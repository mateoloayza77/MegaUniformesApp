import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ScreenLayout } from '@/components/ScreenLayout';
import { COLORS } from '@/constants/colors';
import { isFirebaseConfigured } from '@/constants/firebase';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useCatalog } from '@/context/CatalogContext';
import { createOrder } from '@/services/orders';
import type { CartItem } from '@/types';
import { toImageSource } from '@/utils/images';
import { openWhatsApp } from '@/utils/whatsapp';

const COLOR_LABELS: Record<string, string> = {
  white: 'Blanco',
  navy: 'Azul marino',
  red: 'Rojo',
};

export default function CarritoScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { getProductById } = useCatalog();
  const { items, subtotal, updateQuantity, removeFromCart, clearCart } = useCart();

  const buildWhatsAppMessage = () => {
    const lines = items.map((item) => {
      const product = getProductById(item.productId);
      const name = product?.name ?? item.productId;
      const lineTotal = (product?.price ?? 0) * item.quantity;
      return `• ${name} - Talla ${item.size} - Color ${COLOR_LABELS[item.color] ?? item.color} x${item.quantity} = $${lineTotal.toFixed(2)}`;
    });
    return `Hola, quiero realizar este pedido:\n\n${lines.join('\n')}\n\nTotal: $${subtotal.toFixed(2)}`;
  };

  const handleCheckout = () => {
    // Guardamos una copia del pedido en Firestore solo si hay usuario logueado
    // (las reglas de seguridad exigen `uid`). Es best-effort y no bloquea WhatsApp:
    // el pedido anónimo igual se envía por el chat.
    if (isFirebaseConfigured && user) {
      const orderItems = items.map((item) => {
        const product = getProductById(item.productId);
        return {
          productId: item.productId,
          name: product?.name ?? item.productId,
          price: product?.price ?? 0,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
        };
      });
      createOrder({
        uid: user.uid,
        customerName: user.displayName ?? null,
        items: orderItems,
        subtotal,
      }).catch(() => {
        // Silencioso: el pedido igual sale por WhatsApp aunque falle el guardado.
      });
    }
    openWhatsApp(buildWhatsAppMessage());
  };

  const renderItem = ({ item }: { item: CartItem }) => {
    const product = getProductById(item.productId);
    if (!product) return null;

    return (
      <View style={styles.cartItem}>
        <Image source={toImageSource(product.image)} style={styles.thumb} resizeMode="cover" />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.itemMeta}>
            Talla {item.size} · {COLOR_LABELS[item.color] ?? item.color}
          </Text>
          <Text style={styles.itemPrice}>${(product.price * item.quantity).toFixed(2)}</Text>
          <View style={styles.qtyRow}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => updateQuantity(item.productId, item.size, item.color, item.quantity - 1)}
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => updateQuantity(item.productId, item.size, item.color, item.quantity + 1)}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.removeBtn}
              onPress={() => removeFromCart(item.productId, item.size, item.color)}
            >
              <Ionicons name="trash-outline" size={20} color={COLORS.red} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (items.length === 0) {
    return (
      <ScreenLayout noScroll>
        <View style={styles.empty}>
          <Ionicons name="cart-outline" size={64} color={COLORS.muted} />
          <Text style={styles.emptyTitle}>Tu carrito está vacío</Text>
          <Text style={styles.emptySubtitle}>Explora nuestra colección y agrega uniformes</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => router.push('/categorias')}>
            <Text style={styles.shopBtnText}>VER PRODUCTOS</Text>
          </TouchableOpacity>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout noScroll backgroundColor={COLORS.surface}>
      <View style={styles.header}>
        <Text style={styles.title}>Carrito</Text>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Vaciar</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => `${item.productId}-${item.size}-${item.color}`}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        style={styles.listScroll}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Subtotal</Text>
          <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={handleCheckout}
          activeOpacity={0.85}
        >
          <Ionicons name="logo-whatsapp" size={22} color={COLORS.white} />
          <Text style={styles.checkoutText}>PEDIR POR WHATSAPP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.continueBtn} onPress={() => router.push('/categorias')}>
          <Text style={styles.continueText}>Seguir comprando</Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: COLORS.white,
  },
  title: { fontSize: 24, fontWeight: '800', color: COLORS.navy },
  clearText: { fontSize: 14, fontWeight: '600', color: COLORS.red },
  listScroll: { flex: 1 },
  list: { padding: 16, paddingBottom: 8 },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  thumb: { width: 88, height: 88, borderRadius: 8, backgroundColor: COLORS.surface },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '700', color: COLORS.navy },
  itemMeta: { marginTop: 4, fontSize: 12, color: COLORS.muted },
  itemPrice: { marginTop: 6, fontSize: 16, fontWeight: '700', color: COLORS.gold },
  qtyRow: { flexDirection: 'row', alignItems: 'center', marginTop: 10, gap: 8 },
  qtyBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.surface,
  },
  qtyBtnText: { fontSize: 18, fontWeight: '600', color: COLORS.navy },
  qtyValue: { minWidth: 24, textAlign: 'center', fontWeight: '700', color: COLORS.navy },
  removeBtn: { marginLeft: 'auto', padding: 6 },
  footer: {
    backgroundColor: COLORS.white,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  totalLabel: { fontSize: 16, fontWeight: '600', color: COLORS.navy },
  totalValue: { fontSize: 22, fontWeight: '800', color: COLORS.gold },
  checkoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.whatsapp,
    paddingVertical: 16,
    borderRadius: 10,
  },
  checkoutText: { fontSize: 14, fontWeight: '800', color: COLORS.white, letterSpacing: 0.5 },
  continueBtn: { marginTop: 12, alignItems: 'center', paddingVertical: 10 },
  continueText: { fontSize: 14, fontWeight: '600', color: COLORS.gold },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: COLORS.surface,
  },
  emptyTitle: { marginTop: 16, fontSize: 22, fontWeight: '800', color: COLORS.navy },
  emptySubtitle: { marginTop: 8, fontSize: 14, color: COLORS.muted, textAlign: 'center' },
  shopBtn: {
    marginTop: 24,
    backgroundColor: COLORS.gold,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
  },
  shopBtnText: { fontSize: 13, fontWeight: '800', color: COLORS.navy, letterSpacing: 1 },
});
