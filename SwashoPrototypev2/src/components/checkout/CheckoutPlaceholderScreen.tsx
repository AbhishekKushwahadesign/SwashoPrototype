import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useScreenScale } from '@/components/home/scale';
import { useProviderCart } from '@/context/provider-cart-context';
import {
  CHECKOUT_PICKUP_TIME_SLOTS,
  CHECKOUT_WEEKDAY_OPTIONS,
} from '@/lib/checkout-flow';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';

import { CheckoutProgressStepper } from './CheckoutProgressStepper';
import { CheckoutScreenShell } from './CheckoutScreenShell';

type CheckoutPlaceholderScreenProps = {
  providerId: string;
  query: string;
  isSubscription: boolean;
};

export function CheckoutPlaceholderScreen({ providerId, query, isSubscription }: CheckoutPlaceholderScreenProps) {
  const router = useRouter();
  const { scale, contentWidth } = useScreenScale();
  const { getProviderCartTotals, getCheckoutState } = useProviderCart();
  const totals = getProviderCartTotals(providerId);
  const checkout = getCheckoutState(providerId);

  const handleBackPress = useCallback(() => {
    router.back();
  }, [router]);

  const modeLabel =
    checkout.fulfillmentMode === 'subscribe'
      ? `Subscription${checkout.subscriptionFrequency ? ` · ${checkout.subscriptionFrequency.replace('-', ' ')}` : ''}`
      : 'One-time order';

  return (
    <CheckoutScreenShell title="Checkout" onBackPress={handleBackPress}>
      <View
        style={[
          styles.body,
          {
            width: contentWidth,
            paddingHorizontal: 20 * scale,
            paddingTop: 16 * scale,
            gap: 20 * scale,
          },
        ]}>
        <CheckoutProgressStepper scale={scale} activeStep={2} />
        <View style={[styles.card, { padding: 16 * scale, borderRadius: 12 * scale, gap: 8 * scale }]}>
          <Text style={[searchFont('semibold'), styles.cardTitle, { fontSize: 16 * scale }]}>Checkout (prototype)</Text>
          <Text style={[searchFont('medium'), styles.cardLine, { fontSize: 14 * scale }]}>
            Provider cart preserved — {totals.itemCount} items, ₹{totals.totalPrice} estimated.
          </Text>
          <Text style={[searchFont('medium'), styles.cardLine, { fontSize: 14 * scale }]}>Mode: {modeLabel}</Text>
          {checkout.pickupWeekday && checkout.pickupTimeSlot ? (
            <Text style={[searchFont('medium'), styles.cardLine, { fontSize: 14 * scale }]}>
              Pickup:{' '}
              {CHECKOUT_WEEKDAY_OPTIONS.find((d) => d.id === checkout.pickupWeekday)?.label ?? checkout.pickupWeekday}
              ,{' '}
              {CHECKOUT_PICKUP_TIME_SLOTS.find((s) => s.id === checkout.pickupTimeSlot)?.label ??
                checkout.pickupTimeSlot}
              {checkout.deliverySameAsPickup
                ? ' · delivery same as pickup'
                : checkout.deliveryTimeSlot
                  ? ` · delivery ${CHECKOUT_PICKUP_TIME_SLOTS.find((s) => s.id === checkout.deliveryTimeSlot)?.label ?? checkout.deliveryTimeSlot}`
                  : ''}
            </Text>
          ) : null}
          {query ? (
            <Text style={[searchFont('medium'), styles.cardMuted, { fontSize: 12 * scale }]}>Search: {query}</Text>
          ) : null}
          <Text style={[searchFont('medium'), styles.cardMuted, { fontSize: 12 * scale, marginTop: 8 }]}>
            Full checkout UI is not in Figma yet; this route holds cart state until that screen ships.
            {isSubscription ? ' Subscription billing is out of scope.' : ''}
          </Text>
        </View>
      </View>
    </CheckoutScreenShell>
  );
}

const styles = StyleSheet.create({
  body: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: SwashoColors.surface,
    width: '100%',
  },
  cardTitle: {
    color: SwashoColors.neutral950,
  },
  cardLine: {
    color: SwashoColors.neutral800,
  },
  cardMuted: {
    color: SwashoColors.neutral600,
  },
});
