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

type CheckoutAiDemoPickupNudgeProps = {
  scale: number;
  cardWidth: number;
  onPress: () => void;
};

/** Shown above basket on review when arriving from Swasho AI Go to Cart (Figma 59232:3709). */
export function CheckoutAiDemoPickupNudge({ scale, cardWidth: _cardWidth, onPress }: CheckoutAiDemoPickupNudgeProps) {
  const width = CHECKOUT_AI_DEMO_PICKUP_NUDGE_WIDTH * scale;
  const height = CHECKOUT_AI_DEMO_PICKUP_NUDGE_HEIGHT * scale;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Change pickup schedule"
      onPress={onPress}
      style={({ pressed }) => [
        styles.root,
        {
          width,
          height,
          opacity: pressed ? 0.92 : 1,
        },
      ]}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <AiDemoPickupNudgeBg width={width} height={height} />
      </View>

      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <Text
          style={[
            searchFont('semibold'),
            styles.message,
            {
              position: 'absolute',
              left: 15.77 * scale,
              top: 7.98 * scale,
              fontSize: 14 * scale,
              lineHeight: 20 * scale,
              letterSpacing: 0.5 * scale,
              maxWidth: 335 * scale,
            },
          ]}>
          We&apos;ve selected the earliest available pickup for you.
        </Text>

        <View
          style={[
            styles.changeRow,
            {
              position: 'absolute',
              left: 12 * scale,
              top: 31 * scale,
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
      </View>

      <View
        pointerEvents="none"
        style={[
          styles.sparkleWrap,
          {
            left: 359.87 * scale,
            top: height / 2,
            width: 28.279 * scale,
            height: 28.279 * scale,
            marginTop: (-28.279 / 2) * scale,
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
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'center',
    overflow: 'visible',
  },
  message: {
    color: SwashoColors.neutral50,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  changeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeLabel: {
    color: SwashoColors.neutral50,
    textAlign: 'center',
    flex: 1,
  },
  sparkleWrap: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sparkleRotate: {
    backgroundColor: SwashoColors.surface,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
