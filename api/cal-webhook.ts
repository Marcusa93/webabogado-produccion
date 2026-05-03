import { createHmac, timingSafeEqual } from 'node:crypto';
import { Resend } from 'resend';
// Node ESM en Vercel exige extensión `.js` explícita en imports relativos.
import { sendTelegramMessage, tgEscape } from '../src/lib/telegram.js';
import {
  buildWelcomeEmail,
  buildReminder24hEmail,
  buildReminder1hEmail,
  buildFollowUpEmail,
  buildCancellationEmail,
  reminder24hScheduledAt,
  reminder1hScheduledAt,
  followUpScheduledAt,
} from '../src/lib/bookingEmails.js';

// =====================================================
// Vercel Function: /api/cal-webhook
// Recibe webhooks de Cal.com (BOOKING_CREATED / RESCHEDULED / CANCELLED)
// y los reenvía como push notifications a Telegram.
//
// Setup en Cal.com:
//   1) app.cal.com → Settings → Developer → Webhooks → + New
//   2) URL: https://www.marcorossi.com.ar/api/cal-webhook
//   3) Subscriber: marcalo "BOOKING_CREATED", "BOOKING_RESCHEDULED",
//      "BOOKING_CANCELLED" (los 3 que importan a un estudio chico).
//   4) Secret: generá uno aleatorio (openssl rand -hex 32) y guardalo
//      en Vercel como CAL_WEBHOOK_SECRET. Pegalo también en el campo
//      Secret de Cal.com — debe coincidir.
//
// ENV vars:
//   TELEGRAM_BOT_TOKEN     — del bot de Telegram
//   TELEGRAM_CHAT_ID       — chat al que llegan las notif
//   CAL_WEBHOOK_SECRET     — opcional pero recomendado. Si no se setea,
//                             aceptamos cualquier POST (riesgo de spoofing).
//
// Vercel necesita el body crudo para verificar la firma HMAC, así que
// desactivamos el bodyParser default y leemos los chunks a mano.
// =====================================================

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readRawBody(req: any): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString('utf8');
}

// Constant-time comparison de firmas para evitar timing attacks.
function verifySignature(rawBody: string, signature: string | undefined, secret: string): boolean {
  if (!signature) return false;
  try {
    const computed = createHmac('sha256', secret).update(rawBody).digest('hex');
    if (computed.length !== signature.length) return false;
    return timingSafeEqual(Buffer.from(computed), Buffer.from(signature));
  } catch {
    return false;
  }
}

function formatDateAR(iso?: string): string {
  if (!iso) return 'Sin fecha';
  try {
    return new Date(iso).toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

// Cal.com mete las respuestas a las preguntas custom dentro de payload.responses
// con shape { fieldName: { label, value } }. Extraemos las respuestas relevantes
// para mostrar en la notif (caso, urgencia, docs).
function extractCustomAnswers(responses: any): { label: string; value: string }[] {
  if (!responses || typeof responses !== 'object') return [];
  const skipKeys = new Set(['name', 'email', 'guests', 'location', 'notes', 'phone', 'rescheduleReason', 'smsReminderNumber', 'attendeePhoneNumber']);
  const out: { label: string; value: string }[] = [];
  for (const [key, raw] of Object.entries(responses)) {
    if (skipKeys.has(key)) continue;
    if (raw == null) continue;
    let label = key;
    let value: string | null = null;
    if (typeof raw === 'string' || typeof raw === 'number' || typeof raw === 'boolean') {
      value = String(raw);
    } else if (typeof raw === 'object') {
      const r = raw as any;
      label = r.label || key;
      const v = r.value ?? r.optionValue ?? r;
      if (Array.isArray(v)) value = v.join(', ');
      else if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') value = String(v);
    }
    if (value && value.trim()) {
      out.push({ label, value: value.trim() });
    }
  }
  return out;
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  // 1) Leemos body crudo
  let rawBody: string;
  try {
    rawBody = await readRawBody(req);
  } catch (e: any) {
    console.error('[cal-webhook] Failed to read body:', e?.message || e);
    return res.status(400).json({ ok: false, error: 'Invalid body' });
  }

  // 2) Firma (opcional pero recomendada)
  const secret = process.env.CAL_WEBHOOK_SECRET?.trim();
  const signature =
    (req.headers['x-cal-signature-256'] as string | undefined) ||
    (req.headers['X-Cal-Signature-256'] as string | undefined);

  if (secret) {
    if (!verifySignature(rawBody, signature, secret)) {
      console.warn('[cal-webhook] Invalid signature');
      return res.status(401).json({ ok: false, error: 'Invalid signature' });
    }
  } else {
    console.warn('[cal-webhook] CAL_WEBHOOK_SECRET not set — accepting unsigned webhook');
  }

  // 3) Parse JSON
  let body: any;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ ok: false, error: 'Body is not valid JSON' });
  }

  const triggerEvent: string = body?.triggerEvent || 'UNKNOWN';
  const payload = body?.payload || {};

  // 4) Extraer datos relevantes con fallbacks (Cal.com cambió el shape varias veces)
  const attendee = payload.attendees?.[0] || {};
  const name: string = attendee.name || payload.bookerName || payload.responses?.name || 'Sin nombre';
  const email: string = attendee.email || payload.bookerEmail || payload.responses?.email || 'sin-email';
  const eventTitle: string =
    payload.eventTitle || payload.eventType?.title || payload.title || 'Consulta';
  const startTime: string | undefined = payload.startTime;
  const reschedule = payload.rescheduleUid || payload.metadata?.rescheduleUid;

  // 5) Tono de la notif según el trigger
  let icon = '📅';
  let label = 'Evento Cal.com';
  switch (triggerEvent) {
    case 'BOOKING_CREATED':
      icon = '✅';
      label = reschedule ? 'Turno reservado (de un reschedule)' : 'Nueva reserva';
      break;
    case 'BOOKING_RESCHEDULED':
      icon = '🔄';
      label = 'Turno reprogramado';
      break;
    case 'BOOKING_CANCELLED':
    case 'BOOKING_REJECTED':
      icon = '❌';
      label = 'Turno cancelado';
      break;
    case 'BOOKING_REQUESTED':
      icon = '⏳';
      label = 'Reserva pendiente de aprobación';
      break;
  }

  // 6) Respuestas a preguntas custom (caso, urgencia, docs_link)
  const customAnswers = extractCustomAnswers(payload.responses);
  const customSection =
    customAnswers.length > 0
      ? '\n\n' +
        customAnswers
          .map((a) => `<b>${tgEscape(a.label)}:</b>\n${tgEscape(a.value)}`)
          .join('\n\n')
      : '';

  // 7) Build text
  const text = [
    `<b>${icon} ${label}</b>`,
    '',
    `<b>${tgEscape(name)}</b>`,
    `📧 ${tgEscape(email)}`,
    '',
    `<b>${tgEscape(eventTitle)}</b>`,
    `🕒 ${tgEscape(formatDateAR(startTime))}`,
  ].join('\n') + customSection;

  // 8) Send Telegram (best-effort — no devolvemos error a Cal.com si Telegram
  //    falla, porque Cal.com reintentaría innecesariamente).
  let telegramOk = false;
  try {
    const tg = await sendTelegramMessage(text);
    if (!tg.ok) {
      console.error('[cal-webhook] Telegram failed:', tg.error);
    } else {
      telegramOk = true;
    }
  } catch (e: any) {
    console.error('[cal-webhook] Telegram exception:', e?.message || e);
  }

  // 9) Lead nurture sequence — solo si tenemos Resend + email del attendee.
  //    BOOKING_CREATED:   welcome (now) + reminder24h + reminder1h + follow-up (scheduled)
  //    BOOKING_CANCELLED: cancellation email (now), avisando del posible mail "fantasma"
  //    RESCHEDULED y otros: nada custom (Cal.com manda sus propias notificaciones)
  const nurtureResults = {
    welcomeEmail: false,
    reminder24hScheduled: false,
    reminder1hScheduled: false,
    followUpScheduled: false,
    cancellationEmail: false,
  };

  if ((triggerEvent === 'BOOKING_CREATED' || triggerEvent === 'BOOKING_CANCELLED') && email && email !== 'sin-email') {
    const resendKey = process.env.RESEND_API_KEY?.trim();
    if (!resendKey) {
      console.warn('[cal-webhook] RESEND_API_KEY not set — skipping nurture emails');
    } else {
      const resend = new Resend(resendKey);
      const FROM = 'Estudio Marco Rossi <estudio@marcorossi.com.ar>';
      const REPLY_TO = 'estudio@marcorossi.com.ar';

      // Helper local para mandar un mail con manejo de error consistente.
      const sendMail = async (
        label: string,
        builderResult: { subject: string; html: string; text: string } | null,
        scheduledAt?: string | null,
      ): Promise<boolean> => {
        if (!builderResult) {
          console.warn(`[cal-webhook] ${label}: builder returned null, skipping`);
          return false;
        }
        if (scheduledAt === null) {
          // null explícito = no programar (ej. event a <1h, ya pasó la ventana)
          console.log(`[cal-webhook] ${label}: too close to event, skipping schedule`);
          return false;
        }
        try {
          const { data, error } = await resend.emails.send({
            from: FROM,
            to: [email],
            replyTo: REPLY_TO,
            subject: builderResult.subject,
            html: builderResult.html,
            text: builderResult.text,
            ...(scheduledAt ? { scheduledAt } : {}),
          });
          if (error) {
            console.error(`[cal-webhook] ${label} send failed:`, error);
            return false;
          }
          console.log(
            `[cal-webhook] ${label} ok${scheduledAt ? ` (scheduled ${scheduledAt})` : ' (immediate)'} (id: ${data?.id})`,
          );
          return true;
        } catch (e: any) {
          console.error(`[cal-webhook] ${label} exception:`, e?.message || e);
          return false;
        }
      };

      if (triggerEvent === 'BOOKING_CREATED') {
        // 9a) Welcome inmediato
        nurtureResults.welcomeEmail = await sendMail('welcome', buildWelcomeEmail(payload));

        // 9b) Recordatorio 24h antes
        nurtureResults.reminder24hScheduled = await sendMail(
          'reminder-24h',
          buildReminder24hEmail(payload),
          reminder24hScheduledAt(payload?.startTime),
        );

        // 9c) Recordatorio 1h antes
        nurtureResults.reminder1hScheduled = await sendMail(
          'reminder-1h',
          buildReminder1hEmail(payload),
          reminder1hScheduledAt(payload?.startTime),
        );

        // 9d) Follow-up 24h post-evento
        nurtureResults.followUpScheduled = await sendMail(
          'follow-up',
          buildFollowUpEmail(payload),
          followUpScheduledAt(payload?.endTime),
        );
      } else if (triggerEvent === 'BOOKING_CANCELLED') {
        // 9e) Confirmación de cancelación. Avisa que pueden llegar mails ya
        //     en cola (recordatorios + follow-up) — no podemos cancelarlos
        //     sin DB para almacenar IDs.
        nurtureResults.cancellationEmail = await sendMail(
          'cancellation',
          buildCancellationEmail(payload),
        );
      }
    }
  }

  return res.status(200).json({
    ok: true,
    telegram: telegramOk,
    ...nurtureResults,
  });
}
