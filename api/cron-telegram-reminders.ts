// =====================================================
// /api/cron-telegram-reminders
// Lo llama cada hora .github/workflows/telegram-reminders.yml y manda
// pings a Telegram para reservas próximas: uno 24-25h antes y otro 1-2h antes.
//
// Sin estado: las ventanas se calculan desde la hora en punto en la que
// corre (ver reminderWindows), no desde el minuto exacto. Así cada reserva
// cae en un único run por tipo de ping aunque GitHub Actions arranque con
// demora dentro de la hora. Solo se pierde o duplica un ping si un run se
// saltea entero o se corre a la hora siguiente.
//
// ENV vars:
//   CALCOM_API_KEY           — server-only
//   CALCOM_EVENT_TYPE_ID     — id numérico del event type
//   TELEGRAM_BOT_TOKEN       — bot que manda al chat
//   TELEGRAM_CHAT_ID         — chat destino
//   CRON_SECRET              — obligatorio. El workflow de GitHub
//                              Actions lo manda como "Authorization:
//                              Bearer <SECRET>"; sin él rechazamos todo.
// =====================================================

import { sendTelegramMessage, tgEscape } from '../src/lib/telegram.js';

const CALCOM_API = 'https://api.cal.com/v2/bookings';
const CALCOM_API_VERSION = '2026-02-25';
const TIMEZONE = 'America/Argentina/Buenos_Aires';

const HOUR_MS = 60 * 60 * 1000;

export function reminderWindows(now: Date) {
  const base = Math.floor(now.getTime() / HOUR_MS) * HOUR_MS;
  return {
    w1: { start: base + HOUR_MS, end: base + 2 * HOUR_MS },
    w24: { start: base + 24 * HOUR_MS, end: base + 25 * HOUR_MS },
  };
}

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

function isAuthorizedCron(req: any): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return false;
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
    console.error('[cron-tg-reminders] Uncaught:', e?.stack || e?.message || e);
    return res.status(500).json({ ok: false, error: 'uncaught' });
  }
}

async function handleInternal(req: any, res: any) {
  if (!isAuthorizedCron(req)) {
    return res.status(401).json({ ok: false, error: 'Unauthorized' });
  }

  const apiKey = process.env.CALCOM_API_KEY?.trim();
  const eventTypeId = parseInt(process.env.CALCOM_EVENT_TYPE_ID?.trim() || '', 10);

  if (!apiKey || !eventTypeId || isNaN(eventTypeId)) {
    console.error('[cron-tg-reminders] CALCOM_API_KEY o CALCOM_EVENT_TYPE_ID no configurados');
    return res.status(500).json({ ok: false, error: 'Cal.com no configurado' });
  }

  const { w1, w24 } = reminderWindows(new Date());
  // beforeEnd filtra por fin del turno: 1h de margen para que entren los que empiezan al final de w24.
  const afterStart = new Date(w1.start).toISOString();
  const beforeEnd = new Date(w24.end + HOUR_MS).toISOString();

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
      return res.status(502).json({ ok: false, error: `cal.com ${resp.status}` });
    }
    const data = await resp.json();
    bookings = Array.isArray(data?.data) ? data.data : [];
  } catch (e: any) {
    const aborted = e?.name === 'AbortError';
    console.error('[cron-tg-reminders] Fetch failed:', e?.message || e, 'aborted:', aborted);
    return res.status(502).json({ ok: false, error: aborted ? 'cal.com timeout' : 'fetch failed' });
  } finally {
    clearTimeout(timer);
  }

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
