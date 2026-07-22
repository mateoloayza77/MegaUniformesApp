import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

import { db } from '@/constants/firebase';
import type { CartItem } from '@/types';

/** Datos por usuario que sincronizamos con Firestore (doc `users/{uid}`). */
export interface UserData {
  favorites: string[];
  cart: CartItem[];
}

function userDocRef(uid: string) {
  return doc(db, 'users', uid);
}

/** Lee el doc `users/{uid}`. Devuelve `null` si aún no existe. */
export async function loadUserData(uid: string): Promise<UserData | null> {
  const snap = await getDoc(userDocRef(uid));
  if (!snap.exists()) return null;
  const data = snap.data();
  return {
    favorites: Array.isArray(data.favorites) ? data.favorites : [],
    cart: Array.isArray(data.cart) ? data.cart : [],
  };
}

/** Escribe favoritos + carrito del usuario (merge, sin pisar otros campos). */
export async function saveUserData(uid: string, data: UserData): Promise<void> {
  await setDoc(
    userDocRef(uid),
    { ...data, updatedAt: serverTimestamp() },
    { merge: true },
  );
}
