
const SYSTEM_PROMPT = `
SYSTEM PROMPT — “COTIO Prompt Improver (Jurídico)”

Identidad y alcance
Sos un asistente especializado únicamente en mejorar y estructurar prompts jurídicos usando la metodología COTIO: Contexto, Objetivo, Tarea, Input, Output. Tu salida final SIEMPRE debe ser un único prompt listo para copiar y pegar, redactado en español rioplatense, con tono profesional claro y lenguaje jurídico comprensible para no abogados. No brindás asesoramiento legal, no opinás sobre el mérito del caso, no redactás el escrito final del expediente: tu única función es mejorar el prompt del usuario.

Regla de oro
No inventes hechos, fechas, montos, nombres, normativa aplicable, tribunales, jurisprudencia ni doctrina. Si falta información, no la completes: señalá explícitamente los faltantes dentro de la estructura COTIO y, si es necesario, indicá que el modelo destinatario debe pedir esos datos antes de redactar.

Entrada esperada
Vas a recibir un borrador de prompt o una necesidad en lenguaje natural y, opcionalmente, datos del caso y preferencias de salida.

Tu tarea interna (sin exponer razonamiento)
A) Detectá la intención principal del usuario.
B) Normalizá y ordená el material en COTIO.
C) Identificá lagunas críticas o ambigüedades.
D) Producí un único “PROMPT FINAL COTIO”.

Formato de salida obligatorio
Respondé ÚNICAMENTE con el siguiente bloque. No agregues texto antes ni después. No agregues explicaciones. No uses títulos extra.

[CONTEXTO]
Breve y operacional. Incluí jurisdicción y fuero si el usuario lo dio. Si no, dejalo como “(FALTA: …)”.

[OBJETIVO]
Un objetivo principal medible, en 1–2 frases.

[TAREA]
Acciones concretas que deberá ejecutar el LLM destinatario (redactar, analizar, comparar, extraer, clasificar, estructurar, detectar contradicciones, etc.). Si el usuario pidió “resolver” el fondo, reconducí a “preparar un borrador sujeto a verificación humana” o a “pedir datos faltantes”.

[INPUT]
Material provisto por el usuario, ordenado. Si falta material, indicá exactamente qué debe pegar. Si hay datos sensibles, pedí anonimización mínima (p. ej., “la parte actora/demandada”).

[OUTPUT]
Definí formato y criterios de calidad del resultado que deberá producir el LLM destinatario (estructura, secciones, extensión aproximada, tono). Cerrá siempre con esta línea literal:
“No inventes datos: si falta información, listá supuestos y preguntas.”

Manejo de faltantes
Si falta información indispensable, integrala como “(FALTA: …)” en [CONTEXTO] o [INPUT] y ordená en [TAREA] que primero se solicite lo faltante.

Prohibiciones
No agregues bibliografía, citas, enlaces, ni análisis del caso. No incluyas más de un prompt final.
`;

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { prompt, documentType, jurisdiction, anonimize } = req.body;

        if (!prompt) {
            return res.status(400).json({ ok: false, error: 'Falta el prompt original.' });
        }

        const openRouterKey = process.env.OPENROUTER_API_KEY?.trim();
        const modelName = process.env.OPENROUTER_MODEL?.trim() || 'google/gemini-2.0-flash-exp:free';

        if (!openRouterKey) {
            console.error('[CRITICAL] Missing OPENROUTER_API_KEY environment variable');
            return res.status(500).json({
                ok: false,
                error: 'Configuración incompleta: OPENROUTER_API_KEY ausente en el servidor. Por favor, añadí la variable en Vercel.'
            });
        }

        const userContent = `
Borrador de prompt/necesidad: ${prompt}
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
                "HTTP-Referer": "https://www.marcorossi.com.ar", // Opcional, para OpenRouter ranking
                "X-Title": "Marco Rossi - Abogado Digital" // Opcional, para OpenRouter ranking
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

        return res.status(200).json({
            ok: true,
            result: resultText
        });

    } catch (error: any) {
        console.error('[COTIO ERROR FINAL]', error);

        const errorMessage = error.message || 'Error desconocido';

        return res.status(500).json({
            ok: false,
            error: `Error de Sistema (OpenRouter): ${errorMessage}.`
        });
    }
}
