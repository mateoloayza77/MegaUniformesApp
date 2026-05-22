import type { CategoryInfo, HeroSlide, Product, School } from '@/types';

const heroImage = require('@/assets/imports/Gemini_Generated_Image_f25v5bf25v5bf25v-1.png');

const IMG = {
  polo: 'https://images.unsplash.com/photo-1586363104862-3a3e58c1a1c0?w=600&h=600&fit=crop',
  polo2: 'https://images.unsplash.com/photo-1622445275463-79d2a825b1cd?w=600&h=600&fit=crop',
  buzo: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop',
  saco: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop',
  pantalon: 'https://images.unsplash.com/photo-1473966968600-fa801b279a01?w=600&h=600&fit=crop',
  falda: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop',
  camisa: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2b?w=600&h=600&fit=crop',
  students: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&h=600&fit=crop',
  students2: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0d?w=1200&h=600&fit=crop',
} as const;

export const categories: CategoryInfo[] = [
  { id: 'polo', name: 'Camisetas Polo', slug: 'polo', image: IMG.polo },
  { id: 'buzos', name: 'Buzos y Sacos', slug: 'buzos', image: IMG.buzo },
  { id: 'pantalones', name: 'Pantalones', slug: 'pantalones', image: IMG.pantalon },
  { id: 'faldas', name: 'Faldas', slug: 'faldas', image: IMG.falda },
];

const productDescription =
  'Uniforme escolar de alta calidad, confeccionado con materiales resistentes y cómodos para el uso diario. Ideal para el día a día en clase y actividades escolares. Disponible en varios colores institucionales y tallas para niños y jóvenes.';

export const products: Product[] = [
  { id: 'polo-clasico', name: 'POLO CLÁSICO', price: 16.99, category: 'polo', categoryLabel: 'Camisetas Polo', image: IMG.polo, onPromotion: true, description: productDescription },
  { id: 'polo-bordado', name: 'POLO BORDADO', price: 19.99, category: 'polo', categoryLabel: 'Camisetas Polo', image: IMG.polo2, description: productDescription },
  { id: 'polo-manga-larga', name: 'POLO MANGA LARGA', price: 21.99, category: 'polo', categoryLabel: 'Camisetas Polo', image: IMG.camisa, description: productDescription },
  { id: 'polo-deportivo', name: 'POLO DEPORTIVO', price: 18.5, category: 'polo', categoryLabel: 'Camisetas Polo', image: IMG.polo2, description: productDescription },
  { id: 'buzo-escolar', name: 'BUZO ESCOLAR', price: 22.99, category: 'buzos', categoryLabel: 'Buzos y Sacos', image: IMG.buzo, onPromotion: true, description: productDescription },
  { id: 'saco-escolar', name: 'SACO ESCOLAR', price: 32.99, category: 'buzos', categoryLabel: 'Buzos y Sacos', image: IMG.saco, onPromotion: true, description: productDescription },
  { id: 'chaqueta-deportiva', name: 'CHAQUETA DEPORTIVA', price: 38.99, category: 'buzos', categoryLabel: 'Buzos y Sacos', image: IMG.buzo, description: productDescription },
  { id: 'buzo-capucha', name: 'BUZO CON CAPUCHA', price: 28.99, category: 'buzos', categoryLabel: 'Buzos y Sacos', image: IMG.buzo, description: productDescription },
  { id: 'pantalon-escolar', name: 'PANTALÓN ESCOLAR', price: 18.75, category: 'pantalones', categoryLabel: 'Pantalones', image: IMG.pantalon, onPromotion: true, description: productDescription },
  { id: 'pantalon-drill', name: 'PANTALÓN DRILL', price: 22.5, category: 'pantalones', categoryLabel: 'Pantalones', image: IMG.pantalon, description: productDescription },
  { id: 'short-deportivo', name: 'SHORT DEPORTIVO', price: 15.99, category: 'pantalones', categoryLabel: 'Pantalones', image: IMG.pantalon, description: productDescription },
  { id: 'pantalon-deportivo', name: 'PANTALÓN DEPORTIVO', price: 24.99, category: 'pantalones', categoryLabel: 'Pantalones', image: IMG.pantalon, description: productDescription },
  { id: 'falda-plisada', name: 'FALDA PLISADA', price: 19.99, category: 'faldas', categoryLabel: 'Faldas', image: IMG.falda, onPromotion: true, description: productDescription },
  { id: 'falda-tableada', name: 'FALDA TABLEADA', price: 21.99, category: 'faldas', categoryLabel: 'Faldas', image: IMG.falda, description: productDescription },
  { id: 'falda-pantalon', name: 'FALDA PANTALÓN', price: 24.99, category: 'faldas', categoryLabel: 'Faldas', image: IMG.falda, description: productDescription },
  { id: 'falda-basica', name: 'FALDA ESCOLAR BÁSICA', price: 17.99, category: 'faldas', categoryLabel: 'Faldas', image: IMG.falda, description: productDescription },
  { id: 'camisa-manga-larga', name: 'CAMISA MANGA LARGA', price: 24.99, category: 'polo', categoryLabel: 'Camisetas Polo', image: IMG.camisa, onPromotion: true, description: productDescription },
];

export const promotionProducts = products.filter((p) => p.onPromotion).slice(0, 6);

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: heroImage,
    title: 'LISTOS PARA\nCADA CLASE',
    subtitle: 'Uniformes de calidad, cómodos y diseñados para el día a día.',
  },
  {
    id: 2,
    image: IMG.students,
    title: 'NUEVA COLECCIÓN\n2026',
    subtitle: 'Descubre los nuevos diseños para este año escolar.',
  },
  {
    id: 3,
    image: IMG.students2,
    title: 'OFERTAS\nESPECIALES',
    subtitle: 'Hasta 30% de descuento en productos seleccionados.',
  },
];

export const navCategoryLinks = [
  { label: 'Deportivos Mujer', href: '/categorias' },
  { label: 'Diario Mujer', href: '/categorias' },
  { label: 'Deportivos Hombre', href: '/categorias' },
  { label: 'Diario Hombre', href: '/categorias' },
];

export const schools: School[] = [
  { id: 'sb', name: 'San Bartolomé', initials: 'SB' },
  { id: 'ab', name: 'Asunción', initials: 'AB' },
  { id: 'tc', name: 'Técnico Cuenca', initials: 'TC' },
  { id: 'bc', name: 'Benigno Malo', initials: 'BC' },
  { id: 'lc', name: 'La Salle', initials: 'LC' },
  { id: 'sm', name: 'Santa Mariana', initials: 'SM' },
  { id: 'hm', name: 'Herlinda Toral', initials: 'HM' },
  { id: 'rc', name: 'Rosa de Jesús', initials: 'RC' },
  { id: 'mc', name: 'Manuela Cañizares', initials: 'MC' },
  { id: 'ta', name: 'Técnico Salesiano', initials: 'TA' },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: Product['category']): Product[] {
  return products.filter((p) => p.category === category);
}
