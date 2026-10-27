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

const CONTENT_PADDING_LEFT = 15.77;
const CONTENT_PADDING_RIGHT = 40;
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
          minHeight: height,
          opacity: pressed ? 0.92 : 1,
        },
      ]}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <AiDemoPickupNudgeBg width={width} height={height} />
      </View>

      <View
        pointerEvents="none"
        style={[
          styles.contentRow,
          {
            minHeight: height,
            paddingLeft: CONTENT_PADDING_LEFT * scale,
            paddingRight: CONTENT_PADDING_RIGHT * scale,
            gap: 8 * scale,
          },
        ]}>
        <Text
          style={[
            searchFont('semibold'),
            styles.message,
            {
              fontSize: 14 * scale,
              lineHeight: 20 * scale,
              letterSpacing: 0.5 * scale,
            },
          ]}>
          We’ve selected the earliest available pickup{' '}
          <Text
            style={[
              searchFont('medium'),
              styles.changeInline,
              {
                fontSize: 14 * scale,
                lineHeight: 20 * scale,
                letterSpacing: 0.5 * scale,
              },
            ]}>
            Change
          </Text>
        </Text>
        <AiDemoPickupNudgeArrowRight width={20 * scale} height={20 * scale} />
      </View>

      <View
        pointerEvents="none"
        style={[
          styles.sparkleWrap,
          {
            right: 6 * scale,
            top: (height - 28.279 * scale) / 2,
            width: 28.279 * scale,
            height: 28.279 * scale,
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
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  message: {
    flex: 1,
    flexShrink: 1,
    color: SwashoColors.neutral50,
  },
  changeInline: {
    color: SwashoColors.neutral50,
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
