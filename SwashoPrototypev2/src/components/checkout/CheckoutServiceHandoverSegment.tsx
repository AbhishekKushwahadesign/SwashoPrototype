import { Pressable, StyleSheet, Text, View } from 'react-native';

import { figmaShadow } from '@/components/home/figma-shadows';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';
import { CHECKOUT_ORDER_TYPE_SEGMENT_WIDTH } from '@/lib/checkout-figma-layout';

import { CheckoutGradientDualSegment } from './CheckoutGradientDualSegment';
import { CheckoutInstructionsHeaderIcon, CheckoutPickupLocationMapPointIcon } from './checkout-review-icons';

type CheckoutServiceHandoverSegmentProps = {
  contactless: boolean;
  onContactlessChange: (contactless: boolean) => void;
  onHowItWorksPress?: () => void;
  showPickupLocationNudge?: boolean;
  onPickupLocationNudgePress?: () => void;
  scale: number;
};

/** Figma 59077:3248 — Standard vs Contactless handover toggle on checkout review. */
export function CheckoutServiceHandoverSegment({
  contactless,
  onContactlessChange,
  onHowItWorksPress,
  showPickupLocationNudge = false,
  onPickupLocationNudgePress,
  scale,
}: CheckoutServiceHandoverSegmentProps) {
  const segmentWidth = CHECKOUT_ORDER_TYPE_SEGMENT_WIDTH * scale;

  return (
    <View style={[styles.column, { width: segmentWidth, gap: 12 * scale }]}>
      <CheckoutGradientDualSegment
        typography="service-handover"
        scale={scale}
        left={{ title: 'Standard Service', subtitle: 'Handover in person' }}
        right={{ title: 'Contactless Service', subtitle: 'No handover needed!' }}
        activeSide={contactless ? 'right' : 'left'}
        onSelect={(side) => onContactlessChange(side === 'right')}
      />
      {contactless && showPickupLocationNudge && onPickupLocationNudgePress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Select pickup location for contactless service"
          onPress={onPickupLocationNudgePress}
          style={[
            styles.pickupLocationNudge,
            {
              width: segmentWidth,
              paddingHorizontal: 12 * scale,
              paddingVertical: 12 * scale,
              borderRadius: SwashoRadii.lg * scale,
              gap: 4 * scale,
              ...figmaShadow({ offsetX: 0, offsetY: 0, blur: 8, color: '#000000', opacity: 0.08 }, scale),
            },
          ]}>
          <View style={[styles.pickupLocationNudgeTitleRow, { gap: 6 * scale }]}>
            <CheckoutPickupLocationMapPointIcon width={24 * scale} height={24 * scale} />
            <Text
              style={[
                searchFont('semibold'),
                styles.pickupLocationNudgeTitle,
                { fontSize: 14 * scale, lineHeight: 20 * scale, letterSpacing: 0.3 * scale, flex: 1 },
              ]}>
              Pickup location required
            </Text>
          </View>
          <Text
            style={[
              searchFont('regular'),
              styles.pickupLocationNudgeBody,
              { fontSize: 12 * scale, lineHeight: 16 * scale, letterSpacing: 0.5 * scale },
            ]}>
            Choose where your laundry will be kept for contactless pickup.
          </Text>
          <Text
            style={[
              searchFont('semibold'),
              styles.pickupLocationNudgeAction,
              { fontSize: 13 * scale, lineHeight: 16 * scale, letterSpacing: 0.5 * scale },
            ]}>
            Select location →
          </Text>
        </Pressable>
      ) : null}
      {contactless && onHowItWorksPress ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="How contactless service works"
          onPress={onHowItWorksPress}
          style={[
            styles.howItWorksCard,
            {
              width: segmentWidth,
              paddingHorizontal: 16 * scale,
              paddingVertical: 12 * scale,
              borderRadius: SwashoRadii.lg * scale,
              ...figmaShadow({ offsetX: 0, offsetY: 0, blur: 8, color: '#000000', opacity: 0.1 }, scale),
            },
          ]}>
          <Text
            style={[
              searchFont('semibold'),
              styles.howItWorksCardTitle,
              { fontSize: 15 * scale, lineHeight: 14 * scale, letterSpacing: 0.3 * scale, flex: 1 },
            ]}>
            How Contactless Service works?
          </Text>
          <CheckoutInstructionsHeaderIcon width={20 * scale} height={20 * scale} />
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    alignItems: 'center',
  },
  howItWorksCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: SwashoColors.surface,
    alignSelf: 'stretch',
  },
  howItWorksCardTitle: {
    color: SwashoColors.neutral800,
  },
  pickupLocationNudge: {
    alignSelf: 'stretch',
    backgroundColor: SwashoColors.primary50,
    borderWidth: 1,
    borderColor: SwashoColors.primary100,
  },
  pickupLocationNudgeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pickupLocationNudgeTitle: {
    color: SwashoColors.darkHeaderText,
  },
  pickupLocationNudgeBody: {
    color: SwashoColors.neutral700,
  },
  pickupLocationNudgeAction: {
    color: SwashoColors.primary600,
    marginTop: 4,
  },
});
