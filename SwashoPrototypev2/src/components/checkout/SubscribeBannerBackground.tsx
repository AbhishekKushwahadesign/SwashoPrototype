import { useId } from 'react';
import Svg, { Defs, LinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';

const FILL_PATH =
  'M0 17.3084C0 12.8902 3.58172 9.30844 8 9.30844H269.945C271.703 9.30844 273.428 8.83331 274.938 7.93329L286.271 1.17871C288.783 -0.318763 291.896 -0.394193 294.478 0.979814L307.981 8.16533C309.391 8.9159 310.965 9.30844 312.562 9.30844H364.311C368.729 9.30844 372.311 12.8902 372.311 17.3084V34.3836C372.311 38.8018 368.729 42.3836 364.311 42.3836H7.99999C3.58171 42.3836 0 38.8018 0 34.3836V17.3084Z';

const STROKE_PATH =
  'M307.981 8.16533L294.478 0.979814C291.896 -0.394193 288.783 -0.318763 286.271 1.17871L274.938 7.93329C273.428 8.8333 271.703 9.30844 269.945 9.30844H8C3.58172 9.30844 0 12.8902 0 17.3084V34.3836C0 38.8018 3.58171 42.3836 7.99999 42.3836H364.311C368.729 42.3836 372.311 38.8018 372.311 34.3836V17.3084C372.311 12.8902 368.729 9.30844 364.311 9.30844H312.562C310.965 9.30844 309.391 8.9159 307.981 8.16533Z';

const DESIGN_VIEW_W = 372.311;
const DESIGN_VIEW_H = 42.3836;
const DESIGN_STROKE = 2.7865;
const PURPLE = '#5D30F7';
const LAVENDER = '#E4DDFE';
const MASK_LAVENDER = '#ECE7FE';
/** Top-notch tip X in design coordinates (Figma 3346:13492 export). */
const NOTCH_CENTER_X = 290.466 / DESIGN_VIEW_W;

type SubscribeBannerBackgroundProps = {
  width: number;
  height: number;
  scale: number;
  accentProgress: number;
  isStaticAccent: boolean;
};

/** Lavender mask grows from both ends toward the notch, revealing static purple only at the center. */
function convergenceMaskBounds(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  const leftBound = p * NOTCH_CENTER_X;
  const rightBound = 1 - p * (1 - NOTCH_CENTER_X);
  return { leftBound, rightBound };
}

/** Figma 3346:13492 — speech-bubble banner fill + radial gradient stroke. */
export function SubscribeBannerBackground({
  width,
  height,
  scale,
  accentProgress,
  isStaticAccent,
}: SubscribeBannerBackgroundProps) {
  const strokeWidth = DESIGN_STROKE * scale;
  const instanceId = useId().replace(/:/g, '');
  const radialId = `checkoutSubscribeBannerStroke-${instanceId}`;
  const maskId = `checkoutSubscribeBannerMask-${instanceId}`;

  const showConvergenceMask = !isStaticAccent && accentProgress > 0;
  const { leftBound, rightBound } = convergenceMaskBounds(accentProgress);
  const epsilon = 0.0001;

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${DESIGN_VIEW_W} ${DESIGN_VIEW_H}`}>
      <Defs>
        <RadialGradient
          id={radialId}
          cx={0}
          cy={0}
          r={1}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(0.0134731 20.0673 -118.116 0.515821 290.466 0.507697)">
          <Stop offset="0.261408" stopColor={PURPLE} />
          <Stop offset="1" stopColor={LAVENDER} />
        </RadialGradient>
        <LinearGradient
          id={maskId}
          x1={0}
          y1={0}
          x2={DESIGN_VIEW_W}
          y2={0}
          gradientUnits="userSpaceOnUse">
          <Stop offset="0" stopColor={MASK_LAVENDER} />
          <Stop offset={String(leftBound)} stopColor={MASK_LAVENDER} />
          <Stop offset={String(Math.min(1, leftBound + epsilon))} stopColor={MASK_LAVENDER} stopOpacity={0} />
          <Stop offset={String(Math.max(0, rightBound - epsilon))} stopColor={MASK_LAVENDER} stopOpacity={0} />
          <Stop offset={String(rightBound)} stopColor={MASK_LAVENDER} />
          <Stop offset="1" stopColor={MASK_LAVENDER} />
        </LinearGradient>
      </Defs>
      <Path d={FILL_PATH} fill={MASK_LAVENDER} />
      <Path d={STROKE_PATH} fill="none" stroke={`url(#${radialId})`} strokeWidth={strokeWidth} />
      {showConvergenceMask ? (
        <Path
          d={STROKE_PATH}
          fill="none"
          stroke={`url(#${maskId})`}
          strokeWidth={strokeWidth}
        />
      ) : null}
    </Svg>
  );
}
