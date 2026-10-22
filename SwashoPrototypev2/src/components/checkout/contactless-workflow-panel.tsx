import { LinearGradient } from 'expo-linear-gradient';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

import { SwashoColors } from '@/constants/swasho-tokens';

export type ContactlessWorkflowPanelVariant = 'upload' | 'pickup' | 'sort';

type ArcSide = 'left' | 'right';

/** Figma 59121:3490 / 3493 (right D-arc) and 59121:3491 (left D-arc) — panel-relative px @412. */
const PANEL_ARC: Record<
  ContactlessWorkflowPanelVariant,
  { width: number; height: number; left: number; top: number; side: ArcSide }
> = {
  upload: { width: 225.320_312_5, height: 122, left: -17.82, top: -1, side: 'right' },
  pickup: { width: 237.168_945_312_5, height: 122, left: -91.474, top: -4.874, side: 'left' },
  sort: { width: 225.320_312_5, height: 122, left: -21.82, top: -6.539, side: 'right' },
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
  const radius = 60 * scale;
  const roundedLeft = arc.side === 'left';
  const roundedRight = arc.side === 'right';

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: arc.left * scale,
        top: arc.top * scale,
        width,
        height,
        borderWidth: 1,
        borderColor: SwashoColors.primary600,
        borderTopLeftRadius: roundedLeft ? radius : 0,
        borderBottomLeftRadius: roundedLeft ? radius : 0,
        borderTopRightRadius: roundedRight ? radius : 0,
        borderBottomRightRadius: roundedRight ? radius : 0,
        overflow: 'hidden',
      }}>
      <LinearGradient
        colors={[...ARC_GRADIENT.colors]}
        start={roundedLeft ? { x: 0.575, y: 0.5 } : ARC_GRADIENT.start}
        end={roundedLeft ? { x: 0, y: 0.5 } : ARC_GRADIENT.end}
        style={StyleSheet.absoluteFill}
      />
    </View>
  );
}

/** Single-step illustration + Figma arc (primary600 stroke). Layout width = panel frame only. */
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
