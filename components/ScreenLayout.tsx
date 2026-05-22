import { ScrollView, StyleSheet, View, type ScrollViewProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Header } from '@/components/Header';
import { COLORS } from '@/constants/colors';

interface ScreenLayoutProps extends ScrollViewProps {
  children: React.ReactNode;
  backgroundColor?: string;
  noScroll?: boolean;
}

export function ScreenLayout({
  children,
  backgroundColor = COLORS.surface,
  noScroll,
  ...scrollProps
}: ScreenLayoutProps) {
  const insets = useSafeAreaInsets();

  if (noScroll) {
    return (
      <View style={[styles.root, { backgroundColor }]}>
        <Header />
        <View style={[styles.content, { paddingBottom: insets.bottom }]}>{children}</View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor }]}>
      <Header />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }, scrollProps.contentContainerStyle]}
        showsVerticalScrollIndicator={false}
        {...scrollProps}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  scroll: { flex: 1 },
  content: { flexGrow: 1 },
});
