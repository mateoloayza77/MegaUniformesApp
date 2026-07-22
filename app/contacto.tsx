import { Ionicons } from '@expo/vector-icons';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { ScreenLayout } from '@/components/ScreenLayout';
import { COLORS } from '@/constants/colors';
import { CONTACT, WHATSAPP_CONTACT } from '@/constants/links';

const contactBlocks = [
  {
    icon: 'call-outline' as const,
    label: 'Teléfono / WhatsApp',
    value: CONTACT.phone,
    href: `tel:${CONTACT.phone.replace(/\D/g, '')}`,
  },
  { icon: 'location-outline' as const, label: 'Ubicación', value: CONTACT.address, href: undefined },
  { icon: 'storefront-outline' as const, label: 'Atención', value: CONTACT.detail, href: undefined },
];

export default function ContactoScreen() {
  return (
    <ScreenLayout>
      <View style={styles.hero}>
        <Text style={styles.title}>CONTACTO</Text>
        <Text style={styles.subtitle}>
          ¿Tienes alguna duda? Contáctanos por WhatsApp y te responderemos de inmediato.
        </Text>
        <TouchableOpacity
          style={styles.whatsappBtn}
          onPress={() => Linking.openURL(WHATSAPP_CONTACT)}
          activeOpacity={0.85}
        >
          <Ionicons name="logo-whatsapp" size={26} color={COLORS.white} />
          <Text style={styles.whatsappText}>ESCRIBIR POR WHATSAPP</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>También puedes contactarnos por:</Text>
        {contactBlocks.map((block) => (
          <View key={block.label} style={styles.block}>
            <View style={styles.iconWrap}>
              <Ionicons name={block.icon} size={22} color={COLORS.gold} />
            </View>
            <View style={styles.blockContent}>
              <Text style={styles.blockLabel}>{block.label}</Text>
              {block.href ? (
                <TouchableOpacity onPress={() => Linking.openURL(block.href!)}>
                  <Text style={styles.blockLink}>{block.value}</Text>
                </TouchableOpacity>
              ) : (
                <Text style={styles.blockValue}>{block.value}</Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  hero: { padding: 24, alignItems: 'center', backgroundColor: COLORS.surface },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.navy, letterSpacing: 1 },
  subtitle: {
    marginTop: 12,
    fontSize: 15,
    color: COLORS.muted,
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 320,
  },
  whatsappBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: COLORS.whatsapp,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 14,
    marginTop: 24,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  whatsappText: { fontSize: 16, fontWeight: '800', color: COLORS.white },
  card: {
    margin: 16,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: { fontSize: 17, fontWeight: '800', color: COLORS.navy, marginBottom: 16 },
  block: { flexDirection: 'row', alignItems: 'flex-start', gap: 14, marginBottom: 18 },
  iconWrap: { backgroundColor: COLORS.surface, padding: 12, borderRadius: 10 },
  blockContent: { flex: 1 },
  blockLabel: { fontSize: 13, fontWeight: '700', color: COLORS.navy },
  blockValue: { marginTop: 4, fontSize: 14, color: COLORS.muted, lineHeight: 20 },
  blockLink: { marginTop: 4, fontSize: 14, color: COLORS.muted, lineHeight: 20 },
});
