import type { CategoryInfo, HeroSlide, Product, ProductCategory, School } from '@/types';

const heroImage = require('@/assets/imports/Gemini_Generated_Image_f25v5bf25v5bf25v-1.png');

// Fotos reales del local y de los colegios (tomadas del sitio web MegaUniformes).
const LOCAL = {
  fachada: require('@/assets/brand/local/fachada.jpg'),
  interior: require('@/assets/brand/local/interior.jpg'),
};

const COLEGIO_IMG = {
  asuncion: require('@/assets/brand/colegios/asuncion.jpg'),
  tecnicoSalesiano: require('@/assets/brand/colegios/tecnico-salesiano.jpg'),
  borja: require('@/assets/brand/colegios/borja.jpg'),
  laSalle: require('@/assets/brand/colegios/la-salle.jpg'),
  benignoMalo: require('@/assets/brand/colegios/benigno-malo.jpg'),
  catalinas: require('@/assets/brand/colegios/catalinas.jpg'),
};

// Imágenes por tipo de prenda (stock). Las fotos reales por colegio se usan en la
// pantalla de Colegios; cada prenda usa una imagen genérica de su tipo.
const IMG = {
  polo: 'https://images.unsplash.com/photo-1586363104862-3a3e58c1a1c0?w=600&h=600&fit=crop',
  camisa: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2b?w=600&h=600&fit=crop',
  buzo: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&h=600&fit=crop',
  saco: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&h=600&fit=crop',
  pantalon: 'https://images.unsplash.com/photo-1473966968600-fa801b279a01?w=600&h=600&fit=crop',
  falda: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&h=600&fit=crop',
  deportivo: 'https://images.unsplash.com/photo-1556906781-9a412961c28c?w=600&h=600&fit=crop',
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
  'Uniforme escolar de alta calidad, confeccionado con materiales resistentes y cómodos para el uso diario. Disponible en varias tallas para niños y jóvenes. Confirma tallas, colores y disponibilidad por WhatsApp.';

// Instituciones destacadas (mismas del sitio web, con foto real). Config estática.
export const schools: School[] = [
  {
    id: 'la-asuncion',
    name: 'La Asunción',
    initials: 'LA',
    slug: 'la-asuncion',
    image: COLEGIO_IMG.asuncion,
    tagline: 'Uniforme completo diario, formal y deportivo',
    description:
      'Uniformes de diario, formal y educación física disponibles para diferentes tallas, hombre y mujer.',
    features: ['Varias tallas', 'Excelente calidad'],
  },
  {
    id: 'tecnico-salesiano',
    name: 'Técnico Salesiano',
    initials: 'TS',
    slug: 'tecnico-salesiano',
    image: COLEGIO_IMG.tecnicoSalesiano,
    tagline: 'Prendas de diario, formal y educación física',
    description:
      'Prendas de diario, formal y educación física. Consulta tallas y disponibilidad.',
    features: ['Uniforme diario', 'Educación física'],
  },
  {
    id: 'borja',
    name: 'Borja',
    initials: 'BO',
    slug: 'borja',
    image: COLEGIO_IMG.borja,
    tagline: 'Opciones para uniforme diario y deportivo',
    description:
      'Opciones para uniforme diario y deportivo. Consulta tallas y disponibilidad.',
    features: ['Uniforme diario', 'Prendas deportivas'],
  },
  {
    id: 'la-salle',
    name: 'La Salle',
    initials: 'LS',
    slug: 'la-salle',
    image: COLEGIO_IMG.laSalle,
    tagline: 'Prendas escolares para hombre y mujer',
    description:
      'Prendas escolares para hombre y mujer. Consulta tallas y disponibilidad.',
    features: ['Hombre y mujer', 'Varias tallas'],
  },
  {
    id: 'benigno-malo',
    name: 'Benigno Malo',
    initials: 'BM',
    slug: 'benigno-malo',
    image: COLEGIO_IMG.benignoMalo,
    tagline: 'Uniformes para uso diario y educación física',
    description:
      'Uniformes para uso diario y educación física. Consulta tallas y disponibilidad.',
    features: ['Uniforme diario', 'Educación física'],
  },
  {
    id: 'catalinas',
    name: 'Catalinas',
    initials: 'CA',
    slug: 'catalinas',
    image: COLEGIO_IMG.catalinas,
    tagline: 'Prendas institucionales y deportivas',
    description:
      'Prendas institucionales y deportivas. Consulta tallas y disponibilidad.',
    features: ['Uniforme institucional', 'Uniforme deportivo'],
  },
];

// Plantilla de prendas por colegio. `women: true` agrega falda/blusa.
// ⚠️ PRECIOS REFERENCIALES (placeholder) — la base real no tiene precios cargados.
// Ajústalos antes de publicar (o edítalos en Firestore tras el seed).
type GarmentTemplate = {
  key: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  image: string;
  price: number;
  onlyWomen?: boolean;
};

const GARMENTS: GarmentTemplate[] = [
  { key: 'camisa', name: 'Camisa Formal', category: 'polo', categoryLabel: 'Camisas', image: IMG.camisa, price: 18.99 },
  { key: 'polo', name: 'Camiseta Polo', category: 'polo', categoryLabel: 'Camisetas Polo', image: IMG.polo, price: 15.99 },
  { key: 'chompa', name: 'Chompa', category: 'buzos', categoryLabel: 'Chompas y Buzos', image: IMG.buzo, price: 28.99 },
  { key: 'pantalon', name: 'Pantalón', category: 'pantalones', categoryLabel: 'Pantalones', image: IMG.pantalon, price: 22.99 },
  { key: 'falda', name: 'Falda', category: 'faldas', categoryLabel: 'Faldas', image: IMG.falda, price: 19.99, onlyWomen: true },
  { key: 'conjunto', name: 'Conjunto Deportivo', category: 'pantalones', categoryLabel: 'Deportivo', image: IMG.deportivo, price: 32.99 },
  { key: 'camiseta-ef', name: 'Camiseta Deportiva', category: 'polo', categoryLabel: 'Deportivo', image: IMG.polo, price: 14.99 },
];

// Colegios que incluyen prendas femeninas (falda/blusa).
const SCHOOLS_WITH_WOMEN = new Set(['la-asuncion', 'la-salle', 'catalinas', 'borja', 'benigno-malo']);

function buildProducts(): Product[] {
  const out: Product[] = [];
  for (const school of schools) {
    const includeWomen = SCHOOLS_WITH_WOMEN.has(school.id);
    let first = true;
    for (const g of GARMENTS) {
      if (g.onlyWomen && !includeWomen) continue;
      out.push({
        id: `${school.id}-${g.key}`,
        name: `${g.name} ${school.name}`,
        price: g.price,
        category: g.category,
        categoryLabel: g.categoryLabel,
        school: school.id,
        schoolLabel: school.name,
        image: g.image,
        onPromotion: first, // una prenda destacada por colegio
        description: productDescription,
      });
      first = false;
    }
  }
  return out;
}

export const products: Product[] = buildProducts();

export const promotionProducts = products.filter((p) => p.onPromotion).slice(0, 6);

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    image: heroImage,
    title: 'TODO PARA EL\nREGRESO A CLASES',
    subtitle: 'Uniformes escolares de calidad para las principales instituciones de Cuenca.',
  },
  {
    id: 2,
    image: LOCAL.interior,
    title: 'UNIFORMES\nCOMPLETOS',
    subtitle: 'Diario, formal y educación física para más de 20 instituciones.',
  },
  {
    id: 3,
    image: LOCAL.fachada,
    title: 'ATENCIÓN\nPRESENCIAL',
    subtitle: 'Visítanos en nuestro local en Cuenca, Ecuador.',
  },
];

export const navCategoryLinks = [
  { label: 'La Asunción', href: '/colegios' },
  { label: 'Técnico Salesiano', href: '/colegios' },
  { label: 'Borja', href: '/colegios' },
  { label: 'La Salle', href: '/colegios' },
];

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(category: Product['category']): Product[] {
  return products.filter((p) => p.category === category);
}

export function getProductsBySchool(school: string): Product[] {
  return products.filter((p) => p.school === school);
}

export function getSchoolById(id: string): School | undefined {
  return schools.find((s) => s.id === id);
}
