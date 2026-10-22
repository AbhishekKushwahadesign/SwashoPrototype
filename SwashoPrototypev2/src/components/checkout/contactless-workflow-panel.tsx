import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, View } from 'react-native';

import { SwashoColors } from '@/constants/swasho-tokens';

/** Figma sprite `Laundry App Workflow Panels 1` (59127:5994) — illustration crop only. */
const workflowPanelsSource = require('@/assets/checkout/contactless-workflow-panels.png');

export type ContactlessWorkflowPanelVariant = 'upload' | 'pickup' | 'sort';

/** Figma 59121:3490 / 3491 / 3493 — arc shell behind each step panel (sheet coords → panel-relative). */
const PANEL_ARC: Record<
  ContactlessWorkflowPanelVariant,
  { width: number; height: number; left: number; top: number }
> = {
  upload: { width: 225.320_312_5, height: 122, left: -17.82, top: -1 },
  pickup: { width: 237.168_945_312_5, height: 122, left: -91.474, top: -4.874 },
  sort: { width: 225.320_312_5, height: 122, left: -21.82, top: -6.539 },
};

const PANEL_FRAME: Record<
  ContactlessWorkflowPanelVariant,
  { frameWidth: number; frameHeight: number; imgWidthRatio: number; imgHeightRatio: number; leftRatio: number; topRatio: number }
> = {
  upload: {
    frameWidth: 126.082,
    frameHeight: 116.679,
    imgWidthRatio: 2.9166,
    imgHeightRatio: 1.1999,
    leftRatio: 0,
    topRatio: -0.0999,
  },
  pickup: {
    frameWidth: 119.196,
    frameHeight: 117,
    imgWidthRatio: 3.0851,
    imgHeightRatio: 1.1966,
    leftRatio: -1.0425,
    topRatio: -0.0983,
  },
  sort: {
    frameWidth: 120.944,
    frameHeight: 109.933,
    imgWidthRatio: 3.0405,
    imgHeightRatio: 1.2735,
    leftRatio: -2.0405,
    topRatio: -0.1368,
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

function WorkflowPanelArc({ variant, scale }: { variant: ContactlessWorkflowPanelVariant; scale: number }) {
  const arc = PANEL_ARC[variant];
  const width = arc.width * scale;
  const height = arc.height * scale;
  const radius = 60 * scale;

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
        borderTopRightRadius: radius,
        borderBottomRightRadius: radius,
        overflow: 'hidden',
      }}>
      <LinearGradient colors={[...ARC_GRADIENT.colors]} start={ARC_GRADIENT.start} end={ARC_GRADIENT.end} style={StyleSheet.absoluteFill} />
    </View>
  );
}

/** Cropped workflow illustration with Figma arc fill + primary600 stroke behind the sprite. */
export function ContactlessWorkflowPanel({ variant, scale }: ContactlessWorkflowPanelProps) {
  const spec = PANEL_FRAME[variant];
  const frameWidth = spec.frameWidth * scale;
  const frameHeight = spec.frameHeight * scale;
  const imageWidth = frameWidth * spec.imgWidthRatio;
  const imageHeight = frameHeight * spec.imgHeightRatio;
  const imageLeft = frameWidth * spec.leftRatio;
  const imageTop = frameHeight * spec.topRatio;
  const arc = PANEL_ARC[variant];
  const bleedLeft = Math.max(0, -arc.left * scale);
  const bleedTop = Math.max(0, -arc.top * scale);
  const bleedRight = Math.max(0, (arc.left + arc.width - spec.frameWidth) * scale);
  const bleedBottom = Math.max(0, (arc.top + arc.height - spec.frameHeight) * scale);

  return (
    <View
      style={{
        width: frameWidth + bleedLeft + bleedRight,
        height: frameHeight + bleedTop + bleedBottom,
        marginLeft: -bleedLeft,
        marginTop: -bleedTop,
        marginRight: -bleedRight,
        marginBottom: -bleedBottom,
        overflow: 'visible',
      }}>
      <View style={[styles.frame, { width: frameWidth, height: frameHeight, marginLeft: bleedLeft, marginTop: bleedTop }]}>
        <WorkflowPanelArc variant={variant} scale={scale} />
        <Image
          source={workflowPanelsSource}
          style={{
            position: 'absolute',
            width: imageWidth,
            height: imageHeight,
            left: imageLeft,
            top: imageTop,
            zIndex: 1,
          }}
          resizeMode="cover"
          accessibilityIgnoresInvertColors
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    position: 'relative',
    overflow: 'visible',
  },
});
