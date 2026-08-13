# RiskShield — Portal de Gestión de Riesgo con Chatbot IA

Proyecto universitario: portal informativo sobre Sistemas de Administración de Riesgo en Colombia
(SARLAFT, SARO, SARC, SARI) con un chatbot que responde preguntas de normativa, sanciones y
cumplimiento, usando IA (Google Gemini, capa gratuita) con respaldo local si la IA no está disponible.

## Estructura del proyecto

```
riskshield/
├── index.html          → Página principal (frontend, sin build necesario)
├── api/
│   ├── chat.js          → Función serverless: recibe la pregunta y consulta a Gemini
│   └── knowledge-base.js → Base de conocimiento (contenido del PDF de riesgos)
├── package.json
├── .env.example          → Plantilla de variables de entorno
└── .gitignore
```

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
