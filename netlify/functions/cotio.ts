import type { Config, Context } from "@netlify/functions";
import * as dotenv from 'dotenv';

// Load .env for local development
dotenv.config();

const SYSTEM_PROMPT = `
SYSTEM PROMPT — "COTIO Prompt Improver (Jurídico)"

Identidad y alcance
Sos un asistente especializado únicamente en mejorar y estructurar prompts jurídicos usando la metodología COTIO: Contexto, Objetivo, Tarea, Input, Output. Tu salida final SIEMPRE debe ser un único prompt listo para copiar y pegar, redactado en español rioplatense, con tono profesional claro y lenguaje jurídico comprensible para no abogados. No brindás asesoramiento legal, no opinás sobre el mérito del caso, no redactás el escrito final del expediente: tu única función es mejorar el prompt del usuario.

Regla de oro
No inventes hechos, fechas, montos, nombres, normativa aplicable, tribunales, jurisprudencia ni doctrina. Si falta información fundamental para armar el prompt, NO la completes. En su lugar, generá el bloque COTIO indicando claramente qué datos faltan y ordená al LLM destinatario que lo primero que haga sea solicitar esa información al usuario.

Entrada esperada
Vas a recibir un borrador de prompt o una necesidad en lenguaje natural y, opcionalmente, datos del caso y preferencias de salida.

Tu tarea interna (sin exponer razonamiento)
A) Detectá la intención principal del usuario.
B) Normalizá y ordená el material en COTIO.
C) Identificá lagunas críticas o ambigüedades.
D) Producí un único "PROMPT FINAL COTIO".

Formato de salida obligatorio
Respondé ÚNICAMENTE con el siguiente bloque. No agregues texto antes ni después. No agregues explicaciones. No uses títulos extra.

[CONTEXTO]
Breve y operacional. Si falta información, marcá exactamente qué falta (ej: "Falta Jurisdicción/Fuero").

[OBJETIVO]
Un objetivo principal medible, en 1–2 frases.

[TAREA]
Acciones concretas que deberá ejecutar el LLM destinatario. Si falta información para ejecutar la tarea, el primer punto de la tarea DEBE SER pedirle al usuario los datos faltantes detallados.

[INPUT]
Material provisto por el usuario. Si falta material, indicá exactamente qué debe pegar el usuario.

[OUTPUT]
Definí formato y criterios de calidad del resultado. Cerrá siempre con esta línea literal:
"No inventes datos: si falta información, listá supuestos y preguntas solicitando lo necesario."

Manejo de faltantes (CRÍTICO)
Si el input del usuario es demasiado escueto (ej: solo dice "quiero una apelación" sin decir de qué), tu respuesta debe ser un bloque COTIO donde la [TAREA] y el [INPUT] estén enfocados en PREGUNTAR y RECABAR la información necesaria antes de redactar nada. No asumas nada.
`;

export default async (req: Request, context: Context) => {
    // Only allow POST
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        let body: any;
        try {
            body = await req.json();
        } catch {
            return new Response(JSON.stringify({ ok: false, error: 'Body JSON inválido.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        const { prompt, documentType, jurisdiction, anonimize } = body || {};

        // --- Input validation (defense in depth) ---
        const MAX_PROMPT_LEN = 8000;       // ~2k tokens, generoso para borradores jurídicos
        const MAX_FIELD_LEN = 200;

        if (!prompt || typeof prompt !== 'string') {
            return new Response(JSON.stringify({ ok: false, error: 'Falta el prompt original o tiene formato inválido.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const trimmedPrompt = prompt.trim();
        if (trimmedPrompt.length === 0) {
            return new Response(JSON.stringify({ ok: false, error: 'El prompt no puede estar vacío.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (trimmedPrompt.length > MAX_PROMPT_LEN) {
            return new Response(JSON.stringify({
                ok: false,
                error: `El prompt es demasiado extenso (${trimmedPrompt.length} caracteres). Máximo permitido: ${MAX_PROMPT_LEN}.`
            }), {
                status: 413,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (documentType && (typeof documentType !== 'string' || documentType.length > MAX_FIELD_LEN)) {
            return new Response(JSON.stringify({ ok: false, error: 'Tipo de documento inválido.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (jurisdiction && (typeof jurisdiction !== 'string' || jurisdiction.length > MAX_FIELD_LEN)) {
            return new Response(JSON.stringify({ ok: false, error: 'Jurisdicción inválida.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();
        const modelName = process.env.OPENROUTER_MODEL?.trim() || 'google/gemini-2.0-flash-exp:free';

        if (!openRouterKey) {
            console.error('[CRITICAL] Missing OPENROUTER_API_KEY');
            return new Response(JSON.stringify({
                ok: false,
                error: 'Configuración incompleta: OPENROUTER_API_KEY ausente. Por favor, añadí la variable en Netlify.'
            }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        const userContent = `
Borrador de prompt/necesidad: ${trimmedPrompt}
Tipo de documento deseado: ${documentType || 'No especificado'}
Jurisdicción/Fuero: ${jurisdiction || 'No especificada'}
Anonimizar datos sensibles: ${anonimize ? 'Sí' : 'No'}
        `.trim();

        console.log(`[COTIO] Calling OpenRouter with model: ${modelName}`);

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openRouterKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://www.marcorossi.com.ar",
                "X-Title": "Marco Rossi - Abogado Digital"
            },
            body: JSON.stringify({
                "model": modelName,
                "messages": [
                    { "role": "system", "content": SYSTEM_PROMPT },
                    { "role": "user", "content": `Entrada del usuario:\n${userContent}` }
                ],
                "temperature": 0.3,
                "max_tokens": 2048
            })
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('[COTIO OpenRouter Error]', data);
            throw new Error(data.error?.message || `Error status ${response.status}`);
        }

        const resultText = data.choices[0]?.message?.content;

        if (!resultText) {
            throw new Error("OpenRouter no devolvió contenido en la respuesta.");
        }

        return new Response(JSON.stringify({
            ok: true,
            result: resultText
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        console.error('[COTIO ERROR FINAL]', error);

        const errorMessage = error.message || 'Error desconocido';

        return new Response(JSON.stringify({
            ok: false,
            error: `Error de Sistema (OpenRouter): ${errorMessage}.`
        }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};

export const config: Config = {
    path: "/api/cotio"
};
