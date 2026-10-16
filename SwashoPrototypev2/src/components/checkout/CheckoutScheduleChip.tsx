import { Pressable, StyleSheet, Text } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

type CheckoutScheduleChipProps = {
  label: string;
  selected: boolean;
  onPress: () => void;
  scale: number;
  minWidth?: number;
  height?: number;
};

export function CheckoutScheduleChip({
  label,
  selected,
  onPress,
  scale,
  minWidth = 65,
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
          minWidth: minWidth * scale,
          paddingHorizontal: 16 * scale,
          paddingVertical: 10 * scale,
          borderRadius: SwashoRadii.sm * scale,
          borderWidth: (selected ? 1.5 : 1) * scale,
          height: height != null ? height * scale : undefined,
          opacity: pressed ? 0.9 : 1,
        },
      ]}>
      <Text
        style={[
          searchFont(selected ? 'semibold' : 'medium'),
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
