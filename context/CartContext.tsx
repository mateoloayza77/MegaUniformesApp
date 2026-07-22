import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { useAuth } from '@/context/AuthContext';
import { useCatalog } from '@/context/CatalogContext';
import { loadUserData, saveUserData } from '@/services/userData';
import type { CartItem } from '@/types';

interface CartContextValue {
  items: CartItem[];
  cartCount: number;
  subtotal: number;
  favorites: Set<string>;
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  updateQuantity: (productId: string, size: string, color: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  clearCart: () => void;
  getLineTotal: (item: CartItem) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

function itemKey(productId: string, size: string, color: string) {
  return `${productId}-${size}-${color}`;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const { getProductById } = useCatalog();
  const [items, setItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());

  // Guarda el uid para el que ya hidratamos el estado desde Firestore. Evita que
  // el efecto de guardado escriba con el estado en memoria antes de haber leído lo
  // remoto (lo que borraría el carrito guardado del usuario).
  const hydratedUid = useRef<string | null>(null);

  // Al iniciar sesión: cargar carrito + favoritos desde Firestore. Si el doc no
  // existe, conservamos lo que haya en memoria (el efecto de guardado lo subirá).
  useEffect(() => {
    const uid = user?.uid ?? null;
    if (!uid) {
      hydratedUid.current = null;
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const data = await loadUserData(uid);
        if (cancelled) return;
        if (data) {
          setItems(data.cart);
          setFavorites(new Set(data.favorites));
        }
        hydratedUid.current = uid;
      } catch {
        // Si falla la lectura, seguimos con el estado en memoria (modo offline).
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.uid]);

  // Persistir cambios en Firestore (con un pequeño debounce). Solo tras haber
  // hidratado para el usuario actual, para no pisar lo remoto con estado vacío.
  useEffect(() => {
    const uid = user?.uid ?? null;
    if (!uid || hydratedUid.current !== uid) return;
    const timeout = setTimeout(() => {
      saveUserData(uid, {
        cart: items,
        favorites: Array.from(favorites),
      }).catch(() => {
        // Guardado best-effort; los cambios siguen en memoria.
      });
    }, 400);
    return () => clearTimeout(timeout);
  }, [items, favorites, user?.uid]);

  const toggleFavorite = useCallback((productId: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) next.delete(productId);
      else next.add(productId);
      return next;
    });
  }, []);

  const isFavorite = useCallback(
    (productId: string) => favorites.has(productId),
    [favorites],
  );

  const addToCart = useCallback(
    (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
      const quantity = item.quantity ?? 1;
      setItems((prev) => {
        const key = itemKey(item.productId, item.size, item.color);
        const existing = prev.find(
          (i) => itemKey(i.productId, i.size, i.color) === key,
        );
        if (existing) {
          return prev.map((i) =>
            itemKey(i.productId, i.size, i.color) === key
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          );
        }
        return [...prev, { ...item, quantity }];
      });
    },
    [],
  );

  const updateQuantity = useCallback(
    (productId: string, size: string, color: string, quantity: number) => {
      if (quantity < 1) {
        setItems((prev) =>
          prev.filter(
            (i) => itemKey(i.productId, i.size, i.color) !== itemKey(productId, size, color),
          ),
        );
        return;
      }
      setItems((prev) =>
        prev.map((i) =>
          itemKey(i.productId, i.size, i.color) === itemKey(productId, size, color)
            ? { ...i, quantity }
            : i,
        ),
      );
    },
    [],
  );

  const removeFromCart = useCallback((productId: string, size: string, color: string) => {
    setItems((prev) =>
      prev.filter(
        (i) => itemKey(i.productId, i.size, i.color) !== itemKey(productId, size, color),
      ),
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const getLineTotal = useCallback((item: CartItem) => {
    const product = getProductById(item.productId);
    return (product?.price ?? 0) * item.quantity;
  }, [getProductById]);

  const cartCount = useMemo(
    () => items.reduce((sum, i) => sum + i.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + getLineTotal(i), 0),
    [items, getLineTotal],
  );

  const value = useMemo(
    () => ({
      items,
      cartCount,
      subtotal,
      favorites,
      toggleFavorite,
      isFavorite,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getLineTotal,
    }),
    [
      items,
      cartCount,
      subtotal,
      favorites,
      toggleFavorite,
      isFavorite,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      getLineTotal,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
