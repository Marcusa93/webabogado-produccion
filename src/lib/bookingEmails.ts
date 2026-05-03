// Templates de los mails que se mandan al cliente cuando reserva un turno
// vía Cal.com. Server-only — usados desde api/cal-webhook.ts.
//
// Two emails:
//   1) Welcome — inmediato. "Tu consulta está confirmada, esto es lo que viene".
//   2) Follow-up — programado vía scheduled_at de Resend para 24h post-evento.
//      "Cómo te fue? acá los próximos pasos".

const SITE_URL = 'https://www.marcorossi.com.ar';
const BOOKING_URL = `${SITE_URL}/agendar`;
const WHATSAPP_URL = 'https://wa.me/5493813007791';
const HERRAMIENTAS_URL = `${SITE_URL}/herramientas`;

function escapeHtml(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatDateAR(iso?: string): string {
  if (!iso) return 'tu turno';
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

// Cal.com a veces manda el link en payload.location (puede ser un URL crudo
// o un placeholder tipo "integrations:daily"); a veces lo manda en
// payload.metadata.videoCallUrl. Probamos ambos y devolvemos null si no hay.
function extractMeetingLink(payload: any): string | null {
  const candidates = [
    payload?.metadata?.videoCallUrl,
    payload?.videoCallUrl,
    typeof payload?.location === 'string' && payload.location.startsWith('http') ? payload.location : null,
  ].filter(Boolean);
  return candidates[0] || null;
}

// Idem para los URLs de cancelación / reprogramación.
function extractActionUrls(payload: any): { cancelUrl: string | null; rescheduleUrl: string | null } {
  const uid = payload?.uid;
  const bookerUrl = payload?.bookerUrl || payload?.metadata?.bookerUrl;
  return {
    cancelUrl:
      payload?.cancelUrl ||
      payload?.metadata?.cancelUrl ||
      (bookerUrl && uid ? `${bookerUrl}/booking/${uid}?cancel=true` : null),
    rescheduleUrl:
      payload?.rescheduleUrl ||
      payload?.metadata?.rescheduleUrl ||
      (bookerUrl && uid ? `${bookerUrl}/reschedule/${uid}` : null),
  };
}

// ============================================================
// 1) WELCOME (inmediato post-booking)
// ============================================================

export function buildWelcomeEmail(payload: any): {
  subject: string;
  html: string;
  text: string;
} | null {
  const attendee = payload?.attendees?.[0] || {};
  const name = attendee.name || payload?.responses?.name || '';
  if (!name) return null; // Sin nombre no enviamos — defensa contra payloads raros

  const firstName = String(name).split(' ')[0];
  const eventTitle = payload?.eventTitle || payload?.eventType?.title || payload?.title || 'tu consulta';
  const startTime = payload?.startTime;
  const fechaStr = formatDateAR(startTime);
  const meetingLink = extractMeetingLink(payload);
  const { cancelUrl, rescheduleUrl } = extractActionUrls(payload);

  const subject = `Tu consulta con el Estudio Rossi está confirmada · ${fechaStr.split(',')[0]}`;

  const meetingBlock = meetingLink
    ? `<tr><td style="padding:12px 14px;background:#f0fdf4;border-radius:10px;">
         <div style="font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:#166534;font-weight:800;margin-bottom:6px;">Link de la reunión</div>
         <a href="${escapeHtml(meetingLink)}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:10px 18px;border-radius:8px;">Abrir videollamada</a>
         <div style="font-size:12px;color:#6b7280;margin-top:8px;">Tip: probá el link 5 minutos antes para chequear cámara y micrófono.</div>
       </td></tr>`
    : `<tr><td style="padding:12px 14px;background:#fafafa;border-radius:10px;color:#6b7280;font-size:13px;">
         📹 El link de la videollamada llega aparte en el mail de confirmación de Cal.com.
       </td></tr>`;

  const actionsBlock =
    cancelUrl || rescheduleUrl
      ? `<p style="margin:20px 0 6px;font-size:13px;color:#6b7280;">
           ¿Algo cambió? Podés
           ${rescheduleUrl ? `<a href="${escapeHtml(rescheduleUrl)}" style="color:#0a1929;">reprogramar</a>` : ''}
           ${rescheduleUrl && cancelUrl ? ' o ' : ''}
           ${cancelUrl ? `<a href="${escapeHtml(cancelUrl)}" style="color:#0a1929;">cancelar</a>` : ''}
           sin penalidad.
         </p>`
      : '';

  const html = `<!doctype html>
<html lang="es"><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0a1929;background:#fff;padding:24px;line-height:1.55;">
  <div style="max-width:580px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
    <div style="background:#0a1929;color:#fff;padding:20px 24px;">
      <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;opacity:.7;">Estudio Dr. Marco Rossi</div>
      <h1 style="margin:6px 0 0;font-size:20px;font-weight:800;">✅ Tu consulta está confirmada</h1>
    </div>

    <div style="padding:26px;font-size:15px;color:#0a1929;">
      <p style="margin:0 0 14px;">Hola ${escapeHtml(firstName)},</p>

      <p style="margin:0 0 14px;">Confirmamos tu reserva de <strong>${escapeHtml(eventTitle)}</strong> para:</p>

      <div style="margin:0 0 18px;padding:14px 16px;background:#0a1929;color:#fff;border-radius:10px;font-weight:700;text-align:center;">
        🕒 ${escapeHtml(fechaStr)} <span style="opacity:.7;font-weight:500;">(hora Argentina)</span>
      </div>

      <table role="presentation" style="width:100%;margin:18px 0;border-collapse:separate;border-spacing:0 10px;">
        ${meetingBlock}
      </table>

      <h2 style="font-size:14px;letter-spacing:.18em;text-transform:uppercase;color:#0a1929;margin:24px 0 10px;font-weight:800;">Para sacarle el máximo</h2>
      <ul style="margin:0 0 16px;padding-left:18px;color:#374151;font-size:14px;">
        <li style="margin-bottom:6px;">Si tenés <strong>documentos relevantes</strong> (chats, contratos, notificaciones, capturas), tenélos a mano. Si querés, mandámelos por mail antes de la reunión y los revisamos juntos.</li>
        <li style="margin-bottom:6px;">Pensá <strong>qué resultado querés</strong> de la consulta — eso ordena la conversación.</li>
        <li style="margin-bottom:6px;">No hace falta que vengas con la teoría jurídica armada. De eso me encargo yo.</li>
      </ul>

      ${actionsBlock}

      <p style="margin:24px 0 0;">Nos vemos pronto,<br/><strong>Marco Rossi</strong><br/><span style="color:#6b7280;font-size:13px;">Estudio Marco Rossi · IA · Prueba digital · Proceso judicial</span></p>
    </div>

    <div style="padding:14px 24px;font-size:11px;color:#9ca3af;background:#fafafa;border-top:1px solid #e5e7eb;">
      Recibís este mail porque reservaste un turno en marcorossi.com.ar.
      Si fue un error, simplemente cancelá usando el link de arriba.
    </div>
  </div>
</body></html>`;

  const text = [
    `Hola ${firstName},`,
    '',
    `Confirmamos tu reserva de ${eventTitle} para:`,
    `🕒 ${fechaStr} (hora Argentina)`,
    '',
    meetingLink ? `📹 Link de la reunión: ${meetingLink}` : '📹 El link de la videollamada llega aparte en el mail de Cal.com.',
    '',
    'PARA SACARLE EL MÁXIMO',
    '· Si tenés documentos relevantes (chats, contratos, capturas), tenélos a mano.',
    '· Pensá qué resultado querés de la consulta.',
    '· No hace falta que vengas con la teoría armada — de eso me encargo yo.',
    '',
    cancelUrl || rescheduleUrl ? '¿Algo cambió?' : '',
    rescheduleUrl ? `Reprogramar: ${rescheduleUrl}` : '',
    cancelUrl ? `Cancelar: ${cancelUrl}` : '',
    '',
    'Nos vemos pronto,',
    'Marco Rossi',
    'Estudio Marco Rossi — IA · Prueba digital · Proceso judicial',
  ]
    .filter(Boolean)
    .join('\n');

  return { subject, html, text };
}

// ============================================================
// 2) FOLLOW-UP (programado para 24h post-evento)
// ============================================================

export function buildFollowUpEmail(payload: any): {
  subject: string;
  html: string;
  text: string;
} | null {
  const attendee = payload?.attendees?.[0] || {};
  const name = attendee.name || payload?.responses?.name || '';
  if (!name) return null;

  const firstName = String(name).split(' ')[0];

  const subject = `¿Cómo te quedó la consulta? — Estudio Marco Rossi`;

  const html = `<!doctype html>
<html lang="es"><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0a1929;background:#fff;padding:24px;line-height:1.55;">
  <div style="max-width:580px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
    <div style="background:#0a1929;color:#fff;padding:20px 24px;">
      <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;opacity:.7;">Estudio Dr. Marco Rossi</div>
      <h1 style="margin:6px 0 0;font-size:20px;font-weight:800;">Espero que te haya servido</h1>
    </div>

    <div style="padding:26px;font-size:15px;color:#0a1929;">
      <p style="margin:0 0 14px;">Hola ${escapeHtml(firstName)},</p>

      <p style="margin:0 0 14px;">Pasaron unas horas desde nuestra reunión. Te escribo para tres cosas concretas:</p>

      <h2 style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#0a1929;margin:22px 0 8px;font-weight:800;">1 · ¿Te quedaron dudas?</h2>
      <p style="margin:0 0 16px;color:#374151;">
        Si en estas horas pensaste algo que no preguntaste, <strong>respondé este mail directamente</strong>. Te contesto personalmente.
      </p>

      <h2 style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#0a1929;margin:22px 0 8px;font-weight:800;">2 · ¿Querés avanzar?</h2>
      <p style="margin:0 0 12px;color:#374151;">
        Si vas a contratar representación legal, agendamos una <strong>Consulta por caso</strong> donde diseñamos la estrategia concreta y firmamos:
      </p>
      <p style="margin:0 0 16px;">
        <a href="${BOOKING_URL}" style="display:inline-block;background:#0a1929;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:10px 18px;border-radius:8px;">Reservar consulta por caso →</a>
      </p>

      <h2 style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#0a1929;margin:22px 0 8px;font-weight:800;">3 · Si no es para ahora</h2>
      <p style="margin:0 0 14px;color:#374151;">
        Sin problema. Te dejo recursos para que tengas a mano cuando los necesites:
      </p>
      <ul style="margin:0 0 16px;padding-left:18px;color:#374151;font-size:14px;">
        <li style="margin-bottom:6px;">
          <a href="${HERRAMIENTAS_URL}" style="color:#0a1929;">Kit de herramientas para clientes</a> — preservación de evidencia, check de contratos, scam detector, hasher.
        </li>
        <li style="margin-bottom:6px;">
          <a href="${WHATSAPP_URL}" style="color:#0a1929;">WhatsApp directo</a> — para preguntas rápidas en el futuro.
        </li>
      </ul>

      <p style="margin:24px 0 0;">Saludos,<br/><strong>Marco Rossi</strong><br/><span style="color:#6b7280;font-size:13px;">Estudio Marco Rossi · IA · Prueba digital · Proceso judicial</span></p>
    </div>

    <div style="padding:14px 24px;font-size:11px;color:#9ca3af;background:#fafafa;border-top:1px solid #e5e7eb;">
      Recibís este mail como follow-up automático de tu consulta. Si preferís no recibir este tipo de mensajes, respondé "no más mails" y no te escribo más.
    </div>
  </div>
</body></html>`;

  const text = [
    `Hola ${firstName},`,
    '',
    'Pasaron unas horas desde nuestra reunión. Te escribo por tres cosas concretas:',
    '',
    '1) ¿TE QUEDARON DUDAS?',
    'Si en estas horas pensaste algo que no preguntaste, respondé este mail directamente. Te contesto personalmente.',
    '',
    '2) ¿QUERÉS AVANZAR?',
    'Si vas a contratar representación legal, agendamos una Consulta por caso donde diseñamos la estrategia concreta y firmamos.',
    `Reservar: ${BOOKING_URL}`,
    '',
    '3) SI NO ES PARA AHORA',
    'Sin problema. Te dejo recursos:',
    `· Kit de herramientas: ${HERRAMIENTAS_URL}`,
    `· WhatsApp directo: ${WHATSAPP_URL}`,
    '',
    'Saludos,',
    'Marco Rossi',
    'Estudio Marco Rossi — IA · Prueba digital · Proceso judicial',
    '',
    '— Si preferís no recibir mails de seguimiento, respondé "no más mails" y no te escribo más.',
  ].join('\n');

  return { subject, html, text };
}

// ============================================================
// Helper: ¿cuándo programar el follow-up?
// 24h después del END del evento. Devuelve ISO 8601.
// ============================================================
export function followUpScheduledAt(endTime?: string): string | null {
  if (!endTime) return null;
  try {
    const end = new Date(endTime);
    if (isNaN(end.getTime())) return null;
    const followUp = new Date(end.getTime() + 24 * 60 * 60 * 1000);
    return followUp.toISOString();
  } catch {
    return null;
  }
}
