import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ScreenLayout } from '@/components/ScreenLayout';
import { SchoolCard } from '@/components/SchoolCard';
import { COLORS } from '@/constants/colors';
import { useCatalog } from '@/context/CatalogContext';
import { openWhatsApp } from '@/utils/whatsapp';

export default function ColegiosScreen() {
  const { schools } = useCatalog();

  return (
    <ScreenLayout>
      <View style={styles.banner}>
        <Text style={styles.eyebrow}>MÁS DE 20 INSTITUCIONES EDUCATIVAS</Text>
        <Text style={styles.bannerTitle}>Uniformes por institución educativa</Text>
        <Text style={styles.bannerSubtitle}>
          Explora las instituciones para las cuales comercializamos uniformes escolares en Cuenca.
        </Text>
      </View>

      <View style={styles.list}>
        {schools.map((school) => (
          <SchoolCard key={school.id} school={school} />
        ))}
      </View>

      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>¿Tu colegio no está en la lista?</Text>
        <Text style={styles.ctaSubtitle}>
          Trabajamos con muchas más instituciones. Escríbenos y confirmamos prendas, tallas y
          disponibilidad para tu colegio.
        </Text>
        <TouchableOpacity
          style={styles.whatsappBtn}
          onPress={() => openWhatsApp('Hola, quiero consultar por el uniforme de mi colegio')}
          activeOpacity={0.85}
        >
          <Ionicons name="logo-whatsapp" size={22} color={COLORS.white} />
          <Text style={styles.whatsappBtnText}>Consultar por WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  eyebrow: {
    color: COLORS.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 10,
  },
  bannerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.white,
    lineHeight: 32,
  },
  bannerSubtitle: {
    marginTop: 12,
    fontSize: 14,
    color: 'rgba(255,255,255,0.82)',
    lineHeight: 22,
  },
  list: { paddingHorizontal: 16, paddingTop: 20 },
  ctaSection: {
    backgroundColor: COLORS.navy,
    padding: 28,
    alignItems: 'center',
    marginTop: 8,
  },
  ctaTitle: { fontSize: 20, fontWeight: '800', color: COLORS.white, textAlign: 'center' },
  ctaSubtitle: {
    marginTop: 12,
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 20,
  },
  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.whatsapp,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
  },
  whatsappBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.white },
});
