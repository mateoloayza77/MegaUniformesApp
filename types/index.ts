export type ProductCategory = 'polo' | 'buzos' | 'pantalones' | 'faldas';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  categoryLabel: string;
  /** id del colegio al que pertenece la prenda (ver `schools`). */
  school: string;
  /** nombre visible del colegio (para mostrar sin resolver el id). */
  schoolLabel: string;
  image: string;
  onPromotion?: boolean;
  description?: string;
}

export interface CategoryInfo {
  id: ProductCategory;
  name: string;
  slug: string;
  image: string;
}

export type HeroImageSource = number | string;

export interface HeroSlide {
  id: number;
  image: HeroImageSource;
  title: string;
  subtitle: string;
}

export interface School {
  id: string;
  name: string;
  initials: string;
  slug: string;
  /** Foto real del colegio (asset bundled) o URL. */
  image: HeroImageSource;
  /** Frase corta para la tarjeta. */
  tagline: string;
  description: string;
  /** Características destacadas que se muestran en la tarjeta/detalle. */
  features: string[];
}

export interface CartItem {
  productId: string;
  quantity: number;
  size: string;
  color: string;
}
