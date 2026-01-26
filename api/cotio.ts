import { GoogleGenerativeAI } from '@google/generative-ai';

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

        const rawApiKey = process.env.GEMINI_API_KEY?.trim();

        if (!rawApiKey) {
            return res.status(500).json({ ok: false, error: 'Configuración incompleta: GEMINI_API_KEY ausente.' });
        }

        const genAI = new GoogleGenerativeAI(rawApiKey);

        // We will try gemini-1.5-flash as the main one, and gemini-2.0-flash-exp as fallback
        const candidateModels = ["gemini-1.5-flash", "gemini-2.0-flash-exp", "gemini-1.5-pro"];
        let lastError = null;

        for (const modelName of candidateModels) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });

                const userContent = `
Borrador de prompt/necesidad: ${prompt}
Tipo de documento deseado: ${documentType || 'No especificado'}
Jurisdicción/Fuero: ${jurisdiction || 'No especificada'}
Anonimizar datos sensibles: ${anonimize ? 'Sí' : 'No'}
                `.trim();

                const result = await model.generateContent({
                    contents: [
                        { role: 'user', parts: [{ text: SYSTEM_PROMPT + "\n\nEntrada del usuario:\n" + userContent }] }
                    ]
                });

                const response = await result.response;
                return res.status(200).json({
                    ok: true,
                    result: response.text()
                });
            } catch (err: any) {
                lastError = err;
                if (err.message.includes('401') || err.message.includes('API key')) break;
                if (err.message.includes('permission')) break;
            }
        }

        throw lastError;

    } catch (error: any) {
        console.error('[COTIO ERROR FINAL]', error);

        const errorMessage = error.message || 'Error desconocido';

        // Final Diagnostic message for the user
        let friendlyMessage = `Error de Configuración [404]: Google no encuentra el modelo "gemini-1.5-flash" con esta API Key. `;

        if (errorMessage.includes('404')) {
            friendlyMessage += "Esto ocurre cuando la clave se creó en un proyecto de GCP estricto. Por favor, andá a aistudio.google.com, generá una nueva API Key presionando 'Create API Key' y pegala en Vercel. Asegurate de que NO sea una clave de proyecto de Google Cloud, sino una de AI Studio.";
        } else {
            friendlyMessage = `Error en el Laboratorio: ${errorMessage}`;
        }

        return res.status(500).json({
            ok: false,
            error: friendlyMessage
        });
    }
}
