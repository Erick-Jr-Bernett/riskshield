const { KNOWLEDGE_BASE } = require('./knowledge-base');
const { CASOS_EJEMPLO } = require('./casos-ejemplo');
const { detectarCalculo } = require('./calculos');

// Si el primero está saturado, se intenta con el siguiente de la lista, en orden.
const MODELOS_RESPALDO = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-3.5-flash-lite'];

function obtenerFechaHoy() {
  return new Date().toLocaleDateString('es-CO', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    timeZone: 'America/Bogota',
  });
}

const SYSTEM_INSTRUCTION = `Eres "RiskBot", el asistente virtual único de RiskShield: experto en Sistemas de Administración de Riesgo en Colombia (SARLAFT, SARO, SARC, SARI), lavado de activos, y además una herramienta de PREVENCIÓN DE FRAUDES para el usuario común. Este es un proyecto ACADÉMICO (demo universitaria), no un servicio real de verificación forense ni asesoría financiera oficial.

FECHA ACTUAL: hoy es ${obtenerFechaHoy()}. Tu entrenamiento tiene un corte de conocimiento anterior a esta fecha, así que NO asumas que una fecha reciente o cercana a hoy es "del futuro" o sospechosa solo por no reconocerla — compara las fechas contra la fecha actual real que se te acaba de dar, no contra tu fecha de corte de entrenamiento.

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

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function esErrorDeSaturacion(geminiRes, data) {
  if (geminiRes.ok) return false;
  const msg = (data?.error?.message || '').toLowerCase();
  return geminiRes.status === 503 || msg.includes('high demand') || msg.includes('overloaded');
}

// Prueba cada modelo de MODELOS_RESPALDO en orden. Para cada uno, reintenta
// un par de veces si está saturado antes de pasar al siguiente modelo.
async function llamarGeminiConRespaldo(apiKey, body) {
  let ultimoResultado = null;

  for (const modelo of MODELOS_RESPALDO) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${apiKey}`;

    for (let intento = 0; intento < 2; intento++) {
      const geminiRes = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await geminiRes.json();
      ultimoResultado = { geminiRes, data, modelo };

      if (geminiRes.ok) return ultimoResultado;

      if (esErrorDeSaturacion(geminiRes, data)) {
        console.warn(`Modelo ${modelo} saturado (intento ${intento + 1}), reintentando...`);
        await sleep(700 * (intento + 1));
        continue; // reintenta el mismo modelo una vez más
      }

      // Error que no es de saturación (ej. API key inválida, request mal formado):
      // no tiene sentido seguir intentando con otros modelos, se corta ya.
      return ultimoResultado;
    }
    // Se agotaron los reintentos de este modelo por saturación, prueba el siguiente.
  }

  return ultimoResultado; // todos los modelos fallaron, devuelve el último error para reportarlo
}

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
    const resultado = await llamarGeminiConRespaldo(apiKey, {
      system_instruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
      contents,
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 2048,
        thinkingConfig: { thinkingBudget: 0 },
      },
    });

    if (!resultado || !resultado.geminiRes.ok) {
      console.error('Error de Gemini API (todos los modelos fallaron):', resultado?.data);
      res.status(502).json({ error: resultado?.data?.error?.message || 'Todos los modelos están saturados en este momento. Intenta de nuevo en unos segundos.' });
      return;
    }

    const { geminiRes, data, modelo } = resultado;
    console.log(`Respondido por: ${modelo}`);

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