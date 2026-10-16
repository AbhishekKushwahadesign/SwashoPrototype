import Svg, { Line } from 'react-native-svg';

import { SwashoColors } from '@/constants/swasho-tokens';

/** Figma one-time checkout Line 22 / Line 23 — solid #dcdcdc, full card width (~376.5px at 1×). */
const DESIGN_WIDTH = 377;

type CheckoutSectionDividerProps = {
  width: number;
  scale: number;
};

export function CheckoutSectionDivider({ width, scale }: CheckoutSectionDividerProps) {
  const height = Math.max(1, scale);

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${DESIGN_WIDTH} 1`}
      preserveAspectRatio="none">
      <Line
        x1={0}
        y1={0.5}
        x2={DESIGN_WIDTH}
        y2={0.5}
        stroke={SwashoColors.neutral200}
        strokeWidth={1}
        strokeLinecap="round"
      />
    </Svg>
  );
}
