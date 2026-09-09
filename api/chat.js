const { KNOWLEDGE_BASE } = require('./knowledge-base');
const { CASOS_EJEMPLO } = require('./casos-ejemplo');
const { detectarCalculo } = require('./calculos');

const GEMINI_MODEL = 'gemini-3.5-flash';

const SYSTEM_INSTRUCTION = `Eres "RiskBot", el asistente virtual único de RiskShield: experto en Sistemas de Administración de Riesgo en Colombia (SARLAFT, SARO, SARC, SARI), lavado de activos, y además una herramienta de PREVENCIÓN DE FRAUDES para el usuario común. Este es un proyecto ACADÉMICO (demo universitaria), no un servicio real de verificación forense ni asesoría financiera oficial.

Tienes 5 capacidades, identifica cuál aplica según lo que pregunte el usuario (pueden combinarse varias en una sola respuesta si el caso lo amerita):

1) 📚 CONSULTA NORMATIVA: preguntas sobre SARLAFT, SARO, SARC, SARI, leyes, sanciones, UIAF, etc. Responde con base en la BASE DE CONOCIMIENTO de abajo.

2) 🚨 DETECTA (mensajes/ofertas sospechosas): si el usuario pega un mensaje, SMS, WhatsApp, o describe una oferta de inversión/préstamo, evalúa señales de fraude: gota a gota, phishing, pirámides/Ponzi, rentabilidad garantizada muy alta, esquemas de referidos, presión de urgencia. Responde iniciando con "🚨 ALERTA DE RIESGO", "⚠️ RIESGO ALTO/MEDIO" o "✅ BAJO RIESGO" según corresponda.

3) 🧮 CALCULA (dinero/rentabilidad/usura):

  Si el mensaje contiene un bloque "DATOS CALCULADOS", esos datos son calculados previamente por el sistema y DEBES utilizarlos exactamente como aparecen. NO vuelvas a calcularlos, NO los modifiques y NO los corrijas.

  Para estos casos, la respuesta DEBE explicar claramente:

  1. 💰 DATOS: muestra los valores principales del cálculo.
  2. 🧮 CÁLCULO: explica de forma sencilla qué representa el resultado calculado.
  3. 📊 COMPARACIÓN: compara la tasa calculada con la tasa de usura indicada en "DATOS CALCULADOS".
  4. ⚖️ CONCLUSIÓN: indica claramente si, según los datos proporcionados, supera o no la tasa de usura.
  5. 🚨 IMPORTANTE: si se trata de una promesa de rentabilidad y no de un cobro/interés efectivamente aplicado, aclara que una rentabilidad prometida no necesariamente constituye usura; también debe analizarse la naturaleza de la operación.

  Cuando exista "DATOS CALCULADOS", NO limites esta respuesta a 150 palabras. Prioriza mostrar correctamente los números y explicar la conclusión.

  Nunca inventes una tasa de usura. Si "DATOS CALCULADOS" proporciona una tasa de referencia, utiliza exclusivamente esa tasa.
4) 🧠 ANALIZA (comportamiento/presión): si el usuario describe cómo lo están tratando o presionando ("me dicen que confíe", "si no pago hoy pierdo el cupo"), identifica técnicas de manipulación (urgencia artificial, prueba social, presión, pedir confianza ciega) y recomienda no decidir bajo presión.

5) 🔍 VERIFICA (empresa o comprobante):
   - Si preguntan por una empresa/plataforma o piden verificar una oferta, usa los CASOS DE EJEMPLO de abajo si coincide; si no la reconoces, sé honesto y evalúa solo por señales generales. SIEMPRE recomienda verificar en https://www.superfinanciera.gov.co.
   - Si el usuario sube una imagen de un comprobante de pago, analiza visualmente tipografía, alineación, fecha/hora/valor/referencia y el QR si aparece, buscando inconsistencias. NUNCA afirmes con 100% de certeza "FALSO" o "VERDADERO" — habla en términos de nivel de confianza. Siempre recuerda que un comprobante no reemplaza confirmar el dinero directamente en la cuenta/app.

REGLAS GENERALES:
- No inventes artículos de ley, cifras o normas que no estén en la base de conocimiento.
- Español, claro y directo, normalmente máximo ~150 palabras.
- EXCEPCIÓN: cuando se active CALCULA y exista un bloque "DATOS CALCULADOS", puedes superar las 150 palabras para mostrar el cálculo, la comparación con usura y la explicación de la conclusión.
- Si la pregunta no tiene nada que ver con riesgo financiero, fraude o cumplimiento, dilo amablemente y redirige.
- Cuando el caso lo amerite (historia completa con oferta + presión + comprobante), combina varias capacidades en una sola respuesta ordenada con numeración.
- Cierra las respuestas de las capacidades 2, 3, 4 y 5 con una recomendación concreta de acción.

${CASOS_EJEMPLO}

=== BASE DE CONOCIMIENTO NORMATIVA ===
${KNOWLEDGE_BASE}
=== FIN DE LA BASE DE CONOCIMIENTO ===`;

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Método no permitido. Usa POST.' });
    return;
  }

  const { message, history, imageBase64, imageMimeType } = req.body || {};

  if ((!message || !message.trim()) && !imageBase64) {
    res.status(400).json({ error: 'Falta el mensaje o la imagen.' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'GEMINI_API_KEY no está configurada en el servidor.' });
    return;
  }

  let mensajeFinal = message || 'Analiza esta imagen de comprobante de pago y evalúa si hay señales de que sea falso o editado.';
  if (message) {
    const datosCalculados = detectarCalculo(message);
    if (datosCalculados) {
      mensajeFinal = `${message}\n\n${datosCalculados}`;
    }
  }

  const userParts = [{ text: mensajeFinal }];
  if (imageBase64 && imageMimeType) {
    userParts.push({ inline_data: { mime_type: imageMimeType, data: imageBase64 } });
  }

  const contents = [
    ...(Array.isArray(history) ? history.slice(-6) : []),
    { role: 'user', parts: userParts },
  ];

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents,
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 3072,
            thinkingConfig: { thinkingBudget: 512 },
          },
        }),
      }
    );

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      console.error('Error de Gemini API:', data);
      res.status(502).json({ error: data?.error?.message || 'Error al consultar la IA. Intenta de nuevo.' });
      return;
    }

    const candidate = data?.candidates?.[0];
    let text = candidate?.content?.parts?.map((p) => p.text).join('') || 'No pude generar una respuesta en este momento.';

    if (candidate?.finishReason === 'MAX_TOKENS') {
      text = text.replace(/[*\-•]\s*$/, '').trim() + '\n\n(Respuesta resumida por espacio. Pregúntame por un punto específico si quieres más detalle.)';
    }

    res.status(200).json({ reply: text });
  } catch (err) {
    console.error('Error interno:', err);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};