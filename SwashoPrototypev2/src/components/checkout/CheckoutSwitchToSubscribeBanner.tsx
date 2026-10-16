import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';

import { TransferHorizontalIcon } from './checkout-banner-icons';
import { SubscribeBannerBackground } from './SubscribeBannerBackground';

type CheckoutSwitchToSubscribeBannerProps = {
  onPress: () => void;
  scale: number;
};

/** Figma 3346:13491 — switch to subscribe callout above schedule card. */
export function CheckoutSwitchToSubscribeBanner({ onPress, scale }: CheckoutSwitchToSubscribeBannerProps) {
  const bannerHeight = 43.618 * scale;
  const borderRadius = 5.573 * scale;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Switch to Subscribe and Save with Exclusive Pricing"
      onPress={onPress}
      style={({ pressed }) => [
        styles.wrap,
        {
          minHeight: bannerHeight,
          borderRadius,
          paddingHorizontal: 4.458 * scale,
          paddingVertical: 2.229 * scale,
          opacity: pressed ? 0.92 : 1,
        },
      ]}>
      <View pointerEvents="none" style={[styles.bannerBg, { height: bannerHeight }]}>
        <SubscribeBannerBackground width="100%" height={bannerHeight} />
      </View>
      <View
        style={[
          styles.content,
          {
            gap: 5.573 * scale,
            paddingHorizontal: 8 * scale,
            paddingTop: 6 * scale,
            minHeight: bannerHeight - 4.458 * scale,
          },
        ]}>
        <TransferHorizontalIcon width={24 * scale} height={24 * scale} />
        <Text
          style={[
            searchFont('semibold'),
            styles.label,
            {
              fontSize: 12 * scale,
              lineHeight: 20 * scale,
              letterSpacing: 0.5 * scale,
              flex: 1,
            },
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
    overflow: 'visible',
  },
  bannerBg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  label: {
    color: SwashoColors.primary600,
  },
});
