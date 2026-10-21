import Svg, { Circle, Ellipse, Path, Rect, G } from 'react-native-svg';

import { SwashoColors } from '@/constants/swasho-tokens';

type IllustrationProps = {
  width: number;
  height: number;
};

const PURPLE = SwashoColors.primary600;
const PURPLE_SOFT = SwashoColors.primary100;
const PURPLE_MID = SwashoColors.primary200;
const NEUTRAL = SwashoColors.neutral400;
const NEUTRAL_DARK = SwashoColors.neutral600;
const NEUTRAL_LIGHT = SwashoColors.neutral200;

/** Step 1 — bag + phone with garment thumbnails */
export function ContactlessUploadPhotosIllustration({ width, height }: IllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 120 96" fill="none">
      <Rect x="8" y="28" width="44" height="52" rx="8" fill={PURPLE_SOFT} stroke={PURPLE} strokeWidth="2" />
      <Path d="M14 36h32M14 44h24" stroke={PURPLE_MID} strokeWidth="2" strokeLinecap="round" />
      <Path d="M30 28v-6a6 6 0 0 1 12 0v6" stroke={PURPLE} strokeWidth="2" strokeLinecap="round" />
      <Rect x="62" y="16" width="48" height="72" rx="10" fill="#fff" stroke={PURPLE} strokeWidth="2" />
      <Rect x="68" y="24" width="36" height="28" rx="4" fill={PURPLE_SOFT} />
      <Rect x="72" y="28" width="12" height="12" rx="2" fill={PURPLE} />
      <Rect x="88" y="28" width="12" height="12" rx="2" fill={PURPLE_MID} />
      <Rect x="72" y="44" width="12" height="6" rx="1" fill={NEUTRAL_LIGHT} />
      <Rect x="88" y="44" width="12" height="6" rx="1" fill={NEUTRAL_LIGHT} />
      <Rect x="68" y="58" width="36" height="22" rx="4" fill={PURPLE_SOFT} />
      <Circle cx="78" cy="69" r="5" fill={PURPLE} />
      <Rect x="86" y="64" width="14" height="10" rx="2" fill={PURPLE_MID} />
    </Svg>
  );
}

/** Step 2 — bag at doorstep, partner collecting without customer */
export function ContactlessDoorstepPickupIllustration({ width, height }: IllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 120 96" fill="none">
      <Rect x="4" y="52" width="72" height="36" rx="4" fill={NEUTRAL_LIGHT} />
      <Rect x="4" y="40" width="72" height="14" fill={NEUTRAL} opacity={0.35} />
      <Rect x="18" y="58" width="36" height="44" rx="6" fill={PURPLE_SOFT} stroke={PURPLE} strokeWidth="2" />
      <Path d="M24 66h24M24 74h16" stroke={PURPLE_MID} strokeWidth="2" strokeLinecap="round" />
      <Path d="M36 58v-5a5 5 0 0 1 10 0v5" stroke={PURPLE} strokeWidth="2" strokeLinecap="round" />
      <G opacity={0.9}>
        <Circle cx="92" cy="34" r="10" fill={PURPLE_SOFT} stroke={PURPLE} strokeWidth="2" />
        <Path
          d="M82 78c2-14 8-22 18-24 10 2 16 10 18 24"
          fill={PURPLE}
          stroke={PURPLE}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <Path d="M88 52h12l4 10H84l4-10z" fill={PURPLE_MID} />
        <Path d="M78 88h28" stroke={NEUTRAL_DARK} strokeWidth="2.5" strokeLinecap="round" />
      </G>
      <Path d="M96 70l8 8" stroke={PURPLE} strokeWidth="2" strokeLinecap="round" />
      <Ellipse cx="56" cy="88" rx="20" ry="3" fill={NEUTRAL_LIGHT} />
    </Svg>
  );
}

/** Step 3 — pro sorting garments with reference photo on device */
export function ContactlessSortProcessIllustration({ width, height }: IllustrationProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 120 96" fill="none">
      <Rect x="6" y="62" width="108" height="8" rx="2" fill={NEUTRAL_LIGHT} />
      <Rect x="10" y="48" width="28" height="18" rx="3" fill={PURPLE} />
      <Rect x="42" y="50" width="24" height="16" rx="3" fill={PURPLE_MID} />
      <Rect x="70" y="52" width="22" height="14" rx="3" fill={PURPLE_SOFT} stroke={PURPLE} strokeWidth="1.5" />
      <Circle cx="34" cy="32" r="11" fill={PURPLE_SOFT} stroke={PURPLE} strokeWidth="2" />
      <Path
        d="M22 78c3-16 10-24 22-26 12 2 19 10 22 26"
        fill={PURPLE}
        stroke={PURPLE}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <Rect x="78" y="18" width="34" height="46" rx="6" fill="#fff" stroke={PURPLE} strokeWidth="2" />
      <Rect x="82" y="24" width="26" height="20" rx="3" fill={PURPLE_SOFT} />
      <Rect x="86" y="28" width="10" height="10" rx="2" fill={PURPLE} />
      <Rect x="98" y="28" width="6" height="10" rx="1" fill={PURPLE_MID} />
      <Path d="M86 50h18" stroke={NEUTRAL_LIGHT} strokeWidth="2" strokeLinecap="round" />
      <Path d="M28 58l6-8 6 6 8-10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}
