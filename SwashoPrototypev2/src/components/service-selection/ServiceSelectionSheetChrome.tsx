import { Pressable, StyleSheet, View } from 'react-native';

import { SheetCloseIcon, SheetDeleteShieldCrossIcon } from './service-selection-icons';

type ServiceSelectionSheetChromeProps = {
  scale: number;
  onClose: () => void;
  onDelete: () => void;
};

/** Figma 59340:4775 — close + delete chips above the service selection sheet. */
export function ServiceSelectionSheetChrome({
  scale,
  onClose,
  onDelete,
}: ServiceSelectionSheetChromeProps) {
  const chipSize = 35 * scale;
  const iconSize = 20 * scale;

  return (
    <View style={[styles.row, { gap: 12 * scale, marginBottom: 8 * scale }]}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Close"
        onPress={onClose}
        style={[
          styles.chip,
          {
            width: chipSize,
            height: chipSize,
            borderRadius: 999,
          },
        ]}>
        <SheetCloseIcon width={iconSize} height={iconSize} />
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Remove service from cart"
        onPress={onDelete}
        style={[
          styles.chip,
          {
            width: chipSize,
            height: chipSize,
            borderRadius: 999,
          },
        ]}>
        <SheetDeleteShieldCrossIcon width={iconSize} height={iconSize} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chip: {
    backgroundColor: 'rgba(236, 236, 236, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
