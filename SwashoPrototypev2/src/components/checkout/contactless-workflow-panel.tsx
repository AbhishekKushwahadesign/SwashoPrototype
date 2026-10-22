import { LinearGradient } from 'expo-linear-gradient';
import { Image, ImageSourcePropType, StyleSheet, View } from 'react-native';

import { SwashoColors } from '@/constants/swasho-tokens';

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

/** Figma panel nodes 59127:5954 / 5956 / 5958 — exported @2x PNGs (no shared sprite crop). */
const PANEL_IMAGE: Record<
  ContactlessWorkflowPanelVariant,
  { source: ImageSourcePropType; frameWidth: number; frameHeight: number }
> = {
  upload: {
    source: require('@/assets/checkout/contactless-workflow-upload@2x.png'),
    frameWidth: 126.082,
    frameHeight: 116.679,
  },
  pickup: {
    source: require('@/assets/checkout/contactless-workflow-pickup@2x.png'),
    frameWidth: 119.196,
    frameHeight: 117,
  },
  sort: {
    source: require('@/assets/checkout/contactless-workflow-sort@2x.png'),
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

/** Single-step illustration export + Figma arc fill and primary600 stroke. */
export function ContactlessWorkflowPanel({ variant, scale }: ContactlessWorkflowPanelProps) {
  const { source, frameWidth, frameHeight } = PANEL_IMAGE[variant];
  const width = frameWidth * scale;
  const height = frameHeight * scale;
  const arc = PANEL_ARC[variant];
  const bleedLeft = Math.max(0, -arc.left * scale);
  const bleedTop = Math.max(0, -arc.top * scale);
  const bleedRight = Math.max(0, (arc.left + arc.width - frameWidth) * scale);
  const bleedBottom = Math.max(0, (arc.top + arc.height - frameHeight) * scale);

  return (
    <View
      style={{
        width: width + bleedLeft + bleedRight,
        height: height + bleedTop + bleedBottom,
        marginLeft: -bleedLeft,
        marginTop: -bleedTop,
        marginRight: -bleedRight,
        marginBottom: -bleedBottom,
        overflow: 'visible',
      }}>
      <View
        style={[
          styles.frame,
          {
            width,
            height,
            marginLeft: bleedLeft,
            marginTop: bleedTop,
            overflow: 'hidden',
          },
        ]}>
        <WorkflowPanelArc variant={variant} scale={scale} />
        <Image
          source={source}
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width,
            height,
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
  },
});
