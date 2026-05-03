import { createHmac, timingSafeEqual } from 'node:crypto';
// Node ESM en Vercel exige extensión `.js` explícita en imports relativos.
import { sendTelegramMessage, tgEscape } from '../src/lib/telegram.js';

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

  // 8) Send (best-effort — no devolvemos error a Cal.com si Telegram falla,
  //    porque Cal.com reintentaría innecesariamente).
  try {
    const tg = await sendTelegramMessage(text);
    if (!tg.ok) {
      console.error('[cal-webhook] Telegram failed:', tg.error);
      return res.status(200).json({ ok: true, telegram: false });
    }
    return res.status(200).json({ ok: true, telegram: true });
  } catch (e: any) {
    console.error('[cal-webhook] Telegram exception:', e?.message || e);
    return res.status(200).json({ ok: true, telegram: false });
  }
}
