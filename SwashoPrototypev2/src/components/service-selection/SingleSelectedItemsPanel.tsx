import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

type SingleSelectedItemsPanelProps = {
  scale: number;
  children: ReactNode;
};

/** Added single-service rows above the browse catalog (Figma bifurcation below `3458:6189`). */
export function SingleSelectedItemsPanel({ scale, children }: SingleSelectedItemsPanelProps) {
  return (
    <View
      style={[
        styles.root,
        {
          gap: 20 * scale,
          paddingVertical: 8 * scale,
          borderRadius: SwashoRadii.md * scale,
          paddingHorizontal: 8 * scale,
        },
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: SwashoColors.primary50,
  },
});
