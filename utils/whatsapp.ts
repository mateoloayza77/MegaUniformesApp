import { Linking } from 'react-native';

import { WHATSAPP_BASE } from '@/constants/links';

export async function openWhatsApp(message: string): Promise<void> {
  const url = `${WHATSAPP_BASE}?text=${encodeURIComponent(message)}`;
  const canOpen = await Linking.canOpenURL(url);
  if (canOpen) {
    await Linking.openURL(url);
  }
}
