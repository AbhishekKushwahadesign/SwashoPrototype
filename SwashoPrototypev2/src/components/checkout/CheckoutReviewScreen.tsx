import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { useCallback, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AltArrowDownIcon, ArrowLeftIcon, CalendarLinearIcon } from '@/components/home/figma-icons';
import { figmaShadow, FigmaShadows } from '@/components/home/figma-shadows';
import { HomeIndicator } from '@/components/home/HomeIndicator';
import { useSafeTopInset, useScreenScale } from '@/components/home/scale';
import { SearchStatusBar } from '@/components/search/SearchStatusBar';
import { searchFont } from '@/components/search/search-fonts';
import { ServiceSelectionButton } from '@/components/service-selection/ServiceSelectionButton';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';
import { useProviderCart } from '@/context/provider-cart-context';
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

import { CheckoutSectionDivider } from './CheckoutSectionDivider';
import { CheckoutBillIcon, CheckoutCartIcon, CheckoutConfettiIcon, CheckoutInfoIcon } from './checkout-review-icons';
const STATUS_BAR_HEIGHT = 32;
const HEADER_BLOCK_HEIGHT = 114;
const HOME_INDICATOR_HEIGHT = 24;
const BOTTOM_BAR_HEIGHT = 80;
const COMPENSATION_BAR_HEIGHT = 54;

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

const INSTRUCTION_OPTIONS: { id: InstructionId; label: string }[] = [
  { id: 'call', label: 'Call before Pickup' },
  { id: 'guard', label: 'Collect from Guard' },
  { id: 'doorstep', label: 'Clothes at Doorstep' },
  { id: 'custom', label: 'Custom Instruction' },
];

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
        colors={[SwashoColors.info100, '#eff5ff']}
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
        <View style={[styles.compensationIcon, { width: 33 * scale, height: 33 * scale, borderRadius: 16 * scale }]} />
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
            ...figmaShadow(FigmaShadows.providerCard, scale),
          },
        ]}>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={[searchFont('medium'), styles.payMeta, { fontSize: 14 * scale, lineHeight: 20 * scale }]}>
            Estimated total
          </Text>
          <Text style={[searchFont('semibold'), styles.payAmountLabel, { fontSize: 14 * scale, lineHeight: 20 * scale }]}>
            {formatCheckoutInr(totals.totalPrice)}
          </Text>
        </View>
        <ServiceSelectionButton
          label={`Pay ${formatCheckoutInr(totals.totalPrice)}`}
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
          style={{ flex: 1, marginTop: safeTop + HEADER_BLOCK_HEIGHT * scale }}
          contentContainerStyle={{
            alignItems: 'center',
            paddingTop: 12 * scale,
            paddingBottom: scrollBottomPadding,
            gap: 12 * scale,
          }}
          showsVerticalScrollIndicator={false}>
          {isSubscription ? (
            <LinearGradient
              colors={['#ffffff', SwashoColors.primary50, '#ffffff']}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={[
                styles.subscriberBanner,
                {
                  width: contentWidth,
                  height: 49 * scale,
                  paddingBottom: 15 * scale,
                  gap: 6 * scale,
                },
              ]}>
              <CheckoutConfettiIcon width={20 * scale} height={20 * scale} />
              <Text style={[searchFont('medium'), styles.subscriberBannerText, { fontSize: 13 * scale, lineHeight: 20 * scale }]}>
                You&apos;re enjoying subscriber exclusive pricing
              </Text>
            </LinearGradient>
          ) : null}

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
            serviceTotal={totals.totalPrice}
            isSubscription={isSubscription}
          />
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
        <View style={{ paddingHorizontal: 4 * scale }}>
          <Text style={[searchFont('medium'), styles.cardHeading, { fontSize: 14 * scale, lineHeight: 14 * scale }]}>
            Subscription:{' '}
            <Text style={searchFont('semibold')}>{subscriptionFrequencyTitle}</Text>
            {startLabel ? <Text style={searchFont('semibold')}> (Start {startLabel})</Text> : null}
          </Text>
        </View>
      ) : null}
      {isSubscription ? <CheckoutSectionDivider width={376.514 * scale} scale={scale} /> : null}
      <View style={[styles.scheduleRow, { gap: 8 * scale }]}>
        <IconTile scale={scale}>
          <CalendarLinearIcon width={24 * scale} height={24 * scale} stroke={SwashoColors.neutral950} />
        </IconTile>
        <View style={{ flex: 1, gap: 12 * scale }}>
          {pickupLine ? (
            <ScheduleLine label="Pickup:" value={`${pickupLine} • ${pickupSlot}`} scale={scale} />
          ) : null}
          <ScheduleLine
            label="Delivery:"
            value={deliverySame ? `Next day • ${pickupSlot || deliverySlot}` : deliverySlot}
            scale={scale}
          />
        </View>
        <Pressable accessibilityRole="button" onPress={onChangePress} hitSlop={8}>
          <Text style={[searchFont('medium'), styles.changeLink, { fontSize: 14 * scale, lineHeight: 12 * scale }]}>Change</Text>
        </Pressable>
      </View>
    </View>
  );
}

function ScheduleLine({ label, value, scale }: { label: string; value: string; scale: number }) {
  return (
    <Text style={[searchFont('medium'), styles.cardHeading, { fontSize: 14 * scale, lineHeight: 14 * scale }]}>
      {label} <Text style={searchFont('semibold')}>{value}</Text>
    </Text>
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
      <View style={[styles.row, { gap: 12 * scale }]}>
        <IconTile scale={scale}>
          <Text style={{ fontSize: 18 * scale }}>🚫</Text>
        </IconTile>
        <View style={{ flex: 1, gap: 8 * scale }}>
          <Text style={[searchFont('semibold'), styles.cardHeading, { fontSize: 15 * scale, lineHeight: 14 * scale }]}>
            Contactless Service
          </Text>
          <Text style={[searchFont('regular'), styles.muted, { fontSize: 12 * scale, lineHeight: 16 * scale }]}>
            upload/capture image required
          </Text>
        </View>
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: SwashoColors.neutral400, true: SwashoColors.primary600 }}
          thumbColor={SwashoColors.neutral100}
        />
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
  onEditLine,
}: {
  scale: number;
  cardWidth: number;
  basketCount: number;
  groups: ReturnType<typeof buildCheckoutBasketGroups>;
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
      <View style={[styles.row, { gap: 8 * scale, paddingLeft: 6 * scale }]}>
        <IconTile scale={scale}>
          <CheckoutCartIcon width={24 * scale} height={24 * scale} />
        </IconTile>
        <Text style={[searchFont('semibold'), styles.basketTitle, { fontSize: 15 * scale, flex: 1 }]}>
          Your Basket{' '}
          <Text style={[searchFont('medium'), styles.muted, { fontSize: 13 * scale }]}>
            ({basketCount} {basketCount === 1 ? 'Item' : 'Items'})
          </Text>
        </Text>
        <View
          style={[
            styles.instructionChip,
            {
              borderRadius: SwashoRadii.md * scale,
              paddingHorizontal: 4 * scale,
              minHeight: 29 * scale,
              borderWidth: 1,
            },
          ]}>
          <Text style={[searchFont('semibold'), styles.instructionChipLabel, { fontSize: 12 * scale }]}>Instruction</Text>
        </View>
      </View>
      <CheckoutSectionDivider width={376.514 * scale} scale={scale} />
      {groups.map((group) => (
        <View key={group.sectionId} style={{ width: '100%', gap: 12 * scale }}>
          <Text style={[searchFont('semibold'), styles.sectionLabel, { fontSize: 14 * scale }]}>{group.sectionTitle}</Text>
          {group.lines.map((line, index) => (
            <BasketLineRow key={`${line.serviceId}-${index}`} line={line} scale={scale} onEdit={() => onEditLine(line.serviceId)} />
          ))}
        </View>
      ))}
    </View>
  );
}

function BasketLineRow({
  line,
  scale,
  onEdit,
}: {
  line: CheckoutBasketLine;
  scale: number;
  onEdit: () => void;
}) {
  return (
    <View style={{ gap: 8 * scale }}>
      <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'flex-start' }]}>
        <View style={{ flex: 1, gap: 4 * scale }}>
          <Text style={[searchFont('semibold'), styles.cardHeading, { fontSize: 14 * scale }]}>
            {line.title}
            {line.quantityLabel ? ` ${line.quantityLabel}` : ''}
          </Text>
          {line.detailLines.map((detail) => (
            <Text key={detail} style={[searchFont('medium'), styles.muted, { fontSize: 12 * scale, lineHeight: 16 * scale }]}>
              {detail}
            </Text>
          ))}
          {line.quantityLabel && !line.detailLines.length ? (
            <Text style={[searchFont('medium'), styles.muted, { fontSize: 12 * scale }]}>{line.quantityLabel}</Text>
          ) : null}
        </View>
        <View style={{ alignItems: 'flex-end', gap: 4 * scale }}>
          <Text style={[searchFont('semibold'), styles.price, { fontSize: 14 * scale }]}>
            {formatCheckoutInr(line.price)}
            {line.estimated ? '*' : ''}
            {line.priceSuffix ? (
              <Text style={[searchFont('medium'), styles.muted, { fontSize: 12 * scale }]}> {line.priceSuffix}</Text>
            ) : null}
          </Text>
          <Pressable onPress={onEdit} accessibilityRole="button">
            <Text style={[searchFont('medium'), styles.changeLink, { fontSize: 12 * scale }]}>Edit</Text>
          </Pressable>
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
            <CheckoutInfoIcon width={24 * scale} height={24 * scale} color={SwashoColors.neutral950} />
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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 15 * scale, paddingLeft: 3 * scale }}>
        {INSTRUCTION_OPTIONS.map((option) => {
          const selected = activeInstruction === option.id;
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
                  borderRadius: 11.4 * scale,
                  borderWidth: selected ? 1.5 : 0.475,
                  borderColor: selected ? SwashoColors.primary300 : SwashoColors.neutral400,
                  backgroundColor: selected ? SwashoColors.primary50 : SwashoColors.surface,
                },
              ]}>
              <Text
                style={[
                  searchFont(selected ? 'medium' : 'regular'),
                  styles.instructionOptionLabel,
                  { fontSize: 11.4 * scale, lineHeight: 15 * scale, paddingHorizontal: 4 * scale },
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
        <View
          style={[
            styles.checkbox,
            {
              width: 20 * scale,
              height: 20 * scale,
              borderRadius: SwashoRadii.sm * scale,
              backgroundColor: rememberInstructions ? SwashoColors.primary400 : SwashoColors.surface,
            },
          ]}>
          {rememberInstructions ? <Text style={{ color: SwashoColors.surface, fontSize: 14 * scale }}>✓</Text> : null}
        </View>
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
  serviceTotal,
  isSubscription,
}: {
  scale: number;
  cardWidth: number;
  expanded: boolean;
  onToggleExpanded: () => void;
  serviceTotal: number;
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
          <Text style={{ fontSize: 18 * scale, color: SwashoColors.neutral600 }}>{expanded ? '▾' : '▸'}</Text>
        </View>
        <CheckoutSectionDivider width={376.514 * scale} scale={scale} />
      </Pressable>
      {expanded ? (
        <View style={{ gap: 16 * scale, width: '100%' }}>
          <SummaryRow scale={scale} label="Service Value" value={formatCheckoutInr(serviceTotal)} />
          <SummaryRow scale={scale} label="Pickup and Delivery" value="Free" valueColor="#16a34a" />
          <CheckoutSectionDivider width={376.514 * scale} scale={scale} />
          <View style={[styles.row, { justifyContent: 'space-between' }]}>
            <Text style={[searchFont('semibold'), styles.totalLabel, { fontSize: 16 * scale, lineHeight: 14 * scale }]}>
              {totalLabel}
            </Text>
            <Text style={[searchFont('semibold'), styles.totalLabel, { fontSize: 16 * scale, lineHeight: 14 * scale }]}>
              {formatCheckoutInr(serviceTotal)}
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
}: {
  scale: number;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={[styles.row, { justifyContent: 'space-between', gap: 24 * scale }]}>
      <Text style={[searchFont('medium'), styles.cardHeading, { fontSize: 14 * scale, lineHeight: 18 * scale, flex: 1 }]}>
        {label}
      </Text>
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
    justifyContent: 'center',
  },
  subscriberBannerText: {
    color: SwashoColors.primary800,
    letterSpacing: 0.5,
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
  instructionOption: {
    alignItems: 'center',
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
