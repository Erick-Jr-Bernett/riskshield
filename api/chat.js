const { KNOWLEDGE_BASE } = require('./knowledge-base');

// gemini-3.5-flash es el modelo vigente con cuota gratuita.
const GEMINI_MODEL = 'gemini-3.5-flash';

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido. Usa POST.' });
    return;
  }

  const { message, history } = req.body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    res.status(400).json({ error: 'Falta el campo "message".' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error:
        'GEMINI_API_KEY no está configurada en el servidor. Agrégala en Vercel > Settings > Environment Variables.',
    });
    return;
  }

  const systemInstruction = `Eres "RiskBot", un asistente virtual experto en Sistemas de Administración de Riesgo en Colombia (SARLAFT, SARO, SARC, SARI/SARM), lavado de activos, financiación del terrorismo y cumplimiento normativo.

Reglas:
1. Responde ÚNICAMENTE basándote en la BASE DE CONOCIMIENTO proporcionada abajo. No inventes artículos de ley, cifras ni normas que no estén ahí.
2. Si la pregunta no tiene relación con gestión de riesgo, lavado de activos o cumplimiento normativo, responde amablemente que solo puedes ayudar con esos temas.
3. Responde en español, de forma clara y profesional, usando viñetas cuando ayude a la claridad.
4. Puedes combinar información de varios módulos de la base de conocimiento si la pregunta lo requiere.
5. LÍMITE DE EXTENSIÓN: máximo 4 viñetas o 120 palabras en total. Si el tema da para más, entrega solo lo más importante y termina la respuesta invitando a preguntar por un punto específico ("¿Quieres que profundice en algún punto?"). NUNCA dejes una oración, viñeta o frase a medias — siempre cierra ideas completas dentro de ese límite.

=== BASE DE CONOCIMIENTO ===
${KNOWLEDGE_BASE}
=== FIN DE LA BASE DE CONOCIMIENTO ===`;

  const contents = [
    ...(Array.isArray(history) ? history.slice(-6) : []),
    { role: 'user', parts: [{ text: message }] },
  ];

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemInstruction }] },
          contents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      console.error('Error de Gemini API:', data);
      res.status(502).json({
        error: data?.error?.message || 'Error al consultar la IA. Intenta de nuevo.',
      });
      return;
    }

    const candidate = data?.candidates?.[0];
    let text =
      candidate?.content?.parts?.map((p) => p.text).join('') ||
      'No pude generar una respuesta en este momento.';

    // Salvaguarda: si Gemini se quedó sin espacio de tokens, evita mostrar
    // una respuesta cortada a la mitad de una palabra o viñeta.
    if (candidate?.finishReason === 'MAX_TOKENS') {
      text = text.replace(/[*\-•]\s*$/, '').trim() + '\n\n(Respuesta resumida por espacio. Pregúntame por un punto específico si quieres más detalle.)';
    }

    res.status(200).json({ reply: text });
  } catch (err) {
    console.error('Error interno:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};