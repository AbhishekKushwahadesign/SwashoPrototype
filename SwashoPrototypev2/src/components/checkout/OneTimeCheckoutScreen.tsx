import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { CheckoutSectionDivider } from '@/components/checkout/CheckoutSectionDivider';
import { useScreenScale } from '@/components/home/scale';
import { figmaShadow, FigmaShadows } from '@/components/home/figma-shadows';
import { ServiceSelectionButton } from '@/components/service-selection/ServiceSelectionButton';
import { ServiceCheckbox } from '@/components/service-selection/ServiceCheckbox';
import { useProviderCart } from '@/context/provider-cart-context';
import {
  buildUpcomingCheckoutDays,
  checkoutPlaceholderHref,
  CHECKOUT_PICKUP_TIME_SLOTS,
  subscriptionFrequencyHref,
  type CheckoutDayOption,
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
import { CheckoutWeekdayScrollRow } from './CheckoutWeekdayScrollRow';

type OneTimeCheckoutScreenProps = {
  providerId: string;
  query: string;
};

export function OneTimeCheckoutScreen({ providerId, query }: OneTimeCheckoutScreenProps) {
  const router = useRouter();
  const { scale, contentWidth } = useScreenScale();
  const { getCheckoutState, setFulfillmentMode, setOneTimeSchedule } = useProviderCart();
  const persisted = getCheckoutState(providerId);

  const upcomingDays = useMemo(() => buildUpcomingCheckoutDays(14), []);
  const [weekday, setWeekday] = useState<CheckoutWeekdayId | null>(persisted.pickupWeekday ?? null);
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(() => {
    if (!persisted.pickupWeekday) {
      return null;
    }
    return upcomingDays.find((day) => day.weekdayId === persisted.pickupWeekday)?.key ?? null;
  });
  const [pickupSlot, setPickupSlot] = useState<CheckoutPickupTimeSlotId | null>(
    persisted.pickupTimeSlot ?? null,
  );
  const [deliverySameAsPickup, setDeliverySameAsPickup] = useState(
    persisted.deliverySameAsPickup ?? true,
  );
  const [deliverySlot, setDeliverySlot] = useState<CheckoutPickupTimeSlotId | null>(
    persisted.deliveryTimeSlot ?? null,
  );

  const confirmLockRef = useRef(false);
  const navigateLockRef = useRef(false);
  const [subscribeBannerAnimSession, setSubscribeBannerAnimSession] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setSubscribeBannerAnimSession((session) => session + 1);
    }, []),
  );

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
    if (!deliverySameAsPickup && !deliverySlot) {
      return;
    }
    confirmLockRef.current = true;
    setOneTimeSchedule(providerId, {
      pickupWeekday: weekday,
      pickupTimeSlot: pickupSlot,
      deliverySameAsPickup,
      deliveryTimeSlot: deliverySameAsPickup ? undefined : deliverySlot ?? undefined,
    });
    router.replace(checkoutPlaceholderHref(providerId, query, { scheduleConfirmed: true }));
    setTimeout(() => {
      confirmLockRef.current = false;
    }, 600);
  }, [
    deliverySameAsPickup,
    deliverySlot,
    pickupSlot,
    providerId,
    query,
    router,
    setOneTimeSchedule,
    weekday,
  ]);

  const handleWeekdaySelect = (day: CheckoutDayOption) => {
    setSelectedDayKey(day.key);
    setWeekday(day.weekdayId);
    setOneTimeSchedule(providerId, { pickupWeekday: day.weekdayId });
  };

  const handleSlotSelect = (id: CheckoutPickupTimeSlotId) => {
    setPickupSlot(id);
    setOneTimeSchedule(providerId, { pickupTimeSlot: id });
  };

  const handleDeliverySlotSelect = (id: CheckoutPickupTimeSlotId) => {
    setDeliverySlot(id);
    setOneTimeSchedule(providerId, { deliveryTimeSlot: id });
  };

  const scheduleInset = 9.513 * scale;
  const pickupTimeColumnGap = 12 * scale;
  /** Figma 3346:13522 — 371.507px grid, 110.15px chips, 3 columns */
  const timeSlotGridWidth = 371.507 * scale;
  const pickupTimeChipWidth = useMemo(() => {
    return (timeSlotGridWidth - 2 * pickupTimeColumnGap) / 3;
  }, [pickupTimeColumnGap, timeSlotGridWidth]);

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
      disabled={
        weekday == null || pickupSlot == null || (!deliverySameAsPickup && deliverySlot == null)
      }
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

        <View style={[styles.subscribeBannerSlot, { marginBottom: -4 * scale }]}>
          <CheckoutSwitchToSubscribeBanner
            scale={scale}
            accentAnimationSession={subscribeBannerAnimSession}
          />
        </View>

        <View
          style={[
            styles.scheduleCard,
            {
              borderRadius: SwashoRadii.lg * scale,
              paddingVertical: 16.022 * scale,
              gap: 16.022 * scale,
              ...figmaShadow(FigmaShadows.checkoutScheduleCard, scale),
            },
          ]}>
          <View
            style={{
              width: '100%',
              paddingHorizontal: scheduleInset,
              gap: 16.022 * scale,
              alignItems: 'center',
            }}>
            <View style={{ width: '100%', gap: 16.022 * scale }}>
              <Text
                style={[
                  searchFont('medium'),
                  styles.sectionTitle,
                  { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
                ]}>
                Choose Pickup Day
              </Text>
              <CheckoutWeekdayScrollRow
                days={upcomingDays}
                selectedKey={selectedDayKey}
                onSelectDay={handleWeekdaySelect}
                scale={scale}
              />
            </View>

            <CheckoutSectionDivider width={376.514 * scale} scale={scale} />

            <View style={{ width: '100%', gap: 16.022 * scale }}>
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
                    width: timeSlotGridWidth,
                    columnGap: pickupTimeColumnGap,
                    rowGap: 16.022 * scale,
                    paddingVertical: 8.011 * scale,
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
                    height={35.048}
                  />
                ))}
              </View>
            </View>
          </View>

          <CheckoutSectionDivider width={376.514 * scale} scale={scale} />

          <View
            style={{
              width: '100%',
              paddingHorizontal: 11.516 * scale,
              gap: 9.012 * scale,
              paddingVertical: 8.011 * scale,
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
                  setOneTimeSchedule(providerId, {
                    deliverySameAsPickup: next,
                    ...(next ? { deliveryTimeSlot: undefined } : {}),
                  });
                  if (next) {
                    setDeliverySlot(null);
                  }
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
            {!deliverySameAsPickup ? (
              <View
                style={[
                  styles.chipGrid,
                  {
                    width: timeSlotGridWidth,
                    columnGap: pickupTimeColumnGap,
                    rowGap: 16.022 * scale,
                    paddingTop: 7 * scale,
                  },
                ]}>
                {CHECKOUT_PICKUP_TIME_SLOTS.map((slot) => (
                  <CheckoutScheduleChip
                    key={`delivery-${slot.id}`}
                    label={slot.label}
                    selected={deliverySlot === slot.id}
                    onPress={() => handleDeliverySlotSelect(slot.id)}
                    scale={scale}
                    width={pickupTimeChipWidth}
                    height={35.048}
                  />
                ))}
              </View>
            ) : null}
          </View>
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
});
