import { CHATBOT_API_URL, isChatbotConfigured } from '@/constants/chatbot';

/** El backend vive en Render (plan gratuito): tras ~15 min inactivo se "duerme"
 * y el primer request tarda en despertar. Damos margen amplio para no fallar. */
const CHAT_TIMEOUT_MS = 60_000;

/** Producto que puede devolver el backend desde el inventario SQLite. */
export interface ChatProduct {
  id?: number;
  colegio?: string;
  prenda?: string;
  genero?: string;
  talla?: string;
  stock?: number;
  precio?: number;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatReply {
  response: string;
  productos: ChatProduct[];
}

/** Envía un mensaje al backend del chatbot (`POST /chat`). El backend espera
 * `{ message, history }` y responde `{ response, productos }`. Aborta si el
 * backend no responde dentro de `CHAT_TIMEOUT_MS`. */
export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
): Promise<ChatReply> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);
  try {
    const res = await fetch(`${CHATBOT_API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history }),
      signal: controller.signal,
    });

    if (!res.ok) {
      throw new Error(`El asistente respondió con estado ${res.status}`);
    }

    const data = (await res.json()) as Partial<ChatReply>;
    return {
      response: data.response ?? 'No recibí una respuesta. Intenta nuevamente.',
      productos: Array.isArray(data.productos) ? data.productos : [],
    };
  } finally {
    clearTimeout(timer);
  }
}

/** "Despierta" el backend de Render en segundo plano (GET liviano) para que el
 * primer mensaje del usuario no tenga que esperar el arranque en frío. Es
 * best-effort: si falla o no está configurado, no pasa nada. */
export async function warmUpChatbot(): Promise<void> {
  if (!isChatbotConfigured) return;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);
  try {
    await fetch(`${CHATBOT_API_URL}/`, { signal: controller.signal });
  } catch {
    // Ignorado: es solo un calentamiento previo.
  } finally {
    clearTimeout(timer);
  }
}
