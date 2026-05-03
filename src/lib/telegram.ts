// Notificaciones a Telegram via Bot API.
// Server-only — depende de process.env.TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID.
//
// Setup del bot:
//   1) En Telegram, abrir chat con @BotFather → /newbot → seguir prompts.
//   2) Guardar el TOKEN que devuelve.
//   3) Iniciar chat con el bot recién creado (search by username → /start).
//   4) Visitar https://api.telegram.org/bot<TOKEN>/getUpdates
//      → buscar chat.id (entero, positivo para chats privados, negativo para grupos).
//   5) Cargar TELEGRAM_BOT_TOKEN y TELEGRAM_CHAT_ID en Vercel.

const TELEGRAM_API = 'https://api.telegram.org';
const MAX_MESSAGE_LEN = 4096; // Límite duro de la API.

export type TelegramSendResult = { ok: boolean; error?: string };

export async function sendTelegramMessage(text: string): Promise<TelegramSendResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();

  if (!token || !chatId) {
    return {
      ok: false,
      error: 'Telegram no configurado (faltan TELEGRAM_BOT_TOKEN o TELEGRAM_CHAT_ID)',
    };
  }

  // Truncamos defensivamente; mensajes largos los API rechaza.
  const safeText = text.length > MAX_MESSAGE_LEN ? text.slice(0, MAX_MESSAGE_LEN - 3) + '...' : text;

  try {
    const url = `${TELEGRAM_API}/bot${token}/sendMessage`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: safeText,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });

    if (!resp.ok) {
      const errBody = await resp.text();
      return { ok: false, error: `Telegram API ${resp.status}: ${errBody}` };
    }
    return { ok: true };
  } catch (e: any) {
    return { ok: false, error: e?.message || 'Telegram fetch failed' };
  }
}

// Escapa los chars que rompen el parse_mode=HTML de Telegram.
// Solo &, <, > son especiales; el resto se imprime tal cual.
export function tgEscape(s: string): string {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
