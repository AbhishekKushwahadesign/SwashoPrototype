import { useId } from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

/** Figma 59380:3997 — radial lavender wash from bottom-left of delivering card. */
const DESIGN_WIDTH = 396;
const DESIGN_HEIGHT = 425.22;
/** Matches SwashoRadii.lg on the delivering card (Figma 12px at 396pt width). */
const DESIGN_CORNER_RADIUS = 12;

type PastOrderDeliveringCardBackgroundProps = {
  width: number;
  height: number;
};

export function PastOrderDeliveringCardBackground({
  width,
  height,
}: PastOrderDeliveringCardBackgroundProps) {
  const instanceId = useId().replace(/:/g, '');
  const gradientId = `pastOrderDeliveringCard-${instanceId}`;

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${DESIGN_WIDTH} ${DESIGN_HEIGHT}`}
      preserveAspectRatio="none"
      style={StyleSheet.absoluteFill}>
      <Defs>
        <RadialGradient
          id={gradientId}
          cx={0}
          cy={0}
          r={10}
          gradientUnits="userSpaceOnUse"
          gradientTransform="matrix(30.458 -24.38 22.782 36.155 8.1464 456.41)">
          <Stop offset="0" stopColor="#d8ccff" />
          <Stop offset="0.29272" stopColor="#ffffff" />
        </RadialGradient>
      </Defs>
      <Rect
        x={0}
        y={0}
        width={DESIGN_WIDTH}
        height={DESIGN_HEIGHT}
        rx={DESIGN_CORNER_RADIUS}
        ry={DESIGN_CORNER_RADIUS}
        fill={`url(#${gradientId})`}
      />
    </Svg>
  );
}
