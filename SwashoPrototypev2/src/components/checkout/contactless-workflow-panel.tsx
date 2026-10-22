import { LinearGradient } from 'expo-linear-gradient';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

import { SwashoColors } from '@/constants/swasho-tokens';

/** Figma 59121:3490/3491/3493 — `colors/Primary/600` stroke on arc shell. */
export const CONTACTLESS_WORKFLOW_ARC_STROKE = SwashoColors.primary600;

export type ContactlessWorkflowPanelVariant = 'upload' | 'pickup' | 'sort';

type ArcSide = 'left' | 'right';

/** Figma arc corner on curved edge (59121:3490 / 3493 / 3491). */
const ARC_CORNER_RADIUS = 60;

/** Sheet-absolute arc frames → panel-relative (412 sheet, content @ x=24 for steps). */
const PANEL_ARC: Record<
  ContactlessWorkflowPanelVariant,
  { width: number; height: number; left: number; top: number; side: ArcSide }
> = {
  /** 59121:3490 @ sheet (444.5, 71); panel 59127:5954 @ sheet (237, 72). */
  upload: { width: 225.320_312_5, height: 122, left: 207.5, top: -1, side: 'right' },
  /** 59121:3491 @ sheet (-60.669, 211.806); panel 59127:5956 @ (30.804, 216.679). */
  pickup: { width: 237.168_945_312_5, height: 122, left: -91.474, top: -4.874, side: 'left' },
  /** 59121:3493 @ sheet (444.5, 355.141); panel 59127:5958 @ (241, 361.679). */
  sort: { width: 225.320_312_5, height: 122, left: 203.5, top: -6.539, side: 'right' },
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
  const radius = ARC_CORNER_RADIUS * scale;
  const roundedLeft = arc.side === 'left';
  const roundedRight = arc.side === 'right';

  const cornerRadii = {
    borderTopLeftRadius: roundedLeft ? radius : 0,
    borderBottomLeftRadius: roundedLeft ? radius : 0,
    borderTopRightRadius: roundedRight ? radius : 0,
    borderBottomRightRadius: roundedRight ? radius : 0,
  };

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
        borderColor: CONTACTLESS_WORKFLOW_ARC_STROKE,
        zIndex: 0,
        ...cornerRadii,
        overflow: 'visible',
      }}>
      <View style={[StyleSheet.absoluteFill, cornerRadii, { overflow: 'hidden' }]}>
        <LinearGradient
          colors={[...ARC_GRADIENT.colors]}
          start={roundedLeft ? { x: 0.575, y: 0.5 } : ARC_GRADIENT.start}
          end={roundedLeft ? { x: 0, y: 0.5 } : ARC_GRADIENT.end}
          style={StyleSheet.absoluteFill}
        />
      </View>
    </View>
  );
}

/** Extra px below arc box so 60px corner + 1px stroke are not clipped on web (step 3 sort). */
const ARC_BOTTOM_STROKE_BLEED = 12;

const WORKFLOW_PANEL_VARIANTS: ContactlessWorkflowPanelVariant[] = ['upload', 'pickup', 'sort'];

function arcVerticalBleed(variant: ContactlessWorkflowPanelVariant) {
  const arc = PANEL_ARC[variant];
  const { frameHeight } = PANEL_IMAGE[variant];
  return {
    top: Math.max(0, -arc.top),
    bottom: Math.max(0, arc.top + arc.height - frameHeight) + ARC_BOTTOM_STROKE_BLEED,
  };
}

/** Per-step slot grows by top+bottom bleed vs Figma frame height; sum for modal steps block. */
export function contactlessWorkflowPanelSlotExtra(variant: ContactlessWorkflowPanelVariant) {
  const bleed = arcVerticalBleed(variant);
  return bleed.top + bleed.bottom;
}

export const CONTACTLESS_WORKFLOW_STEPS_SLOT_EXTRA = WORKFLOW_PANEL_VARIANTS.reduce(
  (sum, variant) => sum + contactlessWorkflowPanelSlotExtra(variant),
  0,
);

/** Single-step illustration + Figma arc stroke. Slot height includes arc vertical bleed. */
export function ContactlessWorkflowPanel({ variant, scale }: ContactlessWorkflowPanelProps) {
  const { source, frameWidth, frameHeight } = PANEL_IMAGE[variant];
  const width = frameWidth * scale;
  const height = frameHeight * scale;
  const bleed = arcVerticalBleed(variant);
  const slotHeight = (frameHeight + bleed.top + bleed.bottom) * scale;

  return (
    <View style={[styles.panelSlot, { width, height: slotHeight }]}>
      <View style={[styles.panelFrame, { width, height, marginTop: bleed.top * scale }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  panelSlot: {
    position: 'relative',
    overflow: 'visible',
    flexShrink: 0,
  },
  panelFrame: {
    position: 'relative',
    overflow: 'visible',
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
