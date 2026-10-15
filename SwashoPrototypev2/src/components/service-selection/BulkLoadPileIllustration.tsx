import { Image } from 'expo-image';
import { Platform, StyleSheet, View } from 'react-native';

import type { BulkLoadTierId } from '@/lib/bulk-load-tiers';

const PASTEL_FOLDED_CLOTHING_STACKS = require('@/assets/images/service-selection/bulk-load/pastel-folded-clothing-stacks.png');

const FRAME_WIDTH = 57.215;

type PileCrop = {
  frameHeight: number;
  imageWidthPercent: number;
  imageHeightPercent: number;
  imageLeftPercent: number;
  imageTopPercent: number;
};

const PILE_CROPS: Record<BulkLoadTierId, PileCrop> = {
  small: {
    frameHeight: 43.43,
    imageWidthPercent: 299.48,
    imageHeightPercent: 131.51,
    imageLeftPercent: 0,
    imageTopPercent: -29.54,
  },
  medium: {
    frameHeight: 49.99,
    imageWidthPercent: 299.48,
    imageHeightPercent: 114.25,
    imageLeftPercent: -96.54,
    imageTopPercent: -14.25,
  },
  large: {
    frameHeight: 52.308,
    imageWidthPercent: 299.48,
    imageHeightPercent: 109.19,
    imageLeftPercent: -195.93,
    imageTopPercent: -5.62,
  },
};

type BulkLoadPileIllustrationProps = {
  tier: BulkLoadTierId;
  scale: number;
};

/** Sprite crop of pastel folded clothing stacks per load tier (Figma 58921:2545). */
export function BulkLoadPileIllustration({ tier, scale }: BulkLoadPileIllustrationProps) {
  const crop = PILE_CROPS[tier];
  const frameWidth = FRAME_WIDTH * scale;
  const frameHeight = crop.frameHeight * scale;
  const imageWidth = frameWidth * (crop.imageWidthPercent / 100);
  const imageHeight = frameHeight * (crop.imageHeightPercent / 100);
  const imageLeft = frameWidth * (crop.imageLeftPercent / 100);
  const imageTop = frameHeight * (crop.imageTopPercent / 100);

  const imageStyle = [
    styles.sprite,
    {
      width: imageWidth,
      height: imageHeight,
      left: imageLeft,
      top: imageTop,
    },
    Platform.OS === 'web' ? styles.spriteWeb : null,
  ];

  return (
    <View style={[styles.frame, { width: frameWidth, height: frameHeight }]}>
      <Image
        source={PASTEL_FOLDED_CLOTHING_STACKS}
        style={imageStyle}
        contentFit="fill"
        accessibilityIgnoresInvertColors
      />
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    overflow: 'hidden',
    flexShrink: 0,
    position: 'relative',
  },
  sprite: {
    position: 'absolute',
  },
  // RN Web defaults img to max-width:100%, which collapses sprite crops to an empty sliver.
  spriteWeb: {
    maxWidth: 'none',
    maxHeight: 'none',
  },
});
