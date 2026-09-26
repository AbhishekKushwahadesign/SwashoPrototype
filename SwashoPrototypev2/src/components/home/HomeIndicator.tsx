import { StyleSheet, View } from 'react-native';

import { SwashoColors } from '@/constants/swasho-tokens';

type HomeIndicatorProps = {
  scale: number;
};

export function HomeIndicator({ scale }: HomeIndicatorProps) {
  return (
    <View style={[styles.container, { height: 24 * scale }]}>
      <View
        style={{
          width: 137.33 * scale,
          height: 6 * scale,
          borderRadius: 20 * scale,
          backgroundColor: SwashoColors.homeIndicator,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
