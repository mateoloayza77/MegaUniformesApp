import type { HeroImageSource } from '@/types';
import type { ImageSourcePropType } from 'react-native';

export function toImageSource(image: string): ImageSourcePropType {
  return { uri: image };
}

export function toHeroImageSource(image: HeroImageSource): ImageSourcePropType {
  if (typeof image === 'string') {
    return { uri: image };
  }
  return image;
}
