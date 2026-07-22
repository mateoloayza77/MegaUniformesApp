import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/components/Header';
import { ProductCard } from '@/components/ProductCard';
import { COLORS } from '@/constants/colors';
import { useCatalog } from '@/context/CatalogContext';
import { toHeroImageSource } from '@/utils/images';
import { openWhatsApp } from '@/utils/whatsapp';

export default function ColegioDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { getSchoolById, getProductsBySchool } = useCatalog();
  const school = id ? getSchoolById(id) : undefined;

  if (!school) {
    return (
      <View style={styles.root}>
        <Header />
        <View style={styles.notFound}>
          <Text style={styles.notFoundTitle}>Institución no encontrada</Text>
          <TouchableOpacity onPress={() => router.push('/colegios')}>
            <Text style={styles.notFoundLink}>Ver colegios</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const schoolProducts = getProductsBySchool(school.id);

  return (
    <View style={styles.root}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
      >
        <View style={styles.heroWrap}>
          <Image source={toHeroImageSource(school.image)} style={styles.heroImage} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          <View style={styles.heroContent}>
            <Text style={styles.heroBadge}>INSTITUCIÓN EDUCATIVA</Text>
            <Text style={styles.heroTitle}>Uniforme {school.name}</Text>
          </View>
        </View>

        <View style={styles.intro}>
          <Text style={styles.introText}>{school.description}</Text>
          <View style={styles.features}>
            {school.features.map((f) => (
              <View key={f} style={styles.featureChip}>
                <Ionicons name="checkmark-circle" size={16} color={COLORS.gold} />
                <Text style={styles.featureText}>{f}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prendas disponibles</Text>
          <Text style={styles.sectionSubtitle}>
            Precios referenciales. Confirma tallas, colores y disponibilidad por WhatsApp.
          </Text>
          <View style={styles.grid}>
            {schoolProducts.map((product) => (
              <View key={product.id} style={styles.col}>
                <ProductCard product={product} />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.ctaSection}>
          <TouchableOpacity
            style={styles.whatsappBtn}
            onPress={() =>
              openWhatsApp(`Hola, quiero consultar por el uniforme de ${school.name}`)
            }
            activeOpacity={0.85}
          >
            <Ionicons name="logo-whatsapp" size={22} color={COLORS.white} />
            <Text style={styles.whatsappBtnText}>Consultar uniforme completo</Text>
          </TouchableOpacity>
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
  heroWrap: { height: 240, position: 'relative', backgroundColor: COLORS.navy },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(11, 31, 58, 0.45)' },
  heroContent: { position: 'absolute', left: 20, right: 20, bottom: 20 },
  heroBadge: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  heroTitle: { color: COLORS.white, fontSize: 28, fontWeight: '800' },
  intro: { padding: 20, backgroundColor: COLORS.white },
  introText: { fontSize: 15, color: COLORS.muted, lineHeight: 24 },
  features: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 16 },
  featureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  featureText: { fontSize: 12, fontWeight: '600', color: COLORS.navy },
  section: { paddingHorizontal: 16, paddingVertical: 20 },
  sectionTitle: { fontSize: 20, fontWeight: '800', color: COLORS.navy },
  sectionSubtitle: { marginTop: 6, fontSize: 13, color: COLORS.muted, lineHeight: 20 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: -6, marginTop: 16 },
  col: { width: '50%', paddingHorizontal: 6 },
  ctaSection: { paddingHorizontal: 16, paddingBottom: 8 },
  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.whatsapp,
    paddingVertical: 16,
    borderRadius: 12,
  },
  whatsappBtnText: { fontSize: 15, fontWeight: '800', color: COLORS.white },
});
