import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import {
  Image as RNImage,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  CheckoutCartIcon,
  CheckoutContactlessIcon,
  CheckoutEditPenSquareIcon,
  CheckoutHeaderMenuDotsIcon,
  CheckoutInfoIcon,
  CheckoutInstructionDoorstepIcon,
  CheckoutInstructionPenIcon,
  CheckoutInstructionPhoneIcon,
  CheckoutInstructionShieldIcon,
  CheckoutInstructionsHeaderIcon,
} from '@/components/checkout/checkout-review-icons';
import { CheckoutSectionDivider } from '@/components/checkout/CheckoutSectionDivider';
import { ContactlessGalleryAddMutedIcon } from '@/components/checkout/contactless-basket-photo-icons';
import { ArrowLeftIcon, CalendarLinearIcon } from '@/components/home/figma-icons';
import { FigmaShadows, figmaShadow } from '@/components/home/figma-shadows';
import { HomeIndicator } from '@/components/home/HomeIndicator';
import { useSafeTopInset, useScreenScale } from '@/components/home/scale';
import { StatusBar } from '@/components/home/StatusBar';
import { ListServiceIcon } from '@/components/provider-page/provider-page-icons';
import { searchFont } from '@/components/search/search-fonts';
import { ServiceSelectionButton } from '@/components/service-selection/ServiceSelectionButton';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';
import {
  DEMO_UPCOMING_ORDER,
  upcomingOrderForSubscription,
  type OrderReviewGarmentLine,
  type OrderReviewInstructionId,
  type OrderReviewServiceAssignment,
  type SubscriptionUpcomingOrder,
} from '@/data/subscription-upcoming-order';

import {
  OrderReviewEnabledCheckIcon,
  OrderReviewHistoryIcon,
  OrderReviewMapPointIcon,
} from './order-review-icons';

const STATUS_BAR_HEIGHT = 32;
const HEADER_HEIGHT = 69;
const HEADER_TOTAL = 101;
const POLICY_ROW_HEIGHT = 28;
const SCROLL_TOP = HEADER_TOTAL + POLICY_ROW_HEIGHT;
const HOME_INDICATOR_HEIGHT = 24;
const BOTTOM_ACTIONS_HEIGHT = 98;
const PAGE_BG = '#f2f2f2';

const INSTRUCTION_OPTIONS: {
  id: OrderReviewInstructionId;
  label: string;
  Icon: typeof CheckoutInstructionPhoneIcon;
}[] = [
  { id: 'call', label: 'Call before Pickup', Icon: CheckoutInstructionPhoneIcon },
  { id: 'guard', label: 'Collect from Guard', Icon: CheckoutInstructionShieldIcon },
  { id: 'doorstep', label: 'Clothes at Doorstep', Icon: CheckoutInstructionDoorstepIcon },
  { id: 'custom', label: 'Custom Instruction', Icon: CheckoutInstructionPenIcon },
];

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

function DotSeparator({ scale }: { scale: number }) {
  return <View style={[styles.dot, { width: 4 * scale, height: 4 * scale, borderRadius: 2 * scale }]} />;
}

function ServiceTile({
  assignment,
  scale,
  showDividerAfter,
}: {
  assignment: OrderReviewServiceAssignment;
  scale: number;
  showDividerAfter?: boolean;
}) {
  return (
    <>
      <View style={[styles.serviceTile, { gap: 8 * scale, minWidth: 100 * scale }]}>
        <View
          style={[
            styles.servicePhoto,
            {
              width: 40 * scale,
              height: 40 * scale,
              borderRadius: 4 * scale,
              borderWidth: 0.5 * scale,
            },
          ]}>
          {assignment.photo ? (
            <RNImage source={assignment.photo} style={{ width: '100%', height: '100%', borderRadius: 4 * scale }} />
          ) : assignment.useGalleryPlaceholder ? (
            <ContactlessGalleryAddMutedIcon width={24 * scale} height={24 * scale} />
          ) : null}
        </View>
        <View style={{ alignItems: 'center', gap: 4 * scale, maxWidth: 100 * scale }}>
          <Text
            style={[
              searchFont('semibold'),
              styles.serviceName,
              { fontSize: 14 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale, textAlign: 'center' },
            ]}>
            {assignment.serviceName}
          </Text>
          {assignment.serviceNameSuffix ? (
            <Text
              style={[
                searchFont('semibold'),
                styles.serviceName,
                { fontSize: 14 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale, textAlign: 'center' },
              ]}>
              {assignment.serviceNameSuffix}
            </Text>
          ) : null}
          <Text
            style={[
              searchFont('semibold'),
              {
                fontSize: 14 * scale,
                lineHeight: 14 * scale,
                letterSpacing: 0.5 * scale,
                color: SwashoColors.neutral600,
                textAlign: 'center',
              },
            ]}>
            {assignment.itemCount} items
          </Text>
        </View>
      </View>
      {showDividerAfter ? (
        <View style={{ width: 1 * scale, height: 74.744 * scale, backgroundColor: SwashoColors.neutral300 }} />
      ) : null}
    </>
  );
}

function GarmentBasketBlock({
  line,
  scale,
  showDividerAfter,
}: {
  line: OrderReviewGarmentLine;
  scale: number;
  showDividerAfter: boolean;
}) {
  const thumbSize = 35 * scale;
  return (
    <View style={{ width: '100%', gap: 12 * scale }}>
      <View style={[styles.garmentRow, { paddingLeft: 12 * scale, gap: 8 * scale }]}>
        <View
          style={[
            styles.garmentThumb,
            {
              width: thumbSize,
              height: thumbSize,
              borderRadius: 3.5 * scale,
              borderWidth: 0.438 * scale,
            },
          ]}>
          <ListServiceIcon icon={line.icon} width={22 * scale} height={23 * scale} />
        </View>
        <Text
          style={[
            searchFont('semibold'),
            {
              fontSize: 14 * scale,
              lineHeight: 14 * scale,
              letterSpacing: 0.5 * scale,
              color: SwashoColors.darkHeaderText,
            },
          ]}>
          {line.label}
        </Text>
        <Text
          style={[
            searchFont('semibold'),
            {
              fontSize: 14 * scale,
              lineHeight: 14 * scale,
              letterSpacing: 0.5 * scale,
              color: SwashoColors.darkHeaderText,
            },
          ]}>
          x {line.quantity}
        </Text>
      </View>
      <ScrollView
        horizontal
        nestedScrollEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12 * scale,
          paddingLeft: 52 * scale,
          paddingRight: 12 * scale,
        }}>
        {line.services.map((service, index) => (
          <ServiceTile
            key={service.id}
            assignment={service}
            scale={scale}
            showDividerAfter={index < line.services.length - 1}
          />
        ))}
      </ScrollView>
      {showDividerAfter ? (
        <CheckoutSectionDivider width={364 * scale} scale={scale} />
      ) : null}
    </View>
  );
}

export function OrderReviewScreen() {
  const { subscriptionId } = useLocalSearchParams<{ subscriptionId?: string }>();
  const { scale, contentWidth, contentHeight } = useScreenScale();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);

  const order: SubscriptionUpcomingOrder = useMemo(() => {
    return upcomingOrderForSubscription(subscriptionId) ?? DEMO_UPCOMING_ORDER;
  }, [subscriptionId]);

  const [instructionTab, setInstructionTab] = useState<'pickup' | 'delivery'>('pickup');

  const activeInstructionIds = useMemo(
    () => (instructionTab === 'pickup' ? order.pickupInstructionIds : order.deliveryInstructionIds),
    [instructionTab, order.deliveryInstructionIds, order.pickupInstructionIds],
  );

  const frameHeight = contentHeight + safeTop;
  const cardWidth = 390 * scale;
  const bottomInset = BOTTOM_ACTIONS_HEIGHT * scale + HOME_INDICATOR_HEIGHT * scale + insets.bottom;

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/subscription');
  }, []);

  const handleLooksGood = useCallback(() => {
    handleBack();
  }, [handleBack]);

  return (
    <View style={[styles.root, { backgroundColor: PAGE_BG }]}>
      <View
        style={[
          styles.frame,
          {
            width: contentWidth,
            height: frameHeight,
            marginTop: safeTop,
          },
        ]}>
        <View style={[styles.statusBar, { height: STATUS_BAR_HEIGHT * scale }]}>
          <StatusBar scale={scale} tone="transparent" />
        </View>

        <View
          style={[
            styles.header,
            {
              top: STATUS_BAR_HEIGHT * scale,
              height: HEADER_HEIGHT * scale,
              paddingTop: 25 * scale,
              paddingHorizontal: 17 * scale,
              ...figmaShadow({ offsetX: 0, offsetY: 2, blur: 4, color: '#000000', opacity: 0.1 }, scale),
            },
          ]}>
          <View style={[styles.headerRow, { gap: 12 * scale }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Go back"
              onPress={handleBack}
              style={{ width: 26 * scale, height: 26 * scale, alignItems: 'center', justifyContent: 'center' }}>
              <ArrowLeftIcon width={20 * scale} height={20 * scale} />
            </Pressable>
            <Text
              style={[
                searchFont('medium'),
                {
                  fontSize: 18 * scale,
                  lineHeight: 16 * scale,
                  letterSpacing: 0.5 * scale,
                  color: SwashoColors.darkHeaderText,
                },
              ]}>
              Review Upcoming Order
            </Text>
          </View>
          <Pressable accessibilityRole="button" accessibilityLabel="More options" hitSlop={8}>
            <CheckoutHeaderMenuDotsIcon width={24 * scale} height={24 * scale} />
          </Pressable>
        </View>

        <View
          style={[
            styles.policyRow,
            {
              top: HEADER_TOTAL * scale,
              height: POLICY_ROW_HEIGHT * scale,
              gap: 6 * scale,
              paddingHorizontal: 12 * scale,
            },
          ]}>
          <OrderReviewHistoryIcon width={20 * scale} height={20 * scale} />
          <Text
            style={[
              searchFont('semibold'),
              {
                fontSize: 12 * scale,
                lineHeight: 20 * scale,
                letterSpacing: 0.5 * scale,
                color: SwashoColors.neutral600,
                flexShrink: 1,
                textAlign: 'center',
              },
            ]}>
            Changes allowed until 2 hours before pickup
          </Text>
        </View>

        <ScrollView
          style={[styles.scroll, { marginTop: SCROLL_TOP * scale }]}
          contentContainerStyle={{
            alignItems: 'center',
            gap: 12 * scale,
            paddingHorizontal: 12 * scale,
            paddingBottom: bottomInset + 16 * scale,
          }}
          showsVerticalScrollIndicator={false}>
          {/* Address + schedule card */}
          <View
            style={[
              styles.card,
              {
                width: cardWidth,
                paddingHorizontal: 8 * scale,
                paddingVertical: 12 * scale,
                gap: 12 * scale,
                borderRadius: SwashoRadii.lg * scale,
                ...figmaShadow({ offsetX: 0, offsetY: 0, blur: 4, color: '#000000', opacity: 0.1 }, scale),
              },
            ]}>
            <View style={[styles.row, { gap: 4 * scale, paddingHorizontal: 4 * scale }]}>
              <OrderReviewMapPointIcon width={20 * scale} height={20 * scale} />
              <Text
                numberOfLines={1}
                style={[
                  searchFont('medium'),
                  {
                    fontSize: 14 * scale,
                    lineHeight: 12 * scale,
                    letterSpacing: 0.5 * scale,
                    color: SwashoColors.darkHeaderText,
                    flex: 1,
                  },
                ]}>
                {order.addressLine}
              </Text>
            </View>
            <CheckoutSectionDivider width={364 * scale} scale={scale} />
            <View style={[styles.row, { gap: 12 * scale, paddingHorizontal: 8 * scale, alignItems: 'center' }]}>
              <IconTile scale={scale}>
                <CalendarLinearIcon width={24 * scale} height={24 * scale} />
              </IconTile>
              <View style={{ flex: 1, gap: 12 * scale }}>
                <View style={[styles.row, { gap: 8 * scale, alignItems: 'center', flexWrap: 'wrap' }]}>
                  <Text
                    style={[
                      searchFont('semibold'),
                      {
                        fontSize: 15 * scale,
                        lineHeight: 14 * scale,
                        letterSpacing: 0.3 * scale,
                        color: SwashoColors.darkHeaderText,
                      },
                    ]}>
                    {order.pickupDateLabel}
                  </Text>
                  <DotSeparator scale={scale} />
                  <Text
                    style={[
                      searchFont('semibold'),
                      {
                        fontSize: 15 * scale,
                        lineHeight: 14 * scale,
                        letterSpacing: 0.3 * scale,
                        color: SwashoColors.darkHeaderText,
                      },
                    ]}>
                    {order.pickupTimeLabel}
                  </Text>
                </View>
                <View style={[styles.row, { gap: 6 * scale, alignItems: 'center', flexWrap: 'wrap' }]}>
                  <Text
                    style={[
                      searchFont('medium'),
                      {
                        fontSize: 14 * scale,
                        lineHeight: 12 * scale,
                        letterSpacing: 0.5 * scale,
                        color: SwashoColors.neutral600,
                      },
                    ]}>
                    Delivery {order.deliveryDateLabel}
                  </Text>
                  <DotSeparator scale={scale} />
                  <Text
                    style={[
                      searchFont('medium'),
                      {
                        fontSize: 14 * scale,
                        lineHeight: 12 * scale,
                        letterSpacing: 0.5 * scale,
                        color: SwashoColors.neutral600,
                      },
                    ]}>
                    {order.deliveryTimeLabel}
                  </Text>
                </View>
              </View>
              <Pressable accessibilityRole="button" accessibilityLabel="Change schedule">
                <Text
                  style={[
                    searchFont('medium'),
                    styles.link,
                    { fontSize: 14 * scale, lineHeight: 12 * scale, letterSpacing: 0.5 * scale },
                  ]}>
                  Change
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Contactless card */}
          {order.contactlessEnabled ? (
            <View
              style={[
                styles.card,
                {
                  width: cardWidth,
                  paddingHorizontal: 8 * scale,
                  paddingVertical: 12 * scale,
                  borderRadius: SwashoRadii.lg * scale,
                  ...figmaShadow({ offsetX: 0, offsetY: 0, blur: 4, color: '#000000', opacity: 0.1 }, scale),
                },
              ]}>
              <View style={[styles.row, { gap: 12 * scale, paddingHorizontal: 8 * scale, alignItems: 'center' }]}>
                <IconTile scale={scale}>
                  <CheckoutContactlessIcon width={24 * scale} height={24 * scale} />
                </IconTile>
                <View style={{ flex: 1, gap: 8 * scale }}>
                  <Text
                    style={[
                      searchFont('semibold'),
                      {
                        fontSize: 15 * scale,
                        lineHeight: 14 * scale,
                        letterSpacing: 0.3 * scale,
                        color: SwashoColors.neutral950,
                      },
                    ]}>
                    Contactless Pickup
                  </Text>
                  <View style={[styles.row, { gap: 8 * scale, alignItems: 'center' }]}>
                    <OrderReviewEnabledCheckIcon width={12 * scale} height={8 * scale} />
                    <Text
                      style={[
                        searchFont('medium'),
                        {
                          fontSize: 14 * scale,
                          lineHeight: 12 * scale,
                          letterSpacing: 0.5 * scale,
                          color: SwashoColors.neutral600,
                        },
                      ]}>
                      Enabled
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.locationChip,
                      {
                        gap: 4 * scale,
                        padding: 4 * scale,
                        borderRadius: 4 * scale,
                        borderWidth: 0.5 * scale,
                        alignSelf: 'flex-start',
                      },
                    ]}>
                    <Image
                      source={require('@/assets/checkout/contactless-workflow-pickup.png')}
                      style={{ width: 20 * scale, height: 20 * scale }}
                      contentFit="cover"
                    />
                    <Text
                      numberOfLines={1}
                      style={[
                        searchFont('medium'),
                        {
                          fontSize: 14 * scale,
                          lineHeight: 12 * scale,
                          letterSpacing: 0.5 * scale,
                          color: SwashoColors.darkHeaderText,
                          maxWidth: 202 * scale,
                        },
                      ]}>
                      {order.contactlessLocationLabel}
                    </Text>
                  </View>
                </View>
                <Pressable accessibilityRole="button" accessibilityLabel="Manage contactless pickup">
                  <Text
                    style={[
                      searchFont('medium'),
                      styles.link,
                      { fontSize: 14 * scale, lineHeight: 12 * scale, letterSpacing: 0.5 * scale },
                    ]}>
                    Manage
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : null}

          {/* Basket */}
          <View
            style={[
              styles.card,
              {
                width: cardWidth,
                paddingVertical: 16 * scale,
                paddingRight: 8 * scale,
                gap: 12 * scale,
                borderRadius: SwashoRadii.lg * scale,
                ...figmaShadow(FigmaShadows.orderCard, scale),
              },
            ]}>
            <View style={[styles.row, { gap: 8 * scale, paddingLeft: 6 * scale, alignItems: 'center' }]}>
              <IconTile scale={scale}>
                <CheckoutCartIcon width={24 * scale} height={24 * scale} />
              </IconTile>
              <Text style={{ flex: 1 }}>
                <Text
                  style={[
                    searchFont('semibold'),
                    {
                      fontSize: 15 * scale,
                      lineHeight: 14 * scale,
                      letterSpacing: 0.3 * scale,
                      color: SwashoColors.neutral800,
                    },
                  ]}>
                  Your Basket{' '}
                </Text>
                <Text
                  style={[
                    searchFont('medium'),
                    {
                      fontSize: 13 * scale,
                      lineHeight: 20 * scale,
                      letterSpacing: 0.5 * scale,
                      color: SwashoColors.neutral600,
                    },
                  ]}>
                  ({order.basketItemCount} Items)
                </Text>
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Edit basket"
                style={[
                  styles.editButton,
                  {
                    height: 32 * scale,
                    minWidth: 80 * scale,
                    paddingHorizontal: 10 * scale,
                    gap: 6 * scale,
                    borderRadius: SwashoRadii.md * scale,
                    borderWidth: 1 * scale,
                  },
                ]}>
                <CheckoutEditPenSquareIcon width={20 * scale} height={20 * scale} />
                <Text
                  style={[
                    searchFont('medium'),
                    styles.link,
                    { fontSize: 14 * scale, lineHeight: 12 * scale, letterSpacing: 0.5 * scale },
                  ]}>
                  Edit
                </Text>
              </Pressable>
            </View>
            <CheckoutSectionDivider width={372 * scale} scale={scale} />
            <View style={{ width: '100%', gap: 12 * scale }}>
              {order.garments.map((line, index) => (
                <GarmentBasketBlock
                  key={line.id}
                  line={line}
                  scale={scale}
                  showDividerAfter={index < order.garments.length - 1}
                />
              ))}
            </View>
          </View>

          {/* Instructions */}
          <View
            style={[
              styles.card,
              {
                width: 395 * scale,
                paddingLeft: 8 * scale,
                paddingRight: 10 * scale,
                paddingVertical: 16 * scale,
                gap: 16 * scale,
                borderRadius: SwashoRadii.lg * scale,
                ...figmaShadow(FigmaShadows.orderCard, scale),
              },
            ]}>
            <View style={{ gap: 12 * scale, width: '100%' }}>
              <View style={[styles.row, { gap: 12 * scale, paddingLeft: 6 * scale }]}>
                <IconTile scale={scale}>
                  <CheckoutInstructionsHeaderIcon width={24 * scale} height={24 * scale} />
                </IconTile>
                <Text
                  style={[
                    searchFont('semibold'),
                    {
                      fontSize: 15 * scale,
                      lineHeight: 14 * scale,
                      letterSpacing: 0.3 * scale,
                      color: SwashoColors.neutral950,
                    },
                  ]}>
                  Instructions
                </Text>
              </View>
              <CheckoutSectionDivider width={376.514 * scale} scale={scale} />
            </View>

            <View style={{ width: '100%', gap: 16 * scale, paddingLeft: 8 * scale }}>
              <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center', paddingVertical: 4 * scale }]}>
                <Text
                  style={[
                    searchFont('semibold'),
                    {
                      fontSize: 15 * scale,
                      lineHeight: 14 * scale,
                      letterSpacing: 0.3 * scale,
                      color: SwashoColors.neutral800,
                    },
                  ]}>
                  For Laundry
                </Text>
                <Pressable accessibilityRole="button" accessibilityLabel="Update laundry instructions">
                  <Text
                    style={[
                      searchFont('medium'),
                      styles.link,
                      styles.linkUnderline,
                      { fontSize: 14 * scale, lineHeight: 12 * scale, letterSpacing: 0.5 * scale },
                    ]}>
                    Update
                  </Text>
                </Pressable>
              </View>
              <ScrollView
                horizontal
                nestedScrollEnabled
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ flexDirection: 'row', gap: 8 * scale, height: 45 * scale }}>
                {order.laundryInstructionChips.map((chip) => (
                  <View
                    key={chip.id}
                    style={[
                      styles.laundryChip,
                      {
                        gap: chip.photo ? 10 * scale : 0,
                        height: 45 * scale,
                        paddingLeft: chip.photo ? 2 * scale : 12 * scale,
                        paddingRight: 12 * scale,
                        borderRadius: 8 * scale,
                        borderWidth: 1 * scale,
                      },
                    ]}>
                    {chip.photo ? (
                      <View
                        style={{
                          width: 40 * scale,
                          height: 40 * scale,
                          borderRadius: 8 * scale,
                          borderWidth: 0.5 * scale,
                          borderColor: '#b3b3b3',
                          overflow: 'hidden',
                        }}>
                        <RNImage source={chip.photo} style={{ width: '100%', height: '100%' }} />
                      </View>
                    ) : null}
                    <Text
                      style={[
                        searchFont('semibold'),
                        {
                          fontSize: 14 * scale,
                          lineHeight: 14 * scale,
                          letterSpacing: 0.5 * scale,
                          color: SwashoColors.darkHeaderText,
                        },
                      ]}>
                      {chip.label}
                    </Text>
                  </View>
                ))}
              </ScrollView>
            </View>

            <CheckoutSectionDivider width={374.644 * scale} scale={scale} />

            <View style={{ width: '100%', gap: 16 * scale }}>
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
                      onPress={() => setInstructionTab(tab)}
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
                          {
                            fontSize: 16 * scale,
                            lineHeight: 14 * scale,
                            color: active ? SwashoColors.neutral100 : SwashoColors.neutral800,
                          },
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
                contentContainerStyle={{
                  flexDirection: 'row',
                  gap: 15.2 * scale,
                  paddingLeft: 3 * scale,
                  paddingRight: 3 * scale,
                }}>
                {INSTRUCTION_OPTIONS.map((option) => {
                  const selected = activeInstructionIds.includes(option.id);
                  const { Icon } = option;
                  return (
                    <View
                      key={option.id}
                      style={[
                        styles.instructionOption,
                        {
                          width: 85.5 * scale,
                          height: 85.5 * scale,
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
                          {
                            fontSize: 11.4 * scale,
                            lineHeight: (selected ? 15 : 15.2) * scale,
                            letterSpacing: 0.475 * scale,
                            paddingHorizontal: 4 * scale,
                            textAlign: 'center',
                            color: SwashoColors.neutral800,
                          },
                        ]}>
                        {option.label}
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </View>

          {/* Estimated bill */}
          <View
            style={[
              styles.card,
              {
                width: cardWidth,
                paddingHorizontal: 10 * scale,
                paddingVertical: 16 * scale,
                gap: 16 * scale,
                borderRadius: SwashoRadii.lg * scale,
                ...figmaShadow({ offsetX: 0, offsetY: 0, blur: 4, color: '#000000', opacity: 0.1 }, scale),
              },
            ]}>
            <View style={[styles.row, { gap: 24 * scale, justifyContent: 'space-between', width: '100%' }]}>
              <Text
                style={[
                  searchFont('semibold'),
                  {
                    fontSize: 16 * scale,
                    lineHeight: 14 * scale,
                    letterSpacing: 0.5 * scale,
                    color: SwashoColors.darkHeaderText,
                    flex: 1,
                  },
                ]}>
                Estimated Bill
              </Text>
              <Text
                style={[
                  searchFont('semibold'),
                  styles.billAmount,
                  {
                    fontSize: 16 * scale,
                    lineHeight: 14 * scale,
                    letterSpacing: 0.5 * scale,
                    color: SwashoColors.darkHeaderText,
                  },
                ]}>
                ₹{order.estimatedBillInr}
              </Text>
            </View>
            <View style={[styles.row, { gap: 4 * scale, alignItems: 'center' }]}>
              <CheckoutInfoIcon width={16 * scale} height={16 * scale} />
              <Text
                style={[
                  searchFont('regular'),
                  {
                    fontSize: 12 * scale,
                    lineHeight: 16 * scale,
                    letterSpacing: 0.5 * scale,
                    color: SwashoColors.neutral600,
                    flex: 1,
                  },
                ]}>
                Charged after service completion.
              </Text>
            </View>
          </View>
        </ScrollView>

        <View
          style={[
            styles.bottomBar,
            {
              height: BOTTOM_ACTIONS_HEIGHT * scale + HOME_INDICATOR_HEIGHT * scale,
              paddingTop: 8 * scale,
              paddingBottom: HOME_INDICATOR_HEIGHT * scale,
              ...figmaShadow({ offsetX: 0, offsetY: -2, blur: 8, color: '#000000', opacity: 0.08 }, scale),
            },
          ]}>
          <Text
            style={[
              searchFont('regular'),
              {
                fontSize: 12 * scale,
                lineHeight: 16 * scale,
                letterSpacing: 0.5 * scale,
                color: SwashoColors.neutral600,
                textAlign: 'center',
                marginBottom: 8 * scale,
              },
            ]}>
            Changes will only apply to this order
          </Text>
          <View style={[styles.row, { gap: 16 * scale, paddingHorizontal: 10 * scale, justifyContent: 'center' }]}>
            <ServiceSelectionButton
              label="Skip Pickup"
              variant="secondary"
              scale={scale}
              style={{ width: 175 * scale }}
              onPress={() => {}}
            />
            <ServiceSelectionButton
              label="Looks Good"
              variant="primary"
              scale={scale}
              style={{ width: 175 * scale }}
              onPress={handleLooksGood}
            />
          </View>
          <View style={styles.homeIndicatorWrap} pointerEvents="none">
            <HomeIndicator scale={scale} />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
  },
  frame: {
    backgroundColor: PAGE_BG,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        maxHeight: 1000,
      },
    }),
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 12,
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 11,
    backgroundColor: SwashoColors.surface,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  policyRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
    width: '100%',
  },
  card: {
    backgroundColor: SwashoColors.surface,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconTile: {
    borderColor: SwashoColors.neutral300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    backgroundColor: SwashoColors.neutral600,
  },
  link: {
    color: SwashoColors.primary600,
  },
  linkUnderline: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
  locationChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f7f7f7',
    borderColor: SwashoColors.neutral600,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SwashoColors.primary50,
    borderColor: SwashoColors.primary600,
  },
  garmentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  garmentThumb: {
    borderColor: '#dbdbdb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceTile: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  servicePhoto: {
    borderColor: '#b3b3b3',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  serviceName: {
    color: SwashoColors.darkHeaderText,
  },
  laundryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fafafa',
    borderColor: 'rgba(0,0,0,0.1)',
  },
  instructionTabs: {
    flexDirection: 'row',
    width: '100%',
  },
  instructionTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionOption: {
    alignItems: 'center',
    flexShrink: 0,
  },
  billAmount: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
  bottomBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 12,
    backgroundColor: SwashoColors.surface,
    alignItems: 'center',
  },
  homeIndicatorWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
});
