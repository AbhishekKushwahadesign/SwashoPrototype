import { Image } from 'expo-image';
import { useState } from 'react';
import {
  StyleSheet,
  View,
  type ImageSourcePropType,
  type LayoutChangeEvent,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import type { SwashoAiDemoFlatLayCrop } from '@/constants/swasho-ai-demo-scenarios';

type DemoFlatLayImageProps = {
  source: ImageSourcePropType;
  crop: SwashoAiDemoFlatLayCrop;
  style?: StyleProp<ViewStyle>;
  borderRadius?: number;
};

export function DemoFlatLayImage({ source, crop, style, borderRadius = 0 }: DemoFlatLayImageProps) {
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };

  const imageWidth = layout.width * (crop.imageWidthPercent / 100);
  const marginLeft = layout.width * (crop.offsetLeftPercent / 100);

  return (
    <View
      onLayout={onLayout}
      style={[styles.clip, style, borderRadius ? { borderRadius, overflow: 'hidden' } : null]}>
      {layout.width > 0 ? (
        <Image
          source={source}
          style={{
            width: imageWidth,
            height: layout.height,
            marginLeft,
          }}
          contentFit="cover"
        />
      ) : null}
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
