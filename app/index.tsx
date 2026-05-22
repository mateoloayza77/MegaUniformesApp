import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { CategoryCard } from '@/components/CategoryCard';
import { HeroCarousel } from '@/components/HeroCarousel';
import { ProductCard } from '@/components/ProductCard';
import { ScreenLayout } from '@/components/ScreenLayout';
import { COLORS } from '@/constants/colors';
import { categories, promotionProducts } from '@/data/products';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScreenLayout backgroundColor={COLORS.white}>
      <HeroCarousel />

      <View style={styles.sectionSurface}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>CATEGORÍAS</Text>
          <TouchableOpacity onPress={() => router.push('/categorias')}>
            <Text style={styles.link}>VER TODO</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.categoryGrid}>
          {categories.map((cat) => (
            <View key={cat.id} style={styles.categoryCol}>
              <CategoryCard category={cat} />
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PRODUCTOS EN PROMOCIÓN</Text>
        <FlatList
          data={promotionProducts}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.productRow}
          renderItem={({ item }) => (
            <View style={styles.productCol}>
              <ProductCard product={item} />
            </View>
          )}
        />
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  sectionSurface: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  section: { paddingHorizontal: 16, paddingVertical: 24, backgroundColor: COLORS.white },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: COLORS.navy, letterSpacing: 0.5 },
  link: { fontSize: 13, fontWeight: '700', color: COLORS.gold },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6 },
  categoryCol: { width: '50%', paddingHorizontal: 6 },
  productRow: { gap: 12 },
  productCol: { flex: 1, maxWidth: '50%' },
});
