import { LinearGradient } from 'expo-linear-gradient';
import { Image, StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';

/** Figma sprite `Laundry App Workflow Panels 1` — cropped per step in 59127:5994. */
const workflowPanelsSource = require('@/assets/checkout/contactless-workflow-panels.png');

type PanelVariant = 'upload' | 'pickup' | 'sort';

const PANEL_FRAME: Record<
  PanelVariant,
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

type ArcSide = 'left' | 'right';

type ContactlessStepIllustrationClusterProps = {
  variant: PanelVariant;
  number: number;
  scale: number;
  /** Which side the capsule arc hugs (behind the illustration). */
  arcSide: ArcSide;
  /** Side the numbered badge sits on — toward the step copy. */
  badgeSide: ArcSide;
};

export function ContactlessStepIllustrationCluster({
  variant,
  number,
  scale,
  arcSide,
  badgeSide,
}: ContactlessStepIllustrationClusterProps) {
  const spec = PANEL_FRAME[variant];
  const frameWidth = spec.frameWidth * scale;
  const frameHeight = spec.frameHeight * scale;
  const imageWidth = frameWidth * spec.imgWidthRatio;
  const imageHeight = frameHeight * spec.imgHeightRatio;
  const imageLeft = frameWidth * spec.leftRatio;
  const imageTop = frameHeight * spec.topRatio;

  const clusterWidth = Math.max(frameWidth + 24 * scale, 140 * scale);
  const clusterHeight = 122 * scale;
  const arcWidth = 92 * scale;
  const badgeSize = 20 * scale;

  const arcRadius = 60 * scale;
  const arcBorderStyle =
    arcSide === 'right'
      ? {
          borderTopRightRadius: arcRadius,
          borderBottomRightRadius: arcRadius,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          right: 0,
        }
      : {
          borderTopLeftRadius: arcRadius,
          borderBottomLeftRadius: arcRadius,
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          left: 0,
        };

  const badgePosition =
    badgeSide === 'left'
      ? { left: Math.max(0, clusterWidth - frameWidth - badgeSize * 0.5) }
      : { right: Math.max(0, clusterWidth - frameWidth - badgeSize * 0.5) };

  return (
    <View style={[styles.cluster, { width: clusterWidth, height: clusterHeight }]}>
      <LinearGradient
        colors={['rgba(233, 232, 255, 0.22)', 'rgba(213, 212, 255, 0.22)']}
        start={{ x: arcSide === 'right' ? 0.42 : 0, y: 0.5 }}
        end={{ x: arcSide === 'right' ? 1 : 0.58, y: 0.5 }}
        style={[
          styles.arc,
          arcBorderStyle,
          {
            position: 'absolute',
            width: arcWidth,
            height: clusterHeight,
            top: 0,
            borderWidth: 1,
            borderColor: SwashoColors.primary600,
          },
        ]}
      />

      <View
        style={[
          styles.panelFrame,
          {
            width: frameWidth,
            height: frameHeight,
            alignSelf: arcSide === 'right' ? 'flex-end' : 'flex-start',
            marginTop: (clusterHeight - frameHeight) / 2,
          },
        ]}>
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

      <View
        style={[
          styles.badge,
          badgePosition,
          {
            width: badgeSize,
            minHeight: badgeSize,
            borderRadius: 16 * scale,
            top: clusterHeight / 2 - badgeSize / 2,
          },
        ]}>
        <Text
          style={[
            searchFont('semibold'),
            styles.badgeText,
            { fontSize: 15 * scale, lineHeight: 20 * scale, letterSpacing: 0.2 * scale },
          ]}>
          {number}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cluster: {
    position: 'relative',
    justifyContent: 'center',
  },
  arc: {
    overflow: 'hidden',
  },
  panelFrame: {
    overflow: 'hidden',
    zIndex: 1,
  },
  badge: {
    position: 'absolute',
    zIndex: 2,
    borderWidth: 1,
    borderColor: SwashoColors.primary600,
    backgroundColor: SwashoColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: SwashoColors.primary600,
    textAlign: 'center',
  },
});
