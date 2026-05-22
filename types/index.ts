export type ProductCategory = 'polo' | 'buzos' | 'pantalones' | 'faldas';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  categoryLabel: string;
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
}

export interface CartItem {
  productId: string;
  quantity: number;
  size: string;
  color: string;
}
