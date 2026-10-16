import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';

import { TransferHorizontalIcon } from './checkout-banner-icons';
import { SubscribeBannerBackground } from './SubscribeBannerBackground';

/** Figma 3346:13491 layout frame + 3346:13492 bubble art. */
const FRAME_HEIGHT = 32;
const BUBBLE_TOP = -11.102;
const BUBBLE_HEIGHT = 43.617;
/** Figma: ~20px from segment to banner row, notch rises into gap above the 32px row */
const GAP_COMPENSATION = 20 - FRAME_HEIGHT + BUBBLE_HEIGHT + BUBBLE_TOP;

type CheckoutSwitchToSubscribeBannerProps = {
  onPress: () => void;
  scale: number;
};

/** Figma 3346:13491 — switch to subscribe callout above schedule card. */
export function CheckoutSwitchToSubscribeBanner({ onPress, scale }: CheckoutSwitchToSubscribeBannerProps) {
  const frameHeight = FRAME_HEIGHT * scale;
  const bubbleTop = BUBBLE_TOP * scale;
  const bubbleHeight = BUBBLE_HEIGHT * scale;
  const notchLift = -BUBBLE_TOP * scale;
  const [layoutWidth, setLayoutWidth] = useState(0);
  const overflowVisible = Platform.OS === 'web' ? ('visible' as const) : undefined;

  return (
    <View
      style={[
        styles.outer,
        {
          marginTop: -notchLift,
          marginBottom: GAP_COMPENSATION * scale,
          overflow: overflowVisible,
        },
      ]}>
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
          styles.pressable,
          {
            height: frameHeight,
            opacity: pressed ? 0.92 : 1,
            overflow: overflowVisible,
            borderWidth: 0,
          },
        ]}>
        {layoutWidth > 0 ? (
          <View
            pointerEvents="none"
            style={[
              styles.bannerBg,
              {
                top: bubbleTop,
                height: bubbleHeight,
                overflow: overflowVisible,
              },
            ]}>
            <SubscribeBannerBackground width={layoutWidth} height={bubbleHeight} />
          </View>
        ) : null}
        <View
          style={[
            styles.content,
            {
              height: frameHeight,
              gap: 5.573 * scale,
              paddingLeft: 11.76 * scale,
              paddingRight: 8 * scale,
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
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    zIndex: 2,
  },
  pressable: {
    width: '100%',
    justifyContent: 'center',
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
