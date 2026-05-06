// =====================================================
// Vercel Cron: /api/cron-telegram-reminders
// Corre cada hora (en minuto 00) y manda pings a Telegram
// para reservas próximas — uno ~24h antes, otro ~1h antes.
//
// Sin estado, sin dedup: usamos ventanas de 1h alineadas
// al cron schedule, así cada reserva matchea exactamente UN
// run por tipo de ping. Trade-off conocido: si Vercel atrasa
// un cron run >30min, podría perderse o duplicarse un ping
// (raro). Aceptado como simplicidad vs robustez.
//
// Cron schedule en vercel.json:
//   { "path": "/api/cron-telegram-reminders", "schedule": "0 * * * *" }
//
// ENV vars:
//   CALCOM_API_KEY           — server-only
//   CALCOM_EVENT_TYPE_ID     — id numérico del event type
//   TELEGRAM_BOT_TOKEN       — bot que manda al chat
//   TELEGRAM_CHAT_ID         — chat destino
//   CRON_SECRET              — opcional. Si está, Vercel agrega
//                              "Authorization: Bearer <SECRET>" al
//                              request del cron, y rechazamos los
//                              que no lo traigan (evita disparos
//                              externos via internet).
// =====================================================

import { sendTelegramMessage, tgEscape } from '../src/lib/telegram.js';

const CALCOM_API = 'https://api.cal.com/v2/bookings';
const CALCOM_API_VERSION = '2026-02-25';
const TIMEZONE = 'America/Argentina/Buenos_Aires';

function formatDateAR(iso?: string): string {
  if (!iso) return 'Sin fecha';
  try {
    return new Date(iso).toLocaleString('es-AR', {
      timeZone: TIMEZONE,
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

// Vercel agrega "Authorization: Bearer <CRON_SECRET>" automáticamente
// si la env var está seteada. Sin secret, dejamos pasar (NO recomendado prod).
function isAuthorizedCron(req: any): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return true;
  const auth = (req.headers?.authorization || req.headers?.Authorization || '').trim();
  return auth === `Bearer ${secret}`;
}

// Mismo helper que cal-webhook.ts: extrae respuestas a preguntas custom
// del shape { fieldName: { label, value } } o { fieldName: "value" }.
function extractCustomAnswers(responses: any): { label: string; value: string }[] {
  if (!responses || typeof responses !== 'object') return [];
  const skipKeys = new Set([
    'name', 'email', 'guests', 'location', 'notes', 'phone',
    'rescheduleReason', 'smsReminderNumber', 'attendeePhoneNumber',
  ]);
  const out: { label: string; value: string }[] = [];
  for (const [key, raw] of Object.entries(responses)) {
    if (skipKeys.has(key) || raw == null) continue;
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
    if (value && value.trim()) out.push({ label, value: value.trim() });
  }
  return out;
}

export default async function handler(req: any, res: any) {
  try {
    return await handleInternal(req, res);
  } catch (e: any) {
    // Last-resort catch — exponer el error en lugar de tirar 502 opaco de Vercel.
    const msg = e?.stack || e?.message || String(e);
    console.error('[cron-tg-reminders] Uncaught:', msg);
    return res.status(500).json({ ok: false, error: 'uncaught', detail: msg.slice(0, 1500) });
  }
}

async function handleInternal(req: any, res: any) {
  if (!isAuthorizedCron(req)) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  // PROBE modes:
  //   ?probe=1     → verifica deploy + env vars sin pegarle a Cal.com
  //   ?probe=fetch → testea el fetch a Cal.com con timeout corto
  if (req.query?.probe === '1') {
    return res.status(200).json({
      ok: true,
      probe: 'alive',
      hasCalcomKey: Boolean(process.env.CALCOM_API_KEY?.trim()),
      eventTypeId: process.env.CALCOM_EVENT_TYPE_ID?.trim() || null,
      hasTelegram: Boolean(process.env.TELEGRAM_BOT_TOKEN?.trim() && process.env.TELEGRAM_CHAT_ID?.trim()),
    });
  }
  if (req.query?.probe === 'fetch') {
    const apiKey = process.env.CALCOM_API_KEY?.trim() || '';
    const evtId = process.env.CALCOM_EVENT_TYPE_ID?.trim() || '';
    const u = new URL(CALCOM_API);
    u.searchParams.set('eventTypeId', evtId);
    u.searchParams.set('afterStart', new Date().toISOString());
    u.searchParams.set('beforeEnd', new Date(Date.now() + 86400000).toISOString());
    u.searchParams.set('status', 'accepted');
    const t0 = Date.now();
    try {
      const r = await fetch(u.toString(), {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'cal-api-version': CALCOM_API_VERSION,
        },
      });
      const body = await r.text();
      return res.status(200).json({
        ok: true,
        probe: 'fetch',
        url: u.toString(),
        status: r.status,
        elapsedMs: Date.now() - t0,
        bodyHead: body.slice(0, 600),
      });
    } catch (e: any) {
      return res.status(200).json({
        ok: false,
        probe: 'fetch',
        url: u.toString(),
        elapsedMs: Date.now() - t0,
        errorName: e?.name || null,
        errorMessage: e?.message || String(e),
        errorCause: e?.cause?.message || e?.cause || null,
      });
    }
  }

  const apiKey = process.env.CALCOM_API_KEY?.trim();
  const eventTypeId = parseInt(process.env.CALCOM_EVENT_TYPE_ID?.trim() || '', 10);

  if (!apiKey || !eventTypeId || isNaN(eventTypeId)) {
    console.error('[cron-tg-reminders] CALCOM_API_KEY o CALCOM_EVENT_TYPE_ID no configurados');
    return res.status(500).json({ ok: false, error: 'Cal.com no configurado' });
  }

  const now = new Date();
  // Pedimos a Cal.com sólo lo que cabe en las dos ventanas (1h y 24h ahead).
  // Cubrir [now+1h, now+25h) es suficiente, le agregamos 1h de margen abajo
  // por si la API es laxa con el filtro.
  const afterStart = new Date(now.getTime() + 30 * 60 * 1000).toISOString();
  const beforeEnd = new Date(now.getTime() + 26 * 60 * 60 * 1000).toISOString();

  const url = new URL(CALCOM_API);
  url.searchParams.set('eventTypeId', String(eventTypeId));
  url.searchParams.set('afterStart', afterStart);
  url.searchParams.set('beforeEnd', beforeEnd);
  // /v2/bookings solo acepta: upcoming, recurring, past, cancelled, unconfirmed.
  url.searchParams.set('status', 'upcoming');

  // Timeout corto: Vercel Hobby mata funciones a los 10s, así que cortamos
  // a 6s para que nos quede margen para responder con error claro.
  let bookings: any[];
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 6000);
  try {
    const resp = await fetch(url.toString(), {
      signal: ctrl.signal,
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'cal-api-version': CALCOM_API_VERSION,
      },
    });
    if (!resp.ok) {
      const errBody = await resp.text();
      console.error(`[cron-tg-reminders] Cal.com ${resp.status}:`, errBody.slice(0, 500));
      return res.status(502).json({
        ok: false,
        error: `cal.com ${resp.status}`,
        detail: errBody.slice(0, 500),
        url: url.toString(),
      });
    }
    const data = await resp.json();
    bookings = Array.isArray(data?.data) ? data.data : [];
  } catch (e: any) {
    const aborted = e?.name === 'AbortError';
    console.error('[cron-tg-reminders] Fetch failed:', e?.message || e, 'aborted:', aborted);
    return res.status(502).json({
      ok: false,
      error: aborted ? 'cal.com timeout' : 'fetch failed',
      detail: e?.message || String(e),
      url: url.toString(),
    });
  } finally {
    clearTimeout(timer);
  }

  // Ventanas de matching (relativas a "now"). Cron corre cada hora en :00,
  // así cada booking cae en exactamente un run por tipo de ping.
  // 1h ping  arriba a 1-2h antes del evento.
  // 24h ping arriba a 24-25h antes del evento.
  const ms = (h: number) => h * 60 * 60 * 1000;
  const t = now.getTime();
  const w24 = { start: t + ms(24), end: t + ms(25) };
  const w1 = { start: t + ms(1), end: t + ms(2) };

  const summary = { fetched: bookings.length, ping24h: 0, ping1h: 0, skipped: 0, errors: 0 };

  for (const b of bookings) {
    const startIso: string | undefined = b?.start;
    if (!startIso) { summary.skipped++; continue; }
    const startMs = new Date(startIso).getTime();
    if (isNaN(startMs)) { summary.skipped++; continue; }

    let kind: '24h' | '1h' | null = null;
    if (startMs >= w24.start && startMs < w24.end) kind = '24h';
    else if (startMs >= w1.start && startMs < w1.end) kind = '1h';
    if (!kind) { summary.skipped++; continue; }

    const attendee = b?.attendees?.[0] || {};
    const name = attendee.name || b?.bookerName || 'Sin nombre';
    const email = attendee.email || b?.bookerEmail || 'sin-email';
    const eventTitle = b?.title || b?.eventType?.title || 'Consulta';

    const customAnswers = extractCustomAnswers(b?.bookingFieldsResponses ?? b?.responses);
    const customSection = customAnswers.length > 0
      ? '\n\n' + customAnswers
          .map((a) => `<b>${tgEscape(a.label)}:</b>\n${tgEscape(a.value)}`)
          .join('\n\n')
      : '';

    const heading = kind === '1h'
      ? '📋 Recordatorio: consulta en ~1h'
      : '📋 Recordatorio: consulta mañana';

    const text = [
      `<b>${tgEscape(heading)}</b>`,
      '',
      `<b>${tgEscape(name)}</b>`,
      `📧 ${tgEscape(email)}`,
      '',
      `<b>${tgEscape(eventTitle)}</b>`,
      `🕒 ${tgEscape(formatDateAR(startIso))}`,
    ].join('\n') + customSection;

    try {
      const tg = await sendTelegramMessage(text);
      if (tg.ok) {
        if (kind === '24h') summary.ping24h++;
        else summary.ping1h++;
      } else {
        summary.errors++;
        console.error(`[cron-tg-reminders] TG send failed for booking ${b?.uid}:`, tg.error);
      }
    } catch (e: any) {
      summary.errors++;
      console.error(`[cron-tg-reminders] TG exception for ${b?.uid}:`, e?.message || e);
    }
  }

  console.log('[cron-tg-reminders]', JSON.stringify(summary));
  return res.status(200).json({ ok: true, ...summary });
}
