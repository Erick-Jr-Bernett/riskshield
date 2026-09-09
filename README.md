# RiskShield — Portal de Gestión de Riesgo con Chatbot IA

Proyecto universitario: portal informativo sobre Sistemas de Administración de Riesgo en Colombia
(SARLAFT, SARO, SARC, SARI) con un chatbot que responde preguntas de normativa, sanciones y
cumplimiento, usando IA (Google Gemini, capa gratuita) con respaldo local si la IA no está disponible.

## Estructura del proyecto

```
riskshield/
├── index.html               → Página principal (frontend, sin build necesario)
│                                Incluye: Sistemas de Riesgo, Banco de FAQ, Herramientas
│                                (Detector/Calculadora/Escáner/Verificador) y el Chatbot
├── assets/                   → Logo y favicons
├── api/
│   ├── chat.js                → Chatbot general de SARLAFT/SARO/SARC/SARI
│   ├── detector.js            → Punto 1: Detector de mensajes sospechosos
│   ├── scanner.js             → Punto 3: Escáner "¿cómo me ve el banco?"
│   ├── verificador.js         → Punto 4: Verificador doble (empresa / comprobante)
│   ├── casos-ejemplo.js       → Casos de ejemplo (OmegaPro, etc.) para el Verificador
│   ├── _gemini-client.js      → Lógica compartida para llamar a Gemini (no es un endpoint)
│   └── knowledge-base.js      → Base de conocimiento (contenido del PDF de riesgos)
├── package.json
├── .env.example               → Plantilla de variables de entorno
└── .gitignore
```

> Nota: la **Calculadora de Usura (punto 2)** no usa IA — es un cálculo matemático puro
> en el navegador (JavaScript), para que el resultado sea siempre exacto y no dependa de
> que la IA "sepa" hacer bien las cuentas.

## 1. Obtener la API Key gratuita de Gemini

1. Entra a **https://aistudio.google.com/app/apikey**
2. Inicia sesión con una cuenta de Google.
3. Haz clic en **"Create API key"**.
4. Copia la key generada (algo como `AIzaSy...`). **No la compartas ni la subas a GitHub.**

## 2. Subir el proyecto a GitHub

```bash
cd riskshield
git init
git add .
git commit -m "Proyecto inicial RiskShield"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/riskshield.git
git push -u origin main
```

## 3. Desplegar en Vercel

1. Entra a **https://vercel.com** e inicia sesión con GitHub.
2. Clic en **"Add New... > Project"**.
3. Selecciona el repositorio `riskshield`.
4. En **"Environment Variables"** (antes de darle deploy), agrega:
   - **Name:** `GEMINI_API_KEY`
   - **Value:** la key que copiaste en el paso 1
5. Clic en **Deploy**. En menos de un minuto tendrás una URL pública (ej. `riskshield.vercel.app`).

> Si ya desplegaste antes de agregar la variable de entorno, agrégala en
> **Project > Settings > Environment Variables** y vuelve a desplegar (**Deployments > ⋯ > Redeploy**).

## 4. Probar en local (opcional)

Necesitas la CLI de Vercel para que las funciones de `/api` funcionen localmente (abrir el `index.html`
directo en el navegador NO ejecutará el chatbot con IA, solo el respaldo local):

```bash
npm install -g vercel
vercel dev
```

Esto te da una URL local (ej. `http://localhost:3000`) con el backend funcionando.

## Cómo funciona el chatbot

1. El usuario escribe una pregunta en el chat.
2. El frontend (`index.html`) envía la pregunta a `/api/chat`.
3. `api/chat.js` arma un mensaje para Gemini que incluye **toda la base de conocimiento**
   (`api/knowledge-base.js`, basada en el PDF de preguntas) como contexto, y le pide responder
   solo con base en eso.
4. Gemini responde y el frontend la muestra en el chat.
5. **Si la IA falla o no hay conexión**, el frontend cae automáticamente a un banco de preguntas
   local (por coincidencia de palabras clave) para que el chatbot nunca se vea "roto" durante
   la sustentación.

## Cambiar de proveedor de IA en el futuro

El proyecto está separado a propósito para que cambiar de IA sea sencillo:
- Solo se edita `api/chat.js` (la llamada a la API).
- `api/knowledge-base.js` y el `index.html` no necesitan tocarse.
- Solo cambia la variable de entorno en Vercel por la key del nuevo proveedor.

## Herramientas adicionales (puntos 1-4)

Todas viven en la sección **"Herramientas de Verificación Financiera"** de la página, y llevan
un aviso visible de que es una **demo académica**, no un servicio real de verificación:

1. **Detector de Mensajes Sospechosos** (`api/detector.js`) — pega un texto/SMS/WhatsApp y la IA evalúa señales de fraude (gota a gota, phishing, pirámides).
2. **Calculadora de Usura** (cálculo en `index.html`, sin backend) — compara la tasa efectiva del préstamo contra la tasa de usura vigente en Colombia. No usa IA a propósito, para que el número sea siempre exacto.
3. **Escáner "¿Cómo me ve el banco?"** (`api/scanner.js`) — describes tu negocio y la IA simula qué alertas dispararía en un sistema SARLAFT real.
4. **Verificador Doble** (`api/verificador.js`):
   - *Ruta A (empresa)*: la IA responde con base en casos de ejemplo conocidos (`api/casos-ejemplo.js`), dejando claro que no consulta la base de datos oficial en vivo de la Superfinanciera.
   - *Ruta B (comprobante)*: subes una foto de un comprobante de pago; Gemini (con visión) señala inconsistencias visuales, sin afirmar con certeza absoluta que sea falso o verdadero.

### Actualizar la tasa de usura

La Calculadora de Usura usa una constante `TASA_USURA_ANUAL` dentro del `<script>` de `index.html`
(actualmente 29.24% E.A., vigente para crédito de consumo/ordinario según la Superfinanciera,
Resolución 1260 de 2026). Esta tasa **cambia periódicamente** — para mantenerla vigente hay que
revisar el valor actual en superfinanciera.gov.co y actualizar esa constante.