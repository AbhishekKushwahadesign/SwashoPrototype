import { Platform, type ViewStyle } from 'react-native';

type ShadowSpec = {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread?: number;
  color: string;
  opacity: number;
  inset?: boolean;
};

function rgba(hex: string, opacity: number) {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function toBoxShadow(spec: ShadowSpec, scale = 1) {
  const spread = (spec.spread ?? 0) * scale;
  const blur = spec.blur * scale;
  const x = spec.offsetX * scale;
  const y = spec.offsetY * scale;
  const color = spec.color.startsWith('rgba') ? spec.color : rgba(spec.color, spec.opacity);
  const inset = spec.inset ? 'inset ' : '';
  return `${inset}${x}px ${y}px ${blur}px ${spread}px ${color}`;
}

export function figmaShadow(spec: ShadowSpec, scale = 1): ViewStyle {
  if (Platform.OS === 'web') {
    return {
      boxShadow: toBoxShadow(spec, scale),
    } as ViewStyle;
  }

  const offsetX = spec.offsetX * scale;
  const offsetY = spec.offsetY * scale;
  const shadowRadius = spec.blur * scale;
  const shadowColor = spec.color.startsWith('rgba') ? spec.color : spec.color;
  const shadowOpacity = spec.color.startsWith('rgba') ? 1 : spec.opacity;

  return {
    shadowColor,
    shadowOffset: { width: offsetX, height: offsetY },
    shadowOpacity,
    shadowRadius,
    elevation: Math.max(1, Math.round(spec.blur / 2)),
  };
}

export const FigmaShadows = {
  screen: { offsetX: 0, offsetY: 4, blur: 4, color: '#000000', opacity: 0.25 },
  search: { offsetX: 0, offsetY: 2, blur: 2, color: '#5d30f7', opacity: 0.2 },
  /** Service selection ADD / quantity controls (Figma drop-shadow 0 2px 2px @ 19%). */
  addButton: { offsetX: 0, offsetY: 2, blur: 2, color: '#5d30f7', opacity: 0.19 },
  providerCard: { offsetX: 0, offsetY: 0, blur: 2, color: '#000000', opacity: 0.2 },
  providerCardBody: { offsetX: 0, offsetY: -1, blur: 4, color: '#000000', opacity: 0.25 },
  recommendationCard: { offsetX: 0, offsetY: 0, blur: 2.976, color: '#000000', opacity: 0.19 },
  serviceTile: { offsetX: 0, offsetY: 2, blur: 1.862, color: '#000000', opacity: 0.19 },
  bulkCard: { offsetX: 0, offsetY: 2, blur: 4, color: '#000000', opacity: 0.25 },
  orderCard: { offsetX: 0, offsetY: 0, blur: 3.72, color: '#000000', opacity: 0.19 },
  navPill: { offsetX: 0, offsetY: 0, blur: 4, color: '#000000', opacity: 0.19 },
  outForDelivery: { offsetX: 0, offsetY: 0, blur: 6, color: '#5d30f7', opacity: 1 },
  promiseChip: { offsetX: 0, offsetY: -1.5, blur: 0, color: '#000000', opacity: 0.25 },
  sheet: { offsetX: 0, offsetY: -2, blur: 2, color: '#000000', opacity: 0.1 },
  selectedNavCapsule: {
    offsetX: -5,
    offsetY: 5,
    blur: 4.177,
    color: '#000000',
    opacity: 0.25,
    inset: true,
  },
  promiseStepInner: { offsetX: 0, offsetY: -4, blur: 3, color: '#5d30f7', opacity: 0.3, inset: true },
  serviceImage: { offsetX: 0, offsetY: 1.764, blur: 8.026, color: '#000000', opacity: 0.25 },
  pickupMark: { offsetX: 0, offsetY: 0, blur: 2, color: '#000000', opacity: 0.35 },
  underLaundryMark: { offsetX: 0, offsetY: 0, blur: 1.9, color: '#000000', opacity: 0.45 },
  deliveredMark: { offsetX: 0, offsetY: 0, blur: 2, color: '#000000', opacity: 0.75 },
  providerResultCard: { offsetX: 0, offsetY: 0, blur: 8, color: '#000000', opacity: 0.1 },
  /** Figma node 3346:8468 — Provider Page header card */
  providerPageHeader: { offsetX: 0, offsetY: 8, blur: 5, color: '#000000', opacity: 0.1 },
  /** Compact sticky nav when laundry name is visible (shadow below bar). */
  providerStickyNav: { offsetX: 0, offsetY: 2, blur: 4, color: '#000000', opacity: 0.12 },
  /** Figma 3346:8891 — grid toggle thumb drop shadow (-2, 2, blur 2 @ 19%). */
  gridToggleThumb: { offsetX: -2, offsetY: 2, blur: 2, color: '#000000', opacity: 0.19 },
  /** Figma 3346:13477 — checkout one-time / subscribe segment track */
  checkoutSegmentTrack: { offsetX: 0, offsetY: 2, blur: 4, color: '#000000', opacity: 0.15, inset: true },
  /** Active segment pill drop shadow (Figma 3346:13477 box shadow) */
  checkoutSegmentActive: { offsetX: -4.191, offsetY: 4.191, blur: 4.191, color: '#000000', opacity: 0.25 },
  /** Active one-time pill inner shadow */
  checkoutSegmentActiveInset: {
    offsetX: -6,
    offsetY: 6,
    blur: 4,
    color: '#000000',
    opacity: 0.25,
    inset: true,
  },
} as const satisfies Record<string, ShadowSpec>;

/** CSS drop-shadow (Figma effect on clipped rounded headers). Falls back to box shadow on native. */
export function figmaDropShadow(spec: ShadowSpec, scale = 1): ViewStyle {
  if (Platform.OS === 'web') {
    const x = spec.offsetX * scale;
    const y = spec.offsetY * scale;
    const blur = spec.blur * scale;
    const color = spec.color.startsWith('rgba') ? spec.color : rgba(spec.color, spec.opacity);
    return {
      filter: `drop-shadow(${x}px ${y}px ${blur}px ${color})`,
    } as ViewStyle;
  }
  return figmaShadow(spec, scale);
}
