import { Pressable, StyleSheet, View } from 'react-native';

import { SheetCloseIcon } from './service-selection-icons';

type ServiceSelectionSheetChromeProps = {
  scale: number;
  onClose: () => void;
};

/** Close chip above the service selection sheet (delete lives in sticky footer). */
export function ServiceSelectionSheetChrome({ scale, onClose }: ServiceSelectionSheetChromeProps) {
  const chipSize = 35 * scale;
  const iconSize = 20 * scale;

  return (
    <View style={[styles.row, { marginBottom: 8 * scale }]}>
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
