import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AltArrowDownIcon, AltArrowRightIcon, ArrowLeftIcon, CalendarLinearIcon } from '@/components/home/figma-icons';
import { ChevronDownIcon } from '@/components/provider-page/provider-page-icons';
import { figmaShadow, FigmaShadows } from '@/components/home/figma-shadows';
import { HomeIndicator } from '@/components/home/HomeIndicator';
import { useSafeTopInset, useScreenScale } from '@/components/home/scale';
import { SearchStatusBar } from '@/components/search/SearchStatusBar';
import { searchFont } from '@/components/search/search-fonts';
import { ServiceSelectionButton } from '@/components/service-selection/ServiceSelectionButton';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';
import { useProviderCart } from '@/context/provider-cart-context';
import { garmentCatalogIdFromServiceId } from '@/data/garment-pricing';
import { getProviderResultById } from '@/data/providers';
import {
  buildCheckoutBasketGroups,
  checkoutBasketItemCount,
  formatCheckoutInr,
  type CheckoutBasketLine,
} from '@/lib/build-checkout-basket';
import {
  CHECKOUT_PICKUP_TIME_SLOTS,
  CHECKOUT_WEEKDAY_OPTIONS,
  checkoutDayOptionFromKey,
  oneTimeCheckoutHref,
  subscriptionSubscribe2Href,
  SUBSCRIPTION_FREQUENCY_OPTIONS,
  type CheckoutWeekdayId,
} from '@/lib/checkout-flow';
import { CHECKOUT_SCHEDULE_CARD_WIDTH } from '@/lib/checkout-figma-layout';
import { isBulkServiceId } from '@/lib/provider-cart-selection';

import { CheckoutSectionDivider } from './CheckoutSectionDivider';
import {
  CheckoutAddSquareIcon,
  CheckoutBillIcon,
  CheckoutCartIcon,
  CheckoutCheckSquareIcon,
  CheckoutConfettiIcon,
  CheckoutContactlessIcon,
  CheckoutEditPenSquareIcon,
  CheckoutGarmentThumbIcon,
  CheckoutInfoIcon,
  CheckoutInstructionDoorstepIcon,
  CheckoutInstructionPenIcon,
  CheckoutInstructionPhoneIcon,
  CheckoutInstructionShieldIcon,
  CheckoutInstructionsHeaderIcon,
  CheckoutMoneyTagIcon,
} from './checkout-review-icons';

const compensationShieldImage = require('@/assets/checkout/compensation-shield.png');
const STATUS_BAR_HEIGHT = 32;
const HEADER_BLOCK_HEIGHT = 114;
/** Figma 3353:13605 — scroll content / banner starts at y=101 (flush under header). */
const CHECKOUT_REVIEW_CONTENT_TOP = 101;
/** Figma 3353:13608 at y=136 vs banner 3353:13605 bottom y=150 — schedule stack overlaps banner by 14px. */
const SUBSCRIBER_SCHEDULE_STACK_OVERLAP = 14;
const HOME_INDICATOR_HEIGHT = 24;
const BOTTOM_BAR_HEIGHT = 80;
const COMPENSATION_BAR_HEIGHT = 54;
/** Figma 3353:13981 — shield frame in compensation bar (3353:13980). */
const COMPENSATION_SHIELD_FRAME_WIDTH = 33.413;
const COMPENSATION_SHIELD_FRAME_HEIGHT = 33.405;
/** Figma image crop inside the frame (overflow hidden). */
const COMPENSATION_SHIELD_IMAGE_WIDTH_RATIO = 1.141;
const COMPENSATION_SHIELD_IMAGE_HEIGHT_RATIO = 1.7119;
const COMPENSATION_SHIELD_IMAGE_LEFT_RATIO = -0.0705;
const COMPENSATION_SHIELD_IMAGE_TOP_RATIO = -0.3033;

const WEEKDAY_EVERY_LABEL: Record<CheckoutWeekdayId, string> = {
  mon: 'Monday',
  tue: 'Tuesday',
  wed: 'Wednesday',
  thu: 'Thursday',
  fri: 'Friday',
  sat: 'Saturday',
  sun: 'Sunday',
};

const CHECKOUT_HOME_ADDRESS = '2O1, lodha luxuria, kolshet road Dhokal';

type CheckoutReviewScreenProps = {
  providerId: string;
  query: string;
  isSubscription: boolean;
};

type InstructionId = 'call' | 'guard' | 'doorstep' | 'custom';

const INSTRUCTION_OPTIONS: {
  id: InstructionId;
  label: string;
  Icon: typeof CheckoutInstructionPhoneIcon;
}[] = [
  { id: 'call', label: 'Call before Pickup', Icon: CheckoutInstructionPhoneIcon },
  { id: 'guard', label: 'Collect from Guard', Icon: CheckoutInstructionShieldIcon },
  { id: 'doorstep', label: 'Clothes at Doorstep', Icon: CheckoutInstructionDoorstepIcon },
  { id: 'custom', label: 'Custom Instruction', Icon: CheckoutInstructionPenIcon },
];

const SUBSCRIBER_REGULAR_RATIO = 1057.5 / 900;
const SUBSCRIBER_PAY_RATIO = 704.5 / 1062;
const GST_RATE = 0.18;
/** Figma 3353:13605 — vertical wash (primary/100 → primary/50). */
const SUBSCRIBER_BANNER_GRADIENT_COLORS = [SwashoColors.primary100, SwashoColors.primary50] as const;
const SUBSCRIBER_BANNER_HEIGHT = 49;

function basketGarmentThumbVariant(serviceId: string): 'bulk' | 'tshirt' | 'top' {
  if (isBulkServiceId(serviceId)) {
    return 'bulk';
  }
  const catalogId = garmentCatalogIdFromServiceId(serviceId);
  if (catalogId === 'tshirt') {
    return 'tshirt';
  }
  return 'top';
}

function buildPaymentSummaryDisplay(serviceTotal: number, isSubscription: boolean) {
  const serviceValue = serviceTotal;
  const gst = Math.round(serviceValue * GST_RATE);
  const weeklyBill = serviceValue + gst;

  if (!isSubscription || serviceTotal <= 0) {
    return {
      showSubscriberRows: false,
      regularServiceValue: 0,
      subscriberSaving: 0,
      serviceValue,
      gst,
      weeklyBill,
      payLabelAmount: weeklyBill,
    };
  }

  const regularServiceValue = Math.round(serviceValue * SUBSCRIBER_REGULAR_RATIO * 10) / 10;
  const subscriberSaving = Math.round((regularServiceValue - serviceValue) * 10) / 10;
  const payLabelAmount = Math.round(weeklyBill * SUBSCRIBER_PAY_RATIO * 10) / 10;

  return {
    showSubscriberRows: true,
    regularServiceValue,
    subscriberSaving,
    serviceValue,
    gst,
    weeklyBill,
    payLabelAmount,
  };
}

function compareAtPrice(price: number): number {
  return Math.round(price * SUBSCRIBER_REGULAR_RATIO);
}

function formatSlotCompact(slotId: string | undefined): string {
  if (!slotId) {
    return '';
  }
  const label = CHECKOUT_PICKUP_TIME_SLOTS.find((slot) => slot.id === slotId)?.label ?? slotId;
  return label.replace(/\s/g, '').replace('AM', 'AM').replace('PM', 'PM');
}

function formatStartLabel(dateKey: string | undefined): string | undefined {
  if (!dateKey) {
    return undefined;
  }
  const option = checkoutDayOptionFromKey(dateKey);
  const month = option.dateLine.split(' ')[1]?.toLowerCase() ?? '';
  return `${option.dayOfMonth} ${month}`;
}

export function CheckoutReviewScreen({ providerId, query, isSubscription }: CheckoutReviewScreenProps) {
  const router = useRouter();
  const { scale, contentWidth } = useScreenScale();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const { getCheckoutState, getProviderCartTotals, getProviderCartEntries } = useProviderCart();

  const provider = getProviderResultById(providerId, query);
  const checkout = getCheckoutState(providerId);
  const cartEntries = useMemo(() => getProviderCartEntries(providerId), [getProviderCartEntries, providerId]);
  const basketGroups = useMemo(
    () => buildCheckoutBasketGroups(providerId, query, cartEntries),
    [cartEntries, providerId, query],
  );
  const basketCount = checkoutBasketItemCount(cartEntries);
  const totals = getProviderCartTotals(providerId);
  const paymentDisplay = useMemo(
    () => buildPaymentSummaryDisplay(totals.totalPrice, isSubscription),
    [isSubscription, totals.totalPrice],
  );

  const [contactless, setContactless] = useState(false);
  const [instructionTab, setInstructionTab] = useState<'pickup' | 'delivery'>('pickup');
  const [pickupInstruction, setPickupInstruction] = useState<InstructionId>('doorstep');
  const [deliveryInstruction, setDeliveryInstruction] = useState<InstructionId>('doorstep');
  const [rememberInstructions, setRememberInstructions] = useState(true);
  const [paymentExpanded, setPaymentExpanded] = useState(true);
  const payLockRef = useRef(false);

  const cardWidth = CHECKOUT_SCHEDULE_CARD_WIDTH * scale;
  const returnToSchedule = useCallback(() => {
    if (isSubscription) {
      router.replace(subscriptionSubscribe2Href(providerId, query));
      return;
    }
    router.replace(oneTimeCheckoutHref(providerId, query, 'one-time'));
  }, [isSubscription, providerId, query, router]);

  const handleBackPress = useCallback(() => {
    returnToSchedule();
  }, [returnToSchedule]);

  const handleEditService = useCallback(
    (serviceId: string) => {
      router.push({
        pathname: '/service-selection/[serviceId]' as const,
        params: { serviceId, providerId, q: query },
      } as never);
    },
    [providerId, query, router],
  );

  const handlePayPress = useCallback(() => {
    if (payLockRef.current || totals.itemCount <= 0) {
      return;
    }
    payLockRef.current = true;
    Alert.alert(
      'Order placed',
      `Your ${isSubscription ? 'subscription' : 'order'} with ${provider?.category ?? 'the provider'} is confirmed for ${formatCheckoutInr(totals.totalPrice)} (estimated).`,
      [
        {
          text: 'OK',
          onPress: () => router.replace('/'),
        },
      ],
    );
    setTimeout(() => {
      payLockRef.current = false;
    }, 800);
  }, [isSubscription, provider?.category, router, totals.itemCount, totals.totalPrice]);

  const subscriptionFrequencyTitle =
    SUBSCRIPTION_FREQUENCY_OPTIONS.find((option) => option.id === checkout.subscriptionFrequency)?.title ??
    'Subscription';
  const startLabel = formatStartLabel(checkout.subscriptionStartDateKey);

  const pickupWeekdayLabels = (checkout.subscriptionPickupWeekdays ?? [checkout.pickupWeekday])
    .filter(Boolean)
    .map((id) => WEEKDAY_EVERY_LABEL[id as CheckoutWeekdayId] ?? id);

  const pickupSlot = isSubscription ? checkout.subscriptionPickupTimeSlot : checkout.pickupTimeSlot;
  const deliverySame = isSubscription
    ? checkout.subscriptionDeliverySameAsPickup ?? true
    : checkout.deliverySameAsPickup ?? true;
  const deliverySlot = isSubscription ? checkout.subscriptionDeliveryTimeSlot : checkout.deliveryTimeSlot;

  const pickupLine = isSubscription
    ? pickupWeekdayLabels.length > 0
      ? `Every ${pickupWeekdayLabels.join(', ')}`
      : undefined
    : checkout.pickupWeekday
      ? CHECKOUT_WEEKDAY_OPTIONS.find((d) => d.id === checkout.pickupWeekday)?.label ?? checkout.pickupWeekday
      : undefined;

  const activeInstruction = instructionTab === 'pickup' ? pickupInstruction : deliveryInstruction;
  const setActiveInstruction = instructionTab === 'pickup' ? setPickupInstruction : setDeliveryInstruction;

  const scrollBottomPadding =
    (COMPENSATION_BAR_HEIGHT + BOTTOM_BAR_HEIGHT + HOME_INDICATOR_HEIGHT) * scale + 24 * scale;

  const footer = (
    <View style={styles.footerStack}>
      <LinearGradient
        colors={['#eff5ff', SwashoColors.info100]}
        start={{ x: 1, y: 0.5 }}
        end={{ x: 0, y: 0.5 }}
        style={[
          styles.compensationBar,
          {
            paddingHorizontal: 16 * scale,
            paddingVertical: 10 * scale,
            borderTopLeftRadius: SwashoRadii.xl * scale,
            borderTopRightRadius: SwashoRadii.xl * scale,
            gap: 8 * scale,
          },
        ]}>
        <View
          style={{
            width: COMPENSATION_SHIELD_FRAME_WIDTH * scale,
            height: COMPENSATION_SHIELD_FRAME_HEIGHT * scale,
            overflow: 'hidden',
          }}>
          <Image
            source={compensationShieldImage}
            style={{
              position: 'absolute',
              width: COMPENSATION_SHIELD_FRAME_WIDTH * COMPENSATION_SHIELD_IMAGE_WIDTH_RATIO * scale,
              height: COMPENSATION_SHIELD_FRAME_HEIGHT * COMPENSATION_SHIELD_IMAGE_HEIGHT_RATIO * scale,
              left: COMPENSATION_SHIELD_FRAME_WIDTH * COMPENSATION_SHIELD_IMAGE_LEFT_RATIO * scale,
              top: COMPENSATION_SHIELD_FRAME_HEIGHT * COMPENSATION_SHIELD_IMAGE_TOP_RATIO * scale,
            }}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
          />
        </View>
        <View style={{ flex: 1, gap: 6 * scale }}>
          <Text style={[searchFont('medium'), styles.compensationTitle, { fontSize: 13 * scale, lineHeight: 14 * scale }]}>
            We&apos;ve Got You Covered
          </Text>
          <Text style={[searchFont('medium'), styles.compensationTitle, { fontSize: 13 * scale, lineHeight: 14 * scale }]}>
            Protected by Compensation Policy
          </Text>
        </View>
        <Text style={[searchFont('semibold'), styles.compensationLink, { fontSize: 13 * scale }]}>View</Text>
      </LinearGradient>
      <View
        style={[
          styles.payBar,
          {
            height: BOTTOM_BAR_HEIGHT * scale,
            paddingHorizontal: 20 * scale,
            paddingVertical: 12 * scale,
            gap: 12 * scale,
            ...figmaShadow(FigmaShadows.sheet, scale),
          },
        ]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Change payment method"
          style={[styles.payMethodCol, { width: 156 * scale, paddingHorizontal: 4 * scale, gap: 6 * scale }]}>
          <View style={{ gap: 0 }}>
            <Text style={[searchFont('medium'), styles.payMeta, { fontSize: 14 * scale, lineHeight: 20 * scale }]}>
              by Card
            </Text>
            <Text style={[searchFont('semibold'), styles.payAmountLabel, { fontSize: 14 * scale, lineHeight: 20 * scale }]}>
              Abhi&apos;s Hdfc <Text style={searchFont('medium')}>XX81</Text>
            </Text>
          </View>
          <AltArrowRightIcon width={20 * scale} height={20 * scale} />
        </Pressable>
        <ServiceSelectionButton
          label={`Pay ${formatCheckoutInr(paymentDisplay.payLabelAmount)}`}
          variant="primary"
          disabled={totals.itemCount <= 0}
          onPress={handlePayPress}
          scale={scale}
          style={{ width: 199 * scale, minHeight: 52 * scale }}
        />
      </View>
    </View>
  );

  return (
    <View style={[styles.root, { paddingTop: safeTop }]}>
      <View style={[styles.frame, { width: contentWidth }]}>
        <View style={[styles.statusBar, { top: safeTop, height: STATUS_BAR_HEIGHT * scale }]}>
          <SearchStatusBar scale={scale} />
        </View>

        <View
          style={[
            styles.header,
            {
              top: safeTop,
              minHeight: HEADER_BLOCK_HEIGHT * scale,
              paddingTop: 64 * scale,
              paddingBottom: 4 * scale,
              paddingHorizontal: 20 * scale,
              ...figmaShadow(FigmaShadows.providerCard, scale),
            },
          ]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={handleBackPress}
            style={[styles.backHit, { width: 26 * scale, height: 26 * scale }]}>
            <ArrowLeftIcon width={20 * scale} height={20 * scale} />
          </Pressable>
          <View style={[styles.headerTextCol, { gap: 4 * scale, flex: 1, marginLeft: 9 * scale }]}>
            <Text style={[searchFont('medium'), styles.providerCategory, { fontSize: 14 * scale, lineHeight: 12 * scale }]}>
              {provider?.category ?? 'Laundromat'}
            </Text>
            <View style={[styles.addressRow, { gap: 4 * scale }]}>
              <View style={[styles.homeChip, { gap: 4 * scale }]}>
                <Text style={[searchFont('medium'), styles.homeLabel, { fontSize: 14 * scale, lineHeight: 12 * scale }]}>
                  Home
                </Text>
                <AltArrowDownIcon width={18 * scale} height={18 * scale} />
              </View>
              <Text
                numberOfLines={1}
                style={[searchFont('medium'), styles.addressLine, { fontSize: 14 * scale, lineHeight: 12 * scale, flex: 1 }]}>
                {CHECKOUT_HOME_ADDRESS}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1, marginTop: safeTop + CHECKOUT_REVIEW_CONTENT_TOP * scale }}
          contentContainerStyle={{
            alignItems: 'center',
            paddingTop: isSubscription ? 0 : 12 * scale,
            paddingBottom: scrollBottomPadding,
          }}
          showsVerticalScrollIndicator={false}>
          {isSubscription ? (
            <LinearGradient
              colors={[...SUBSCRIBER_BANNER_GRADIENT_COLORS]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={[
                styles.subscriberBanner,
                {
                  alignSelf: 'stretch',
                  width: '100%',
                  height: SUBSCRIBER_BANNER_HEIGHT * scale,
                  paddingTop: 8 * scale,
                  paddingBottom: 15 * scale,
                  gap: 6 * scale,
                  zIndex: -1,
                },
              ]}>
              <CheckoutConfettiIcon width={20 * scale} height={20 * scale} />
              <Text
                style={[
                  searchFont('medium'),
                  styles.subscriberBannerText,
                  { fontSize: 13 * scale, lineHeight: 20 * scale },
                ]}>
                You&apos;re enjoying subscriber exclusive pricing
              </Text>
            </LinearGradient>
          ) : null}

          <View
            style={{
              width: '100%',
              alignItems: 'center',
              gap: 12 * scale,
              marginTop: isSubscription ? -SUBSCRIBER_SCHEDULE_STACK_OVERLAP * scale : 0,
            }}>
            <ScheduleCard
              scale={scale}
              cardWidth={cardWidth}
              isSubscription={isSubscription}
              subscriptionFrequencyTitle={subscriptionFrequencyTitle}
              startLabel={startLabel}
              pickupLine={pickupLine}
              pickupSlot={formatSlotCompact(pickupSlot)}
              deliverySame={deliverySame}
              deliverySlot={formatSlotCompact(deliverySlot)}
              onChangePress={returnToSchedule}
            />

            <ContactlessCard scale={scale} cardWidth={cardWidth} value={contactless} onValueChange={setContactless} />

            <BasketCard
              scale={scale}
              cardWidth={cardWidth}
              basketCount={basketCount}
              groups={basketGroups}
              showCompareAt={isSubscription}
              onEditLine={handleEditService}
            />

            <InstructionsCard
              scale={scale}
              cardWidth={cardWidth}
              instructionTab={instructionTab}
              onTabChange={setInstructionTab}
              activeInstruction={activeInstruction}
              onSelectInstruction={setActiveInstruction}
              rememberInstructions={rememberInstructions}
              onToggleRemember={() => setRememberInstructions((value) => !value)}
            />

            <PaymentSummaryCard
              scale={scale}
              cardWidth={cardWidth}
              expanded={paymentExpanded}
              onToggleExpanded={() => setPaymentExpanded((value) => !value)}
              paymentDisplay={paymentDisplay}
              isSubscription={isSubscription}
            />
          </View>
        </ScrollView>

        <View style={[styles.footerWrap, { bottom: HOME_INDICATOR_HEIGHT * scale }]}>{footer}</View>

        <View style={styles.homeIndicatorWrap} pointerEvents="none">
          <HomeIndicator scale={scale} />
        </View>
      </View>
    </View>
  );
}

function IconTile({ scale, children }: { scale: number; children: ReactNode }) {
  return (
    <View
      style={[
        styles.iconTile,
        {
          width: 40 * scale,
          height: 40 * scale,
          borderRadius: SwashoRadii.md * scale,
          borderWidth: 0.5 * scale,
        },
      ]}>
      {children}
    </View>
  );
}

function ScheduleCard({
  scale,
  cardWidth,
  isSubscription,
  subscriptionFrequencyTitle,
  startLabel,
  pickupLine,
  pickupSlot,
  deliverySame,
  deliverySlot,
  onChangePress,
}: {
  scale: number;
  cardWidth: number;
  isSubscription: boolean;
  subscriptionFrequencyTitle: string;
  startLabel?: string;
  pickupLine?: string;
  pickupSlot: string;
  deliverySame: boolean;
  deliverySlot: string;
  onChangePress: () => void;
}) {
  return (
    <View
      style={[
        styles.card,
        {
          width: cardWidth,
          paddingHorizontal: 10 * scale,
          paddingVertical: 8 * scale,
          gap: 8 * scale,
          borderRadius: SwashoRadii.lg * scale,
          ...figmaShadow(FigmaShadows.checkoutScheduleCard, scale),
        },
      ]}>
      {isSubscription ? (
        <View
          style={{
            height: 18 * scale,
            justifyContent: 'center',
            paddingHorizontal: 4 * scale,
            width: '100%',
          }}>
          <View style={[styles.row, { gap: 4 * scale, flexWrap: 'wrap', alignItems: 'center' }]}>
            <View style={[styles.row, { gap: 7 * scale, paddingHorizontal: 2 * scale, alignItems: 'center' }]}>
              <Text
                style={[
                  searchFont('medium'),
                  styles.cardHeading,
                  { fontSize: 14 * scale, lineHeight: 13.3 * scale, letterSpacing: 0.475 * scale },
                ]}>
                Subscription:
              </Text>
              <Text
                style={[
                  searchFont('semibold'),
                  styles.cardHeading,
                  { fontSize: 14 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
                ]}>
                {subscriptionFrequencyTitle}
              </Text>
            </View>
            {startLabel ? (
              <Text
                style={[
                  searchFont('semibold'),
                  styles.cardHeading,
                  { fontSize: 14 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
                ]}>
                (Start {startLabel})
              </Text>
            ) : null}
          </View>
        </View>
      ) : null}
      {isSubscription ? <CheckoutSectionDivider width={376.514 * scale} scale={scale} /> : null}
      <View
        style={[
          styles.scheduleRow,
          {
            gap: 8 * scale,
            paddingTop: 8 * scale,
            paddingBottom: 8 * scale,
            paddingLeft: 2 * scale,
          },
        ]}>
        <IconTile scale={scale}>
          <CalendarLinearIcon width={24 * scale} height={24 * scale} stroke={SwashoColors.neutral950} />
        </IconTile>
        <View style={{ flex: 1, gap: 12 * scale }}>
          {pickupLine ? (
            <ScheduleTimingRow label="Pickup:" parts={[pickupLine, pickupSlot].filter(Boolean)} scale={scale} />
          ) : null}
          <ScheduleTimingRow
            label="Delivery:"
            parts={deliverySame ? ['Next day', pickupSlot || deliverySlot].filter(Boolean) : [deliverySlot].filter(Boolean)}
            scale={scale}
          />
        </View>
        <Pressable accessibilityRole="button" onPress={onChangePress} hitSlop={8}>
          <Text
            style={[
              searchFont('medium'),
              styles.changeLink,
              { fontSize: 14 * scale, lineHeight: 12 * scale, letterSpacing: 0.5 * scale },
            ]}>
            Change
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function ScheduleTimingRow({
  label,
  parts,
  scale,
}: {
  label: string;
  parts: string[];
  scale: number;
}) {
  return (
    <View style={[styles.row, { flexWrap: 'wrap', gap: 4 * scale, alignItems: 'center' }]}>
      <Text style={[searchFont('medium'), styles.cardHeading, { fontSize: 14 * scale, lineHeight: 14 * scale }]}>
        {label}
      </Text>
      {parts.map((part, index) => (
        <View key={`${part}-${index}`} style={[styles.row, { gap: 4 * scale, alignItems: 'center' }]}>
          {index > 0 ? (
            <View
              style={{
                width: 4 * scale,
                height: 4 * scale,
                borderRadius: 2 * scale,
                backgroundColor: SwashoColors.neutral950,
              }}
            />
          ) : null}
          <Text style={[searchFont('semibold'), styles.cardHeading, { fontSize: 14 * scale, lineHeight: 14 * scale }]}>
            {part}
          </Text>
        </View>
      ))}
    </View>
  );
}

function ContactlessCard({
  scale,
  cardWidth,
  value,
  onValueChange,
}: {
  scale: number;
  cardWidth: number;
  value: boolean;
  onValueChange: (next: boolean) => void;
}) {
  return (
    <View
      style={[
        styles.card,
        {
          width: cardWidth,
          paddingHorizontal: 10 * scale,
          paddingVertical: 12 * scale,
          borderRadius: SwashoRadii.lg * scale,
          ...figmaShadow(FigmaShadows.checkoutScheduleCard, scale),
        },
      ]}>
      <View style={[styles.row, { gap: 12 * scale, width: '100%', alignItems: 'center' }]}>
        <IconTile scale={scale}>
          <CheckoutContactlessIcon width={24 * scale} height={24 * scale} />
        </IconTile>
        <View style={{ flex: 1, minWidth: 0, gap: 8 * scale }}>
          <Text style={[searchFont('semibold'), styles.cardHeading, { fontSize: 15 * scale, lineHeight: 14 * scale }]}>
            Contactless Service
          </Text>
          <Text style={[searchFont('regular'), styles.muted, { fontSize: 12 * scale, lineHeight: 16 * scale }]}>
            upload/capture image required
          </Text>
        </View>
        <ContactlessToggle scale={scale} value={value} onValueChange={onValueChange} style={{ flexShrink: 0, marginLeft: 'auto' }} />
      </View>
      <Pressable style={{ paddingHorizontal: 8 * scale, marginTop: 12 * scale }}>
        <Text style={[searchFont('medium'), styles.dottedLink, { fontSize: 13 * scale, lineHeight: 20 * scale }]}>
          How it works?
        </Text>
      </Pressable>
    </View>
  );
}

function BasketCard({
  scale,
  cardWidth,
  basketCount,
  groups,
  showCompareAt,
  onEditLine,
}: {
  scale: number;
  cardWidth: number;
  basketCount: number;
  groups: ReturnType<typeof buildCheckoutBasketGroups>;
  showCompareAt: boolean;
  onEditLine: (serviceId: string) => void;
}) {
  return (
    <View
      style={[
        styles.card,
        {
          width: cardWidth,
          paddingHorizontal: 10 * scale,
          paddingVertical: 16 * scale,
          gap: 16 * scale,
          borderRadius: SwashoRadii.lg * scale,
          ...figmaShadow(FigmaShadows.providerCard, scale),
        },
      ]}>
      <View
        style={[
          styles.row,
          {
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 6 * scale,
            gap: 8 * scale,
          },
        ]}>
        <View style={[styles.row, { flex: 1, minWidth: 0, gap: 8 * scale, alignItems: 'center' }]}>
          <IconTile scale={scale}>
            <CheckoutCartIcon width={24 * scale} height={24 * scale} />
          </IconTile>
          <Text
            numberOfLines={1}
            style={[searchFont('semibold'), styles.basketTitle, { fontSize: 15 * scale, flexShrink: 1, letterSpacing: 0.3 * scale }]}>
            Your Basket{' '}
            <Text style={[searchFont('medium'), styles.muted, { fontSize: 13 * scale, letterSpacing: 0.5 * scale, lineHeight: 20 * scale }]}>
              ({basketCount} {basketCount === 1 ? 'Item' : 'Items'})
            </Text>
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Add basket instruction"
          style={[
            styles.instructionChip,
            styles.row,
            {
              flexShrink: 0,
              alignSelf: 'flex-end',
              borderRadius: SwashoRadii.md * scale,
              paddingHorizontal: 4 * scale,
              height: 29 * scale,
              minWidth: 60 * scale,
              borderWidth: 1,
              gap: 4 * scale,
            },
          ]}>
          <View
            style={{
              width: 20 * scale,
              height: 20 * scale,
              overflow: 'hidden',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <CheckoutAddSquareIcon
              width={40 * scale}
              height={40 * scale}
              style={{ position: 'absolute', left: -10 * scale, top: -10 * scale }}
            />
          </View>
          <Text
            style={[
              searchFont('semibold'),
              styles.instructionChipLabel,
              { fontSize: 12 * scale, lineHeight: 20 * scale, letterSpacing: 0.5 * scale },
            ]}>
            Instruction
          </Text>
        </Pressable>
      </View>
      <CheckoutSectionDivider width={376.514 * scale} scale={scale} />
      {groups.map((group) => (
        <View key={group.sectionId} style={{ width: '100%', gap: 12 * scale }}>
          <View style={[styles.row, { height: 24 * scale, justifyContent: 'space-between' }]}>
            <Text style={[searchFont('semibold'), styles.sectionLabel, { fontSize: 15 * scale, lineHeight: 14 * scale, letterSpacing: 0.3 * scale }]}>
              {group.sectionTitle}
            </Text>
            <ChevronDownIcon width={24 * scale} height={24 * scale} />
          </View>
          {group.lines.map((line, index) => (
            <BasketLineRow
              key={`${line.serviceId}-${index}`}
              line={line}
              scale={scale}
              showCompareAt={showCompareAt}
              onEdit={() => onEditLine(line.serviceId)}
            />
          ))}
          <CheckoutSectionDivider width={362 * scale} scale={scale} />
        </View>
      ))}
    </View>
  );
}

function BasketLineRow({
  line,
  scale,
  showCompareAt,
  onEdit,
}: {
  line: CheckoutBasketLine;
  scale: number;
  showCompareAt: boolean;
  onEdit: () => void;
}) {
  const compareAt = showCompareAt && line.price > 0 ? compareAtPrice(line.price) : null;
  const qtyLabel = line.quantityLabel?.trim() ?? '';
  const showQtySuffix = qtyLabel.toLowerCase().startsWith('x');
  const qtySuffix = showQtySuffix ? qtyLabel.replace(/^x\s*/i, '') : '';
  const hasMultipleServices = line.detailLines.length > 1;
  const singleServiceLine = line.detailLines.length === 1 ? line.detailLines[0] : null;
  const bulkQuantitySubline =
    !line.detailLines.length && line.quantityLabel && !showQtySuffix ? line.quantityLabel : null;

  return (
    <View style={{ gap: 16 * scale, paddingHorizontal: 12 * scale, paddingTop: 4 * scale, paddingBottom: 8 * scale }}>
      <View style={[styles.row, { alignItems: 'flex-start', gap: 16 * scale }]}>
        <View style={{ flex: 1, gap: 16 * scale, paddingRight: 8 * scale }}>
          <View style={[styles.row, { gap: 8 * scale, alignItems: 'flex-start', minHeight: 57 * scale }]}>
            <View
              style={[
                styles.garmentThumb,
                {
                  width: 40 * scale,
                  height: 40 * scale,
                  borderRadius: 3.5 * scale,
                  borderWidth: 0.438 * scale,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}>
              <CheckoutGarmentThumbIcon
                variant={basketGarmentThumbVariant(line.serviceId)}
                width={28 * scale}
                height={25 * scale}
              />
            </View>
            <View style={{ flex: 1, gap: 8 * scale, justifyContent: 'center' }}>
              <View style={[styles.row, { gap: 8 * scale, alignItems: 'center', flexWrap: 'wrap' }]}>
                <Text
                  style={[
                    searchFont('semibold'),
                    styles.sectionLabel,
                    { fontSize: 14 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
                  ]}>
                  {line.title}
                </Text>
                {showQtySuffix ? (
                  <View style={[styles.row, { gap: 4 * scale, alignItems: 'center' }]}>
                    <Text
                      style={[
                        searchFont('semibold'),
                        styles.sectionLabel,
                        { fontSize: 14 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
                      ]}>
                      x
                    </Text>
                    <Text
                      style={[
                        searchFont('semibold'),
                        styles.sectionLabel,
                        { fontSize: 14 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
                      ]}>
                      {qtySuffix}
                    </Text>
                  </View>
                ) : null}
              </View>
              {hasMultipleServices ? (
                <Pressable accessibilityRole="button" style={[styles.row, { gap: 4 * scale, alignItems: 'center' }]}>
                  <Text
                    style={[
                      searchFont('medium'),
                      styles.sectionLabel,
                      { fontSize: 13 * scale, lineHeight: 20 * scale, letterSpacing: 0.5 * scale },
                    ]}>
                    Services
                  </Text>
                  <ChevronDownIcon width={18 * scale} height={18 * scale} />
                </Pressable>
              ) : singleServiceLine ? (
                <Text
                  style={[
                    searchFont('medium'),
                    styles.sectionLabel,
                    { fontSize: 13 * scale, lineHeight: 20 * scale, letterSpacing: 0.5 * scale },
                  ]}>
                  {singleServiceLine}
                </Text>
              ) : bulkQuantitySubline ? (
                <Text
                  style={[
                    searchFont('semibold'),
                    styles.cardHeading,
                    { fontSize: 14 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
                  ]}>
                  {bulkQuantitySubline}
                </Text>
              ) : null}
            </View>
          </View>
          {hasMultipleServices ? (
            <View style={{ gap: 20 * scale, paddingLeft: 32 * scale }}>
              {line.detailLines.map((detail, detailIndex) => (
                <View key={detail}>
                  <Text
                    style={[
                      searchFont('semibold'),
                      styles.cardHeading,
                      {
                        fontSize: 14 * scale,
                        lineHeight: 14 * scale,
                        letterSpacing: 0.5 * scale,
                        paddingHorizontal: 14 * scale,
                      },
                    ]}>
                    {detail}
                  </Text>
                  {detailIndex < line.detailLines.length - 1 ? (
                    <View style={{ marginTop: 20 * scale }}>
                      <CheckoutSectionDivider width={349 * scale} scale={scale} />
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}
        </View>
        <View style={{ alignItems: 'flex-end', gap: 10 * scale, flexShrink: 0 }}>
          <View style={{ alignItems: 'flex-end', gap: 4 * scale }}>
            <View style={[styles.row, { gap: 8 * scale, alignItems: 'flex-end' }]}>
              {compareAt ? (
                <Text
                  style={[
                    searchFont('medium'),
                    styles.strikePrice,
                    { fontSize: 12 * scale, lineHeight: 10 * scale, letterSpacing: 0.5 * scale },
                  ]}>
                  {formatCheckoutInr(compareAt)}
                </Text>
              ) : null}
              <Text
                style={[
                  searchFont('semibold'),
                  styles.price,
                  { fontSize: 14 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
                ]}>
                {formatCheckoutInr(line.price)}
                {line.priceSuffix ? (
                  <Text style={[searchFont('semibold'), styles.price, { fontSize: 14 * scale }]}>{line.priceSuffix}</Text>
                ) : null}
                {line.estimated ? '*' : ''}
              </Text>
            </View>
            <View
              style={{
                width: 31.3 * scale,
                height: 1 * scale,
                borderBottomWidth: 1.75 * scale,
                borderBottomColor: SwashoColors.neutral950,
                borderStyle: 'dotted',
              }}
            />
          </View>
          <View
            style={{
              borderRadius: 8.16 * scale,
              ...figmaShadow(FigmaShadows.providerCard, scale),
            }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Edit ${line.title}`}
              onPress={onEdit}
              style={[
                styles.editButton,
                styles.row,
                {
                  gap: 5.5 * scale,
                  paddingHorizontal: 14.5 * scale,
                  paddingVertical: 7.3 * scale,
                  borderRadius: 7.5 * scale,
                  borderWidth: 0.459 * scale,
                  minHeight: 29.4 * scale,
                  minWidth: 78.9 * scale,
                },
              ]}>
              <Text
                style={[
                  searchFont('medium'),
                  styles.changeLink,
                  { fontSize: 11.8 * scale, lineHeight: 10.1 * scale, letterSpacing: 0.459 * scale },
                ]}>
                Edit
              </Text>
              <CheckoutEditPenSquareIcon width={16.5 * scale} height={16.5 * scale} />
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

function InstructionsCard({
  scale,
  cardWidth,
  instructionTab,
  onTabChange,
  activeInstruction,
  onSelectInstruction,
  rememberInstructions,
  onToggleRemember,
}: {
  scale: number;
  cardWidth: number;
  instructionTab: 'pickup' | 'delivery';
  onTabChange: (tab: 'pickup' | 'delivery') => void;
  activeInstruction: InstructionId;
  onSelectInstruction: (id: InstructionId) => void;
  rememberInstructions: boolean;
  onToggleRemember: () => void;
}) {
  return (
    <View
      style={[
        styles.card,
        {
          width: cardWidth,
          paddingHorizontal: 10 * scale,
          paddingVertical: 16 * scale,
          gap: 20 * scale,
          borderRadius: SwashoRadii.lg * scale,
          ...figmaShadow(FigmaShadows.checkoutScheduleCard, scale),
        },
      ]}>
      <View style={{ gap: 12 * scale, width: '100%' }}>
        <View style={[styles.row, { gap: 12 * scale, paddingLeft: 6 * scale }]}>
          <IconTile scale={scale}>
            <CheckoutInstructionsHeaderIcon width={24 * scale} height={24 * scale} />
          </IconTile>
          <Text style={[searchFont('semibold'), styles.basketTitle, { fontSize: 15 * scale }]}>Instructions</Text>
        </View>
        <CheckoutSectionDivider width={376.514 * scale} scale={scale} />
      </View>
      <View
        style={[
          styles.instructionTabs,
          {
            height: 40 * scale,
            borderRadius: SwashoRadii.md * scale,
            backgroundColor: SwashoColors.neutral100,
          },
        ]}>
        {(['pickup', 'delivery'] as const).map((tab) => {
          const active = instructionTab === tab;
          return (
            <Pressable
              key={tab}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => onTabChange(tab)}
              style={[
                styles.instructionTab,
                active
                  ? {
                      backgroundColor: SwashoColors.neutral950,
                      borderWidth: 1.5,
                      borderColor: '#000000',
                      ...figmaShadow(FigmaShadows.providerCard, scale),
                    }
                  : null,
                { borderRadius: SwashoRadii.md * scale, height: 40 * scale },
              ]}>
              <Text
                style={[
                  searchFont('medium'),
                  { fontSize: 16 * scale, lineHeight: 14 * scale, color: active ? SwashoColors.neutral100 : SwashoColors.neutral800 },
                ]}>
                {tab === 'pickup' ? 'Pickup' : 'Delivery'}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        style={{ width: '100%', flexGrow: 0 }}
        contentContainerStyle={{
          flexDirection: 'row',
          flexWrap: 'nowrap',
          gap: 15.2 * scale,
          paddingLeft: 3 * scale,
          paddingRight: 3 * scale,
        }}>
        {INSTRUCTION_OPTIONS.map((option) => {
          const selected = activeInstruction === option.id;
          const { Icon } = option;
          return (
            <Pressable
              key={option.id}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              onPress={() => onSelectInstruction(option.id)}
              style={[
                styles.instructionOption,
                {
                  width: 85.5 * scale,
                  height: 85.5 * scale,
                  flexShrink: 0,
                  borderRadius: 11.4 * scale,
                  borderWidth: selected ? 1.5 : 0.475,
                  borderColor: selected ? SwashoColors.primary300 : SwashoColors.neutral400,
                  backgroundColor: selected ? SwashoColors.primary50 : SwashoColors.surface,
                  paddingTop: 13.5 * scale,
                  gap: 8 * scale,
                },
              ]}>
              <View style={{ height: 20.9 * scale, alignItems: 'center', justifyContent: 'center' }}>
                <Icon width={20.9 * scale} height={20.9 * scale} />
              </View>
              <Text
                style={[
                  searchFont(selected ? 'medium' : 'regular'),
                  styles.instructionOptionLabel,
                  {
                    fontSize: 11.4 * scale,
                    lineHeight: (selected ? 15 : 15.2) * scale,
                    letterSpacing: 0.475 * scale,
                    paddingHorizontal: 4 * scale,
                    textAlign: 'center',
                  },
                ]}>
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: rememberInstructions }}
        onPress={onToggleRemember}
        style={[styles.row, { gap: 8 * scale, paddingHorizontal: 4 * scale }]}>
        {rememberInstructions ? (
          <CheckoutCheckSquareIcon width={20 * scale} height={20 * scale} />
        ) : (
          <View
            style={[
              styles.checkbox,
              {
                width: 20 * scale,
                height: 20 * scale,
                borderRadius: SwashoRadii.sm * scale,
                borderWidth: 1,
                borderColor: SwashoColors.neutral400,
                backgroundColor: SwashoColors.surface,
              },
            ]}
          />
        )}
        <Text style={[searchFont('regular'), styles.rememberLabel, { fontSize: 12 * scale, lineHeight: 16 * scale, flex: 1 }]}>
          Remember instructions for all future orders on this address.
        </Text>
      </Pressable>
    </View>
  );
}

function PaymentSummaryCard({
  scale,
  cardWidth,
  expanded,
  onToggleExpanded,
  paymentDisplay,
  isSubscription,
}: {
  scale: number;
  cardWidth: number;
  expanded: boolean;
  onToggleExpanded: () => void;
  paymentDisplay: ReturnType<typeof buildPaymentSummaryDisplay>;
  isSubscription: boolean;
}) {
  const totalLabel = isSubscription ? 'Weekly bill' : 'Total';
  return (
    <View
      style={[
        styles.card,
        {
          width: cardWidth,
          paddingHorizontal: 10 * scale,
          paddingVertical: 16 * scale,
          gap: 20 * scale,
          borderRadius: SwashoRadii.lg * scale,
          ...figmaShadow(FigmaShadows.providerCard, scale),
        },
      ]}>
      <Pressable accessibilityRole="button" onPress={onToggleExpanded} style={{ width: '100%', gap: 12 * scale }}>
        <View style={[styles.row, { justifyContent: 'space-between', paddingLeft: 6 * scale }]}>
          <View style={[styles.row, { gap: 8 * scale, flex: 1 }]}>
            <IconTile scale={scale}>
              <CheckoutBillIcon width={24 * scale} height={24 * scale} />
            </IconTile>
            <Text style={[searchFont('semibold'), styles.basketTitle, { fontSize: 15 * scale }]}>Payment Summary</Text>
          </View>
          <AltArrowDownIcon
            width={24 * scale}
            height={24 * scale}
            stroke={SwashoColors.neutral600}
            style={{ transform: [{ rotate: expanded ? '0deg' : '-90deg' }] }}
          />
        </View>
        <CheckoutSectionDivider width={376.514 * scale} scale={scale} />
      </Pressable>
      {expanded ? (
        <View style={{ gap: 16 * scale, width: '100%' }}>
          {paymentDisplay.showSubscriberRows ? (
            <>
              <SummaryRow
                scale={scale}
                label="Regular Service Value"
                value={formatCheckoutInr(paymentDisplay.regularServiceValue)}
              />
              <SubscriberSavingRow scale={scale} value={formatCheckoutInr(-paymentDisplay.subscriberSaving)} />
              <SummaryRow scale={scale} label="Service Value" value={formatCheckoutInr(paymentDisplay.serviceValue)} />
            </>
          ) : (
            <SummaryRow scale={scale} label="Service Value" value={formatCheckoutInr(paymentDisplay.serviceValue)} />
          )}
          <SummaryRow
            scale={scale}
            label="GST"
            value={formatCheckoutInr(paymentDisplay.gst)}
            labelAccessory={<CheckoutInfoIcon width={16 * scale} height={16 * scale} />}
          />
          <SummaryRow scale={scale} label="Pickup and Delivery" value="Free" valueColor="#16a34a" />
          <CheckoutSectionDivider width={376.514 * scale} scale={scale} />
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Text style={[searchFont('semibold'), styles.totalLabel, { fontSize: 16 * scale, lineHeight: 14 * scale }]}>
              {totalLabel}
            </Text>
            <Text style={[searchFont('semibold'), styles.totalLabel, { fontSize: 16 * scale, lineHeight: 14 * scale }]}>
              {formatCheckoutInr(paymentDisplay.weeklyBill)}
            </Text>
          </View>
          {isSubscription ? (
            <View style={[styles.row, { gap: 4 * scale, alignItems: 'flex-start' }]}>
              <CheckoutInfoIcon width={16 * scale} height={16 * scale} />
              <Text style={[searchFont('regular'), styles.muted, { fontSize: 12 * scale, lineHeight: 16 * scale, flex: 1 }]}>
                Future orders will be charged after service completion.
              </Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

function SummaryRow({
  scale,
  label,
  value,
  valueColor,
  labelAccessory,
}: {
  scale: number;
  label: string;
  value: string;
  valueColor?: string;
  labelAccessory?: ReactNode;
}) {
  return (
    <View style={[styles.row, { justifyContent: 'space-between', gap: 24 * scale, alignItems: 'flex-start' }]}>
      <View style={[styles.row, { gap: 6 * scale, flex: 1, alignItems: 'center' }]}>
        <Text style={[searchFont('medium'), styles.summaryLabel, { fontSize: 14 * scale, lineHeight: 18 * scale }]}>
          {label}
        </Text>
        {labelAccessory}
      </View>
      <Text
        style={[
          searchFont('semibold'),
          { fontSize: 14 * scale, lineHeight: 18 * scale, color: valueColor ?? SwashoColors.neutral600 },
        ]}>
        {value}
      </Text>
    </View>
  );
}

function SubscriberSavingRow({ scale, value }: { scale: number; value: string }) {
  return (
    <View style={[styles.row, { justifyContent: 'space-between', gap: 24 * scale, alignItems: 'flex-start' }]}>
      <View style={[styles.row, { gap: 6 * scale, flex: 1, alignItems: 'center' }]}>
        <CheckoutMoneyTagIcon width={20 * scale} height={20 * scale} />
        <Text style={[searchFont('medium'), styles.subscriberSavingLabel, { fontSize: 14 * scale, lineHeight: 18 * scale }]}>
          Subscriber Saving
        </Text>
      </View>
      <Text style={[searchFont('semibold'), styles.subscriberSavingLabel, { fontSize: 14 * scale, lineHeight: 18 * scale }]}>
        {value}
      </Text>
    </View>
  );
}

function ContactlessToggle({
  scale,
  value,
  onValueChange,
  style,
}: {
  scale: number;
  value: boolean;
  onValueChange: (next: boolean) => void;
  style?: object;
}) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={() => onValueChange(!value)}
      style={[
        styles.contactlessTrack,
        style,
        {
          width: 41 * scale,
          height: 25 * scale,
          borderRadius: 6451 * scale,
          padding: 2.58 * scale,
          backgroundColor: value ? SwashoColors.primary600 : SwashoColors.neutral400,
          ...figmaShadow(FigmaShadows.providerCard, scale),
        },
      ]}>
      <View
        style={{
          width: 20 * scale,
          height: 20 * scale,
          borderRadius: 10 * scale,
          backgroundColor: '#d9d9d9',
          marginLeft: value ? 17 * scale : 0,
        }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  frame: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    overflow: 'hidden',
  },
  statusBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 30,
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: SwashoColors.surface,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  backHit: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTextCol: {},
  providerCategory: {
    color: SwashoColors.neutral600,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeChip: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeLabel: {
    color: SwashoColors.darkHeaderText,
  },
  addressLine: {
    color: SwashoColors.neutral600,
  },
  subscriberBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  subscriberBannerText: {
    color: '#4f1ee3',
    letterSpacing: 0.5,
  },
  payMethodCol: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  card: {
    backgroundColor: SwashoColors.surface,
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  iconTile: {
    borderColor: SwashoColors.neutral300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeading: {
    color: SwashoColors.neutral950,
  },
  changeLink: {
    color: SwashoColors.primary600,
  },
  muted: {
    color: SwashoColors.neutral600,
  },
  dottedLink: {
    color: SwashoColors.neutral600,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
  basketTitle: {
    color: SwashoColors.neutral800,
  },
  sectionLabel: {
    color: SwashoColors.neutral800,
  },
  price: {
    color: SwashoColors.neutral950,
  },
  instructionChip: {
    backgroundColor: SwashoColors.neutral50,
    borderColor: SwashoColors.neutral300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionChipLabel: {
    color: SwashoColors.neutral700,
  },
  instructionTabs: {
    flexDirection: 'row',
    width: '100%',
    overflow: 'hidden',
  },
  instructionTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
  },
  instructionOption: {
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  garmentThumb: {
    borderColor: '#dbdbdb',
    backgroundColor: SwashoColors.neutral50,
  },
  editButton: {
    backgroundColor: SwashoColors.surface,
    borderColor: SwashoColors.primary600,
    alignItems: 'center',
    justifyContent: 'center',
  },
  strikePrice: {
    color: SwashoColors.neutral950,
    textDecorationLine: 'line-through',
  },
  summaryLabel: {
    color: SwashoColors.neutral800,
  },
  subscriberSavingLabel: {
    color: SwashoColors.primary600,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
  contactlessTrack: {
    justifyContent: 'center',
  },
  instructionOptionLabel: {
    color: SwashoColors.neutral800,
    textAlign: 'center',
  },
  checkbox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  rememberLabel: {
    color: SwashoColors.neutral900,
  },
  totalLabel: {
    color: SwashoColors.darkHeaderText,
  },
  footerWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 25,
  },
  footerStack: {
    width: '100%',
  },
  compensationBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compensationIcon: {
    backgroundColor: SwashoColors.info300,
  },
  compensationTitle: {
    color: SwashoColors.info700,
  },
  compensationLink: {
    color: SwashoColors.info700,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
  payBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SwashoColors.surface,
  },
  payMeta: {
    color: SwashoColors.neutral600,
  },
  payAmountLabel: {
    color: SwashoColors.darkHeaderText,
  },
  homeIndicatorWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
});
