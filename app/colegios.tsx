import { Ionicons } from '@expo/vector-icons';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ScreenLayout } from '@/components/ScreenLayout';
import { COLORS } from '@/constants/colors';
import { CONTACT } from '@/constants/links';
import { schools } from '@/data/products';
import { openWhatsApp } from '@/utils/whatsapp';

const benefits = [
  {
    icon: 'book-outline' as const,
    title: 'Uniformes con identidad',
    description:
      'Diseñamos uniformes que reflejan la esencia, valores y prestigio de tu institución.',
  },
  {
    icon: 'people-outline' as const,
    title: 'Precios institucionales',
    description:
      'Planes especiales para compras al por mayor, optimizando costos sin sacrificar calidad.',
  },
  {
    icon: 'checkmark-circle-outline' as const,
    title: 'Calidad que perdura',
    description:
      'Materiales premium y confección resistente para el uso diario durante todo el año escolar.',
  },
];

const services = [
  {
    title: 'Diseño personalizado',
    description: 'Creamos diseños exclusivos con colores, escudo y logo de tu institución.',
  },
  {
    title: 'Entregas programadas',
    description: 'Planificamos entregas según el calendario escolar de cada colegio.',
  },
  {
    title: 'Control de inventario',
    description: 'Sistema de pedidos recurrentes para mantener stock disponible.',
  },
  {
    title: 'Facilidades de pago',
    description:
      'Paga de forma fácil y segura con tarjeta de crédito, débito o transferencia bancaria.',
  },
];

export default function ColegiosScreen() {
  return (
    <ScreenLayout>
      <View style={styles.banner}>
        <Text style={styles.bannerTitle}>Encuentra uniformes escolares en Cuenca</Text>
        <Text style={styles.bannerSubtitle}>
          Filtra por institución, nivel y tipo y compra en pocos pasos.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Instituciones que confían en nosotros</Text>
        <Text style={styles.sectionSubtitle}>
          Colegios reconocidos de Cuenca que visten con MEGA UNIFORMES
        </Text>
        <View style={styles.schoolsGrid}>
          {schools.map((school) => (
            <View key={school.id} style={styles.schoolItem}>
              <View style={styles.schoolBadge}>
                <Text style={styles.schoolInitials}>{school.initials}</Text>
              </View>
              <Text style={styles.schoolName}>{school.name}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.benefitsSection}>
        {benefits.map((item) => (
          <View key={item.title} style={styles.benefitCard}>
            <Ionicons name={item.icon} size={36} color={COLORS.gold} />
            <Text style={styles.benefitTitle}>{item.title}</Text>
            <Text style={styles.benefitDesc}>{item.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, styles.centered]}>Nuestros Servicios</Text>
        {services.map((service) => (
          <View key={service.title} style={styles.serviceCard}>
            <Text style={styles.serviceTitle}>{service.title}</Text>
            <Text style={styles.serviceDesc}>{service.description}</Text>
          </View>
        ))}
      </View>

      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>¿Listo para equipar tu institución?</Text>
        <Text style={styles.ctaSubtitle}>
          Solicita una cotización personalizada y descubre cómo podemos vestir a tu colegio.
        </Text>
        <TouchableOpacity
          style={styles.whatsappBtn}
          onPress={() => openWhatsApp('Hola, quiero una cotización institucional')}
        >
          <Ionicons name="logo-whatsapp" size={22} color={COLORS.white} />
          <Text style={styles.whatsappBtnText}>WhatsApp</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => Linking.openURL(`mailto:${CONTACT.email}`)}
        >
          <Ionicons name="mail-outline" size={20} color={COLORS.white} />
          <Text style={styles.secondaryBtnText}>Email</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => Linking.openURL(`tel:${CONTACT.phone.replace(/\D/g, '')}`)}
        >
          <Ionicons name="call-outline" size={20} color={COLORS.white} />
          <Text style={styles.secondaryBtnText}>Llamar</Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  banner: {
    backgroundColor: COLORS.navy,
    paddingHorizontal: 20,
    paddingVertical: 36,
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 32,
  },
  bannerSubtitle: {
    marginTop: 12,
    fontSize: 15,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 22,
  },
  section: { padding: 20, backgroundColor: COLORS.white },
  sectionTitle: { fontSize: 22, fontWeight: '800', color: COLORS.navy, textAlign: 'center' },
  sectionSubtitle: { marginTop: 8, fontSize: 14, color: COLORS.muted, textAlign: 'center' },
  centered: { marginBottom: 16 },
  schoolsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
    gap: 16,
  },
  schoolItem: { width: '42%', alignItems: 'center', marginBottom: 8 },
  schoolBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.navy,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  schoolInitials: { fontSize: 20, fontWeight: '800', color: COLORS.gold },
  schoolName: { marginTop: 8, fontSize: 12, fontWeight: '600', color: COLORS.navy, textAlign: 'center' },
  benefitsSection: { padding: 16, backgroundColor: COLORS.surface, gap: 12 },
  benefitCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  benefitTitle: { marginTop: 12, fontSize: 17, fontWeight: '800', color: COLORS.navy },
  benefitDesc: { marginTop: 8, fontSize: 13, color: COLORS.muted, textAlign: 'center', lineHeight: 20 },
  serviceCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  serviceTitle: { fontSize: 16, fontWeight: '800', color: COLORS.navy },
  serviceDesc: { marginTop: 6, fontSize: 13, color: COLORS.muted, lineHeight: 20 },
  ctaSection: {
    backgroundColor: COLORS.navy,
    padding: 28,
    alignItems: 'center',
    marginBottom: 8,
  },
  ctaTitle: { fontSize: 22, fontWeight: '800', color: COLORS.white, textAlign: 'center' },
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
    borderRadius: 10,
    marginTop: 20,
    width: '100%',
    justifyContent: 'center',
  },
  whatsappBtnText: { fontSize: 16, fontWeight: '700', color: COLORS.white },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
    width: '100%',
    justifyContent: 'center',
  },
  secondaryBtnText: { fontSize: 15, fontWeight: '600', color: COLORS.white },
});
