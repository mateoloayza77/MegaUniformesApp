import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
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
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { useCatalog } from '@/context/CatalogContext';

const logoImage = require('@/assets/brand/logo-megauniformes.jpeg');

const NAV_ITEMS = [
  { label: 'Inicio', path: '/' as const },
  { label: 'Colegios', path: '/colegios' as const },
  { label: 'Asistente', path: '/asistente' as const },
  { label: 'Contacto', path: '/contacto' as const },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const { schools } = useCatalog();
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = (path: string) => {
    setMenuOpen(false);
    if (path === '/') {
      router.push('/');
    } else {
      router.push(path as '/categorias');
    }
  };

  const goToLogin = () => {
    setMenuOpen(false);
    router.push('/login');
  };

  const confirmLogout = () => {
    Alert.alert('Cerrar sesión', '¿Seguro que quieres cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Cerrar sesión',
        style: 'destructive',
        onPress: async () => {
          setMenuOpen(false);
          await logout();
        },
      },
    ]);
  };

  return (
    <>
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.logoRow}
          onPress={() => router.push('/')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="MEGA UNIFORMES, ir al inicio"
        >
          <Image source={logoImage} style={styles.logo} accessibilityIgnoresInvertColors />
          <View>
            <Text style={styles.logoMega}>MEGA</Text>
            <Text style={styles.logoUniformes}>UNIFORMES</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={goToLogin}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={user ? 'Mi cuenta' : 'Iniciar sesión'}
          >
            <Ionicons
              name={user ? 'person-circle' : 'person-circle-outline'}
              size={26}
              color={user ? COLORS.gold : COLORS.navy}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => router.push('/carrito')}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={
              cartCount > 0 ? `Carrito, ${cartCount} artículos` : 'Carrito, vacío'
            }
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
            accessibilityRole="button"
            accessibilityLabel="Abrir menú"
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
              <TouchableOpacity
                onPress={() => setMenuOpen(false)}
                accessibilityRole="button"
                accessibilityLabel="Cerrar menú"
              >
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

            <Text style={styles.sectionLabel}>COLEGIOS</Text>
            {schools.map((school) => (
              <TouchableOpacity
                key={school.id}
                style={styles.subNavItem}
                onPress={() => {
                  setMenuOpen(false);
                  router.push({ pathname: '/colegio/[id]', params: { id: school.id } });
                }}
              >
                <Text style={styles.subNavText}>{school.name}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.sectionLabel}>CUENTA</Text>
            {user ? (
              <>
                <View style={styles.accountRow}>
                  <Ionicons name="person-circle" size={40} color={COLORS.gold} />
                  <View style={styles.accountInfo}>
                    <Text style={styles.accountName} numberOfLines={1}>
                      {user.displayName || 'Mi cuenta'}
                    </Text>
                    <Text style={styles.accountEmail} numberOfLines={1}>
                      {user.email}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.logoutBtn} onPress={confirmLogout}>
                  <Ionicons name="log-out-outline" size={20} color={COLORS.red} />
                  <Text style={styles.logoutText}>Cerrar sesión</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.loginBtn} onPress={goToLogin} activeOpacity={0.85}>
                <Ionicons name="log-in-outline" size={20} color={COLORS.navy} />
                <Text style={styles.loginText}>Iniciar sesión / Registrarme</Text>
              </TouchableOpacity>
            )}
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

  accountRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 8, paddingHorizontal: 8 },
  accountInfo: { flex: 1 },
  accountName: { fontSize: 15, fontWeight: '700', color: COLORS.navy },
  accountEmail: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 8,
    marginTop: 4,
  },
  logoutText: { fontSize: 15, fontWeight: '600', color: COLORS.red },
  loginBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.gold,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 4,
  },
  loginText: { fontSize: 15, fontWeight: '700', color: COLORS.navy },
});
