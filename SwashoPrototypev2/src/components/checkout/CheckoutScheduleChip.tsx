import { Platform, Pressable, StyleSheet, Text } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

type CheckoutScheduleChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  scale: number;
  minWidth?: number;
  width?: number;
  height?: number;
};

export function CheckoutScheduleChip({
  label,
  selected,
  onPress,
  scale,
  minWidth = 65,
  width,
  height,
}: CheckoutScheduleChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        selected && styles.chipSelected,
        {
          minWidth: width != null ? undefined : minWidth * scale,
          width: width != null ? width : undefined,
          paddingHorizontal: 16.022 * scale,
          paddingVertical: 8.011 * scale,
          borderRadius: SwashoRadii.md * scale,
          borderWidth: (selected ? 1.502 : 1.001) * scale,
          height: height != null ? height * scale : undefined,
          flexShrink: 0,
          opacity: pressed ? 0.9 : 1,
          ...(Platform.OS === 'web' ? { boxSizing: 'border-box' as const } : null),
        },
      ]}>
      <Text
        style={[
          searchFont('semibold'),
          selected ? styles.labelSelected : styles.label,
          { fontSize: 15 * scale, lineHeight: 14 * scale, letterSpacing: 0.3 * scale },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderColor: SwashoColors.neutral200,
    backgroundColor: SwashoColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    borderColor: SwashoColors.primary600,
    backgroundColor: SwashoColors.primary100,
  },
  label: {
    color: SwashoColors.darkHeaderText,
  },
  labelSelected: {
    color: SwashoColors.primary600,
    textAlign: 'center',
  },
});
