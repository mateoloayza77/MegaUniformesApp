import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { isFirebaseConfigured } from '@/constants/firebase';
import { products as staticProducts, schools as staticSchools } from '@/data/products';
import { fetchCatalog } from '@/services/catalog';
import type { Product, School } from '@/types';

interface CatalogContextValue {
  products: Product[];
  promotionProducts: Product[];
  /** Instituciones destacadas (config estática con fotos reales). */
  schools: School[];
  /** `true` mientras se lee el catálogo remoto (falso si Firebase no está configurado). */
  loading: boolean;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: Product['category']) => Product[];
  getProductsBySchool: (school: string) => Product[];
  getSchoolById: (id: string) => School | undefined;
}

const CatalogContext = createContext<CatalogContextValue | null>(null);

export function CatalogProvider({ children }: { children: ReactNode }) {
  // Arranca con el catálogo estático (fallback inmediato: la app abre al instante e
  // incluso funciona offline). Si Firestore tiene productos, los reemplazamos.
  const [products, setProducts] = useState<Product[]>(staticProducts);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!isFirebaseConfigured) return;
    let cancelled = false;
    (async () => {
      try {
        const remote = await fetchCatalog();
        if (!cancelled && remote.length > 0) setProducts(remote);
      } catch {
        // Si falla la lectura, conservamos el catálogo estático como fallback.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<CatalogContextValue>(() => {
    const byId = new Map(products.map((p) => [p.id, p]));
    const schoolById = new Map(staticSchools.map((s) => [s.id, s]));
    return {
      products,
      promotionProducts: products.filter((p) => p.onPromotion).slice(0, 6),
      schools: staticSchools,
      loading,
      getProductById: (id) => byId.get(id),
      getProductsByCategory: (category) => products.filter((p) => p.category === category),
      getProductsBySchool: (school) => products.filter((p) => p.school === school),
      getSchoolById: (id) => schoolById.get(id),
    };
  }, [products, loading]);

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

/** Hook para consumir el catálogo. Lanza si se usa fuera de `CatalogProvider`. */
export function useCatalog(): CatalogContextValue {
  const ctx = useContext(CatalogContext);
  if (!ctx) throw new Error('useCatalog debe usarse dentro de un CatalogProvider');
  return ctx;
}
