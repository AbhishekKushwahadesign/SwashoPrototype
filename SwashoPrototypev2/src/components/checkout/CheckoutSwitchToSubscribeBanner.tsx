import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';

const bannerBg = require('@/assets/images/checkout/subscribe-banner-bg.svg');
const transferIcon = require('@/assets/images/checkout/transfer-horizontal.svg');

type CheckoutSwitchToSubscribeBannerProps = {
  onPress: () => void;
  scale: number;
};

export function CheckoutSwitchToSubscribeBanner({ onPress, scale }: CheckoutSwitchToSubscribeBannerProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Switch to Subscribe and Save with Exclusive Pricing"
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrap,
        {
          minHeight: 32 * scale,
          borderRadius: 6 * scale,
          paddingHorizontal: 4 * scale,
          paddingVertical: 2 * scale,
          opacity: pressed ? 0.92 : 1,
        },
      ]}>
      <Image
        source={bannerBg}
        style={[styles.bannerBg, { height: 44 * scale }]}
        contentFit="fill"
        accessibilityIgnoresInvertColors
      />
      <View style={[styles.content, { gap: 6 * scale, paddingHorizontal: 8 * scale }]}>
        <Image
          source={transferIcon}
          style={{ width: 24 * scale, height: 24 * scale }}
          contentFit="contain"
          accessibilityIgnoresInvertColors
        />
        <Text
          style={[
            searchFont('semibold'),
            styles.label,
            { fontSize: 12 * scale, lineHeight: 20 * scale, letterSpacing: 0.5 * scale, flex: 1 },
          ]}>
          Switch to Subscribe & Save with Exclusive Pricing
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bannerBg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    color: SwashoColors.primary600,
  },
});
