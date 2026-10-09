import { Pressable, StyleSheet, Text, View } from 'react-native';

import { figmaShadow, FigmaShadows } from '@/components/home/figma-shadows';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { AddSquareIcon, MinusSquareIcon } from './service-selection-icons';

type ServiceQuantitySelectorProps = {
  value: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
  scale: number;
};

export function ServiceQuantitySelector({
  value,
  min = 0,
  max,
  disabled = false,
  onIncrement,
  onDecrement,
  scale,
}: ServiceQuantitySelectorProps) {
  const atMin = value <= min;
  const atMax = max != null && value >= max;
  const decrementDisabled = disabled || atMin;
  const incrementDisabled = disabled || atMax;

  return (
    <View
      style={[
        styles.container,
        disabled && styles.containerDisabled,
        {
          width: 86 * scale,
          height: 32 * scale,
          borderRadius: SwashoRadii.md * scale,
          paddingHorizontal: 16 * scale,
          paddingVertical: 8 * scale,
          gap: 12 * scale,
          ...figmaShadow(FigmaShadows.search, scale),
        },
      ]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Decrease quantity"
        accessibilityState={{ disabled: decrementDisabled }}
        disabled={decrementDisabled}
        hitSlop={8}
        onPress={() => {
          if (!decrementDisabled) {
            onDecrement?.();
          }
        }}
        style={({ pressed }) => [
          styles.iconButton,
          { width: 22 * scale, height: 24 * scale, opacity: pressed && !decrementDisabled ? 0.7 : 1 },
        ]}>
        <MinusSquareIcon width={18 * scale} height={18 * scale} />
      </Pressable>
      <Text
        style={[
          searchFont('semibold'),
          styles.value,
          { fontSize: 14 * scale, lineHeight: 18 * scale, letterSpacing: 1 * scale },
        ]}>
        {value}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Increase quantity"
        accessibilityState={{ disabled: incrementDisabled }}
        disabled={incrementDisabled}
        hitSlop={8}
        onPress={() => {
          if (!incrementDisabled) {
            onIncrement?.();
          }
        }}
        style={({ pressed }) => [
          styles.iconButton,
          { width: 22 * scale, height: 24 * scale, opacity: pressed && !incrementDisabled ? 0.7 : 1 },
        ]}>
        <AddSquareIcon width={18 * scale} height={18 * scale} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: SwashoColors.primary600,
    borderWidth: 0.5,
    borderColor: SwashoColors.primary600,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  containerDisabled: {
    opacity: 0.5,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  value: {
    color: SwashoColors.surface,
    textAlign: 'center',
  },
});
