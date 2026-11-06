import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useMemo, useState, type LayoutChangeEvent } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CheckoutSectionDivider } from '@/components/checkout/CheckoutSectionDivider';
import { ArrowLeftIcon, MagnifierIcon } from '@/components/home/figma-icons';
import { FigmaShadows, figmaShadow } from '@/components/home/figma-shadows';
import { HomeIndicator, homeIndicatorScreenBottomStyle } from '@/components/home/HomeIndicator';
import { useSafeTopInset, useScreenScale } from '@/components/home/scale';
import { StatusBar } from '@/components/home/StatusBar';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';
import {
  PAST_ORDER_FILTERS,
  pastOrdersForFilter,
  type PastOrderFilterId,
  type PastOrderLineItem,
  type PastOrderSummary,
} from '@/data/subscription-past-orders';
import { DEMO_SUBSCRIPTION } from '@/data/subscriptions';
import { orderTrackingHrefFromPastOrder } from '@/lib/order-tracking-flow';
import { subscriptionUpcomingFromPastOrdersHref } from '@/lib/subscription-past-orders-flow';
import {
  FIGMA_ORDERS_FILTER_BAR_TOP,
  FIGMA_ORDERS_HEADER_CHROME_HEIGHT,
  FIGMA_ORDERS_HEADER_ROW_TOP,
  FIGMA_STATUS_BAR_HEIGHT,
} from '@/lib/screen-header-figma';
import {
  PAST_ORDER_CARD_DASHED_RULE_WIDTH,
  PAST_ORDER_CARD_FIGMA_HEIGHT,
  PAST_ORDER_CARD_FIGMA_WIDTH,
  PAST_ORDER_CARD_HEADER_GAP,
  PAST_ORDER_CARD_HORIZONTAL_INSET,
  PAST_ORDER_CARD_RULE_WIDTH,
  PAST_ORDER_CARD_SECTION_GAP,
  PAST_ORDER_DELIVERING_FOOTER_HEIGHT,
  PAST_ORDER_DELIVERING_FOOTER_TEXT_LEFT,
  PAST_ORDER_DELIVERING_FOOTER_TEXT_WIDTH,
  PAST_ORDER_DELIVERING_RIDER_BLOCK_HEIGHT,
  PAST_ORDER_DELIVERING_RIDER_BLOCK_LEFT,
  PAST_ORDER_DELIVERING_RIDER_BLOCK_TOP,
  PAST_ORDER_DELIVERING_RIDER_BLOCK_WIDTH,
  PAST_ORDER_DELIVERING_RIDER_CLUSTER_HEIGHT,
  PAST_ORDER_DELIVERING_RIDER_CLUSTER_LEFT,
  PAST_ORDER_DELIVERING_RIDER_CLUSTER_TOP,
  PAST_ORDER_DELIVERING_RIDER_CLUSTER_WIDTH,
  PAST_ORDER_DELIVERING_RIDER_IMG_HEIGHT,
  PAST_ORDER_DELIVERING_RIDER_IMG_WIDTH,
  PAST_ORDER_DELIVERING_RIDER_ROTATE_DEG,
  PAST_ORDER_DELIVERING_ROAD_CLUSTER_HEIGHT,
  PAST_ORDER_DELIVERING_ROAD_CLUSTER_LEFT,
  PAST_ORDER_DELIVERING_ROAD_CLUSTER_TOP,
  PAST_ORDER_DELIVERING_ROAD_CLUSTER_WIDTH,
  PAST_ORDER_DELIVERING_ROAD_HEIGHT,
  PAST_ORDER_DELIVERING_ROAD_ROTATE_DEG,
  PAST_ORDER_DELIVERING_ROAD_WIDTH,
  PAST_ORDER_DELIVERING_STATUS_PL,
} from '@/lib/past-order-card-figma-59380';
import { PastOrderDeliveringCardBackground } from '@/components/subscription/PastOrderDeliveringCardBackground';

import {
  PastOrderDeliveredCheckIcon,
  PastOrderExperienceStarsIcon,
  PastOrderExtraGarmentAIcon,
  PastOrderExtraGarmentBIcon,
  PastOrderInvoiceDownloadIcon,
  PastOrderRoadIcon,
  PastOrderScooterIcon,
  PastOrderTrackRiderIcon,
  PastOrderTrouserTileIcon,
  PastOrderUpcomingDotIcon,
  PastOrderWashIronStackBottomIcon,
  PastOrderWashIronStackTopIcon,
} from './past-orders-icons';

const STATUS_BAR_HEIGHT = FIGMA_STATUS_BAR_HEIGHT;
const HEADER_HEIGHT = FIGMA_ORDERS_HEADER_CHROME_HEIGHT;
const HEADER_TOOLBAR_TOP = FIGMA_ORDERS_HEADER_ROW_TOP;
const FILTER_BAR_TOP = FIGMA_ORDERS_FILTER_BAR_TOP;
const FILTER_BAR_HEIGHT = 45;
const SCROLL_CONTENT_START_Y = FILTER_BAR_TOP + FILTER_BAR_HEIGHT;
const SCROLL_PADDING_TOP = 14;
const HOME_INDICATOR_HEIGHT = 24;
const PAGE_BG = '#f2f2f2';
const SUCCESS_600 = '#16a34a';

const riderImage = require('@/assets/images/subscription/rider-with-bike.png');

function OrderFilterChip({
  label,
  active,
  scale,
  onPress,
}: {
  label: string;
  active: boolean;
  scale: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filterChip,
        active ? styles.filterChipActive : styles.filterChipIdle,
        {
          borderRadius: SwashoRadii.sm * scale,
          paddingHorizontal: 12 * scale,
          paddingVertical: 8 * scale,
          height: 26 * scale,
          borderWidth: (active ? 1.5 : 1) * scale,
        },
      ]}>
      <Text
        style={[
          searchFont(active ? 'semibold' : 'medium'),
          {
            fontSize: 12 * scale,
            lineHeight: 10 * scale,
            letterSpacing: 0.5 * scale,
            color: active ? SwashoColors.primary600 : SwashoColors.neutral900,
          },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

function DateTimeMeta({
  dateLabel,
  timeLabel,
  scale,
}: {
  dateLabel: string;
  timeLabel: string;
  scale: number;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 * scale }}>
      <Text
        style={[
          searchFont('regular'),
          {
            fontSize: 15 * scale,
            lineHeight: 14 * scale,
            letterSpacing: 0.15 * scale,
            color: SwashoColors.neutral800,
          },
        ]}>
        {dateLabel}
      </Text>
      <View style={{ width: 1 * scale, height: 20 * scale, backgroundColor: SwashoColors.neutral300 }} />
      <Text
        style={[
          searchFont('regular'),
          {
            fontSize: 15 * scale,
            lineHeight: 14 * scale,
            letterSpacing: 0.15 * scale,
            color: SwashoColors.neutral800,
          },
        ]}>
        {timeLabel}
      </Text>
    </View>
  );
}

function WashIronServiceIcon({ scale }: { scale: number }) {
  const tile = 35 * scale;
  return (
    <View
      style={{
        width: tile,
        height: tile,
        borderWidth: 0.438 * scale,
        borderColor: '#dbdbdb',
        borderRadius: 3.5 * scale,
        overflow: 'hidden',
      }}>
      <PastOrderWashIronStackTopIcon
        width={28 * scale}
        height={19 * scale}
        style={{ position: 'absolute', left: 1.2 * scale, top: 6.4 * scale }}
      />
      <PastOrderWashIronStackBottomIcon
        width={21 * scale}
        height={13 * scale}
        style={{ position: 'absolute', left: 12.74 * scale, top: 17.5 * scale }}
      />
    </View>
  );
}

function LineItemRow({
  item,
  scale,
  layoutScale,
  showDividerAfter,
}: {
  item: PastOrderLineItem;
  scale: number;
  layoutScale: number;
  showDividerAfter: boolean;
}) {
  if (item.kind === 'extra_garments') {
    return (
      <View style={{ width: '100%', gap: 12 * scale }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 * scale }}>
          <View style={{ width: 75 * scale, height: 33 * scale, position: 'relative', marginLeft: 0 }}>
            {[0, 20.76, 41.52].map((left, index) => (
              <View
                key={left}
                style={{
                  position: 'absolute',
                  left: left * scale,
                  top: 0,
                  width: 33 * scale,
                  height: 33 * scale,
                  borderRadius: 9999 * scale,
                  borderWidth: 0.519 * scale,
                  borderColor: SwashoColors.neutral200,
                  backgroundColor: 'rgba(255,255,255,0.75)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  ...figmaShadow({ offsetX: 0, offsetY: 0, blur: 4.613, color: '#000000', opacity: 0.25 }, scale),
                }}>
                {index === 0 ? (
                  <PastOrderExtraGarmentAIcon width={23 * scale} height={23 * scale} />
                ) : index === 1 ? (
                  <PastOrderExtraGarmentBIcon width={15 * scale} height={26 * scale} />
                ) : (
                  <Text
                    style={[
                      searchFont('semibold'),
                      {
                        fontSize: 17 * scale,
                        lineHeight: 16 * scale,
                        letterSpacing: 0.58 * scale,
                        color: SwashoColors.darkHeaderText,
                      },
                    ]}>
                    +{item.extraCount}
                  </Text>
                )}
              </View>
            ))}
          </View>
        </View>
        {showDividerAfter ? (
          <CheckoutSectionDivider width={PAST_ORDER_CARD_DASHED_RULE_WIDTH * layoutScale} scale={layoutScale} />
        ) : null}
      </View>
    );
  }

  const isWashIron = item.label === 'Wash & Iron';

  return (
    <View style={{ width: '100%', gap: 12 * scale }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 * scale, flex: 1 }}>
          {isWashIron ? (
            <WashIronServiceIcon scale={scale} />
          ) : (
            <View
              style={{
                width: 35 * scale,
                height: 35 * scale,
                borderWidth: 0.583 * scale,
                borderColor: '#dbdbdb',
                borderRadius: 4.667 * scale,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <PastOrderTrouserTileIcon width={20 * scale} height={27 * scale} />
            </View>
          )}
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
            {item.label}
          </Text>
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
          {item.quantityLabel}
        </Text>
      </View>
      {showDividerAfter ? (
        <CheckoutSectionDivider width={PAST_ORDER_CARD_DASHED_RULE_WIDTH * layoutScale} scale={layoutScale} />
      ) : null}
    </View>
  );
}

/** Figma 59380:4270 — rider + road in delivering footer. */
function DeliveringOrderRiderArt({ layoutScale }: { layoutScale: number }) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: PAST_ORDER_DELIVERING_RIDER_BLOCK_LEFT * layoutScale,
        top: PAST_ORDER_DELIVERING_RIDER_BLOCK_TOP * layoutScale,
        width: PAST_ORDER_DELIVERING_RIDER_BLOCK_WIDTH * layoutScale,
        height: PAST_ORDER_DELIVERING_RIDER_BLOCK_HEIGHT * layoutScale,
        overflow: 'hidden',
      }}>
      <View
        style={{
          position: 'absolute',
          left: PAST_ORDER_DELIVERING_ROAD_CLUSTER_LEFT * layoutScale,
          top: PAST_ORDER_DELIVERING_ROAD_CLUSTER_TOP * layoutScale,
          width: PAST_ORDER_DELIVERING_ROAD_CLUSTER_WIDTH * layoutScale,
          height: PAST_ORDER_DELIVERING_ROAD_CLUSTER_HEIGHT * layoutScale,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ rotate: `${PAST_ORDER_DELIVERING_ROAD_ROTATE_DEG}deg` }],
        }}>
        <PastOrderRoadIcon
          width={PAST_ORDER_DELIVERING_ROAD_WIDTH * layoutScale}
          height={PAST_ORDER_DELIVERING_ROAD_HEIGHT * layoutScale}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          left: PAST_ORDER_DELIVERING_RIDER_CLUSTER_LEFT * layoutScale,
          top: PAST_ORDER_DELIVERING_RIDER_CLUSTER_TOP * layoutScale,
          width: PAST_ORDER_DELIVERING_RIDER_CLUSTER_WIDTH * layoutScale,
          height: PAST_ORDER_DELIVERING_RIDER_CLUSTER_HEIGHT * layoutScale,
          alignItems: 'center',
          justifyContent: 'center',
          transform: [{ rotate: `${PAST_ORDER_DELIVERING_RIDER_ROTATE_DEG}deg` }],
        }}>
        <Image
          source={riderImage}
          style={{
            width: PAST_ORDER_DELIVERING_RIDER_IMG_WIDTH * layoutScale,
            height: PAST_ORDER_DELIVERING_RIDER_IMG_HEIGHT * layoutScale,
          }}
          contentFit="contain"
        />
      </View>
    </View>
  );
}

/** Figma 59380:4269 delivering footer — 92pt illustration + 293pt text / track row. */
function DeliveringOrderFooter({
  order,
  scale,
  cardWidth,
  onTrackPress,
}: {
  order: PastOrderSummary;
  scale: number;
  cardWidth: number;
  onTrackPress: () => void;
}) {
  const layoutScale = cardWidth / PAST_ORDER_CARD_FIGMA_WIDTH;

  return (
    <View
      style={{
        width: cardWidth,
        height: PAST_ORDER_DELIVERING_FOOTER_HEIGHT * layoutScale,
        position: 'relative',
      }}>
      <DeliveringOrderRiderArt layoutScale={layoutScale} />
      <View
        style={{
          position: 'absolute',
          left: PAST_ORDER_DELIVERING_FOOTER_TEXT_LEFT * layoutScale,
          top: 0,
          width: PAST_ORDER_DELIVERING_FOOTER_TEXT_WIDTH * layoutScale,
          height: PAST_ORDER_DELIVERING_FOOTER_HEIGHT * layoutScale,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <View
          style={{
            flex: 1,
            gap: 8 * scale,
            paddingLeft: PAST_ORDER_DELIVERING_STATUS_PL * layoutScale,
            justifyContent: 'center',
            minHeight: PAST_ORDER_DELIVERING_FOOTER_HEIGHT * layoutScale,
          }}>
          <Text
            style={[
              searchFont('semibold'),
              {
                fontSize: 15 * scale,
                lineHeight: 14 * scale,
                letterSpacing: 0.3 * scale,
                color: 'rgba(0,0,0,0.85)',
              },
            ]}>
            {order.deliveryEtaLabel}
          </Text>
          <Text
            style={[
              searchFont('regular'),
              {
                fontSize: 13 * scale,
                lineHeight: 16 * scale,
                color: '#000000',
              },
            ]}>
            {order.deliveryPhaseLabel}
          </Text>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Track rider"
          onPress={onTrackPress}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6 * scale,
            paddingHorizontal: 4 * scale,
            minWidth: 60 * scale,
            height: 18 * scale,
          }}>
          <PastOrderTrackRiderIcon width={20 * scale} height={20 * scale} />
          <Text
            numberOfLines={1}
            style={[
              searchFont('medium'),
              {
                fontSize: 12 * scale,
                lineHeight: 10 * scale,
                letterSpacing: 0.5 * scale,
                color: SwashoColors.primary600,
                flexShrink: 0,
              },
            ]}>
            Track Rider
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function PastOrderCard({ order, scale, cardWidth }: { order: PastOrderSummary; scale: number; cardWidth: number }) {
  const isDelivering = order.lifecycleStatus === 'delivering';
  const layoutScale = cardWidth / PAST_ORDER_CARD_FIGMA_WIDTH;
  const contentInset = PAST_ORDER_CARD_HORIZONTAL_INSET * layoutScale;
  const ruleWidth = PAST_ORDER_CARD_RULE_WIDTH * layoutScale;
  const paddedBlockWidth = cardWidth - 2 * contentInset;
  const [cardHeight, setCardHeight] = useState(0);

  const handleTrackPress = useCallback(() => {
    router.push(orderTrackingHrefFromPastOrder(order.id));
  }, [order.id]);

  const handleCardLayout = useCallback((event: LayoutChangeEvent) => {
    if (!isDelivering) {
      return;
    }
    const nextHeight = event.nativeEvent.layout.height;
    setCardHeight((prev) => (prev === nextHeight ? prev : nextHeight));
  }, [isDelivering]);

  const cardBody = (
    <>
      <View
        style={{
          width: cardWidth,
          gap: PAST_ORDER_CARD_SECTION_GAP * layoutScale,
          paddingBottom: 16 * layoutScale,
        }}>
        <View
          style={{
            width: cardWidth,
            paddingHorizontal: contentInset,
            paddingTop: 16 * layoutScale,
            paddingBottom: 0,
            gap: PAST_ORDER_CARD_HEADER_GAP * layoutScale,
          }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', width: '100%' }}>
            <View style={{ flex: 1, minWidth: 0, gap: PAST_ORDER_CARD_HEADER_GAP * layoutScale }}>
              <Text
                style={[
                  searchFont(isDelivering ? 'semibold' : 'medium'),
                  {
                    fontSize: (isDelivering ? 15 : 16) * scale,
                    lineHeight: 14 * scale,
                    letterSpacing: (isDelivering ? 0.3 : 0.5) * scale,
                    color: '#000000',
                  },
                ]}>
                {order.reference}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 * scale, flexWrap: 'wrap', width: '100%' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 * scale }}>
                  {isDelivering ? (
                    <PastOrderScooterIcon width={20 * scale} height={20 * scale} />
                  ) : (
                    <PastOrderDeliveredCheckIcon width={18 * scale} height={18 * scale} />
                  )}
                  <Text
                    style={[
                      searchFont('medium'),
                      {
                        fontSize: 16 * scale,
                        lineHeight: 14 * scale,
                        letterSpacing: 0.5 * scale,
                        color: isDelivering ? SwashoColors.info700 : SUCCESS_600,
                      },
                    ]}>
                    {order.statusLabel}
                  </Text>
                </View>
                <DateTimeMeta dateLabel={order.dateLabel} timeLabel={order.timeLabel} scale={scale} />
              </View>
            </View>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Download invoice"
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6 * scale,
                borderWidth: 0.5 * scale,
                borderColor: SwashoColors.neutral300,
                borderRadius: SwashoRadii.md * scale,
                paddingHorizontal: 12 * scale,
                paddingVertical: 8 * scale,
                minWidth: 60 * scale,
                marginLeft: 8 * scale,
              }}>
              <PastOrderInvoiceDownloadIcon width={20 * scale} height={20 * scale} />
              <Text
                style={[
                  searchFont('medium'),
                  {
                    fontSize: 14 * scale,
                    lineHeight: 12 * scale,
                    letterSpacing: 0.5 * scale,
                    color: SwashoColors.darkHeaderText,
                    textAlign: 'center',
                    flexShrink: 0,
                  },
                ]}>
                Invoice
              </Text>
            </Pressable>
          </View>
        </View>

        <CheckoutSectionDivider width={ruleWidth} scale={layoutScale} />

        <View style={{ width: cardWidth, paddingHorizontal: contentInset, gap: 12 * scale }}>
          {order.lineItems.map((line, index) => (
            <LineItemRow
              key={line.id}
              item={line}
              scale={scale}
              layoutScale={layoutScale}
              showDividerAfter={index < order.lineItems.length - 1}
            />
          ))}
        </View>

        <CheckoutSectionDivider width={ruleWidth} scale={layoutScale} />

        <View
          style={{
            width: paddedBlockWidth,
            alignSelf: 'center',
            flexDirection: 'row',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            paddingRight: 4 * layoutScale,
          }}>
          <View style={{ gap: 8 * scale, maxWidth: 89 * scale, flexShrink: 1 }}>
            <Text
              style={[
                searchFont('medium'),
                {
                  fontSize: 16 * scale,
                  lineHeight: 14 * scale,
                  letterSpacing: 0.5 * scale,
                  color: '#000000',
                },
              ]}>
              Total bill
            </Text>
            <Text
              style={[
                searchFont('medium'),
                {
                  fontSize: 12 * scale,
                  lineHeight: 10 * scale,
                  letterSpacing: 0.5 * scale,
                  color: SwashoColors.neutral800,
                },
              ]}>
              {order.paymentNote}
            </Text>
          </View>
          <Text
            style={[
              searchFont('medium'),
              {
                fontSize: 18 * scale,
                lineHeight: 16 * scale,
                letterSpacing: 0.5 * scale,
                color: '#000000',
              },
            ]}>
            ₹ {order.totalBillInr}
          </Text>
        </View>

        <CheckoutSectionDivider width={ruleWidth} scale={layoutScale} />

        {isDelivering ? (
          <DeliveringOrderFooter order={order} scale={scale} cardWidth={cardWidth} onTrackPress={handleTrackPress} />
        ) : (
          <View
            style={{
              width: paddedBlockWidth,
              alignSelf: 'center',
              alignItems: 'center',
              gap: 16 * scale,
              paddingTop: 12 * scale,
              paddingHorizontal: 80 * scale,
            }}>
            <Text
              style={[
                searchFont('medium'),
                {
                  fontSize: 14 * scale,
                  lineHeight: 12 * scale,
                  letterSpacing: 0.5 * scale,
                  color: SwashoColors.neutral600,
                  textAlign: 'center',
                },
              ]}>
              How was your experience?
            </Text>
            <PastOrderExperienceStarsIcon width={220 * scale} height={24 * scale} />
          </View>
        )}
      </View>
    </>
  );

  const deliveringCardFallbackHeight = PAST_ORDER_CARD_FIGMA_HEIGHT * layoutScale;
  const cardRadius = SwashoRadii.lg * scale;

  return (
    <View
      onLayout={handleCardLayout}
      style={[
        styles.orderCard,
        {
          width: cardWidth,
          borderRadius: cardRadius,
          paddingLeft: 0,
          paddingRight: 0,
          paddingVertical: 0,
          overflow: 'hidden',
          backgroundColor: isDelivering ? 'transparent' : SwashoColors.surface,
          ...(isDelivering
            ? figmaShadow({ offsetX: 0, offsetY: 0, blur: 8, color: '#000000', opacity: 0.1 }, scale)
            : figmaShadow(FigmaShadows.checkoutScheduleCard, scale)),
        },
      ]}>
      {isDelivering ? (
        <View
          pointerEvents="none"
          style={[
            StyleSheet.absoluteFillObject,
            {
              borderRadius: cardRadius,
              overflow: 'hidden',
            },
          ]}>
          <PastOrderDeliveringCardBackground
            width={cardWidth}
            height={cardHeight > 0 ? cardHeight : deliveringCardFallbackHeight}
          />
        </View>
      ) : null}
      <View style={{ zIndex: 2 }}>{cardBody}</View>
    </View>
  );
}

export function PastOrdersScreen() {
  const { scale, contentWidth } = useScreenScale();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const [filter, setFilter] = useState<PastOrderFilterId>('all');

  const cardWidth = (contentWidth - 16 * scale);
  const bottomInset = HOME_INDICATOR_HEIGHT * scale + insets.bottom;

  const visibleOrders = useMemo(() => pastOrdersForFilter(filter), [filter]);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/subscription');
  }, []);

  const handleUpcoming = useCallback(() => {
    router.push(subscriptionUpcomingFromPastOrdersHref(DEMO_SUBSCRIPTION.id));
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: PAGE_BG, paddingTop: safeTop }]}>
      <View style={[styles.frame, { width: contentWidth }]}>
        <View style={[styles.statusBar, { height: STATUS_BAR_HEIGHT * scale }]}>
          <StatusBar scale={scale} tone="light" />
        </View>

        <View
          style={[
            styles.header,
            {
              top: STATUS_BAR_HEIGHT * scale,
              height: HEADER_HEIGHT * scale,
              ...figmaShadow({ offsetX: 0, offsetY: 2, blur: 4, color: '#000000', opacity: 0.1 }, scale),
            },
          ]}>
          <View
            style={[
              styles.toolbarRow,
              {
                top: (HEADER_TOOLBAR_TOP - STATUS_BAR_HEIGHT) * scale,
                left: 17 * scale,
                right: 18 * scale,
                height: 34 * scale,
              },
            ]}>
            <View style={[styles.headerRow, { gap: 12 * scale, height: 34 * scale }]}>
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
                    flexShrink: 0,
                  },
                ]}>
                Orders
              </Text>
            </View>
            <View style={[styles.headerActions, { gap: 12 * scale, height: 34 * scale }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Search orders"
              onPress={() => router.push('/search')}
              style={[
                styles.iconPill,
                {
                  width: 34 * scale,
                  height: 34 * scale,
                  borderRadius: 9999 * scale,
                  borderWidth: 0.5 * scale,
                },
              ]}>
              <MagnifierIcon width={18 * scale} height={18 * scale} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Upcoming order"
              onPress={handleUpcoming}
              style={[
                styles.iconPill,
                {
                  height: 34 * scale,
                  paddingLeft: 4 * scale,
                  paddingRight: 8 * scale,
                  borderRadius: 9999 * scale,
                  borderWidth: 0.5 * scale,
                  gap: 2 * scale,
                },
              ]}>
              <Image
                source={riderImage}
                style={{ width: 27 * scale, height: 30 * scale, transform: [{ rotate: '-4.8deg' }] }}
                contentFit="contain"
              />
              <Text
                style={[
                  searchFont('medium'),
                  {
                    fontSize: 14 * scale,
                    lineHeight: 12 * scale,
                    letterSpacing: 0.5 * scale,
                    color: SwashoColors.neutral950,
                  },
                ]}>
                Upcoming
              </Text>
              <View style={{ position: 'absolute', right: -1 * scale, top: -1 * scale }}>
                <PastOrderUpcomingDotIcon width={8 * scale} height={8 * scale} />
              </View>
            </Pressable>
          </View>
          </View>
        </View>

        <View
          style={[
            styles.filterBar,
            {
              top: FILTER_BAR_TOP * scale,
              height: FILTER_BAR_HEIGHT * scale,
              paddingHorizontal: 20 * scale,
              gap: 8 * scale,
              ...figmaShadow(FigmaShadows.checkoutScheduleCard, scale),
            },
          ]}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 * scale, alignItems: 'center' }}>
            {PAST_ORDER_FILTERS.map((chip) => (
              <OrderFilterChip
                key={chip.id}
                label={chip.label}
                active={filter === chip.id}
                scale={scale}
                onPress={() => setFilter(chip.id)}
              />
            ))}
          </ScrollView>
        </View>

        <ScrollView
          style={{ marginTop: SCROLL_CONTENT_START_Y * scale, flex: 1 }}
          contentContainerStyle={{
            paddingTop: SCROLL_PADDING_TOP * scale,
            paddingHorizontal: 8 * scale,
            paddingBottom: bottomInset + 16 * scale,
            gap: 16 * scale,
            alignItems: 'center',
          }}
          showsVerticalScrollIndicator={false}>
          {visibleOrders.map((order) => (
            <PastOrderCard key={order.id} order={order} scale={scale} cardWidth={cardWidth} />
          ))}
        </ScrollView>

        <View
          style={[styles.homeIndicatorWrap, homeIndicatorScreenBottomStyle, { paddingBottom: insets.bottom }]}
          pointerEvents="none">
          <HomeIndicator scale={scale} />
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
    flex: 1,
    position: 'relative',
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 3,
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: SwashoColors.surface,
  },
  toolbarRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  iconPill: {
    borderColor: SwashoColors.neutral300,
    backgroundColor: SwashoColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: SwashoColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterChip: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: '#fafafa',
    borderColor: SwashoColors.primary600,
  },
  filterChipIdle: {
    backgroundColor: SwashoColors.surface,
    borderColor: SwashoColors.neutral300,
  },
  orderCard: {
    backgroundColor: SwashoColors.surface,
  },
  homeIndicatorWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    backgroundColor: SwashoColors.surface,
  },
});
