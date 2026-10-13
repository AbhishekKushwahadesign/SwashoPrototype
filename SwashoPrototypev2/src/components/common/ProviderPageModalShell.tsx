import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { SwashoColors } from '@/constants/swasho-tokens';

type ProviderPageModalShellProps = {
  onDismiss: () => void;
  children: ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
};

/**
 * Full-screen overlay for modals opened from the provider page: provider stays visible
 * underneath with a dark scrim (Figma 3346:11182 “Black tint”), sheet content on top.
 */
export function ProviderPageModalShell({
  onDismiss,
  children,
  contentStyle,
}: ProviderPageModalShellProps) {
  return (
    <View style={styles.root}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss"
        onPress={onDismiss}
        style={styles.scrim}
      />
      <View pointerEvents="box-none" style={[styles.contentLayer, contentStyle]}>
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    backgroundColor: 'transparent',
  },
  scrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: SwashoColors.modalScrim,
    zIndex: 0,
  },
  contentLayer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
});
