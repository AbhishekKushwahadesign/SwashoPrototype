import { Dimensions, Platform } from 'react-native';

import { ScreenHeight, ScreenWidth } from '@/constants/swasho-tokens';

export function useScreenScale() {
  const windowWidth = Dimensions.get('window').width;
  const contentWidth = Math.min(windowWidth, ScreenWidth);
  const scale = contentWidth / ScreenWidth;
  const contentHeight = ScreenHeight * scale;
  return { scale, contentWidth, contentHeight };
}

export function s(value: number, scale: number) {
  return value * scale;
}

export function useSafeTopInset(insetsTop: number) {
  return Platform.OS === 'web' ? 0 : insetsTop;
}
