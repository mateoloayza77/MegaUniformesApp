import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { getProductById } from '@/data/products';
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
  const [items, setItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<Set<string>>(() => new Set());

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
  }, []);

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
