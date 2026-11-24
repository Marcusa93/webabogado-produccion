// Envío de reservas y mensajes del sitio a MR System (sistema interno del
// estudio, app.marcorossi.com.ar). Server-only: lo usan las funciones de api/.
//
// MR System los carga como `consultas` vía la edge function `ingesta-web`
// (repo MR-Abogado). Best-effort: si MR System no responde, el sitio sigue
// igual (mails y Telegram salen igual) y el error queda en los logs.
//
// ENV (Vercel, solo servidor):
//   MR_SYSTEM_INGEST_URL     https://<ref>.supabase.co/functions/v1/ingesta-web
//   MR_SYSTEM_INGEST_SECRET  mismo valor que WEB_INGEST_SECRET en Supabase

const TIMEOUT_MS = 5000;

export type ReservaMrSystem = {
  tipo: 'reserva';
  evento: 'creada' | 'reprogramada' | 'cancelada';
  uid: string;
  uid_anterior?: string;
  nombre: string;
  email?: string;
  telefono?: string;
  inicio?: string;
  titulo?: string;
  respuestas?: { label: string; value: string }[];
  area?: string;
  origen?: string;
  motivo?: string;
};

export type ContactoMrSystem = {
  tipo: 'contacto';
  nombre: string;
  email: string;
  telefono?: string;
  mensaje: string;
};

export type MrSystemResult = {
  ok: boolean;
  accion?: string;
  consultaId?: string;
  error?: string;
};

export async function enviarAMrSystem(
  datos: ReservaMrSystem | ContactoMrSystem,
): Promise<MrSystemResult> {
  const url = process.env.MR_SYSTEM_INGEST_URL?.trim();
  const secret = process.env.MR_SYSTEM_INGEST_SECRET?.trim();
  if (!url || !secret) {
    return {
      ok: false,
      error: 'MR System no configurado (faltan MR_SYSTEM_INGEST_URL o MR_SYSTEM_INGEST_SECRET)',
    };
  }

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-ingesta-secret': secret },
      body: JSON.stringify(datos),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    const body = (await resp.json().catch(() => ({}))) as {
      accion?: string;
      consulta_id?: string;
      error?: string;
    };
    if (!resp.ok) {
      return { ok: false, error: `HTTP ${resp.status}: ${body.error ?? 'sin detalle'}` };
    }
    return { ok: true, accion: body.accion, consultaId: body.consulta_id };
  } catch (e) {
    const err = e as Error;
    return {
      ok: false,
      error: err?.name === 'TimeoutError' ? `timeout de ${TIMEOUT_MS} ms` : err?.message || String(e),
    };
  }
}
