import { Pressable, StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';

type ServiceRadioProps = {
  selected: boolean;
  disabled?: boolean;
  label?: string;
  onSelect?: () => void;
  scale: number;
};

export function ServiceRadio({ selected, disabled = false, label, onSelect, scale }: ServiceRadioProps) {
  const handlePress = () => {
    if (!disabled) {
      onSelect?.();
    }
  };

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected, disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.row,
        { gap: 8 * scale, opacity: pressed && !disabled ? 0.8 : 1 },
      ]}>
      <View
        style={[
          styles.outer,
          selected && styles.outerSelected,
          disabled && styles.disabled,
          {
            width: 20 * scale,
            height: 20 * scale,
            borderRadius: 10 * scale,
          },
        ]}>
        {selected ? (
          <View
            style={[
              styles.inner,
              {
                width: 10 * scale,
                height: 10 * scale,
                borderRadius: 5 * scale,
              },
            ]}
          />
        ) : null}
      </View>
      {label ? (
        <Text
          style={[
            styles.label,
            searchFont('medium'),
            { fontSize: 14 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
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
  outer: {
    borderWidth: 1.5,
    borderColor: SwashoColors.neutral300,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SwashoColors.surface,
  },
  outerSelected: {
    borderColor: SwashoColors.primary600,
  },
  inner: {
    backgroundColor: SwashoColors.primary600,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: SwashoColors.neutral900,
    flexShrink: 1,
  },
});
