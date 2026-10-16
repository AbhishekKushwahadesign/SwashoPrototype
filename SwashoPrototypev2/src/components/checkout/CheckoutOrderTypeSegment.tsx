import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { figmaShadow, FigmaShadows } from '@/components/home/figma-shadows';
import { searchFont } from '@/components/search/search-fonts';
import type { ProviderOrderFulfillmentMode } from '@/lib/checkout-flow';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

type CheckoutOrderTypeSegmentProps = {
  activeMode: ProviderOrderFulfillmentMode;
  onSelectMode: (mode: ProviderOrderFulfillmentMode) => void;
  scale: number;
};

export function CheckoutOrderTypeSegment({
  activeMode,
  onSelectMode,
  scale,
}: CheckoutOrderTypeSegmentProps) {
  const isOneTime = activeMode === 'one-time';

  return (
    <View
      style={[
        styles.outer,
        {
          borderRadius: SwashoRadii.lg * scale,
          borderWidth: 1 * scale,
          minHeight: 61 * scale,
          ...figmaShadow(FigmaShadows.providerCard, scale),
        },
      ]}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: isOneTime }}
          onPress={() => onSelectMode('one-time')}
          style={({ pressed }) => [
            styles.half,
            styles.halfLeft,
            { opacity: pressed ? 0.95 : 1 },
          ]}>
          {isOneTime ? (
            <LinearGradient
              colors={['#7e77ff', '#7056ff', '#6234ff']}
              start={{ x: 1, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={[StyleSheet.absoluteFill, { borderRadius: SwashoRadii.lg * scale }]} />
          ) : (
            <View style={[StyleSheet.absoluteFill, styles.inactiveFill, { borderRadius: SwashoRadii.lg * scale }]} />
          )}
          <View style={[styles.copy, { gap: 6 * scale, paddingVertical: 12 * scale }]}>
            <Text
              style={[
                searchFont('semibold'),
                isOneTime ? styles.titleOnGradient : styles.titleMuted,
                { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
              ]}>
              One-Time
            </Text>
            <Text
              style={[
                searchFont('semibold'),
                isOneTime ? styles.subOnGradient : styles.subMuted,
                { fontSize: 12 * scale, lineHeight: 17 * scale, letterSpacing: 0.5 * scale },
              ]}>
              Pay Standard Pricing
            </Text>
          </View>
          {isOneTime ? <View style={styles.insetShadow} pointerEvents="none" /> : null}
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: !isOneTime }}
          onPress={() => onSelectMode('subscribe')}
          style={({ pressed }) => [
            styles.half,
            styles.halfRight,
            { opacity: pressed ? 0.95 : 1 },
          ]}>
          <View style={[styles.copy, { gap: 7 * scale, paddingVertical: 12 * scale }]}>
            <Text
              style={[
                searchFont('semibold'),
                styles.titleDark,
                { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
              ]}>
              Subscribe
            </Text>
            <Text
              style={[
                searchFont('regular'),
                styles.subDark,
                { fontSize: 12 * scale, lineHeight: 14 * scale },
              ]}>
              Unlock Exclusive Pricing
            </Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.outerInset} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    borderColor: '#d7d7d7',
    backgroundColor: '#e0e0e0',
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  half: {
    flex: 1,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  halfLeft: {
    zIndex: 2,
  },
  halfRight: {
    backgroundColor: SwashoColors.surface,
    zIndex: 1,
  },
  inactiveFill: {
    backgroundColor: SwashoColors.neutral50,
  },
  copy: {
    alignItems: 'center',
    zIndex: 1,
  },
  titleOnGradient: {
    color: SwashoColors.primary100,
  },
  subOnGradient: {
    color: SwashoColors.primary100,
  },
  titleMuted: {
    color: SwashoColors.neutral800,
  },
  subMuted: {
    color: SwashoColors.neutral600,
  },
  titleDark: {
    color: SwashoColors.neutral950,
  },
  subDark: {
    color: SwashoColors.neutral800,
  },
  insetShadow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: SwashoRadii.lg,
    shadowColor: '#000',
    shadowOffset: { width: -6, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  outerInset: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: SwashoRadii.lg,
    borderWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
  },
});
