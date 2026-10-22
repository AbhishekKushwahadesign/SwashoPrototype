import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Path, Stop } from 'react-native-svg';

import { SwashoColors } from '@/constants/swasho-tokens';

/** Figma 59121:3490/3491/3493 — `colors/Primary/600` stroke on arc shell. */
export const CONTACTLESS_WORKFLOW_ARC_STROKE = SwashoColors.primary600;

export type ContactlessWorkflowPanelVariant = 'upload' | 'pickup' | 'sort';

type ArcCurveSide = 'left' | 'right';

/** Figma arc corner on curved end (59121:3490 / 3493 / 3491). */
const ARC_CORNER_RADIUS = 60;

/**
 * Arc frames in Figma are anchored with the straight edge toward the screen edge:
 * upload/sort right edge @ sheet x=444.5; pickup left edge @ sheet x=-60.669.
 * Values below are panel-relative (arc origin minus illustration frame origin).
 */
const PANEL_ARC: Record<
  ContactlessWorkflowPanelVariant,
  { width: number; height: number; left: number; top: number; curveSide: ArcCurveSide }
> = {
  /** 59121:3490; panel 59127:5954 @ sheet (237, 72) → left = 219.18 − 237. */
  upload: { width: 225.320_312_5, height: 122, left: -17.820_312_5, top: -1, curveSide: 'left' },
  /** 59121:3491; panel 59127:5956 @ sheet (30.804, 216.679). */
  pickup: { width: 237.168_945_312_5, height: 122, left: -91.473_632_812_5, top: -4.874, curveSide: 'right' },
  /** 59121:3493; panel 59127:5958 @ sheet (241, 361.679) → left = 219.18 − 241. */
  sort: { width: 225.320_312_5, height: 122, left: -21.820_312_5, top: -6.539, curveSide: 'left' },
};

/** Figma 59127:5954 / 5956 / 5958 — 1× PNG exports (single scene each). */
const PANEL_IMAGE: Record<
  ContactlessWorkflowPanelVariant,
  { source: ImageSourcePropType; frameWidth: number; frameHeight: number }
> = {
  upload: {
    source: require('@/assets/checkout/contactless-workflow-upload.png'),
    frameWidth: 126.082,
    frameHeight: 116.679,
  },
  pickup: {
    source: require('@/assets/checkout/contactless-workflow-pickup.png'),
    frameWidth: 119.196,
    frameHeight: 117,
  },
  sort: {
    source: require('@/assets/checkout/contactless-workflow-sort.png'),
    frameWidth: 120.944,
    frameHeight: 109.933,
  },
};

const ARC_GRADIENT = {
  colors: ['rgba(233, 232, 255, 0.11)', 'rgba(213, 212, 255, 0.11)'] as const,
  start: { x: 0.425, y: 0.5 },
  end: { x: 1, y: 0.5 },
};

/** Asymmetric D-panel path — one end uses 60px corner arcs (Figma rounded-*-[60px]). */
function buildArcPath(width: number, height: number, radius: number, curveSide: ArcCurveSide): string {
  const r = radius;
  const w = width;
  const h = height;
  if (curveSide === 'left') {
    return [
      `M ${w} 0`,
      `H ${r}`,
      `A ${r} ${r} 0 0 0 0 ${r}`,
      `V ${h - r}`,
      `A ${r} ${r} 0 0 0 ${r} ${h}`,
      `H ${w}`,
      `V 0`,
      'Z',
    ].join(' ');
  }
  return [
    'M 0 0',
    `H ${w - r}`,
    `A ${r} ${r} 0 0 1 ${w} ${r}`,
    `V ${h - r}`,
    `A ${r} ${r} 0 0 1 ${w - r} ${h}`,
    'H 0',
    'V 0',
    'Z',
  ].join(' ');
}

type ContactlessWorkflowPanelProps = {
  variant: ContactlessWorkflowPanelVariant;
  scale: number;
};

function WorkflowPanelArc({
  variant,
  scale,
}: {
  variant: ContactlessWorkflowPanelVariant;
  scale: number;
}) {
  const arc = PANEL_ARC[variant];
  const width = arc.width * scale;
  const height = arc.height * scale;
  const path = buildArcPath(arc.width, arc.height, ARC_CORNER_RADIUS, arc.curveSide);
  const gradientId = `contactless-arc-fill-${variant}`;
  const gradientStart = arc.curveSide === 'left' ? { x: '57.5%', y: '50%' } : { x: '42.5%', y: '50%' };
  const gradientEnd = arc.curveSide === 'left' ? { x: '0%', y: '50%' } : { x: '100%', y: '50%' };

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: arc.left * scale,
        top: arc.top * scale,
        width,
        height,
        zIndex: 0,
        overflow: 'visible',
      }}>
      <Svg width={width} height={height} viewBox={`0 0 ${arc.width} ${arc.height}`}>
        <Defs>
          <SvgLinearGradient id={gradientId} x1={gradientStart.x} y1={gradientStart.y} x2={gradientEnd.x} y2={gradientEnd.y}>
            <Stop offset="42.505%" stopColor={ARC_GRADIENT.colors[0]} />
            <Stop offset="100%" stopColor={ARC_GRADIENT.colors[1]} />
          </SvgLinearGradient>
        </Defs>
        <Path
          d={path}
          fill={`url(#${gradientId})`}
          stroke={CONTACTLESS_WORKFLOW_ARC_STROKE}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      </Svg>
    </View>
  );
}

/** Extra px below step block so step 3 D-arc stroke is not clipped above footer. */
export const CONTACTLESS_WORKFLOW_STEPS_BOTTOM_BLEED = 12;

/** Single-step illustration + Figma arc stroke. Row height matches Figma panel frame; arcs overflow. */
export function ContactlessWorkflowPanel({ variant, scale }: ContactlessWorkflowPanelProps) {
  const { source, frameWidth, frameHeight } = PANEL_IMAGE[variant];
  const width = frameWidth * scale;
  const height = frameHeight * scale;

  return (
    <View style={[styles.panelSlot, { width, height }]}>
      <WorkflowPanelArc variant={variant} scale={scale} />
      <View style={[styles.imageClip, { width, height }]}>
        <Image
          source={source}
          style={styles.imageFill}
          resizeMode="contain"
          accessibilityIgnoresInvertColors
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  panelSlot: {
    position: 'relative',
    overflow: 'visible',
    flexShrink: 0,
  },
  imageClip: {
    overflow: 'hidden',
    zIndex: 1,
    backgroundColor: 'transparent',
  },
  imageFill: {
    width: '100%',
    height: '100%',
  },
});
