import { Pressable, StyleSheet, Text } from 'react-native';

import { figmaShadow, FigmaShadows } from '@/components/home/figma-shadows';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { AddSquareIcon, DoubleAltArrowRightIcon } from './service-selection-icons';

export type ServiceAddButtonMode = 'add' | 'select' | 'tertiary';

type ServiceAddButtonProps = {
  mode?: ServiceAddButtonMode;
  /** When `mode` is `select`, filled brand style matching the quantity counter (primary600). */
  selected?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  scale: number;
};

export function ServiceAddButton({
  mode = 'add',
  selected = false,
  disabled = false,
  onPress,
  scale,
}: ServiceAddButtonProps) {
  const isSelect = mode === 'select';
  const isSelected = isSelect && selected;
  const label = isSelected ? 'SELECTED' : isSelect ? 'SELECT' : 'ADD';
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
        isSelected ? styles.selected : null,
        disabled && styles.disabled,
        {
          width: isTertiary ? undefined : isSelected ? 96 * scale : 86 * scale,
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
          isSelected ? searchFont('semibold') : searchFont('medium'),
          styles.label,
          isSelected && styles.selectedLabel,
          isTertiary && styles.tertiaryLabel,
          {
            fontSize: 14 * scale,
            lineHeight: isSelected ? 18 * scale : 12 * scale,
            letterSpacing: isSelected ? 1 * scale : 0.5 * scale,
          },
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
  selected: {
    backgroundColor: SwashoColors.primary600,
    borderColor: SwashoColors.primary600,
  },
  label: {
    color: SwashoColors.primary600,
    textAlign: 'center',
  },
  selectedLabel: {
    color: SwashoColors.surface,
    textAlign: 'center',
  },
  tertiaryLabel: {
    flex: 1,
  },
});
