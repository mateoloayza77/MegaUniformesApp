import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { COLORS } from '@/constants/colors';
import { useCart } from '@/context/CartContext';
import { navCategoryLinks } from '@/data/products';

const logoImage = require('@/assets/imports/WhatsApp_Image_2026-05-05_at_07.57.26.jpeg');

const NAV_ITEMS = [
  { label: 'Inicio', path: '/' as const },
  { label: 'Categorías', path: '/categorias' as const },
  { label: 'Colegios', path: '/colegios' as const },
  { label: 'Contacto', path: '/contacto' as const },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { cartCount } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (path: string) => {
    setMenuOpen(false);
    if (path === '/') {
      router.push('/');
    } else {
      router.push(path as '/categorias');
    }
  };

  return (
    <>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.logoRow}
          onPress={() => router.push('/')}
          activeOpacity={0.8}
        >
          <Image source={logoImage} style={styles.logo} />
          <View>
            <Text style={styles.logoMega}>MEGA</Text>
            <Text style={styles.logoUniformes}>UNIFORMES</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('/carrito')}
            activeOpacity={0.7}
          >
            <Ionicons name="cart-outline" size={24} color={COLORS.navy} />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount > 99 ? '99+' : cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setMenuOpen(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="menu" size={26} color={COLORS.navy} />
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={menuOpen} animationType="slide" transparent>
        <Pressable style={styles.overlay} onPress={() => setMenuOpen(false)}>
          <Pressable style={[styles.drawer, { paddingTop: insets.top + 16 }]} onPress={(e) => e.stopPropagation()}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>Menú</Text>
              <TouchableOpacity onPress={() => setMenuOpen(false)}>
                <Ionicons name="close" size={28} color={COLORS.navy} />
              </TouchableOpacity>
            </View>

            {NAV_ITEMS.map((item) => {
              const active =
                item.path === '/'
                  ? pathname === '/' || pathname === '/index'
                  : pathname.startsWith(item.path);
              return (
                <TouchableOpacity
                  key={item.path}
                  style={[styles.navItem, active && styles.navItemActive]}
                  onPress={() => navigate(item.path)}
                >
                  <Text style={[styles.navText, active && styles.navTextActive]}>{item.label}</Text>
                </TouchableOpacity>
              );
            })}

            <Text style={styles.sectionLabel}>CATEGORÍAS</Text>
            {navCategoryLinks.map((link) => (
              <TouchableOpacity
                key={link.label}
                style={styles.subNavItem}
                onPress={() => navigate('/categorias')}
              >
                <Text style={styles.subNavText}>{link.label}</Text>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(200, 169, 106, 0.4)',
  },
  logoMega: { fontSize: 18, fontWeight: '800', color: COLORS.navy, letterSpacing: -0.5 },
  logoUniformes: { fontSize: 11, fontWeight: '600', color: COLORS.gold, letterSpacing: 2 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  iconBtn: { padding: 8, position: 'relative' },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { fontSize: 10, fontWeight: '800', color: COLORS.navy },
  overlay: { flex: 1, backgroundColor: 'rgba(11, 31, 58, 0.5)', justifyContent: 'flex-end' },
  drawer: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
    maxHeight: '85%',
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  drawerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.navy },
  navItem: { paddingVertical: 14, paddingHorizontal: 8, borderRadius: 10 },
  navItemActive: { backgroundColor: COLORS.surface },
  navText: { fontSize: 16, fontWeight: '600', color: COLORS.navy },
  navTextActive: { color: COLORS.gold },
  sectionLabel: {
    marginTop: 16,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.muted,
    letterSpacing: 1,
  },
  subNavItem: { paddingVertical: 10, paddingHorizontal: 8 },
  subNavText: { fontSize: 14, color: COLORS.navy },
});
