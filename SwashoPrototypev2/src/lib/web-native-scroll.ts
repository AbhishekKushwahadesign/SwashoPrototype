import { Platform, type ViewStyle } from 'react-native';

/**
 * RN Web: route wheel and pointer-drag through one overflow scroll box (no touch-only momentum).
 * Merge into vertical ScrollView `style` on web alongside flex/minHeight as needed.
 */
export const webNativeVerticalScrollStyle: ViewStyle = Platform.select({
  web: {
    overflowY: 'auto',
    overscrollBehaviorY: 'contain',
    // RN Web sets `touch` by default on ScrollView; `auto` matches desktop wheel feel.
    WebkitOverflowScrolling: 'auto',
  },
  default: {},
}) ?? {};
