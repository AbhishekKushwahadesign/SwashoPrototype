import { useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useScreenScale } from '@/components/home/scale';
import { figmaDropShadow, figmaShadow, FigmaShadows } from '@/components/home/figma-shadows';
import { ServiceSelectionButton } from '@/components/service-selection/ServiceSelectionButton';
import { ServiceCheckbox } from '@/components/service-selection/ServiceCheckbox';
import { useProviderCart } from '@/context/provider-cart-context';
import {
  buildUpcomingCheckoutDays,
  checkoutPlaceholderHref,
  CHECKOUT_PICKUP_TIME_SLOTS,
  oneTimeCheckoutHref,
  SUBSCRIPTION_FREQUENCY_OPTIONS,
  SUBSCRIPTION_FREQUENCY_PICKUP_HINT,
  subscriptionPickupWeekdayLimit,
  type CheckoutDayOption,
  type CheckoutPickupTimeSlotId,
  type CheckoutWeekdayId,
  type ProviderOrderFulfillmentMode,
  type SubscriptionFrequencyOption,
} from '@/lib/checkout-flow';
import {
  CHECKOUT_ORDER_TYPE_SEGMENT_WIDTH,
  CHECKOUT_SCHEDULE_CARD_WIDTH,
} from '@/lib/checkout-figma-layout';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { CheckoutOrderTypeSegment } from './CheckoutOrderTypeSegment';
import { CheckoutProgressStepper } from './CheckoutProgressStepper';
import { CheckoutScheduleChip } from './CheckoutScheduleChip';
import { CheckoutScreenShell } from './CheckoutScreenShell';
import { CheckoutSectionDivider } from './CheckoutSectionDivider';
import { CheckoutWeekdayNameGrid } from './CheckoutWeekdayNameGrid';
import { CheckoutStartDateSection } from './CheckoutStartDateSection';

type Subscribe2CheckoutScreenProps = {
  providerId: string;
  query: string;
};

function frequencyTitle(id: SubscriptionFrequencyOption): string {
  return SUBSCRIPTION_FREQUENCY_OPTIONS.find((option) => option.id === id)?.title ?? id;
}

export function Subscribe2CheckoutScreen({ providerId, query }: Subscribe2CheckoutScreenProps) {
  const router = useRouter();
  const { scale, contentWidth } = useScreenScale();
  const {
    getCheckoutState,
    setFulfillmentMode,
    setSubscriptionSchedule,
  } = useProviderCart();
  const persisted = getCheckoutState(providerId);
  const frequency = persisted.subscriptionFrequency;

  const upcomingDays = useMemo(() => buildUpcomingCheckoutDays(45), []);
  const weekdayLimit = subscriptionPickupWeekdayLimit(frequency);

  const [pickupWeekdays, setPickupWeekdays] = useState<CheckoutWeekdayId[]>(
    persisted.subscriptionPickupWeekdays ?? [],
  );
  const [pickupSlot, setPickupSlot] = useState<CheckoutPickupTimeSlotId | null>(
    persisted.subscriptionPickupTimeSlot ?? null,
  );
  const [deliverySameAsPickup, setDeliverySameAsPickup] = useState(
    persisted.subscriptionDeliverySameAsPickup ?? true,
  );
  const [deliverySlot, setDeliverySlot] = useState<CheckoutPickupTimeSlotId | null>(
    persisted.subscriptionDeliveryTimeSlot ?? null,
  );
  const [startDateKey, setStartDateKey] = useState<string | null>(
    persisted.subscriptionStartDateKey ?? null,
  );

  const confirmLockRef = useRef(false);

  useEffect(() => {
    if (!frequency) {
      router.replace(oneTimeCheckoutHref(providerId, query, 'subscribe'));
    }
  }, [frequency, providerId, query, router]);

  const returnToFrequencyStep = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace(oneTimeCheckoutHref(providerId, query, 'subscribe'));
  }, [providerId, query, router]);

  const handleBackPress = returnToFrequencyStep;

  const handleSelectOrderMode = useCallback(
    (mode: ProviderOrderFulfillmentMode) => {
      setFulfillmentMode(providerId, mode);
      router.replace(oneTimeCheckoutHref(providerId, query, mode));
    },
    [providerId, query, router, setFulfillmentMode],
  );

  const persistSchedule = useCallback(
    (patch: Parameters<typeof setSubscriptionSchedule>[1]) => {
      setSubscriptionSchedule(providerId, patch);
    },
    [providerId, setSubscriptionSchedule],
  );

  const handleToggleWeekday = useCallback(
    (id: CheckoutWeekdayId) => {
      setPickupWeekdays((current) => {
        if (current.includes(id)) {
          const next = current.filter((day) => day !== id);
          persistSchedule({ subscriptionPickupWeekdays: next });
          return next;
        }
        if (weekdayLimit === 1) {
          const next = [id];
          persistSchedule({ subscriptionPickupWeekdays: next });
          return next;
        }
        if (current.length >= 2) {
          return current;
        }
        const next = [...current, id];
        persistSchedule({ subscriptionPickupWeekdays: next });
        return next;
      });
    },
    [persistSchedule, weekdayLimit],
  );

  const handleSlotSelect = (id: CheckoutPickupTimeSlotId) => {
    setPickupSlot(id);
    persistSchedule({ subscriptionPickupTimeSlot: id });
  };

  const handleDeliverySlotSelect = (id: CheckoutPickupTimeSlotId) => {
    setDeliverySlot(id);
    persistSchedule({ subscriptionDeliveryTimeSlot: id });
  };

  const handleStartDateSelect = (day: CheckoutDayOption) => {
    setStartDateKey(day.key);
    persistSchedule({ subscriptionStartDateKey: day.key });
  };

  const scheduleValid =
    pickupWeekdays.length === weekdayLimit &&
    pickupWeekdays.length === new Set(pickupWeekdays).size &&
    pickupSlot != null &&
    startDateKey != null &&
    (deliverySameAsPickup || deliverySlot != null);

  const handleConfirm = useCallback(() => {
    if (!scheduleValid || !frequency || confirmLockRef.current) {
      return;
    }
    confirmLockRef.current = true;
    persistSchedule({
      subscriptionPickupWeekdays: pickupWeekdays,
      subscriptionPickupTimeSlot: pickupSlot ?? undefined,
      subscriptionDeliverySameAsPickup: deliverySameAsPickup,
      subscriptionDeliveryTimeSlot: deliverySameAsPickup ? undefined : deliverySlot ?? undefined,
      subscriptionStartDateKey: startDateKey ?? undefined,
    });
    router.replace(checkoutPlaceholderHref(providerId, query, { subscription: true }));
    setTimeout(() => {
      confirmLockRef.current = false;
    }, 600);
  }, [
    deliverySameAsPickup,
    deliverySlot,
    frequency,
    persistSchedule,
    pickupSlot,
    pickupWeekdays,
    providerId,
    query,
    router,
    scheduleValid,
    startDateKey,
  ]);

  const stepOneProgress = useMemo(() => {
    let completed = 0;
    const total = 3 + (deliverySameAsPickup ? 0 : 1);
    if (pickupWeekdays.length === weekdayLimit) {
      completed += 1;
    }
    if (pickupSlot != null) {
      completed += 1;
    }
    if (deliverySameAsPickup || deliverySlot != null) {
      completed += 1;
    }
    if (startDateKey != null) {
      completed += 1;
    }
    return Math.min(0.95, 0.35 + (completed / Math.max(total, 1)) * 0.55);
  }, [
    deliverySameAsPickup,
    deliverySlot,
    pickupSlot,
    pickupWeekdays.length,
    startDateKey,
    weekdayLimit,
  ]);

  const checkoutColumnWidth = CHECKOUT_ORDER_TYPE_SEGMENT_WIDTH * scale;
  const scheduleCardWidth = CHECKOUT_SCHEDULE_CARD_WIDTH * scale;
  const timeSlotGridWidth = 371.507 * scale;
  const pickupTimeColumnGap = 12 * scale;
  const pickupTimeChipWidth = 110.15 * scale;
  const timeSlotGridStyle = {
    width: timeSlotGridWidth,
    columnGap: pickupTimeColumnGap,
    rowGap: 16.022 * scale,
    alignSelf: 'center' as const,
  };

  const footer = (
    <ServiceSelectionButton
      label="Confirm"
      variant="primary"
      disabled={!scheduleValid}
      onPress={handleConfirm}
      scale={scale}
      style={{ width: '100%' }}
    />
  );

  if (!frequency) {
    return null;
  }

  const pickupHint = SUBSCRIPTION_FREQUENCY_PICKUP_HINT[frequency];

  return (
    <CheckoutScreenShell title="Choose Subscription Type" onBackPress={handleBackPress} footer={footer}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: 12 * scale,
            paddingBottom: 24 * scale,
            width: contentWidth,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <View style={[styles.checkoutColumn, { width: checkoutColumnWidth, gap: 20 * scale }]}>
          <CheckoutProgressStepper scale={scale} activeStep={1} stepOneProgress={stepOneProgress} />

          <CheckoutOrderTypeSegment
            activeMode="subscribe"
            onSelectMode={handleSelectOrderMode}
            scale={scale}
          />

          <View style={[styles.column, { width: scheduleCardWidth, gap: 12 * scale }]}>
            <View
              style={[
                styles.frequencyCard,
                {
                  width: scheduleCardWidth,
                  borderRadius: 12.016 * scale,
                  paddingVertical: 16.022 * scale,
                  paddingHorizontal: 16.022 * scale,
                  gap: 16.022 * scale,
                  ...figmaShadow(FigmaShadows.checkoutScheduleCard, scale),
                },
              ]}>
              <Text
                style={[
                  searchFont('medium'),
                  styles.panelTitle,
                  {
                    fontSize: 16 * scale,
                    lineHeight: 14 * scale,
                    letterSpacing: 0.5 * scale,
                    alignSelf: 'stretch',
                  },
                ]}>
                Choose your laundry frequency
              </Text>
              <View
                style={[
                  styles.frequencySummaryOuter,
                  {
                    width: 372.508 * scale,
                    maxWidth: 372.508 * scale,
                    minHeight: 72.060 * scale,
                    marginHorizontal: -4.507 * scale,
                    borderRadius: 8.011 * scale,
                    paddingHorizontal: 11.015 * scale,
                    paddingVertical: 4.005 * scale,
                    ...figmaDropShadow(FigmaShadows.checkoutFrequencySummary, scale),
                  },
                ]}>
                <View
                  style={[
                    styles.frequencySummary,
                    {
                      paddingLeft: (8.011 * 12 / 7.46656) * scale,
                      paddingTop: 12.016 * scale,
                      paddingBottom: 12.016 * scale,
                      paddingRight: 84 * scale,
                    },
                  ]}>
                  <Text
                    style={[
                      searchFont('semibold'),
                      styles.frequencyTitle,
                      { fontSize: 15.021 * scale, lineHeight: 13.318 * scale, letterSpacing: 0.4756 * scale },
                    ]}>
                    {frequencyTitle(frequency)}
                    <Text style={searchFont('regular')}> (selected)</Text>
                  </Text>
                  <View style={[styles.hintRow, { gap: 8.011 * scale, marginTop: 12.016 * scale }]}>
                    <Text
                      style={[
                        searchFont('medium'),
                        styles.hintCheck,
                        { fontSize: 14 * scale, lineHeight: 13.318 * scale },
                      ]}>
                      ✓
                    </Text>
                    <Text
                      style={[
                        searchFont('medium'),
                        styles.hintText,
                        {
                          fontSize: 14.019 * scale,
                          lineHeight: 13.318 * scale,
                          letterSpacing: 0.4756 * scale,
                          flexShrink: 1,
                        },
                      ]}>
                      {pickupHint}
                    </Text>
                  </View>
                </View>
                <Pressable
                  accessibilityRole="button"
                  onPress={returnToFrequencyStep}
                  style={({ pressed }) => [
                    styles.changeButton,
                    {
                      top: 22.541 * scale,
                      right: 11.015 * scale,
                      minWidth: 76.022 * scale,
                      borderRadius: SwashoRadii.sm * scale,
                      borderWidth: 1.001 * scale,
                      paddingHorizontal: 8.011 * scale,
                      paddingVertical: 6.008 * scale,
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}>
                  <Text
                    style={[
                      searchFont('medium'),
                      styles.changeLabel,
                      {
                        fontSize: 14.02 * scale,
                        lineHeight: 12.016 * scale,
                        letterSpacing: 0.5 * scale,
                      },
                    ]}>
                    Change
                  </Text>
                </Pressable>
              </View>
            </View>

            <View
              style={[
                styles.scheduleCard,
                {
                  width: scheduleCardWidth,
                  borderRadius: 12.016 * scale,
                  paddingVertical: 16.022 * scale,
                  gap: 16.022 * scale,
                  ...figmaShadow(FigmaShadows.checkoutScheduleCard, scale),
                },
              ]}>
              <View style={{ width: '100%', gap: 16.022 * scale, alignItems: 'center' }}>
                <Text
                  style={[
                    searchFont('medium'),
                    styles.sectionTitle,
                    {
                      fontSize: 16 * scale,
                      lineHeight: 14 * scale,
                      letterSpacing: 0.5 * scale,
                      alignSelf: 'flex-start',
                      marginLeft: 16 * scale,
                    },
                  ]}>
                  {weekdayLimit > 1 ? 'Choose Pickup days' : 'Choose Pickup day'}
                </Text>
                <CheckoutWeekdayNameGrid
                  selectedWeekdays={pickupWeekdays}
                  onToggleWeekday={handleToggleWeekday}
                  scale={scale}
                />
              </View>

              <CheckoutSectionDivider width={376.514 * scale} scale={scale} />

              <View style={{ width: '100%', gap: 16.022 * scale, paddingHorizontal: 16 * scale }}>
                <Text
                  style={[
                    searchFont('medium'),
                    styles.sectionTitle,
                    {
                      fontSize: 16.022 * scale,
                      lineHeight: 14.019 * scale,
                      letterSpacing: 0.5007 * scale,
                    },
                  ]}>
                  Choose Pickup Time
                </Text>
                <View style={[styles.chipGrid, timeSlotGridStyle, { paddingVertical: 8.011 * scale }]}>
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

              <CheckoutSectionDivider width={376.514 * scale} scale={scale} />

              <View
                style={{
                  width: '100%',
                  paddingHorizontal: 11.516 * scale,
                  gap: 9.012 * scale,
                  paddingVertical: 8.011 * scale,
                  alignItems: 'center',
                }}>
                <Text
                  style={[
                    searchFont('medium'),
                    styles.sectionTitle,
                    styles.deliverySectionTitle,
                    {
                      fontSize: 16.022 * scale,
                      lineHeight: 14.019 * scale,
                      letterSpacing: 0.5007 * scale,
                    },
                  ]}>
                  Choose Delivery Time
                </Text>
                <View style={[styles.deliveryRow, styles.deliveryRowFullWidth, { gap: 8 * scale }]}>
                  <ServiceCheckbox
                    checked={deliverySameAsPickup}
                    onChange={(next) => {
                      setDeliverySameAsPickup(next);
                      persistSchedule({
                        subscriptionDeliverySameAsPickup: next,
                        ...(next ? { subscriptionDeliveryTimeSlot: undefined } : {}),
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
                      {
                        fontSize: 12.016 * scale,
                        lineHeight: 20.027 * scale,
                        letterSpacing: 0.5007 * scale,
                      },
                    ]}>
                    Same as Pickup time
                  </Text>
                </View>
                {!deliverySameAsPickup ? (
                  <View
                    style={[
                      styles.chipGrid,
                      timeSlotGridStyle,
                      { paddingTop: 8.011 * scale, paddingBottom: 8.011 * scale },
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

            <View
              style={[
                styles.scheduleCard,
                {
                  width: scheduleCardWidth,
                  borderRadius: 12.016 * scale,
                  paddingVertical: 16.022 * scale,
                  gap: 16.022 * scale,
                  ...figmaShadow(FigmaShadows.checkoutScheduleCard, scale),
                },
              ]}>
              <CheckoutStartDateSection
                days={upcomingDays}
                selectedKey={startDateKey}
                onSelectDay={handleStartDateSelect}
                scale={scale}
                cardWidth={scheduleCardWidth}
              />
            </View>
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
  checkoutColumn: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  column: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  frequencyCard: {
    backgroundColor: SwashoColors.surface,
    alignItems: 'stretch',
  },
  panelTitle: {
    color: SwashoColors.darkHeaderText,
    textAlign: 'left',
  },
  frequencySummaryOuter: {
    alignSelf: 'center',
    backgroundColor: SwashoColors.surface,
    position: 'relative',
    overflow: 'visible',
  },
  frequencySummary: {
    alignSelf: 'stretch',
  },
  frequencyTitle: {
    color: SwashoColors.neutral950,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  hintCheck: {
    color: SwashoColors.primary600,
  },
  hintText: {
    color: SwashoColors.primary600,
  },
  changeButton: {
    position: 'absolute',
    borderColor: SwashoColors.primary200,
    backgroundColor: SwashoColors.surface,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeLabel: {
    color: SwashoColors.primary600,
    textAlign: 'center',
  },
  scheduleCard: {
    backgroundColor: SwashoColors.surface,
    alignSelf: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    color: SwashoColors.darkHeaderText,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryRowFullWidth: {
    alignSelf: 'stretch',
  },
  deliverySectionTitle: {
    alignSelf: 'flex-start',
    width: '100%',
  },
  deliveryLabel: {
    color: SwashoColors.neutral900,
  },
});
