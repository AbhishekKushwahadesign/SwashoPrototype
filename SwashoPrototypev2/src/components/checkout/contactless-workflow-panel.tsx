import { Image, StyleSheet, View } from 'react-native';

/** Figma sprite `Laundry App Workflow Panels 1` (59127:5994). */
const workflowPanelsSource = require('@/assets/checkout/contactless-workflow-panels.png');

export type ContactlessWorkflowPanelVariant = 'upload' | 'pickup' | 'sort';

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

type ContactlessWorkflowPanelProps = {
  variant: ContactlessWorkflowPanelVariant;
  scale: number;
};

/** Cropped workflow illustration only — arcs are sheet-level in the modal. */
export function ContactlessWorkflowPanel({ variant, scale }: ContactlessWorkflowPanelProps) {
  const spec = PANEL_FRAME[variant];
  const frameWidth = spec.frameWidth * scale;
  const frameHeight = spec.frameHeight * scale;
  const imageWidth = frameWidth * spec.imgWidthRatio;
  const imageHeight = frameHeight * spec.imgHeightRatio;
  const imageLeft = frameWidth * spec.leftRatio;
  const imageTop = frameHeight * spec.topRatio;

  return (
    <View style={[styles.frame, { width: frameWidth, height: frameHeight }]}>
      <Image
        source={workflowPanelsSource}
        style={{
          position: 'absolute',
          width: imageWidth,
          height: imageHeight,
          left: imageLeft,
          top: imageTop,
        }}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
  },
});
