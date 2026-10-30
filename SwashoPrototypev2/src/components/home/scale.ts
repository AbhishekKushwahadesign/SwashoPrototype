import { Dimensions, Platform } from 'react-native';

import { ScreenHeight, ScreenWidth } from '@/constants/swasho-tokens';

export function useScreenScale() {
  const { width: windowWidth, height: windowHeight } = Dimensions.get('window');
  const contentWidth = Math.min(windowWidth, ScreenWidth);
  const scale = contentWidth / ScreenWidth;
  const figmaFrameHeight = ScreenHeight * scale;
  // Web preview panes are often shorter than the 412×1000 Figma frame — clamp so bottom nav isn’t clipped.
  const contentHeight =
    Platform.OS === 'web' ? Math.min(figmaFrameHeight, windowHeight) : figmaFrameHeight;
  return { scale, contentWidth, contentHeight };
}

export function s(value: number, scale: number) {
  return value * scale;
}

export function useSafeTopInset(insetsTop: number) {
  return Platform.OS === 'web' ? 0 : insetsTop;
}
