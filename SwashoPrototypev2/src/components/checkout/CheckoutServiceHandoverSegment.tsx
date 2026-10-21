import { Pressable, StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';
import {
  CHECKOUT_ORDER_TYPE_SEGMENT_WIDTH,
} from '@/lib/checkout-figma-layout';

import { CheckoutGradientDualSegment } from './CheckoutGradientDualSegment';

type CheckoutServiceHandoverSegmentProps = {
  contactless: boolean;
  onContactlessChange: (contactless: boolean) => void;
  onHowItWorksPress?: () => void;
  scale: number;
};

/** Figma 59077:3248 — Standard vs Contactless handover toggle on checkout review. */
export function CheckoutServiceHandoverSegment({
  contactless,
  onContactlessChange,
  onHowItWorksPress,
  scale,
}: CheckoutServiceHandoverSegmentProps) {
  const segmentWidth = CHECKOUT_ORDER_TYPE_SEGMENT_WIDTH * scale;

  return (
    <View style={[styles.column, { width: segmentWidth, gap: 8 * scale }]}>
      <CheckoutGradientDualSegment
        typography="service-handover"
        scale={scale}
        left={{ title: 'Standard Service', subtitle: 'Handover in person' }}
        right={{ title: 'Contactless Service', subtitle: 'No handover needed!' }}
        activeSide={contactless ? 'right' : 'left'}
        onSelect={(side) => onContactlessChange(side === 'right')}
      />
      {onHowItWorksPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="How contactless service works"
          onPress={onHowItWorksPress}
          hitSlop={8}
          style={styles.howItWorksHit}>
          <Text
            style={[
              searchFont('semibold'),
              styles.howItWorksText,
              { fontSize: 13 * scale, lineHeight: 18 * scale, letterSpacing: 0.2 * scale },
            ]}>
            How it works?
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    alignItems: 'center',
  },
  howItWorksHit: {
    alignSelf: 'center',
  },
  howItWorksText: {
    color: SwashoColors.primary600,
    textDecorationLine: 'underline',
  },
});
