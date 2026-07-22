// Siembra la colección `products` de Firestore con el catálogo inicial.
//
// Requisitos:
//   1. npm install (instala firebase-admin, ya está en devDependencies).
//   2. Consola de Firebase → Configuración del proyecto → Cuentas de servicio →
//      "Generar nueva clave privada". Guarda el JSON como `serviceAccountKey.json`
//      en la raíz del proyecto (¡está en .gitignore, NO lo subas!), o exporta su
//      ruta en la variable de entorno GOOGLE_APPLICATION_CREDENTIALS.
//   3. npm run seed:catalog
//
// Es idempotente: usa el id del producto como id del documento y hace merge, así
// que puedes volver a correrlo sin duplicar. Tras el primer seed, la fuente de
// verdad del catálogo pasa a ser Firestore (edita ahí o en la consola).
//
// NOTA: los productos van embebidos aquí a propósito para que el script sea Node
// puro (sin el alias @/ ni el require de imágenes de data/products.ts). Si cambias
// el catálogo estático de arranque, actualiza esta lista también.

import { readFileSync } from 'node:fs';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS ?? './serviceAccountKey.json';

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'));
} catch {
  console.error(
    `\n✗ No se encontró la clave de cuenta de servicio en "${keyPath}".\n` +
      '  Descárgala desde la consola de Firebase (Cuentas de servicio → Generar\n' +
      '  nueva clave privada) y guárdala como serviceAccountKey.json en la raíz,\n' +
      '  o define GOOGLE_APPLICATION_CREDENTIALS con su ruta.\n',
  );
  process.exit(1);
}

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// Catálogo organizado por COLEGIO. Debe reflejar `data/products.ts` (buildProducts).
// ⚠️ PRECIOS REFERENCIALES (placeholder) — ajústalos antes de publicar.
const IMG = {
  polo: 'https://images.unsplash.com/photo-1586363104862-3a3e58c1a1c0?w=600&h=600&fit=crop',
  camisa: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2b?w=600&h=600&fit=crop',
  buzo: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop',
  pantalon: 'https://images.unsplash.com/photo-1473966968600-fa801b279a01?w=600&h=600&fit=crop',
  falda: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop',
  deportivo: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=600&fit=crop',
};

const description =
  'Uniforme escolar de alta calidad, confeccionado con materiales resistentes y cómodos para el uso diario. Disponible en varias tallas para niños y jóvenes. Confirma tallas, colores y disponibilidad por WhatsApp.';

const schools = [
  { id: 'la-asuncion', name: 'La Asunción', women: true },
  { id: 'tecnico-salesiano', name: 'Técnico Salesiano', women: false },
  { id: 'borja', name: 'Borja', women: true },
  { id: 'la-salle', name: 'La Salle', women: true },
  { id: 'benigno-malo', name: 'Benigno Malo', women: true },
  { id: 'catalinas', name: 'Catalinas', women: true },
];

const garments = [
  { key: 'camisa', name: 'Camisa Formal', category: 'polo', categoryLabel: 'Camisas', image: IMG.camisa, price: 18.99 },
  { key: 'polo', name: 'Camiseta Polo', category: 'polo', categoryLabel: 'Camisetas Polo', image: IMG.polo, price: 15.99 },
  { key: 'chompa', name: 'Chompa', category: 'buzos', categoryLabel: 'Chompas y Buzos', image: IMG.buzo, price: 28.99 },
  { key: 'pantalon', name: 'Pantalón', category: 'pantalones', categoryLabel: 'Pantalones', image: IMG.pantalon, price: 22.99 },
  { key: 'falda', name: 'Falda', category: 'faldas', categoryLabel: 'Faldas', image: IMG.falda, price: 19.99, onlyWomen: true },
  { key: 'conjunto', name: 'Conjunto Deportivo', category: 'pantalones', categoryLabel: 'Deportivo', image: IMG.deportivo, price: 32.99 },
  { key: 'camiseta-ef', name: 'Camiseta Deportiva', category: 'polo', categoryLabel: 'Deportivo', image: IMG.polo, price: 14.99 },
];

const products = [];
for (const school of schools) {
  let first = true;
  for (const g of garments) {
    if (g.onlyWomen && !school.women) continue;
    products.push({
      id: `${school.id}-${g.key}`,
      name: `${g.name} ${school.name}`,
      price: g.price,
      category: g.category,
      categoryLabel: g.categoryLabel,
      school: school.id,
      schoolLabel: school.name,
      image: g.image,
      onPromotion: first,
      description,
    });
    first = false;
  }
}

const batch = db.batch();
const validIds = new Set(products.map((p) => p.id));
for (const { id, ...data } of products) {
  batch.set(db.collection('products').doc(id), data, { merge: true });
}

// Prune: elimina documentos que ya no están en el catálogo (p.ej. el modelo viejo
// por prenda), para que Firestore refleje exactamente el catálogo actual.
const existing = await db.collection('products').get();
let pruned = 0;
for (const docSnap of existing.docs) {
  if (!validIds.has(docSnap.id)) {
    batch.delete(docSnap.ref);
    pruned += 1;
  }
}

try {
  await batch.commit();
  console.log(
    `✓ Catálogo sembrado: ${products.length} productos en "products"` +
      (pruned ? ` (${pruned} documentos obsoletos eliminados).` : '.'),
  );
  process.exit(0);
} catch (err) {
  console.error('✗ Error al sembrar el catálogo:', err);
  process.exit(1);
}
