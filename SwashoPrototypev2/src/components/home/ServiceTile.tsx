import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { FigmaShadows, figmaShadow } from './figma-shadows';

type ServiceTileProps = {
  label: string;
  image: number;
  imageWidth: number;
  imageHeight: number;
  scale: number;
};

export function ServiceTile({ label, image, imageWidth, imageHeight, scale }: ServiceTileProps) {
  const tileSize = 83.79 * scale;

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
      <View style={[styles.content, { gap: 9 * scale }]}>
        <View style={[{ width: imageWidth * scale, height: imageHeight * scale }, figmaShadow(FigmaShadows.serviceImage, scale)]}>
          <Image
            source={image}
            style={{ width: imageWidth * scale, height: imageHeight * scale }}
            contentFit="contain"
            contentPosition="bottom"
          />
        </View>
        <Text style={[styles.label, { fontSize: 10 * scale, lineHeight: 10 * scale }]}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    backgroundColor: SwashoColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 0.4655,
  },
});
