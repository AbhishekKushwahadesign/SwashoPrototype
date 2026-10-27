import { Pressable, StyleSheet, Text, View } from 'react-native';

import AiDemoPickupNudgeArrowRight from '@/assets/checkout/ai-demo-pickup-nudge-arrow-right.svg';
import AiDemoPickupNudgeBg from '@/assets/checkout/ai-demo-pickup-nudge-bg.svg';
import AiDemoPickupNudgeSparkle from '@/assets/checkout/ai-demo-pickup-nudge-sparkle.svg';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';
import {
  CHECKOUT_AI_DEMO_PICKUP_NUDGE_HEIGHT,
  CHECKOUT_AI_DEMO_PICKUP_NUDGE_WIDTH,
} from '@/lib/checkout-figma-layout';

/** Figma 59232:3709 — headline and Change row insets. */
const HEADLINE_LEFT = 15.77;
const HEADLINE_TOP = 7.98;
const CHANGE_ROW_LEFT = 12;
const CHANGE_ROW_TOP = 31;
const SPARKLE_RESERVE = 44;

type CheckoutAiDemoPickupNudgeProps = {
  scale: number;
  cardWidth: number;
  onPress: () => void;
  onDismiss: () => void;
};

/** Shown above basket on review when arriving from Swasho AI Go to Cart (Figma 59232:3709). */
export function CheckoutAiDemoPickupNudge({
  scale,
  cardWidth,
  onPress,
  onDismiss,
}: CheckoutAiDemoPickupNudgeProps) {
  const width = cardWidth > 0 ? cardWidth : CHECKOUT_AI_DEMO_PICKUP_NUDGE_WIDTH * scale;
  const height = CHECKOUT_AI_DEMO_PICKUP_NUDGE_HEIGHT * scale;
  const headlineMaxWidth = width - (HEADLINE_LEFT + SPARKLE_RESERVE) * scale;

  return (
    <View style={[styles.root, { width, height }]}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <AiDemoPickupNudgeBg width={width} height={height} />
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Change pickup schedule"
        onPress={onPress}
        style={({ pressed }) => [
          StyleSheet.absoluteFill,
          styles.scheduleHitArea,
          {
            paddingRight: SPARKLE_RESERVE * scale,
            opacity: pressed ? 0.92 : 1,
          },
        ]}>
        <Text
          style={[
            searchFont('semibold'),
            styles.headline,
            {
              position: 'absolute',
              left: HEADLINE_LEFT * scale,
              top: HEADLINE_TOP * scale,
              maxWidth: headlineMaxWidth,
              fontSize: 14 * scale,
              lineHeight: 20 * scale,
              letterSpacing: 0.5 * scale,
            },
          ]}>
          We’ve selected the earliest available pickup
        </Text>

        <View
          style={[
            styles.changeRow,
            {
              position: 'absolute',
              left: CHANGE_ROW_LEFT * scale,
              top: CHANGE_ROW_TOP * scale,
              gap: 6 * scale,
            },
          ]}>
          <View
            style={[
              styles.changeButton,
              {
                minWidth: 60 * scale,
                paddingHorizontal: 4 * scale,
                height: 18 * scale,
              },
            ]}>
            <Text
              style={[
                searchFont('medium'),
                styles.changeLabel,
                {
                  fontSize: 14 * scale,
                  lineHeight: 12 * scale,
                  letterSpacing: 0.5 * scale,
                },
              ]}>
              Change
            </Text>
          </View>
          <AiDemoPickupNudgeArrowRight width={20 * scale} height={20 * scale} />
        </View>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss pickup reminder"
        onPress={onDismiss}
        hitSlop={8 * scale}
        style={({ pressed }) => [
          styles.sparkleWrap,
          {
            right: 6 * scale,
            top: (height - 28.279 * scale) / 2,
            width: 28.279 * scale,
            height: 28.279 * scale,
            opacity: pressed ? 0.88 : 1,
          },
        ]}>
        <View
          style={[
            styles.sparkleRotate,
            {
              width: 20 * scale,
              height: 20 * scale,
              borderRadius: 11 * scale,
              transform: [{ rotate: '43.88deg' }],
            },
          ]}>
          <AiDemoPickupNudgeSparkle
            width={40 * scale}
            height={40 * scale}
            style={{
              position: 'absolute',
              left: -10 * scale,
              top: -10 * scale,
            }}
          />
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  scheduleHitArea: {
    justifyContent: 'center',
  },
  headline: {
    color: SwashoColors.neutral50,
    flexShrink: 1,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeLabel: {
    color: SwashoColors.neutral50,
    textAlign: 'center',
  },
  sparkleWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  sparkleRotate: {
    backgroundColor: SwashoColors.surface,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
