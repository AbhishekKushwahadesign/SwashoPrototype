import { Pressable, StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

type ServiceCheckboxProps = {
  checked: boolean;
  disabled?: boolean;
  label?: string;
  onChange?: (checked: boolean) => void;
  scale: number;
};

export function ServiceCheckbox({
  checked,
  disabled = false,
  label,
  onChange,
  scale,
}: ServiceCheckboxProps) {
  const handlePress = () => {
    if (!disabled) {
      onChange?.(!checked);
    }
  };

  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.row,
        { gap: 8 * scale, opacity: pressed && !disabled ? 0.8 : 1 },
      ]}>
      <View
        style={[
          styles.box,
          checked && styles.boxChecked,
          disabled && styles.boxDisabled,
          {
            width: 20 * scale,
            height: 20 * scale,
            borderRadius: SwashoRadii.sm * scale,
          },
        ]}>
        {checked ? (
          <Text style={[styles.checkMark, { fontSize: 12 * scale, lineHeight: 14 * scale }]}>✓</Text>
        ) : null}
      </View>
      {label ? (
        <Text
          style={[
            styles.label,
            searchFont('medium'),
            { fontSize: 12 * scale, lineHeight: 14 * scale },
          ]}>
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  box: {
    backgroundColor: SwashoColors.neutral200,
    borderWidth: 0.5,
    borderColor: SwashoColors.neutral300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxChecked: {
    backgroundColor: SwashoColors.primary600,
    borderColor: SwashoColors.primary600,
  },
  boxDisabled: {
    opacity: 0.5,
  },
  checkMark: {
    color: SwashoColors.surface,
    fontFamily: 'Poppins_600SemiBold',
  },
  label: {
    color: SwashoColors.neutral900,
    flexShrink: 1,
  },
});
