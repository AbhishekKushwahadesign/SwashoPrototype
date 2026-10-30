import { Pressable, StyleSheet } from 'react-native';

import { SwashoRadii } from '@/constants/swasho-tokens';

import { ServiceSelectionRemoveIcon } from './service-selection-icons';

type ServiceSelectionStickyDeleteButtonProps = {
  scale: number;
  onPress: () => void;
  accessibilityLabel?: string;
};

/** Figma 59340:4907 — 30×30 sticky footer remove control. */
export function ServiceSelectionStickyDeleteButton({
  scale,
  onPress,
  accessibilityLabel = 'Remove service from cart',
}: ServiceSelectionStickyDeleteButtonProps) {
  const size = 30 * scale;
  const iconSize = 20 * scale;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[
        styles.button,
        {
          width: size,
          height: size,
          borderRadius: SwashoRadii.md * scale,
        },
      ]}>
      <ServiceSelectionRemoveIcon width={iconSize} height={iconSize} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
