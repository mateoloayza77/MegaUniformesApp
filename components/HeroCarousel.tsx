import { useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { COLORS } from '@/constants/colors';
import { heroSlides } from '@/data/products';
import { toHeroImageSource } from '@/utils/images';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CAROUSEL_HEIGHT = 420;
const INTERVAL_MS = 5000;

export function HeroCarousel() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);
  const [active, setActive] = useState(0);

  const goTo = useCallback((index: number) => {
    setActive(index);
    scrollRef.current?.scrollTo({ x: index * SCREEN_WIDTH, animated: true });
  }, []);

  const next = useCallback(() => {
    goTo((active + 1) % heroSlides.length);
  }, [active, goTo]);

  const prev = useCallback(() => {
    goTo((active - 1 + heroSlides.length) % heroSlides.length);
  }, [active, goTo]);

  useEffect(() => {
    const timer = setInterval(next, INTERVAL_MS);
    return () => clearInterval(timer);
  }, [next]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_WIDTH);
    if (index !== active && index >= 0 && index < heroSlides.length) {
      setActive(index);
    }
  };

  const slide = heroSlides[active];

  return (
    <View style={styles.wrapper}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        scrollEventThrottle={16}
      >
        {heroSlides.map((s) => (
          <View key={s.id} style={styles.slide}>
            <Image source={toHeroImageSource(s.image)} style={styles.slideImage} resizeMode="cover" />
            <View style={styles.overlay} />
          </View>
        ))}
      </ScrollView>

      <View style={styles.content} pointerEvents="box-none">
        <Text style={styles.title}>{slide.title}</Text>
        <Text style={styles.subtitle}>{slide.subtitle}</Text>
        <TouchableOpacity
          style={styles.cta}
          onPress={() => router.push('/categorias')}
          activeOpacity={0.85}
        >
          <Text style={styles.ctaText}>VER COLECCIÓN</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.arrowLeft} onPress={prev} activeOpacity={0.8}>
        <Text style={styles.arrowText}>‹</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.arrowRight} onPress={next} activeOpacity={0.8}>
        <Text style={styles.arrowText}>›</Text>
      </TouchableOpacity>

      <View style={styles.dots}>
        {heroSlides.map((_, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => goTo(index)}
            style={[styles.dot, index === active && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { height: CAROUSEL_HEIGHT, position: 'relative' },
  slide: { width: SCREEN_WIDTH, height: CAROUSEL_HEIGHT },
  slideImage: { width: '100%', height: '100%' },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11, 31, 58, 0.55)',
  },
  content: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  subtitle: {
    marginTop: 12,
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 22,
  },
  cta: {
    marginTop: 24,
    backgroundColor: COLORS.gold,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
  },
  ctaText: { fontSize: 13, fontWeight: '800', color: COLORS.navy, letterSpacing: 1 },
  arrowLeft: {
    position: 'absolute',
    left: 12,
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowRight: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: { fontSize: 28, color: COLORS.white, fontWeight: '300', marginTop: -4 },
  dots: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.5)' },
  dotActive: { width: 28, backgroundColor: COLORS.gold },
});
