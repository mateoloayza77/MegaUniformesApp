import { collection, getDocs } from 'firebase/firestore';

import { db } from '@/constants/firebase';
import type { Product, ProductCategory } from '@/types';

/** Lee todos los productos de la colección `products` de Firestore. El id del
 * documento es el id del producto. Devuelve `[]` si la colección está vacía. */
export async function fetchCatalog(): Promise<Product[]> {
  const snap = await getDocs(collection(db, 'products'));
  return snap.docs.map((docSnap) => {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      name: data.name,
      price: data.price,
      category: data.category as ProductCategory,
      categoryLabel: data.categoryLabel,
      school: data.school ?? '',
      schoolLabel: data.schoolLabel ?? '',
      image: data.image,
      onPromotion: data.onPromotion ?? false,
      description: data.description,
    } satisfies Product;
  });
}
