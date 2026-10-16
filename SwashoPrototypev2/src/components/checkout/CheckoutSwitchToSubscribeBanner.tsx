import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';

import { TransferHorizontalIcon } from './checkout-banner-icons';
import { SubscribeBannerBackground } from './SubscribeBannerBackground';

/** Figma 3346:13492 artboard height; notch extends above the 32px text row. */
const BANNER_ART_HEIGHT = 43.618;
const NOTCH_OVERFLOW_TOP = 11;

type CheckoutSwitchToSubscribeBannerProps = {
  onPress: () => void;
  scale: number;
};

/** Figma 3346:13491 — switch to subscribe callout above schedule card. */
export function CheckoutSwitchToSubscribeBanner({ onPress, scale }: CheckoutSwitchToSubscribeBannerProps) {
  const artHeight = BANNER_ART_HEIGHT * scale;
  const notchOverflow = NOTCH_OVERFLOW_TOP * scale;
  const [layoutWidth, setLayoutWidth] = useState(0);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Switch to Subscribe and Save with Exclusive Pricing"
      onPress={onPress}
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        if (width > 0 && width !== layoutWidth) {
          setLayoutWidth(width);
        }
      }}
      style={({ pressed }) => [
        styles.wrap,
        {
          marginTop: -notchOverflow,
          paddingTop: notchOverflow,
          minHeight: artHeight - notchOverflow,
          paddingHorizontal: 4.458 * scale,
          paddingBottom: 2.229 * scale,
          opacity: pressed ? 0.92 : 1,
          ...(Platform.OS === 'web' ? ({ overflow: 'visible' } as const) : null),
        },
      ]}>
      {layoutWidth > 0 ? (
        <View
          pointerEvents="none"
          style={[
            styles.bannerBg,
            {
              top: -notchOverflow,
              height: artHeight,
            },
          ]}>
          <SubscribeBannerBackground width={layoutWidth} height={artHeight} />
        </View>
      ) : null}
      <View
        style={[
          styles.content,
          {
            gap: 5.573 * scale,
            paddingHorizontal: 8 * scale,
            paddingTop: 4 * scale,
            minHeight: 32 * scale,
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
    position: 'absolute',
    left: 0,
    right: 0,
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
