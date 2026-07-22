import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/constants/colors';
import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';
import { toImageSource } from '@/utils/images';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useCart();
  const favorited = isFavorite(product.id);

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() =>
        router.push({ pathname: '/producto/[id]', params: { id: product.id } })
      }
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, desde $${product.price.toFixed(2)}. Ver detalle`}
    >
      <View style={styles.imageWrap}>
        <Image source={toImageSource(product.image)} style={styles.image} resizeMode="cover" />
        {product.onPromotion && (
          <View style={styles.promoBadge}>
            <Text style={styles.promoText}>OFERTA</Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.favBtn}
          onPress={() => toggleFavorite(product.id)}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel={favorited ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          accessibilityState={{ selected: favorited }}
        >
          <Ionicons
            name={favorited ? 'heart' : 'heart-outline'}
            size={22}
            color={favorited ? COLORS.red : COLORS.navy}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>Desde ${product.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 12,
  },
  imageWrap: { aspectRatio: 1, backgroundColor: COLORS.surface, position: 'relative' },
  image: { width: '100%', height: '100%' },
  promoBadge: {
    position: 'absolute',
    left: 8,
    top: 8,
    backgroundColor: COLORS.red,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  promoText: { fontSize: 10, fontWeight: '800', color: COLORS.white },
  favBtn: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 20,
    padding: 8,
  },
  info: { padding: 12 },
  name: { fontSize: 13, fontWeight: '700', color: COLORS.navy, letterSpacing: 0.3 },
  price: { marginTop: 4, fontSize: 14, fontWeight: '600', color: COLORS.gold },
});
