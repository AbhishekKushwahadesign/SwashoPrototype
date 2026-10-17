import { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';

import { TransferHorizontalIcon } from './checkout-banner-icons';
import { SubscribeBannerBackground } from './SubscribeBannerBackground';
import { useSubscribeBannerAccentAnimation } from './useSubscribeBannerAccentAnimation';

/** Figma 3346:13491 layout frame + 3346:13492 bubble art. */
const FRAME_HEIGHT = 32;
const BUBBLE_LEFT = 8.469;
const BUBBLE_TOP = -11.102;
const BUBBLE_WIDTH = 372.311;
const BUBBLE_HEIGHT = 43.617;
const ICON_LEFT = 15.761;
const CONTENT_GAP = 5.573;

type CheckoutSwitchToSubscribeBannerProps = {
  scale: number;
  /** Bumps when the checkout screen regains focus so accent animation can replay once. */
  accentAnimationSession: number;
  onSwitchToSubscribe?: () => void;
};

/** Figma 3346:13491 — nudge toward Subscribe tab (segment remains primary control). */
export function CheckoutSwitchToSubscribeBanner({
  scale,
  accentAnimationSession,
  onSwitchToSubscribe,
}: CheckoutSwitchToSubscribeBannerProps) {
  const { accentProgress, isStaticAccent } = useSubscribeBannerAccentAnimation(accentAnimationSession);
  const frameHeight = FRAME_HEIGHT * scale;
  const bubbleTop = BUBBLE_TOP * scale;
  const bubbleWidth = BUBBLE_WIDTH * scale;
  const bubbleHeight = BUBBLE_HEIGHT * scale;
  const bubbleLeft = BUBBLE_LEFT * scale;
  const [layoutWidth, setLayoutWidth] = useState(0);
  const overflowVisible = Platform.OS === 'web' ? ('visible' as const) : undefined;

  const root = (
    <View
      importantForAccessibility="yes"
      onLayout={(event) => {
        const { width } = event.nativeEvent.layout;
        if (width > 0 && width !== layoutWidth) {
          setLayoutWidth(width);
        }
      }}
      style={[
        styles.outer,
        {
          height: frameHeight,
          overflow: overflowVisible,
        },
      ]}>
      {layoutWidth > 0 ? (
        <View
          pointerEvents="none"
          style={[
            styles.bannerBg,
            {
              top: bubbleTop,
              left: bubbleLeft,
              width: bubbleWidth,
              height: bubbleHeight,
              overflow: overflowVisible,
            },
          ]}>
          <SubscribeBannerBackground
            width={bubbleWidth}
            height={bubbleHeight}
            scale={scale}
            accentProgress={accentProgress}
            isStaticAccent={isStaticAccent}
          />
        </View>
      ) : null}
      <View
        pointerEvents={onSwitchToSubscribe ? 'auto' : 'none'}
        style={[
          styles.content,
          {
            height: frameHeight,
            gap: CONTENT_GAP * scale,
            paddingLeft: ICON_LEFT * scale,
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
    </View>
  );

  if (!onSwitchToSubscribe) {
    return root;
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Switch to Subscribe and save with exclusive pricing"
      onPress={onSwitchToSubscribe}
      style={({ pressed }) => [{ opacity: pressed ? 0.92 : 1 }]}>
      {root}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  outer: {
    width: '100%',
    justifyContent: 'center',
    zIndex: 2,
  },
  bannerBg: {
    position: 'absolute',
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
