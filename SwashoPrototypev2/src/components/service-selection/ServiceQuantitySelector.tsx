import { Pressable, StyleSheet, Text, View } from 'react-native';

import { figmaShadow, FigmaShadows } from '@/components/home/figma-shadows';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import {
  CounterAddSquareIcon,
  CounterMinusSquareIcon,
  type CounterIconTone,
} from './service-selection-icons';

type ServiceQuantitySelectorProps = {
  value: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
  scale: number;
};

function CounterIconSlot({
  scale,
  tone,
  variant,
}: {
  scale: number;
  tone: CounterIconTone;
  variant: 'minus' | 'add';
}) {
  const iconSize = 36 * scale;
  const Icon = variant === 'minus' ? CounterMinusSquareIcon : CounterAddSquareIcon;

  return (
    <View
      style={{
        width: 22 * scale,
        height: 24 * scale,
        overflow: 'hidden',
      }}>
      <View
        style={{
          position: 'absolute',
          left: -7 * scale,
          top: -6 * scale,
        }}>
        <Icon width={iconSize} height={iconSize} tone={tone} />
      </View>
    </View>
  );
}

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

  const decrementTone: CounterIconTone = decrementDisabled && !disabled ? 'muted' : 'default';
  const incrementTone: CounterIconTone = incrementDisabled && !disabled ? 'muted' : 'default';

  return (
    <View
      style={[
        styles.container,
        disabled ? styles.containerDisabled : styles.containerActive,
        {
          width: 86 * scale,
          height: 32 * scale,
          borderRadius: SwashoRadii.md * scale,
          paddingHorizontal: 16 * scale,
          paddingVertical: 8 * scale,
          gap: 12 * scale,
          ...figmaShadow(FigmaShadows.addButton, scale),
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
          pressed && !decrementDisabled && styles.iconButtonPressed,
        ]}>
        <CounterIconSlot scale={scale} tone={disabled ? 'subdued' : decrementTone} variant="minus" />
      </Pressable>
      <Text
        style={[
          searchFont('semibold'),
          styles.value,
          disabled && styles.valueDisabled,
          {
            fontSize: 14 * scale,
            lineHeight: 18 * scale,
            letterSpacing: 1 * scale,
          },
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
          pressed && !incrementDisabled && styles.iconButtonPressed,
        ]}>
        <CounterIconSlot scale={scale} tone={disabled ? 'subdued' : incrementTone} variant="add" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
  },
  containerActive: {
    backgroundColor: SwashoColors.primary600,
    borderColor: SwashoColors.primary600,
  },
  containerDisabled: {
    backgroundColor: SwashoColors.primary300,
    borderColor: SwashoColors.primary300,
  },
  iconButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconButtonPressed: {
    opacity: 0.85,
  },
  value: {
    color: SwashoColors.surface,
    textAlign: 'center',
  },
  valueDisabled: {
    color: SwashoColors.primary100,
  },
});
