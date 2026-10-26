import { Image } from 'expo-image';
import { StyleSheet, View, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';

import type { SwashoAiDemoFlatLayCrop } from '@/constants/swasho-ai-demo-scenarios';

type DemoFlatLayImageProps = {
  source: ImageSourcePropType;
  crop: SwashoAiDemoFlatLayCrop;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
};

export function DemoFlatLayImage({ source, crop, style, borderRadius = 0 }: DemoFlatLayImageProps) {
  return (
    <View style={[styles.clip, style, borderRadius ? { borderRadius, overflow: 'hidden' } : null]}>
      <Image
        source={source}
        style={{
          width: `${crop.imageWidthPercent}%`,
          height: '100%',
          marginLeft: `${crop.offsetLeftPercent}%`,
        }}
        contentFit="cover"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    overflow: 'hidden',
    width: '100%',
    height: '100%',
  },
});
