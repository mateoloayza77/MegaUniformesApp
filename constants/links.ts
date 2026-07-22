// Número real de MEGA UNIFORMES (Cuenca): 099 177 1729 → formato internacional
// para wa.me (Ecuador +593, sin el 0 inicial).
export const WHATSAPP_NUMBER = '593991771729';
export const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;
export const WHATSAPP_CONTACT = `${WHATSAPP_BASE}?text=${encodeURIComponent('Hola, tengo una consulta sobre los uniformes')}`;

export const SOCIAL = {
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  whatsapp: WHATSAPP_BASE,
} as const;

export const CONTACT = {
  phone: '099 177 1729',
  address: 'Cuenca, Ecuador',
  detail: 'Atención presencial en nuestro local',
} as const;

// Ubicación física de la tienda (Cuenca, Ecuador — coordenadas del centro histórico
// como valor por defecto). Ajusta latitude/longitude a la dirección real antes de publicar.
export const STORE = {
  name: 'MEGA UNIFORMES',
  address: CONTACT.address,
  latitude: -2.897_4,
  longitude: -79.004_5,
} as const;
