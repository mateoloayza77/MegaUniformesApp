export const WHATSAPP_NUMBER = '1234567890';
export const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;
export const WHATSAPP_CONTACT = `${WHATSAPP_BASE}?text=${encodeURIComponent('Hola, tengo una consulta sobre los uniformes')}`;

export const SOCIAL = {
  facebook: 'https://facebook.com',
  instagram: 'https://instagram.com',
  whatsapp: WHATSAPP_BASE,
} as const;

export const CONTACT = {
  email: 'info@megauniformes.com',
  phone: '(123) 456-7890',
  address: 'Av. Principal 123, Cuenca, Ecuador',
  hours: 'Lunes-Viernes 8AM-6PM, Sábados 9AM-2PM',
} as const;
