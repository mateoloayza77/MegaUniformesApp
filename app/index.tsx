import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { HeroCarousel } from '@/components/HeroCarousel';
import { ProductCard } from '@/components/ProductCard';
import { ScreenLayout } from '@/components/ScreenLayout';
import { COLORS } from '@/constants/colors';
import { useCatalog } from '@/context/CatalogContext';
import { toHeroImageSource } from '@/utils/images';

const aboutImage = require('@/assets/brand/local/fachada.jpg');

export default function HomeScreen() {
  const router = useRouter();
  const { promotionProducts, schools } = useCatalog();

  return (
    <ScreenLayout backgroundColor={COLORS.white}>
      <HeroCarousel />

      {/* BOTONES DE ACCIÓN */}
      <View style={styles.servicesContainer}>
        <TouchableOpacity
          style={styles.assistantButton}
          onPress={() => router.push('/asistente')}
          activeOpacity={0.85}
        >
          <Ionicons name="chatbubbles-outline" size={20} color={COLORS.navy} />
          <Text style={styles.assistantButtonText}>Consultar con el asistente IA</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.servicesButton}
          onPress={() => router.push('/servicios')}
        >
          <Text style={styles.servicesButtonText}>
            🛠 Servicios Gratuitos
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionSurface}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>NUESTRAS INSTITUCIONES</Text>
          <TouchableOpacity onPress={() => router.push('/colegios')}>
            <Text style={styles.link}>VER TODO</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.schoolGrid}>
          {schools.map((school) => (
            <TouchableOpacity
              key={school.id}
              style={styles.schoolCol}
              activeOpacity={0.85}
              onPress={() => router.push({ pathname: '/colegio/[id]', params: { id: school.id } })}
            >
              <View style={styles.schoolTile}>
                <Image
                  source={toHeroImageSource(school.image)}
                  style={styles.schoolImage}
                  resizeMode="cover"
                />
                <View style={styles.schoolLabelWrap}>
                  <Text style={styles.schoolLabel} numberOfLines={1}>
                    {school.name}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.about}>
        <Image source={aboutImage} style={styles.aboutImage} resizeMode="cover" />
        <View style={styles.aboutBody}>
          <Text style={styles.aboutEyebrow}>¿QUIÉNES SOMOS?</Text>
          <Text style={styles.aboutTitle}>Uniformes con estilo y calidad</Text>
          <Text style={styles.aboutText}>
            En MEGA UNIFORMES trabajamos cada temporada para ofrecer uniformes escolares de excelente
            calidad para las principales instituciones educativas de Cuenca. Atención personalizada,
            amplio stock y consulta inmediata por WhatsApp.
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>PRENDAS DESTACADAS</Text>

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
  servicesContainer: {
    paddingHorizontal: 16,
    marginTop: 15,
    marginBottom: 10,
    gap: 10,
  },

  assistantButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.gold,
    paddingVertical: 15,
    borderRadius: 12,
  },

  assistantButtonText: {
    color: COLORS.navy,
    fontWeight: '800',
    fontSize: 16,
  },

  servicesButton: {
    backgroundColor: COLORS.navy,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },

  servicesButtonText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 17,
  },

  sectionSurface: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    paddingVertical: 24,
  },

  section: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: COLORS.white,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: COLORS.navy,
    letterSpacing: 0.5,
  },

  link: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.gold,
  },

  schoolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -6,
  },

  schoolCol: {
    width: '50%',
    paddingHorizontal: 6,
    marginBottom: 12,
  },

  schoolTile: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  schoolImage: { width: '100%', height: 110 },

  schoolLabelWrap: { paddingVertical: 10, paddingHorizontal: 8, alignItems: 'center' },

  schoolLabel: { fontSize: 12, fontWeight: '800', color: COLORS.navy, textAlign: 'center' },

  about: { backgroundColor: COLORS.white },
  aboutImage: { width: '100%', height: 200 },
  aboutBody: { padding: 20 },
  aboutEyebrow: { color: COLORS.gold, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 },
  aboutTitle: { marginTop: 8, fontSize: 22, fontWeight: '800', color: COLORS.navy },
  aboutText: { marginTop: 12, fontSize: 14, color: COLORS.muted, lineHeight: 22 },

  productRow: {
    gap: 12,
  },

  productCol: {
    flex: 1,
    maxWidth: '50%',
  },
});