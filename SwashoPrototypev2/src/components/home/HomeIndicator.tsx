import { StyleSheet, View, type ViewStyle } from 'react-native';

import { SwashoColors } from '@/constants/swasho-tokens';

/** Figma home-indicator bar height @ 412pt width. */
export const HOME_INDICATOR_BAR_HEIGHT = 24;

/** Pin the 24px home-indicator strip to the bottom of the screen frame. */
export const homeIndicatorScreenBottomStyle: ViewStyle = {
  position: 'absolute',
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 30,
  backgroundColor: SwashoColors.surface,
  alignItems: 'center',
  justifyContent: 'center',
};

type HomeIndicatorProps = {
  scale: number;
};

export function HomeIndicator({ scale }: HomeIndicatorProps) {
  return (
    <View style={[styles.container, { height: HOME_INDICATOR_BAR_HEIGHT * scale }]}>
      <View
        style={{
          width: 137.33 * scale,
          height: 6 * scale,
          borderRadius: 20 * scale,
          backgroundColor: SwashoColors.homeIndicator,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SwashoColors.surface,
  },
});
