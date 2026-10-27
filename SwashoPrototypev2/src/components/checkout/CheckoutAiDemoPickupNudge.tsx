import { Pressable, StyleSheet, Text, View } from 'react-native';

import AiDemoPickupNudgeBg from '@/assets/checkout/ai-demo-pickup-nudge-bg.svg';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';
import {
  CHECKOUT_AI_DEMO_PICKUP_NUDGE_HEIGHT,
  CHECKOUT_AI_DEMO_PICKUP_NUDGE_WIDTH,
} from '@/lib/checkout-figma-layout';

/** Figma 59230:3669 layout — message inset and Change control. */
const MESSAGE_LEFT = 13.02;
const MESSAGE_MAX_WIDTH = 266.789;
const CHANGE_MIN_WIDTH = 60;
const CHANGE_PADDING_H = 4;

type CheckoutAiDemoPickupNudgeProps = {
  scale: number;
  cardWidth: number;
  onPress: () => void;
};

/** Shown above basket on review when arriving from Swasho AI Go to Cart. Figma 59230:3669. */
export function CheckoutAiDemoPickupNudge({ scale, cardWidth: _cardWidth, onPress }: CheckoutAiDemoPickupNudgeProps) {
  const width = CHECKOUT_AI_DEMO_PICKUP_NUDGE_WIDTH * scale;
  const height = CHECKOUT_AI_DEMO_PICKUP_NUDGE_HEIGHT * scale;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Change pickup date, time, or subscription"
      onPress={onPress}
      style={({ pressed }) => [styles.root, { width, height, opacity: pressed ? 0.92 : 1 }]}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        <AiDemoPickupNudgeBg width={width} height={height} />
      </View>
      <View
        style={[
          styles.content,
          {
            paddingLeft: MESSAGE_LEFT * scale,
            paddingRight: CHANGE_PADDING_H * scale,
            minHeight: height,
          },
        ]}>
        <Text
          style={[
            searchFont('semibold'),
            styles.message,
            {
              fontSize: 13 * scale,
              lineHeight: 20 * scale,
              letterSpacing: 0.5 * scale,
              maxWidth: MESSAGE_MAX_WIDTH * scale,
            },
          ]}>
          We’ve selected the earliest available pickup for you.
        </Text>
        <View
          style={[
            styles.changeButton,
            {
              minWidth: CHANGE_MIN_WIDTH * scale,
              paddingHorizontal: CHANGE_PADDING_H * scale,
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
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  message: {
    flex: 1,
    color: SwashoColors.neutral50,
  },
  changeButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeLabel: {
    color: SwashoColors.neutral50,
    textAlign: 'center',
  },
});
