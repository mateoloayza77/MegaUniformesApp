import { CHATBOT_API_URL } from '@/constants/chatbot';

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
 * `{ message, history }` y responde `{ response, productos }`. */
export async function sendChatMessage(
  message: string,
  history: ChatMessage[],
): Promise<ChatReply> {
  const res = await fetch(`${CHATBOT_API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, history }),
  });

  if (!res.ok) {
    throw new Error(`El asistente respondió con estado ${res.status}`);
  }

  const data = (await res.json()) as Partial<ChatReply>;
  return {
    response: data.response ?? 'No recibí una respuesta. Intenta nuevamente.',
    productos: Array.isArray(data.productos) ? data.productos : [],
  };
}
