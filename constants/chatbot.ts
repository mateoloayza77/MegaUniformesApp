// URL base del backend del chatbot (FastAPI). Se define en `.env` como
// EXPO_PUBLIC_CHATBOT_API_URL (p.ej. https://megauniformes-api.onrender.com).
// Mientras no esté configurada, la pantalla del asistente muestra un aviso y
// ofrece WhatsApp como alternativa.
export const CHATBOT_API_URL = (process.env.EXPO_PUBLIC_CHATBOT_API_URL ?? '').replace(/\/$/, '');
export const isChatbotConfigured = CHATBOT_API_URL.length > 0;
