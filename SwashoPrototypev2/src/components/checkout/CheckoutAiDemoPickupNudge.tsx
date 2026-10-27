import { Pressable, StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

type CheckoutAiDemoPickupNudgeProps = {
  scale: number;
  cardWidth: number;
  onDismiss: () => void;
};

/** Shown above basket on review when arriving from Swasho AI Go to Cart. */
export function CheckoutAiDemoPickupNudge({ scale, cardWidth, onDismiss }: CheckoutAiDemoPickupNudgeProps) {
  return (
    <View
      style={[
        styles.root,
        {
          width: cardWidth,
          borderRadius: SwashoRadii.md * scale,
          paddingHorizontal: 12 * scale,
          paddingVertical: 10 * scale,
          gap: 8 * scale,
        },
      ]}>
      <Text
        style={[
          searchFont('medium'),
          styles.message,
          { fontSize: 13 * scale, lineHeight: 18 * scale, letterSpacing: 0.26 * scale },
        ]}>
        We’ve selected the earliest available pickup for you. Need a different day or time? Tap{' '}
        <Text style={searchFont('semibold')}>Change</Text> in your schedule below.
      </Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Dismiss pickup reminder" onPress={onDismiss}>
        <Text
          style={[
            searchFont('semibold'),
            styles.dismiss,
            { fontSize: 13 * scale, lineHeight: 16 * scale },
          ]}>
          Got it
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    alignSelf: 'center',
    backgroundColor: SwashoColors.primary50,
    borderWidth: 1,
    borderColor: SwashoColors.primary200,
  },
  message: {
    color: SwashoColors.neutral900,
  },
  dismiss: {
    color: SwashoColors.primary600,
    alignSelf: 'flex-start',
  },
});
