import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/components/Header';
import { COLORS } from '@/constants/colors';
import { useCart } from '@/context/CartContext';
import { useCatalog } from '@/context/CatalogContext';
import { toImageSource } from '@/utils/images';
import { openWhatsApp } from '@/utils/whatsapp';

const SIZES = ['6', '8', '10', '12', '14', '16'] as const;

const COLORS_OPTIONS = [
  { id: 'white', label: 'Blanco', swatch: COLORS.white, border: true },
  { id: 'navy', label: 'Azul marino', swatch: COLORS.navy, border: false },
  { id: 'red', label: 'Rojo', swatch: COLORS.red, border: false },
] as const;

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getProductById } = useCatalog();
  const product = id ? getProductById(id) : undefined;
  const { isFavorite, toggleFavorite, addToCart } = useCart();
  const [selectedColor, setSelectedColor] = useState<(typeof COLORS_OPTIONS)[number]['id']>('white');
  const [selectedSize, setSelectedSize] = useState<string>('10');
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <View style={[styles.root, { paddingTop: insets.top }]}>
        <Header />
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>Producto no encontrado</Text>
          <TouchableOpacity onPress={() => router.push('/categorias')}>
            <Text style={styles.notFoundLink}>Ver categorías</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const favorited = isFavorite(product.id);

  const handleAddToCart = () => {
    addToCart({
      productId: product.id,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    Alert.alert('Agregado', `${product.name} se agregó al carrito`, [
      { text: 'Seguir comprando', style: 'cancel' },
      { text: 'Ver carrito', onPress: () => router.push('/carrito') },
    ]);
  };

  const handleWhatsApp = () => {
    openWhatsApp(
      `Hola, me interesa el ${product.name} - Talla ${selectedSize} - Color ${COLORS_OPTIONS.find((c) => c.id === selectedColor)?.label ?? selectedColor} - Cantidad ${quantity}`,
    );
  };

  return (
    <View style={styles.root}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <View style={styles.breadcrumb}>
          <TouchableOpacity onPress={() => router.push('/')}>
            <Text style={styles.crumbLink}>Inicio</Text>
          </TouchableOpacity>
          <Text style={styles.crumbSep}> / </Text>
          <TouchableOpacity onPress={() => router.push('/categorias')}>
            <Text style={styles.crumbLink}>Categorías</Text>
          </TouchableOpacity>
          <Text style={styles.crumbSep}> / </Text>
          <Text style={styles.crumbCurrent} numberOfLines={1}>
            {product.name}
          </Text>
        </View>

        <View style={styles.imageCard}>
          <Image source={toImageSource(product.image)} style={styles.productImage} resizeMode="cover" />
          {product.onPromotion && (
            <View style={styles.promoBadge}>
              <Text style={styles.promoText}>PROMOCIÓN</Text>
            </View>
          )}
          <TouchableOpacity style={styles.favBtn} onPress={() => toggleFavorite(product.id)}>
            <Ionicons
              name={favorited ? 'heart' : 'heart-outline'}
              size={26}
              color={favorited ? COLORS.red : COLORS.navy}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.details}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={styles.category}>{product.categoryLabel}</Text>
          <Text style={styles.description}>
            {product.description ??
              'Uniforme escolar de alta calidad para el uso diario en instituciones de Cuenca.'}
          </Text>

          <Text style={styles.optionLabel}>Color</Text>
          <View style={styles.colorRow}>
            {COLORS_OPTIONS.map((color) => (
              <TouchableOpacity
                key={color.id}
                onPress={() => setSelectedColor(color.id)}
                style={[
                  styles.colorSwatch,
                  {
                    backgroundColor: color.swatch,
                    borderWidth: color.border ? 2 : 0,
                    borderColor: '#D1D5DB',
                  },
                  selectedColor === color.id && styles.colorSelected,
                ]}
              />
            ))}
          </View>

          <View style={styles.sizeHeader}>
            <Text style={styles.optionLabel}>Talla</Text>
            <Text style={styles.sizeGuide}>Guía de tallas</Text>
          </View>
          <View style={styles.sizeRow}>
            {SIZES.map((size) => (
              <TouchableOpacity
                key={size}
                style={[styles.sizeBtn, selectedSize === size && styles.sizeBtnActive]}
                onPress={() => setSelectedSize(size)}
              >
                <Text style={[styles.sizeText, selectedSize === size && styles.sizeTextActive]}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.optionLabel}>Cantidad</Text>
          <View style={styles.qtyBox}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              <Text style={styles.qtyBtnText}>−</Text>
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQuantity((q) => q + 1)}>
              <Text style={styles.qtyBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.addBtn} onPress={handleAddToCart} activeOpacity={0.85}>
            <Text style={styles.addBtnText}>AGREGAR AL CARRITO</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.waBtn} onPress={handleWhatsApp} activeOpacity={0.85}>
            <Ionicons name="logo-whatsapp" size={22} color={COLORS.white} />
            <Text style={styles.waBtnText}>COMPRAR POR WHATSAPP</Text>
          </TouchableOpacity>

          <View style={styles.trustRow}>
            <View style={styles.trustItem}>
              <Ionicons name="car-outline" size={20} color={COLORS.gold} />
              <Text style={styles.trustText}>
                <Text style={styles.trustBold}>Envío rápido:</Text> 2-3 días hábiles
              </Text>
            </View>
            <View style={styles.trustItem}>
              <Ionicons name="shield-checkmark-outline" size={20} color={COLORS.gold} />
              <Text style={styles.trustText}>
                <Text style={styles.trustBold}>Pago seguro:</Text> 100% protegido
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.surface },
  notFound: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  notFoundTitle: { fontSize: 22, fontWeight: '800', color: COLORS.navy },
  notFoundLink: { marginTop: 12, fontSize: 16, fontWeight: '600', color: COLORS.gold },
  breadcrumb: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  crumbLink: { fontSize: 13, color: COLORS.muted },
  crumbSep: { fontSize: 13, color: COLORS.muted },
  crumbCurrent: { fontSize: 13, color: COLORS.navy, fontWeight: '600', flex: 1 },
  imageCard: {
    marginHorizontal: 16,
    aspectRatio: 1,
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    position: 'relative',
  },
  productImage: { width: '100%', height: '100%' },
  promoBadge: {
    position: 'absolute',
    left: 12,
    top: 12,
    backgroundColor: COLORS.red,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  promoText: { fontSize: 11, fontWeight: '800', color: COLORS.white },
  favBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 24,
    padding: 10,
  },
  details: { padding: 16 },
  name: { fontSize: 26, fontWeight: '800', color: COLORS.navy },
  price: { marginTop: 8, fontSize: 32, fontWeight: '800', color: COLORS.gold },
  category: { marginTop: 4, fontSize: 13, color: COLORS.muted, fontWeight: '600' },
  description: { marginTop: 16, fontSize: 15, color: COLORS.muted, lineHeight: 24 },
  optionLabel: { marginTop: 20, marginBottom: 10, fontSize: 14, fontWeight: '700', color: COLORS.navy },
  colorRow: { flexDirection: 'row', gap: 12 },
  colorSwatch: { width: 40, height: 40, borderRadius: 20 },
  colorSelected: { borderWidth: 3, borderColor: COLORS.gold },
  sizeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sizeGuide: { fontSize: 13, fontWeight: '600', color: COLORS.gold },
  sizeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sizeBtn: {
    minWidth: 48,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: COLORS.white,
  },
  sizeBtnActive: { borderColor: COLORS.gold, backgroundColor: COLORS.gold },
  sizeText: { fontSize: 14, fontWeight: '600', color: COLORS.navy, textAlign: 'center' },
  sizeTextActive: { color: COLORS.navy },
  qtyBox: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
  },
  qtyBtn: { paddingHorizontal: 16, paddingVertical: 12 },
  qtyBtnText: { fontSize: 20, fontWeight: '600', color: COLORS.navy },
  qtyValue: { minWidth: 40, textAlign: 'center', fontSize: 16, fontWeight: '700', color: COLORS.navy },
  addBtn: {
    marginTop: 24,
    backgroundColor: COLORS.gold,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  addBtnText: { fontSize: 13, fontWeight: '800', color: COLORS.navy, letterSpacing: 1 },
  waBtn: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.whatsapp,
    paddingVertical: 16,
    borderRadius: 10,
  },
  waBtnText: { fontSize: 13, fontWeight: '800', color: COLORS.white, letterSpacing: 0.5 },
  trustRow: {
    marginTop: 20,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  trustItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  trustText: { flex: 1, fontSize: 13, color: COLORS.muted, lineHeight: 18 },
  trustBold: { fontWeight: '700', color: COLORS.navy },
});
