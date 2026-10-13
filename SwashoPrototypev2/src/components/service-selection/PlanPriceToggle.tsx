import { Pressable, StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';

type PlanPriceToggleProps = {
  enabled: boolean;
  disabled?: boolean;
  showLabel?: boolean;
  onChange?: (enabled: boolean) => void;
  scale: number;
};

export function PlanPriceToggle({
  enabled,
  disabled = false,
  showLabel = true,
  onChange,
  scale,
}: PlanPriceToggleProps) {
  const handlePress = () => {
    if (!disabled) {
      onChange?.(!enabled);
    }
  };

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: enabled, disabled }}
      accessibilityLabel="Plan price"
      disabled={disabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.row,
        { gap: 6 * scale, opacity: pressed && !disabled ? 0.8 : 1 },
      ]}>
      <View
        style={[
          styles.track,
          enabled && styles.trackOn,
          disabled && styles.disabled,
          {
            width: 43 * scale,
            height: 23 * scale,
            borderRadius: 12 * scale,
            padding: 2 * scale,
          },
        ]}>
        <View
          style={[
            styles.thumb,
            enabled && styles.thumbOn,
            {
              width: 19 * scale,
              height: 19 * scale,
              borderRadius: 10 * scale,
              transform: [{ translateX: enabled ? 18 * scale : 0 }],
            },
          ]}
        />
      </View>
      {showLabel ? (
        <Text
          style={[
            searchFont('medium'),
            styles.label,
            { fontSize: 12 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
          ]}>
          Plan price
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
  track: {
    backgroundColor: SwashoColors.neutral200,
    justifyContent: 'center',
  },
  trackOn: {
    backgroundColor: SwashoColors.primary600,
  },
  thumb: {
    backgroundColor: SwashoColors.neutral600,
  },
  thumbOn: {
    backgroundColor: SwashoColors.surface,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    color: SwashoColors.darkText,
  },
});
