import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CheckoutSectionDivider } from '@/components/checkout/CheckoutSectionDivider';
import { useScreenScale } from '@/components/home/scale';
import { figmaShadow, FigmaShadows } from '@/components/home/figma-shadows';
import { ServiceSelectionButton } from '@/components/service-selection/ServiceSelectionButton';
import { ServiceCheckbox } from '@/components/service-selection/ServiceCheckbox';
import { useProviderCart } from '@/context/provider-cart-context';
import {
  checkoutPlaceholderHref,
  CHECKOUT_PICKUP_TIME_SLOTS,
  CHECKOUT_WEEKDAY_OPTIONS,
  subscriptionFrequencyHref,
  type CheckoutPickupTimeSlotId,
  type CheckoutWeekdayId,
} from '@/lib/checkout-flow';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { CheckoutOrderTypeSegment } from './CheckoutOrderTypeSegment';
import { CheckoutProgressStepper } from './CheckoutProgressStepper';
import { CheckoutScheduleChip } from './CheckoutScheduleChip';
import { CheckoutScreenShell } from './CheckoutScreenShell';
import { CheckoutSwitchToSubscribeBanner } from './CheckoutSwitchToSubscribeBanner';

type OneTimeCheckoutScreenProps = {
  providerId: string;
  query: string;
};

function formatStartDateLabel(weekday?: CheckoutWeekdayId): string {
  const labels: Record<CheckoutWeekdayId, number> = {
    sun: 0,
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
  };
  const now = new Date();
  const target = weekday ? labels[weekday] : now.getDay();
  const day = now.getDay();
  let delta = target - day;
  if (delta <= 0) {
    delta += 7;
  }
  const next = new Date(now);
  next.setDate(now.getDate() + delta);
  return next.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function OneTimeCheckoutScreen({ providerId, query }: OneTimeCheckoutScreenProps) {
  const router = useRouter();
  const { scale, contentWidth } = useScreenScale();
  const { getCheckoutState, setFulfillmentMode, setOneTimeSchedule } = useProviderCart();
  const persisted = getCheckoutState(providerId);

  const [weekday, setWeekday] = useState<CheckoutWeekdayId | null>(persisted.pickupWeekday ?? null);
  const [pickupSlot, setPickupSlot] = useState<CheckoutPickupTimeSlotId | null>(
    persisted.pickupTimeSlot ?? null,
  );
  const [deliverySameAsPickup, setDeliverySameAsPickup] = useState(
    persisted.deliverySameAsPickup ?? true,
  );

  const confirmLockRef = useRef(false);
  const navigateLockRef = useRef(false);

  useEffect(() => {
    setFulfillmentMode(providerId, 'one-time');
  }, [providerId, setFulfillmentMode]);

  const handleBackPress = useCallback(() => {
    router.back();
  }, [router]);

  const goSubscribePath = useCallback(() => {
    if (navigateLockRef.current) {
      return;
    }
    navigateLockRef.current = true;
    setFulfillmentMode(providerId, 'subscribe');
    router.replace(subscriptionFrequencyHref(providerId, query));
    setTimeout(() => {
      navigateLockRef.current = false;
    }, 600);
  }, [providerId, query, router, setFulfillmentMode]);

  const handleConfirm = useCallback(() => {
    if (!weekday || !pickupSlot || confirmLockRef.current) {
      return;
    }
    confirmLockRef.current = true;
    setOneTimeSchedule(providerId, {
      pickupWeekday: weekday,
      pickupTimeSlot: pickupSlot,
      deliverySameAsPickup,
    });
    router.replace(checkoutPlaceholderHref(providerId, query, { scheduleConfirmed: true }));
    setTimeout(() => {
      confirmLockRef.current = false;
    }, 600);
  }, [deliverySameAsPickup, pickupSlot, providerId, query, router, setOneTimeSchedule, weekday]);

  const handleWeekdaySelect = (id: CheckoutWeekdayId) => {
    setWeekday(id);
    setOneTimeSchedule(providerId, { pickupWeekday: id });
  };

  const handleSlotSelect = (id: CheckoutPickupTimeSlotId) => {
    setPickupSlot(id);
    setOneTimeSchedule(providerId, { pickupTimeSlot: id });
  };

  const pickupTimeColumnGap = 12 * scale;
  const pickupTimeChipWidth = useMemo(() => {
    const gridWidth = contentWidth - 64 * scale;
    return (gridWidth - 2 * pickupTimeColumnGap) / 3;
  }, [contentWidth, scale, pickupTimeColumnGap]);

  const stepOneProgress = useMemo(() => {
    let completed = 0;
    if (weekday != null) {
      completed += 1;
    }
    if (pickupSlot != null) {
      completed += 1;
    }
    return completed / 2;
  }, [pickupSlot, weekday]);

  const footer = (
    <ServiceSelectionButton
      label="Confirm"
      variant="primary"
      disabled={weekday == null || pickupSlot == null}
      onPress={handleConfirm}
      scale={scale}
      style={{ width: '100%' }}
    />
  );

  return (
    <CheckoutScreenShell title="Choose Subscription Type" onBackPress={handleBackPress} footer={footer}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: 16 * scale,
            paddingTop: 12 * scale,
            paddingBottom: 24 * scale,
            width: contentWidth,
            gap: 20 * scale,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <CheckoutProgressStepper scale={scale} activeStep={1} stepOneProgress={stepOneProgress} />

        <CheckoutOrderTypeSegment activeMode="one-time" onSelectMode={(mode) => {
          if (mode === 'subscribe') {
            goSubscribePath();
          }
        }} scale={scale} />

        <View style={styles.subscribeBannerSlot}>
          <CheckoutSwitchToSubscribeBanner onPress={goSubscribePath} scale={scale} />
        </View>

        <View
          style={[
            styles.scheduleCard,
            {
              borderRadius: SwashoRadii.lg * scale,
              paddingVertical: 16 * scale,
              gap: 16 * scale,
              ...figmaShadow(FigmaShadows.providerCard, scale),
            },
          ]}>
          <View style={{ width: '100%', paddingHorizontal: 16 * scale, gap: 16 * scale }}>
            <Text
              style={[
                searchFont('medium'),
                styles.sectionTitle,
                { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
              ]}>
              Choose Day & Time
            </Text>
            <View style={[styles.chipGrid, { gap: 12 * scale, rowGap: 16 * scale, paddingVertical: 8 * scale }]}>
              {CHECKOUT_WEEKDAY_OPTIONS.map((day) => (
                <CheckoutScheduleChip
                  key={day.id}
                  label={day.label}
                  selected={weekday === day.id}
                  onPress={() => handleWeekdaySelect(day.id)}
                  scale={scale}
                />
              ))}
            </View>
          </View>

          <CheckoutSectionDivider width={376 * scale} scale={scale} />

          <View style={{ width: '100%', paddingHorizontal: 16 * scale, gap: 16 * scale }}>
            <Text
              style={[
                searchFont('medium'),
                styles.sectionTitle,
                { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
              ]}>
              Choose Pickup Time
            </Text>
            <View
              style={[
                styles.chipGrid,
                {
                  columnGap: pickupTimeColumnGap,
                  rowGap: 16 * scale,
                  paddingVertical: 8 * scale,
                },
              ]}>
              {CHECKOUT_PICKUP_TIME_SLOTS.map((slot) => (
                <CheckoutScheduleChip
                  key={slot.id}
                  label={slot.label}
                  selected={pickupSlot === slot.id}
                  onPress={() => handleSlotSelect(slot.id)}
                  scale={scale}
                  width={pickupTimeChipWidth}
                  height={35}
                />
              ))}
            </View>
          </View>

          <CheckoutSectionDivider width={376 * scale} scale={scale} />

          <View
            style={{
              width: '100%',
              paddingHorizontal: 16 * scale,
              gap: 9 * scale,
              paddingVertical: 8 * scale,
            }}>
            <Text
              style={[
                searchFont('medium'),
                styles.sectionTitle,
                { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
              ]}>
              Choose Delivery Time
            </Text>
            <View style={[styles.deliveryRow, { gap: 8 * scale }]}>
              <ServiceCheckbox
                checked={deliverySameAsPickup}
                onChange={(next) => {
                  setDeliverySameAsPickup(next);
                  setOneTimeSchedule(providerId, { deliverySameAsPickup: next });
                }}
                scale={scale}
              />
              <Text
                style={[
                  searchFont('semibold'),
                  styles.deliveryLabel,
                  { fontSize: 12 * scale, lineHeight: 20 * scale, letterSpacing: 0.5 * scale },
                ]}>
                Same as Pickup time
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.startDateCard,
            {
              borderRadius: SwashoRadii.lg * scale,
              padding: 16 * scale,
              minHeight: 92 * scale,
              ...figmaShadow(FigmaShadows.providerCard, scale),
            },
          ]}>
          <Text
            style={[
              searchFont('medium'),
              styles.sectionTitle,
              { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
            ]}>
            Start Date
          </Text>
          <Text
            style={[
              searchFont('medium'),
              styles.startDateValue,
              { fontSize: 14 * scale, lineHeight: 20 * scale, marginTop: 8 * scale },
            ]}>
            {formatStartDateLabel(weekday ?? undefined)}
          </Text>
        </View>
      </ScrollView>
    </CheckoutScreenShell>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
  },
  subscribeBannerSlot: {
    width: '100%',
    overflow: 'visible',
    zIndex: 2,
  },
  scheduleCard: {
    backgroundColor: SwashoColors.surface,
    width: '100%',
    alignItems: 'center',
  },
  sectionTitle: {
    color: SwashoColors.darkHeaderText,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryLabel: {
    color: SwashoColors.neutral900,
  },
  startDateCard: {
    backgroundColor: SwashoColors.surface,
    width: '100%',
  },
  startDateValue: {
    color: SwashoColors.neutral600,
  },
});
