import { Pressable, StyleSheet, Text } from 'react-native';

import { figmaShadow, FigmaShadows } from '@/components/home/figma-shadows';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { AddSquareIcon, DoubleAltArrowRightIcon } from './service-selection-icons';

export type ServiceAddButtonMode = 'add' | 'select' | 'tertiary';

type ServiceAddButtonProps = {
  mode?: ServiceAddButtonMode;
  disabled?: boolean;
  onPress?: () => void;
  scale: number;
};

export function ServiceAddButton({ mode = 'add', disabled = false, onPress, scale }: ServiceAddButtonProps) {
  const label = mode === 'add' ? 'ADD' : mode === 'select' ? 'SELECT' : 'Add';
  const isTertiary = mode === 'tertiary';

  const handlePress = () => {
    if (!disabled) {
      onPress?.();
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.base,
        disabled && styles.disabled,
        {
          width: isTertiary ? undefined : 86 * scale,
          minWidth: isTertiary ? 60 * scale : undefined,
          height: 32 * scale,
          borderRadius: SwashoRadii.md * scale,
          paddingHorizontal: 16 * scale,
          paddingVertical: 8 * scale,
          gap: 6 * scale,
          opacity: pressed && !disabled ? 0.85 : 1,
          ...figmaShadow(FigmaShadows.addButton, scale),
        },
      ]}>
      <Text
        style={[
          searchFont('medium'),
          styles.label,
          isTertiary && styles.tertiaryLabel,
          { fontSize: 14 * scale, lineHeight: 12 * scale, letterSpacing: 0.5 * scale },
        ]}>
        {label}
      </Text>
      {mode === 'add' ? <AddSquareIcon width={18 * scale} height={18 * scale} /> : null}
      {isTertiary ? <DoubleAltArrowRightIcon width={20 * scale} height={20 * scale} /> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: SwashoColors.surface,
    borderWidth: 0.5,
    borderColor: SwashoColors.primary300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: SwashoColors.primary600,
    textAlign: 'center',
  },
  tertiaryLabel: {
    flex: 1,
  },
});
