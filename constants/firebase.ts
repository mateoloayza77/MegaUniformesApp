import AsyncStorage from '@react-native-async-storage/async-storage';
import { getApp, getApps, initializeApp } from 'firebase/app';
// `getReactNativePersistence` solo se exporta en la build de React Native del SDK
// (Metro resuelve `firebase/auth` a `dist/rn`). TypeScript resuelve los tipos del
// navegador, que no lo declaran, por eso lo importamos con un cast controlado.
import {
  getAuth,
  initializeAuth,
  // @ts-expect-error — presente en la entrada React Native, ausente en los tipos web.
  getReactNativePersistence,
  type Auth,
} from 'firebase/auth';
import { initializeFirestore, type Firestore } from 'firebase/firestore';

// Config del proyecto Firebase. Se leen de variables de entorno `EXPO_PUBLIC_*`
// (ver `.env` / `.env.example`). Estas claves de cliente NO son secretas: viajan en
// el bundle de la app. La seguridad real vive en las reglas de Firebase, no aquí.
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

/** True cuando el `.env` tiene claves reales (no los placeholders). Las pantallas lo
 * usan para avisar en vez de reventar si Firebase aún no está configurado. */
export const isFirebaseConfigured =
  !!firebaseConfig.apiKey && !firebaseConfig.apiKey.startsWith('TU_');

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// `initializeAuth` debe llamarse una sola vez por app; en Fast Refresh vuelve a
// ejecutarse este módulo, así que caemos en `getAuth` si ya estaba inicializado.
let auth: Auth;
try {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} catch {
  auth = getAuth(app);
}

// Firestore. En React Native/Expo (Hermes) el transporte WebChannel por defecto
// puede fallar; `experimentalAutoDetectLongPolling` deja que el SDK detecte y use
// long-polling cuando haga falta. Como este módulo se re-ejecuta en Fast Refresh,
// `initializeFirestore` solo debe llamarse una vez, así que caemos a la instancia
// existente si ya estaba creada.
let db: Firestore;
try {
  db = initializeFirestore(app, {
    experimentalAutoDetectLongPolling: true,
  });
} catch {
  // Ya inicializada (p. ej. tras Fast Refresh): reutilizamos la misma instancia.
  const { getFirestore } = require('firebase/firestore');
  db = getFirestore(app);
}

export { auth, db };
