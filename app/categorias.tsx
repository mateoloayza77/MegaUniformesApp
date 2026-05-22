import { Image, StyleSheet, Text, View } from 'react-native';

import { ProductCard } from '@/components/ProductCard';
import { ScreenLayout } from '@/components/ScreenLayout';
import { COLORS } from '@/constants/colors';
import { categories, getProductsByCategory } from '@/data/products';
import { toImageSource } from '@/utils/images';

export default function CategoriasScreen() {
  return (
    <ScreenLayout>
      <View style={styles.hero}>
        <Text style={styles.heroTitle}>Todas las Categorías</Text>
        <Text style={styles.heroSubtitle}>
          Explora nuestra colección completa de uniformes escolares
        </Text>
      </View>

      {categories.map((category) => {
        const categoryProducts = getProductsByCategory(category.id);
        return (
          <View key={category.id} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Image source={toImageSource(category.image)} style={styles.categoryIcon} />
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
            <View style={styles.productGrid}>
              {categoryProducts.map((product) => (
                <View key={product.id} style={styles.productCol}>
                  <ProductCard product={product} />
                </View>
              ))}
            </View>
          </View>
        );
      })}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 16,
    paddingVertical: 28,
    marginBottom: 8,
  },
  heroTitle: { fontSize: 28, fontWeight: '800', color: COLORS.navy },
  heroSubtitle: { marginTop: 8, fontSize: 15, color: COLORS.muted, lineHeight: 22 },
  categorySection: { paddingHorizontal: 16, paddingVertical: 20 },
  categoryHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
  categoryIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: 'rgba(200, 169, 106, 0.35)',
  },
  categoryName: { fontSize: 20, fontWeight: '800', color: COLORS.navy },
  productGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  productCol: { width: '50%', paddingHorizontal: 6 },
});
