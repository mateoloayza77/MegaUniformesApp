import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/constants/colors';
import type { School } from '@/types';
import { toHeroImageSource } from '@/utils/images';

interface SchoolCardProps {
  school: School;
}

export function SchoolCard({ school }: SchoolCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.9}
      onPress={() => router.push({ pathname: '/colegio/[id]', params: { id: school.id } })}
    >
      <View style={styles.imageWrap}>
        <Image source={toHeroImageSource(school.image)} style={styles.image} resizeMode="cover" />
        <View style={styles.label}>
          <Text style={styles.labelText}>Disponible</Text>
        </View>
      </View>

      <View style={styles.body}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{school.name}</Text>
        </View>
        <Text style={styles.title}>Uniforme {school.name}</Text>
        <Text style={styles.desc} numberOfLines={2}>
          {school.description}
        </Text>

        <View style={styles.features}>
          {school.features.map((f) => (
            <View key={f} style={styles.featureRow}>
              <Ionicons name="checkmark" size={14} color={COLORS.gold} />
              <Text style={styles.featureText}>{f}</Text>
            </View>
          ))}
        </View>

        <View style={styles.cta}>
          <Text style={styles.ctaText}>Ver uniformes</Text>
          <Ionicons name="arrow-forward" size={16} color={COLORS.navy} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  imageWrap: { height: 200, backgroundColor: COLORS.surface, position: 'relative' },
  image: { width: '100%', height: '100%' },
  label: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: COLORS.gold,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  labelText: { fontSize: 11, fontWeight: '800', color: COLORS.navy },
  body: { padding: 18 },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(200, 169, 106, 0.16)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  badgeText: { fontSize: 11, fontWeight: '800', color: '#96763B' },
  title: { marginTop: 12, fontSize: 19, fontWeight: '800', color: COLORS.navy },
  desc: { marginTop: 8, fontSize: 13, color: COLORS.muted, lineHeight: 20 },
  features: { marginTop: 14, gap: 8 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featureText: { fontSize: 12, color: COLORS.text },
  cta: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: 12,
  },
  ctaText: { fontSize: 14, fontWeight: '800', color: COLORS.navy },
});
