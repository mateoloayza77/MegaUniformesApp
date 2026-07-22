import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

import { db } from '@/constants/firebase';

/** Línea de pedido con nombre y precio "congelados" al momento de la compra, para
 * que el historial no cambie si luego se edita el catálogo. La pantalla que llama
 * resuelve nombre/precio contra el catálogo (`useCatalog`) antes de crear el pedido. */
export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

export interface CreateOrderInput {
  uid: string;
  customerName: string | null;
  items: OrderItem[];
  subtotal: number;
}

/** Crea un pedido en `orders/{autoId}`. Devuelve el id del documento creado. */
export async function createOrder(input: CreateOrderInput): Promise<string> {
  const ref = await addDoc(collection(db, 'orders'), {
    uid: input.uid,
    customerName: input.customerName,
    items: input.items,
    subtotal: input.subtotal,
    status: 'pendiente',
    createdAt: serverTimestamp(),
  });

  return ref.id;
}
