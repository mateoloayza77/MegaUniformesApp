import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import 'react-native-reanimated';

import { CartProvider } from '@/context/CartContext';
import { COLORS } from '@/constants/colors';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <CartProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: COLORS.surface },
              animation: 'slide_from_right',
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="categorias" />
            <Stack.Screen name="colegios" />
            <Stack.Screen name="contacto" />
            <Stack.Screen name="carrito" />
            <Stack.Screen name="producto/[id]" />
          </Stack>
          <StatusBar style="dark" />
        </CartProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
