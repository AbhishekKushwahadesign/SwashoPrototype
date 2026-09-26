import { Image, ImageContentFit, ImageContentPosition } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { FigmaShadows, figmaShadow } from './figma-shadows';

const CONTENT_WIDTH = 87.514;
const LABEL_LINE_HEIGHT = 10;

export type ServiceTileLayout = {
  label: string;
  image: number;
  imageWidth: number;
  imageHeight: number;
  contentGap: number;
  labelWidth: number;
  contentTop?: number;
  contentCenterOffsetY?: number;
  contentFit?: ImageContentFit;
  contentPosition?: ImageContentPosition;
};

type ServiceTileProps = ServiceTileLayout & {
  scale: number;
};

export function ServiceTile({
  label,
  image,
  imageWidth,
  imageHeight,
  contentGap,
  labelWidth,
  contentTop,
  contentCenterOffsetY,
  contentFit = 'fill',
  contentPosition = 'bottom',
  scale,
}: ServiceTileProps) {
  const tileSize = 83.79 * scale;
  const contentWidth = CONTENT_WIDTH * scale;
  const contentHeight = (imageHeight + contentGap + LABEL_LINE_HEIGHT) * scale;

  const resolvedTop =
    contentCenterOffsetY != null
      ? (tileSize / 2 - contentCenterOffsetY * scale - contentHeight / 2)
      : (contentTop ?? 0) * scale;

  return (
    <View
      style={[
        styles.tile,
        {
          width: tileSize,
          height: tileSize,
          borderRadius: SwashoRadii.lg * scale,
          ...figmaShadow(FigmaShadows.serviceTile, scale),
        },
      ]}>
      <View
        style={[
          styles.content,
          {
            width: contentWidth,
            top: resolvedTop,
            left: (tileSize - contentWidth) / 2,
            gap: contentGap * scale,
          },
        ]}>
        <View
          style={{
            width: imageWidth * scale,
            height: imageHeight * scale,
            overflow: 'hidden',
          }}>
          <Image
            source={image}
            style={{ width: '100%', height: '100%' }}
            contentFit={contentFit}
            contentPosition={contentPosition}
          />
        </View>
        <Text
          style={[
            styles.label,
            {
              fontSize: 10 * scale,
              lineHeight: LABEL_LINE_HEIGHT * scale,
              width: labelWidth * scale,
            },
          ]}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: SwashoColors.surface,
    overflow: 'visible',
  },
  content: {
    position: 'absolute',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 0.4655,
  },
});
