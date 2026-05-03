// Vercel Function: /api/cal-slots
// Devuelve los próximos N slots disponibles del Cal.com Event Type configurado.
// Usado por BookingPreview en home/Contacto para mostrar disponibilidad inline.
//
// ENV vars:
//   CALCOM_API_KEY            — server-only (NO prefix VITE_!)
//   CALCOM_EVENT_TYPE_ID      — id numérico del event type (ej. 5559524)
//
// Cache: 5 min en CDN de Vercel via Cache-Control header.
// stale-while-revalidate=600 → si pasaron 5-15 min, sirve la cacheada
// y refresca en background. Resultado: usuario nunca espera un fetch lento.

const HORIZON_DAYS = 14; // Cuánto adelante miramos
const SLOTS_TO_RETURN = 3;
const TIMEZONE = 'America/Argentina/Buenos_Aires';

type Slot = { time: string };

function setCorsHeaders(req: any, res: any) {
  const origin = req.headers?.origin || '';
  const allowed = new Set([
    'https://www.marcorossi.com.ar',
    'https://marcorossi.com.ar',
  ]);
  const isLocalhost = /^https?:\/\/localhost(:\d+)?$/.test(origin);
  if (allowed.has(origin) || isLocalhost) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// Cal.com v2 devuelve { status: "success", data: { "YYYY-MM-DD": [{ start: "ISO" }, ...] } }
// Traducimos a { time: ISO } para mantener estable el contrato con el frontend.
function extractSlotsFromResponse(data: any): Slot[] {
  const root = data?.data ?? {};
  if (!root || typeof root !== 'object') return [];

  const out: Slot[] = [];
  const dates = Object.keys(root).sort();
  for (const date of dates) {
    const day = root[date];
    if (!Array.isArray(day)) continue;
    for (const s of day) {
      const iso = typeof s === 'string' ? s : s?.start ?? s?.time;
      if (iso) out.push({ time: iso });
      if (out.length >= SLOTS_TO_RETURN) return out;
    }
  }
  return out;
}

export default async function handler(req: any, res: any) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  const apiKey = process.env.CALCOM_API_KEY?.trim();
  const eventTypeIdRaw = process.env.CALCOM_EVENT_TYPE_ID?.trim() || '';
  const eventTypeId = parseInt(eventTypeIdRaw, 10);

  if (!apiKey || !eventTypeId || isNaN(eventTypeId)) {
    console.error('[cal-slots] Missing CALCOM_API_KEY or CALCOM_EVENT_TYPE_ID');
    return res.status(500).json({ ok: false, error: 'Cal.com no configurado' });
  }

  const now = new Date();
  // El startTime arranca al inicio del próximo cuarto de hora para evitar
  // mostrar slots "que ya casi pasaron".
  const buffer = new Date(now.getTime() + 30 * 60 * 1000); // +30 min de buffer
  const startTime = buffer.toISOString();
  const endTime = new Date(now.getTime() + HORIZON_DAYS * 24 * 60 * 60 * 1000).toISOString();

  const url = new URL('https://api.cal.com/v2/slots');
  url.searchParams.set('eventTypeId', String(eventTypeId));
  url.searchParams.set('start', startTime);
  url.searchParams.set('end', endTime);
  url.searchParams.set('timeZone', TIMEZONE);

  try {
    const resp = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        // Cal.com v2 exige header con la versión que querés consumir.
        // 2024-08-13 es la versión estable documentada para /v2/slots.
        'cal-api-version': '2024-08-13',
      },
    });

    if (!resp.ok) {
      const errBody = await resp.text();
      console.error(`[cal-slots] Cal.com API ${resp.status}:`, errBody.slice(0, 500));
      // Devolvemos array vacío en lugar de error 502 para que el frontend
      // simplemente esconda el preview en lugar de mostrar UI rota.
      // Cache corto en errores para no quedar tirados si Cal.com vuelve.
      res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
      return res.status(200).json({ ok: false, slots: [], error: `cal.com ${resp.status}` });
    }

    const data = await resp.json();
    const slots = extractSlotsFromResponse(data);

    // Cache 5 min con SWR de 10 min adicionales — los visitantes nunca
    // esperan una request a Cal.com, y el dashboard refleja cambios
    // de disponibilidad dentro de 5 min.
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600');
    return res.status(200).json({ ok: true, slots });
  } catch (e: any) {
    console.error('[cal-slots] Exception:', e?.message || e);
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=120');
    return res.status(200).json({ ok: false, slots: [], error: 'fetch failed' });
  }
}
