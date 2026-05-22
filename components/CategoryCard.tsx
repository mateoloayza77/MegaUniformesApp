import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/constants/colors';
import type { CategoryInfo } from '@/types';
import { toImageSource } from '@/utils/images';

interface CategoryCardProps {
  category: CategoryInfo;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push('/categorias')}
    >
      <Image source={toImageSource(category.image)} style={styles.image} resizeMode="cover" />
      <View style={styles.labelWrap}>
        <Text style={styles.label}>{category.name}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  image: { width: '100%', aspectRatio: 1 },
  labelWrap: {
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
  label: { fontSize: 12, fontWeight: '700', color: COLORS.navy, textAlign: 'center' },
});
