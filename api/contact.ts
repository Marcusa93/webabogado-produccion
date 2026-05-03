import { Resend } from 'resend';
import { contactSchema } from '../src/lib/contactSchema';

// =====================================================
// Vercel Function: /api/contact
// Recibe el form de contacto, valida con Zod y manda
// mail vía Resend al estudio. Sin DB — los leads viven
// en el inbox.
//
// ENV vars requeridas (cargar en Vercel + .env.local):
//   RESEND_API_KEY      Key de Resend (re_...)
//   CONTACT_INBOX       Mail(s) destino. Puede ser uno solo o lista
//                       separada por comas. Ej:
//                         "dr.marcorossi9@gmail.com"
//                         "dr.marcorossi9@gmail.com, admin@marcorossi.com.ar"
// =====================================================

const ALLOWED_ORIGINS = new Set([
  'https://www.marcorossi.com.ar',
  'https://marcorossi.com.ar',
]);

// Rate limit en memoria. Best-effort: serverless puede no compartir
// memoria entre invocaciones, pero protege contra ráfagas dentro del
// mismo lambda warm.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;
const recentRequests = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  const prev = (recentRequests.get(ip) || []).filter((t) => t > cutoff);
  if (prev.length >= RATE_LIMIT_MAX) {
    recentRequests.set(ip, prev);
    return true;
  }
  prev.push(now);
  recentRequests.set(ip, prev);
  return false;
}

function setCorsHeaders(req: any, res: any) {
  const origin = req.headers?.origin || '';
  const isLocalhost = /^https?:\/\/localhost(:\d+)?$/.test(origin);
  const isAllowed = ALLOWED_ORIGINS.has(origin) || isLocalhost;
  if (isAllowed) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function getClientIp(req: any): string {
  const xff = req.headers?.['x-forwarded-for'];
  if (typeof xff === 'string' && xff.length > 0) {
    return xff.split(',')[0]!.trim();
  }
  if (Array.isArray(xff) && xff.length > 0) {
    return String(xff[0]).split(',')[0]!.trim();
  }
  return req.headers?.['x-real-ip'] || req.socket?.remoteAddress || 'unknown';
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildEmailHtml(input: {
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
  fecha: string;
}): string {
  const tel = input.telefono?.trim()
    ? `<tr><td style="padding:8px 12px;background:#f6f6f6;font-weight:600;">Teléfono</td><td style="padding:8px 12px;">${escapeHtml(input.telefono)}</td></tr>`
    : '';

  return `<!doctype html>
<html lang="es"><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0a1929;background:#fff;padding:24px;">
  <div style="max-width:560px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
    <div style="background:#0a1929;color:#fff;padding:20px 24px;">
      <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;opacity:.7;">Estudio Dr. Marco Rossi</div>
      <h1 style="margin:6px 0 0;font-size:20px;">Nueva consulta web</h1>
    </div>
    <table style="width:100%;border-collapse:collapse;font-size:14px;">
      <tr><td style="padding:8px 12px;background:#f6f6f6;font-weight:600;width:120px;">Nombre</td><td style="padding:8px 12px;">${escapeHtml(input.nombre)}</td></tr>
      <tr><td style="padding:8px 12px;background:#f6f6f6;font-weight:600;">Email</td><td style="padding:8px 12px;"><a href="mailto:${escapeHtml(input.email)}" style="color:#0a1929;">${escapeHtml(input.email)}</a></td></tr>
      ${tel}
      <tr><td style="padding:8px 12px;background:#f6f6f6;font-weight:600;vertical-align:top;">Mensaje</td><td style="padding:8px 12px;white-space:pre-wrap;">${escapeHtml(input.mensaje)}</td></tr>
      <tr><td style="padding:8px 12px;background:#f6f6f6;font-weight:600;">Fecha</td><td style="padding:8px 12px;color:#6b7280;">${escapeHtml(input.fecha)}</td></tr>
    </table>
    <div style="padding:16px 24px;font-size:12px;color:#6b7280;background:#fafafa;border-top:1px solid #e5e7eb;">
      Para responder, simplemente respondé este mail (Reply-To apunta al consultante).
    </div>
  </div>
</body></html>`;
}

function buildEmailText(input: {
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
  fecha: string;
}): string {
  const tel = input.telefono?.trim() ? `Teléfono: ${input.telefono}\n` : '';
  return [
    'Nueva consulta web — Estudio Dr. Marco Rossi',
    '',
    `Nombre: ${input.nombre}`,
    `Email: ${input.email}`,
    tel,
    'Mensaje:',
    input.mensaje,
    '',
    `Fecha: ${input.fecha}`,
    '',
    '— Para responder, contestá este mail (Reply-To apunta al consultante).',
  ]
    .filter(Boolean)
    .join('\n');
}

// ---- Auto-reply al consultante ----
const SITE_URL = 'https://www.marcorossi.com.ar';
const BOOKING_URL = `${SITE_URL}/agendar`;
const WHATSAPP_URL = 'https://wa.me/5493813007791';

function buildAutoReplyHtml(input: { nombre: string; mensaje: string }): string {
  const primerNombre = input.nombre.split(' ')[0];
  return `<!doctype html>
<html lang="es"><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0a1929;background:#fff;padding:24px;line-height:1.55;">
  <div style="max-width:560px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
    <div style="background:#0a1929;color:#fff;padding:20px 24px;">
      <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;opacity:.7;">Estudio Dr. Marco Rossi</div>
      <h1 style="margin:6px 0 0;font-size:20px;font-weight:800;">Recibí tu consulta</h1>
    </div>
    <div style="padding:24px;font-size:15px;color:#0a1929;">
      <p style="margin:0 0 14px;">Hola ${escapeHtml(primerNombre)},</p>
      <p style="margin:0 0 14px;">Recibí tu mensaje correctamente. Te respondo personalmente <strong>en menos de 24 horas hábiles</strong>.</p>
      <p style="margin:0 0 14px;">Si tu caso es urgente o preferís avanzar más rápido, tenés dos opciones:</p>
      <table role="presentation" style="width:100%;margin:18px 0;border-collapse:separate;border-spacing:0 8px;">
        <tr>
          <td style="background:#f6f6f6;border-radius:10px;padding:14px 16px;">
            <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#0a1929;font-weight:800;margin-bottom:4px;">Opción 1 · Agenda directa</div>
            <div style="font-size:14px;color:#374151;margin-bottom:8px;">Reservá un turno de consulta inicial sin cargo (30 min, por videollamada).</div>
            <a href="${BOOKING_URL}" style="display:inline-block;background:#0a1929;color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:9px 16px;border-radius:8px;">Agendar consulta →</a>
          </td>
        </tr>
        <tr>
          <td style="background:#f0fdf4;border-radius:10px;padding:14px 16px;">
            <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#166534;font-weight:800;margin-bottom:4px;">Opción 2 · WhatsApp</div>
            <div style="font-size:14px;color:#374151;margin-bottom:8px;">Para una respuesta inmediata o consultas cortas.</div>
            <a href="${WHATSAPP_URL}" style="display:inline-block;background:#25d366;color:#fff;text-decoration:none;font-weight:700;font-size:13px;padding:9px 16px;border-radius:8px;">Escribir por WhatsApp →</a>
          </td>
        </tr>
      </table>
      <p style="margin:16px 0 6px;color:#6b7280;font-size:13px;">Para tu referencia, este es el mensaje que recibí:</p>
      <blockquote style="margin:0;padding:12px 14px;border-left:3px solid #0a1929;background:#fafafa;color:#374151;font-size:13px;white-space:pre-wrap;">${escapeHtml(input.mensaje)}</blockquote>
      <p style="margin:24px 0 0;">Saludos,<br/><strong>Marco Rossi</strong><br/><span style="color:#6b7280;font-size:13px;">Estudio Marco Rossi · IA · Prueba digital · Proceso judicial</span></p>
    </div>
    <div style="padding:14px 24px;font-size:11px;color:#9ca3af;background:#fafafa;border-top:1px solid #e5e7eb;">
      Este es un mail automático de confirmación. Tu consulta ya está en mi inbox y la respondo personalmente.
    </div>
  </div>
</body></html>`;
}

function buildAutoReplyText(input: { nombre: string; mensaje: string }): string {
  const primerNombre = input.nombre.split(' ')[0];
  return [
    `Hola ${primerNombre},`,
    '',
    'Recibí tu mensaje correctamente. Te respondo personalmente en menos de 24 horas hábiles.',
    '',
    'Si tu caso es urgente, tenés dos opciones:',
    `· Agendar consulta directa (sin cargo, 30 min): ${BOOKING_URL}`,
    `· WhatsApp: ${WHATSAPP_URL}`,
    '',
    'Para tu referencia, recibí este mensaje:',
    `"${input.mensaje}"`,
    '',
    'Saludos,',
    'Marco Rossi',
    'Estudio Marco Rossi — IA · Prueba digital · Proceso judicial',
    '',
    '— Este es un mail automático de confirmación. Tu consulta ya está en mi inbox y la respondo personalmente.',
  ].join('\n');
}

export default async function handler(req: any, res: any) {
  setCorsHeaders(req, res);

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  // --- ENV vars ---
  const resendKey = process.env.RESEND_API_KEY?.trim();

  // CONTACT_INBOX puede ser una sola dirección o una lista separada por comas.
  // Resend acepta `to: string[]` y manda una copia a cada uno (no es BCC, todos
  // ven la lista — perfecto para que socios/asistentes reciban el mismo lead).
  const inboxRaw = process.env.CONTACT_INBOX?.trim() || 'dr.marcorossi9@gmail.com';
  const inbox = inboxRaw
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  if (!resendKey) {
    console.error('[contact] Missing RESEND_API_KEY');
    return res.status(500).json({
      ok: false,
      error: 'Configuración del servidor incompleta. Probá por WhatsApp.',
    });
  }

  // --- Rate limit por IP ---
  const clientIp = getClientIp(req);
  if (isRateLimited(clientIp)) {
    return res.status(429).json({
      ok: false,
      error: 'Demasiados intentos. Esperá un minuto antes de reintentar.',
    });
  }

  // --- Validar body con Zod ---
  const body = req.body && typeof req.body === 'object' ? req.body : {};
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return res.status(400).json({
      ok: false,
      error: 'validation',
      issues: parsed.error.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      })),
    });
  }

  const data = parsed.data;

  // --- Honeypot: si vino algo en `website`, fingir éxito sin mandar nada ---
  if (data.website && data.website.length > 0) {
    console.warn('[contact] Honeypot triggered, ignoring submission');
    return res.status(200).json({ ok: true });
  }

  const fechaStr = new Date().toLocaleString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  // --- Enviar mail vía Resend ---
  // From: web@ del dominio apex. Resend está verificado en el apex
  // (DKIM en `resend._domainkey.marcorossi.com.ar`); SPF/MX viven en
  // el subdominio `send.` solo para el envelope de bounces, sin
  // chocar con el SPF de Workspace en el apex.
  // Reply-To apunta al consultante para responder con un click.
  const resend = new Resend(resendKey);
  const subject = `Nueva consulta web: ${data.nombre.slice(0, 60)}`;

  try {
    const { error } = await resend.emails.send({
      from: 'Formulario web <web@marcorossi.com.ar>',
      to: inbox,
      replyTo: data.email,
      subject,
      html: buildEmailHtml({
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        mensaje: data.mensaje,
        fecha: fechaStr,
      }),
      text: buildEmailText({
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        mensaje: data.mensaje,
        fecha: fechaStr,
      }),
    });

    if (error) {
      console.error('[contact] Resend error:', error);
      return res.status(500).json({
        ok: false,
        error: 'No se pudo enviar el mail. Probá por WhatsApp.',
      });
    }
  } catch (e: any) {
    console.error('[contact] Resend exception:', e?.message || e);
    return res.status(500).json({
      ok: false,
      error: 'No se pudo enviar el mail. Probá por WhatsApp.',
    });
  }

  // --- Auto-reply al consultante (best-effort) ---
  // Si esto falla, NO le devolvemos error al usuario: el lead ya está en el
  // inbox del estudio, que es lo crítico. Solo loggeamos la falla.
  try {
    const { error: autoReplyError } = await resend.emails.send({
      from: 'Estudio Marco Rossi <estudio@marcorossi.com.ar>',
      to: [data.email],
      replyTo: 'estudio@marcorossi.com.ar',
      subject: 'Recibí tu consulta — Estudio Marco Rossi',
      html: buildAutoReplyHtml({ nombre: data.nombre, mensaje: data.mensaje }),
      text: buildAutoReplyText({ nombre: data.nombre, mensaje: data.mensaje }),
    });

    if (autoReplyError) {
      console.warn('[contact] Auto-reply failed (non-blocking):', autoReplyError);
    }
  } catch (e: any) {
    console.warn('[contact] Auto-reply exception (non-blocking):', e?.message || e);
  }

  return res.status(200).json({ ok: true });
}
