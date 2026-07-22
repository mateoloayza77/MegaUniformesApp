import { Linking, Platform } from 'react-native';

// Abre la app de mapas nativa (Apple Maps en iOS, Google Maps en Android) en unas
// coordenadas concretas. Si el esquema nativo no está disponible, cae en Google Maps web.
export async function openMaps(
  latitude: number,
  longitude: number,
  label: string,
): Promise<void> {
  const latLng = `${latitude},${longitude}`;
  const webUrl = `https://www.google.com/maps/search/?api=1&query=${latLng}`;

  const nativeUrl = Platform.select({
    ios: `maps://?q=${encodeURIComponent(label)}&ll=${latLng}`,
    android: `geo:${latLng}?q=${latLng}(${encodeURIComponent(label)})`,
    default: webUrl,
  }) as string;

  const canOpenNative = await Linking.canOpenURL(nativeUrl);
  await Linking.openURL(canOpenNative ? nativeUrl : webUrl);
}
