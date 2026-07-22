import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import * as Device from 'expo-device';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';

import { ScreenLayout } from '@/components/ScreenLayout';
import { COLORS } from '@/constants/colors';
import { STORE } from '@/constants/links';
import { distanceKm, formatDistance } from '@/utils/geo';
import { openMaps } from '@/utils/maps';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

interface Ubicacion {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  distanceKm: number;
}

export default function ServiciosScreen() {
  const [ubicacion, setUbicacion] = useState<Ubicacion | null>(null);
  const [cargandoUbicacion, setCargandoUbicacion] = useState(false);

  const obtenerUbicacion = async () => {
    try {
      setCargandoUbicacion(true);
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Debes permitir el acceso a la ubicación.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude, accuracy } = location.coords;
      setUbicacion({
        latitude,
        longitude,
        accuracy,
        distanceKm: distanceKm(latitude, longitude, STORE.latitude, STORE.longitude),
      });
    } catch {
      Alert.alert('Error', 'No fue posible obtener la ubicación.');
    } finally {
      setCargandoUbicacion(false);
    }
  };

  const enviarNotificacion = async () => {
    if (!Device.isDevice) {
      Alert.alert('Información', 'Las notificaciones funcionan en un dispositivo físico.');
      return;
    }

    const { status } = await Notifications.requestPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Debes permitir las notificaciones.');
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🎉 MEGA UNIFORMES',
        body: '¡Llegaron nuevos uniformes escolares con 20% de descuento!',
      },
      trigger: null,
    });
    Alert.alert('Listo', 'Te enviamos una notificación de prueba.');
  };

  const comoLlegar = () => openMaps(STORE.latitude, STORE.longitude, STORE.name);

  return (
    <ScreenLayout>
      <View style={styles.intro}>
        <Text style={styles.title}>Servicios Gratuitos</Text>
        <Text style={styles.subtitle}>
          Herramientas para acercarte más a nuestra tienda en Cuenca.
        </Text>
      </View>

      {/* SERVICIO 1: GEOLOCALIZACIÓN */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconCircle}>
            <Ionicons name="location-outline" size={22} color={COLORS.navy} />
          </View>
          <Text style={styles.cardTitle}>Geolocalización</Text>
        </View>
        <Text style={styles.cardText}>
          Calcula tu distancia hasta nuestra tienda usando el GPS de tu dispositivo.
        </Text>

        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={obtenerUbicacion}
          activeOpacity={0.85}
          disabled={cargandoUbicacion}
        >
          {cargandoUbicacion ? (
            <ActivityIndicator color={COLORS.navy} />
          ) : (
            <Text style={styles.primaryBtnText}>OBTENER MI UBICACIÓN</Text>
          )}
        </TouchableOpacity>

        {ubicacion && (
          <View style={styles.result}>
            <View style={styles.distanceBox}>
              <Text style={styles.distanceLabel}>Estás a</Text>
              <Text style={styles.distanceValue}>{formatDistance(ubicacion.distanceKm)}</Text>
              <Text style={styles.distanceLabel}>de la tienda</Text>
            </View>
            <View style={styles.coordsRow}>
              <View style={styles.coordItem}>
                <Text style={styles.coordLabel}>Latitud</Text>
                <Text style={styles.coordValue}>{ubicacion.latitude.toFixed(5)}</Text>
              </View>
              <View style={styles.coordItem}>
                <Text style={styles.coordLabel}>Longitud</Text>
                <Text style={styles.coordValue}>{ubicacion.longitude.toFixed(5)}</Text>
              </View>
              <View style={styles.coordItem}>
                <Text style={styles.coordLabel}>Precisión</Text>
                <Text style={styles.coordValue}>
                  {ubicacion.accuracy ? `${ubicacion.accuracy.toFixed(0)} m` : '—'}
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* SERVICIO 2: NOTIFICACIONES */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconCircle}>
            <Ionicons name="notifications-outline" size={22} color={COLORS.navy} />
          </View>
          <Text style={styles.cardTitle}>Notificaciones</Text>
        </View>
        <Text style={styles.cardText}>
          Recibe avisos de nuevos uniformes, ofertas y promociones especiales.
        </Text>

        <TouchableOpacity style={styles.primaryBtn} onPress={enviarNotificacion} activeOpacity={0.85}>
          <Text style={styles.primaryBtnText}>ENVIAR NOTIFICACIÓN DE PRUEBA</Text>
        </TouchableOpacity>
      </View>

      {/* SERVICIO 3: CÓMO LLEGAR */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconCircle}>
            <Ionicons name="navigate-outline" size={22} color={COLORS.navy} />
          </View>
          <Text style={styles.cardTitle}>Cómo llegar</Text>
        </View>
        <Text style={styles.cardText}>{STORE.address}</Text>

        <TouchableOpacity style={styles.mapBtn} onPress={comoLlegar} activeOpacity={0.85}>
          <Ionicons name="map-outline" size={20} color={COLORS.white} />
          <Text style={styles.mapBtnText}>ABRIR EN EL MAPA</Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  intro: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 8 },
  title: { fontSize: 26, fontWeight: '800', color: COLORS.navy },
  subtitle: { marginTop: 6, fontSize: 14, color: COLORS.muted, lineHeight: 20 },

  card: {
    backgroundColor: COLORS.white,
    borderRadius: 14,
    padding: 18,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 8 },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { fontSize: 18, fontWeight: '800', color: COLORS.navy },
  cardText: { fontSize: 14, color: COLORS.muted, lineHeight: 20, marginBottom: 16 },

  primaryBtn: {
    backgroundColor: COLORS.gold,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  primaryBtnText: { fontSize: 13, fontWeight: '800', color: COLORS.navy, letterSpacing: 0.5 },

  mapBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: COLORS.navy,
    paddingVertical: 15,
    borderRadius: 10,
  },
  mapBtnText: { fontSize: 13, fontWeight: '800', color: COLORS.white, letterSpacing: 0.5 },

  result: { marginTop: 18 },
  distanceBox: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  distanceLabel: { fontSize: 13, color: COLORS.muted },
  distanceValue: { fontSize: 30, fontWeight: '800', color: COLORS.gold, marginVertical: 2 },
  coordsRow: { flexDirection: 'row', marginTop: 14, gap: 8 },
  coordItem: {
    flex: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  coordLabel: { fontSize: 11, color: COLORS.muted, marginBottom: 4 },
  coordValue: { fontSize: 14, fontWeight: '700', color: COLORS.navy },
});
