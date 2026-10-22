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
  /** Shown when contactless is on but clothes location is not saved. */
  showLocationReminder?: boolean;
  savedLocationLabel?: string | null;
  onChooseLocationPress?: () => void;
  onEditLocationPress?: () => void;
  scale: number;
};

/** Figma 59077:3248 — Standard vs Contactless handover toggle on checkout review. */
export function CheckoutServiceHandoverSegment({
  contactless,
  onContactlessChange,
  onHowItWorksPress,
  showLocationReminder = false,
  savedLocationLabel,
  onChooseLocationPress,
  onEditLocationPress,
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
      {contactless && showLocationReminder && onChooseLocationPress ? (
        <View
          style={[
            styles.reminderCard,
            {
              width: segmentWidth,
              paddingHorizontal: 12 * scale,
              paddingVertical: 10 * scale,
              borderRadius: 8 * scale,
              gap: 4 * scale,
            },
          ]}>
          <Text
            style={[
              searchFont('semibold'),
              styles.reminderTitle,
              { fontSize: 13 * scale, lineHeight: 18 * scale },
            ]}>
            Set your clothes location
          </Text>
          <Text
            style={[
              searchFont('regular'),
              styles.reminderBody,
              { fontSize: 12 * scale, lineHeight: 16 * scale },
            ]}>
            Choose where your laundry bag will be collected from.
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Choose clothes location"
            onPress={onChooseLocationPress}
            hitSlop={8}
            style={{ alignSelf: 'flex-start', marginTop: 2 * scale }}>
            <Text
              style={[
                searchFont('semibold'),
                styles.reminderCta,
                { fontSize: 13 * scale, lineHeight: 18 * scale },
              ]}>
              Choose location →
            </Text>
          </Pressable>
        </View>
      ) : null}

      {contactless && savedLocationLabel && !showLocationReminder ? (
        <View style={[styles.savedRow, { gap: 6 * scale, maxWidth: segmentWidth }]}>
          <Text
            numberOfLines={1}
            style={[
              searchFont('medium'),
              styles.savedLabel,
              { fontSize: 12 * scale, lineHeight: 16 * scale, flexShrink: 1 },
            ]}>
            Clothes location: {savedLocationLabel}
          </Text>
          {onEditLocationPress ? (
            <Pressable accessibilityRole="button" accessibilityLabel="Edit clothes location" onPress={onEditLocationPress} hitSlop={8}>
              <Text
                style={[
                  searchFont('semibold'),
                  styles.reminderCta,
                  { fontSize: 12 * scale, lineHeight: 16 * scale },
                ]}>
                Edit
              </Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}

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
  reminderCard: {
    alignSelf: 'stretch',
    backgroundColor: SwashoColors.primary50,
    borderWidth: 1,
    borderColor: SwashoColors.primary100,
  },
  reminderTitle: {
    color: SwashoColors.neutral800,
  },
  reminderBody: {
    color: SwashoColors.neutral600,
  },
  reminderCta: {
    color: SwashoColors.primary600,
  },
  savedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  savedLabel: {
    color: SwashoColors.neutral700,
  },
});
