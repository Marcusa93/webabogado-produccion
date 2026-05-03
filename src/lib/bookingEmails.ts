// Templates de los mails que se mandan al cliente cuando reserva un turno
// vía Cal.com. Server-only — usados desde api/cal-webhook.ts.
//
// Sequence completa:
//   1) Welcome             — inmediato post-booking. Disclaimer de qué viene.
//   2) Reminder 24h antes  — scheduled vía Resend para startTime - 24h.
//   3) Reminder 1h antes   — scheduled vía Resend para startTime - 1h.
//   4) Follow-up 24h post  — scheduled vía Resend para endTime + 24h.
//   5) Cancellation        — inmediato si se cancela el turno.
//
// Todo en estudio@marcorossi.com.ar para mantener brand consistency, y todo
// vía scheduled_at de Resend (sin cron jobs ni infraestructura extra).
//
// Trade-off conocido: si el cliente reprograma, los mails ya programados
// se disparan igual (no podemos cancelarlos sin DB). El de cancelación
// declara honestamente que esto puede pasar.

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

function formatTimeAR(iso?: string): string {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleString('es-AR', {
      timeZone: 'America/Argentina/Buenos_Aires',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '';
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

// Reusable: signature visual del mail (HTML).
function htmlSignature(): string {
  return `<p style="margin:24px 0 0;">Saludos,<br/><strong>Marco Rossi</strong><br/><span style="color:#6b7280;font-size:13px;">Estudio Marco Rossi · IA · Prueba digital · Proceso judicial</span></p>`;
}

// Reusable: footer común (HTML).
function htmlFooter(extra?: string): string {
  const base = 'Recibís este mail porque reservaste un turno en marcorossi.com.ar.';
  return `<div style="padding:14px 24px;font-size:11px;color:#9ca3af;background:#fafafa;border-top:1px solid #e5e7eb;">
    ${base}${extra ? ` ${extra}` : ''}
  </div>`;
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
  if (!name) return null;

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

  // Disclaimer de qué emails va a recibir — setea expectativas.
  const expectationsBlock = `
    <h2 style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#0a1929;margin:28px 0 8px;font-weight:800;">Qué te vamos a mandar y cuándo</h2>
    <ul style="margin:0 0 6px;padding-left:18px;color:#374151;font-size:13px;line-height:1.6;">
      <li><strong>24 horas antes</strong> — recordatorio con el link de Meet.</li>
      <li><strong>1 hora antes</strong> — último recordatorio con tip de conexión.</li>
      <li><strong>24 horas después</strong> — seguimiento por si quedaron dudas.</li>
    </ul>
    <p style="margin:8px 0 0;color:#6b7280;font-size:12px;">
      Si cancelás el turno, no enviamos el seguimiento ni los recordatorios siguientes.
    </p>
  `;

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

      ${expectationsBlock}

      ${actionsBlock}

      ${htmlSignature()}
    </div>

    ${htmlFooter('Si fue un error, simplemente cancelá usando el link de arriba.')}
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
    'QUÉ TE VAMOS A MANDAR Y CUÁNDO',
    '· 24 horas antes — recordatorio con el link de Meet.',
    '· 1 hora antes — último recordatorio con tip de conexión.',
    '· 24 horas después — seguimiento por si quedaron dudas.',
    'Si cancelás el turno, no te llegan los recordatorios siguientes ni el seguimiento.',
    '',
    cancelUrl || rescheduleUrl ? '¿Algo cambió?' : '',
    rescheduleUrl ? `Reprogramar: ${rescheduleUrl}` : '',
    cancelUrl ? `Cancelar: ${cancelUrl}` : '',
    '',
    'Saludos,',
    'Marco Rossi',
    'Estudio Marco Rossi — IA · Prueba digital · Proceso judicial',
  ]
    .filter(Boolean)
    .join('\n');

  return { subject, html, text };
}

// ============================================================
// 2) RECORDATORIO 24h antes (scheduled)
// ============================================================

export function buildReminder24hEmail(payload: any): {
  subject: string;
  html: string;
  text: string;
} | null {
  const attendee = payload?.attendees?.[0] || {};
  const name = attendee.name || payload?.responses?.name || '';
  if (!name) return null;

  const firstName = String(name).split(' ')[0];
  const startTime = payload?.startTime;
  const horaStr = formatTimeAR(startTime);
  const fechaStr = formatDateAR(startTime);
  const meetingLink = extractMeetingLink(payload);
  const { rescheduleUrl } = extractActionUrls(payload);

  const subject = `Mañana: tu consulta con el Estudio Rossi a las ${horaStr || 'tu horario'}`;

  const meetingBlock = meetingLink
    ? `<a href="${escapeHtml(meetingLink)}" style="display:inline-block;background:#0a1929;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:11px 20px;border-radius:8px;">🔗 Abrir link de Meet</a>`
    : `<span style="color:#6b7280;font-size:13px;">El link de la reunión está en el mail de confirmación inicial.</span>`;

  const html = `<!doctype html>
<html lang="es"><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0a1929;background:#fff;padding:24px;line-height:1.55;">
  <div style="max-width:560px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
    <div style="background:#0a1929;color:#fff;padding:20px 24px;">
      <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;opacity:.7;">Recordatorio · 24 horas</div>
      <h1 style="margin:6px 0 0;font-size:20px;font-weight:800;">Mañana nos vemos</h1>
    </div>

    <div style="padding:26px;font-size:15px;color:#0a1929;">
      <p style="margin:0 0 14px;">Hola ${escapeHtml(firstName)},</p>

      <p style="margin:0 0 14px;">Recordatorio: <strong>mañana a las ${escapeHtml(horaStr)}</strong> tenemos consulta.</p>

      <div style="margin:18px 0;text-align:center;">${meetingBlock}</div>

      <p style="margin:18px 0 6px;font-size:14px;color:#374151;">
        <strong>Tip de preparación</strong>: si tenés cualquier documento o mensaje relevante para tu caso, tenélo a mano o mandámelo por mail antes de la reunión. Cuanto más concreto el material, más útil la consulta.
      </p>

      ${
        rescheduleUrl
          ? `<p style="margin:18px 0 6px;font-size:13px;color:#6b7280;">
               ¿Surgió algo? Podés <a href="${escapeHtml(rescheduleUrl)}" style="color:#0a1929;">reprogramar acá</a> sin problema.
             </p>`
          : ''
      }

      ${htmlSignature()}
    </div>

    ${htmlFooter('Este es un recordatorio automático.')}
  </div>
</body></html>`;

  const text = [
    `Hola ${firstName},`,
    '',
    `Recordatorio: mañana (${fechaStr}) tenemos consulta a las ${horaStr}.`,
    '',
    meetingLink ? `🔗 Link de Meet: ${meetingLink}` : 'El link de Meet está en el mail de confirmación inicial.',
    '',
    'TIP DE PREPARACIÓN',
    'Si tenés documentos o mensajes relevantes para tu caso, tenélos a mano o mandámelos por mail antes de la reunión.',
    '',
    rescheduleUrl ? `¿Surgió algo? Reprogramá acá: ${rescheduleUrl}` : '',
    '',
    'Saludos,',
    'Marco Rossi',
    'Estudio Marco Rossi — IA · Prueba digital · Proceso judicial',
  ]
    .filter(Boolean)
    .join('\n');

  return { subject, html, text };
}

// ============================================================
// 3) RECORDATORIO 1h antes (scheduled)
// ============================================================

export function buildReminder1hEmail(payload: any): {
  subject: string;
  html: string;
  text: string;
} | null {
  const attendee = payload?.attendees?.[0] || {};
  const name = attendee.name || payload?.responses?.name || '';
  if (!name) return null;

  const firstName = String(name).split(' ')[0];
  const startTime = payload?.startTime;
  const horaStr = formatTimeAR(startTime);
  const meetingLink = extractMeetingLink(payload);

  const subject = `En 1 hora: tu consulta con el Estudio Rossi`;

  const meetingBlock = meetingLink
    ? `<a href="${escapeHtml(meetingLink)}" style="display:inline-block;background:#16a34a;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:13px 24px;border-radius:10px;">🚀 Entrar a la videollamada</a>`
    : `<span style="color:#6b7280;font-size:13px;">El link de Meet está en el mail anterior.</span>`;

  const html = `<!doctype html>
<html lang="es"><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0a1929;background:#fff;padding:24px;line-height:1.55;">
  <div style="max-width:520px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
    <div style="background:#0a1929;color:#fff;padding:20px 24px;">
      <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;opacity:.7;">⏱ Recordatorio · 1 hora</div>
      <h1 style="margin:6px 0 0;font-size:20px;font-weight:800;">En 1 hora arrancamos</h1>
    </div>

    <div style="padding:24px;font-size:15px;color:#0a1929;">
      <p style="margin:0 0 14px;">Hola ${escapeHtml(firstName)},</p>

      <p style="margin:0 0 14px;">A las <strong>${escapeHtml(horaStr)}</strong> nos vemos.</p>

      <div style="margin:18px 0;text-align:center;">${meetingBlock}</div>

      <p style="margin:14px 0 0;font-size:13px;color:#6b7280;">
        Tip: probá el link 5 minutos antes para chequear cámara y micrófono.
      </p>

      ${htmlSignature()}
    </div>

    ${htmlFooter('Este es el último recordatorio antes de la consulta.')}
  </div>
</body></html>`;

  const text = [
    `Hola ${firstName},`,
    '',
    `A las ${horaStr} nos vemos.`,
    '',
    meetingLink ? `🚀 Link directo: ${meetingLink}` : 'El link de Meet está en el mail anterior.',
    '',
    'Tip: probá el link 5 minutos antes para chequear cámara y micrófono.',
    '',
    'Saludos,',
    'Marco Rossi',
  ].join('\n');

  return { subject, html, text };
}

// ============================================================
// 4) FOLLOW-UP (programado para 24h post-evento)
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

      ${htmlSignature()}
    </div>

    ${htmlFooter('Si preferís no recibir este tipo de seguimiento, respondé "no más mails" y no te escribo más.')}
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
// 5) CANCELLATION (inmediato si se cancela el turno)
// ============================================================

export function buildCancellationEmail(payload: any): {
  subject: string;
  html: string;
  text: string;
} | null {
  const attendee = payload?.attendees?.[0] || {};
  const name = attendee.name || payload?.responses?.name || '';
  if (!name) return null;

  const firstName = String(name).split(' ')[0];
  const startTime = payload?.startTime;
  const fechaStr = formatDateAR(startTime);

  const subject = `Cancelaste tu consulta — Estudio Marco Rossi`;

  const html = `<!doctype html>
<html lang="es"><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#0a1929;background:#fff;padding:24px;line-height:1.55;">
  <div style="max-width:560px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
    <div style="background:#0a1929;color:#fff;padding:20px 24px;">
      <div style="font-size:11px;letter-spacing:.2em;text-transform:uppercase;opacity:.7;">Estudio Dr. Marco Rossi</div>
      <h1 style="margin:6px 0 0;font-size:20px;font-weight:800;">Cancelación confirmada</h1>
    </div>

    <div style="padding:26px;font-size:15px;color:#0a1929;">
      <p style="margin:0 0 14px;">Hola ${escapeHtml(firstName)},</p>

      <p style="margin:0 0 14px;">
        Confirmamos la cancelación de tu consulta del <strong>${escapeHtml(fechaStr)}</strong>.
      </p>

      <p style="margin:0 0 14px;color:#374151;">
        Si querés volver a reservar más adelante, podés hacerlo desde acá:
      </p>

      <div style="margin:18px 0;">
        <a href="${BOOKING_URL}" style="display:inline-block;background:#0a1929;color:#fff;text-decoration:none;font-weight:700;font-size:14px;padding:10px 18px;border-radius:8px;">Agendar nuevo turno →</a>
      </div>

      <div style="margin:24px 0 0;padding:14px 16px;background:#fefce8;border:1px solid #fde68a;border-radius:8px;font-size:13px;color:#713f12;">
        <strong>⚠️ Posible mensaje "fantasma"</strong>: como nuestros recordatorios se programan al momento de la reserva, es posible que recibas algún mail automático ya en cola (recordatorio o seguimiento) en los próximos días. <strong>Podés ignorarlos.</strong> No reflejan un nuevo turno activo.
      </div>

      ${htmlSignature()}
    </div>

    ${htmlFooter()}
  </div>
</body></html>`;

  const text = [
    `Hola ${firstName},`,
    '',
    `Confirmamos la cancelación de tu consulta del ${fechaStr}.`,
    '',
    'Si querés volver a reservar más adelante:',
    `${BOOKING_URL}`,
    '',
    '⚠️ POSIBLE MENSAJE "FANTASMA"',
    'Como nuestros recordatorios se programan al momento de la reserva, es posible que recibas algún mail automático ya en cola (recordatorio o seguimiento) en los próximos días. Podés ignorarlos. No reflejan un nuevo turno activo.',
    '',
    'Saludos,',
    'Marco Rossi',
    'Estudio Marco Rossi — IA · Prueba digital · Proceso judicial',
  ].join('\n');

  return { subject, html, text };
}

// ============================================================
// Helpers de scheduling — devuelven ISO 8601 o null si no se puede.
// Resend acepta hasta 30 días en el futuro.
// ============================================================

export function reminder24hScheduledAt(startTime?: string): string | null {
  if (!startTime) return null;
  try {
    const start = new Date(startTime);
    if (isNaN(start.getTime())) return null;
    const reminder = new Date(start.getTime() - 24 * 60 * 60 * 1000);
    // Si ya pasó (booking creado con menos de 24h de anticipación), no programamos.
    if (reminder.getTime() <= Date.now()) return null;
    return reminder.toISOString();
  } catch {
    return null;
  }
}

export function reminder1hScheduledAt(startTime?: string): string | null {
  if (!startTime) return null;
  try {
    const start = new Date(startTime);
    if (isNaN(start.getTime())) return null;
    const reminder = new Date(start.getTime() - 60 * 60 * 1000);
    if (reminder.getTime() <= Date.now()) return null;
    return reminder.toISOString();
  } catch {
    return null;
  }
}

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
