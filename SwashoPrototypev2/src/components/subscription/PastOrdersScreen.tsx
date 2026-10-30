import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useMemo, useState, type LayoutChangeEvent } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CheckoutSectionDivider } from '@/components/checkout/CheckoutSectionDivider';
import { ArrowLeftIcon, MagnifierIcon } from '@/components/home/figma-icons';
import { FigmaShadows, figmaShadow } from '@/components/home/figma-shadows';
import { HomeIndicator } from '@/components/home/HomeIndicator';
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
import { subscriptionUpcomingFromPastOrdersHref } from '@/lib/subscription-past-orders-flow';
import { PastOrderDeliveringCardBackground } from '@/components/subscription/PastOrderDeliveringCardBackground';

import {
  PastOrderDeliveredCheckIcon,
  PastOrderExperienceStarsIcon,
  PastOrderExtraGarmentAIcon,
  PastOrderExtraGarmentBIcon,
  PastOrderInvoiceDownloadIcon,
  PastOrderRiderScribbleBgIcon,
  PastOrderRiderScribbleLineIcon,
  PastOrderScooterIcon,
  PastOrderTrackRiderIcon,
  PastOrderTrouserTileIcon,
  PastOrderUpcomingDotIcon,
  PastOrderWashIronStackBottomIcon,
  PastOrderWashIronStackTopIcon,
} from './past-orders-icons';

const STATUS_BAR_HEIGHT = 32;
const HEADER_HEIGHT = 69;
const FILTER_BAR_TOP = 102;
const FILTER_BAR_HEIGHT = 45;
const SCROLL_CONTENT_START_Y = FILTER_BAR_TOP + FILTER_BAR_HEIGHT;
const SCROLL_PADDING_TOP = 14;
const HOME_INDICATOR_HEIGHT = 24;
const PAGE_BG = '#f2f2f2';
const SUCCESS_600 = '#16a34a';
/** Figma 3429:18167 delivering footer strip */
const DELIVERING_ORDER_FOOTER_HEIGHT = 68;
const DELIVERING_ORDER_FOOTER_WIDTH = 371;
const DELIVERING_ORDER_FOOTER_INSET_LEFT = 13;
const DELIVERING_ORDER_FOOTER_TOP = 332;
/** Figma 3429:18168 Frame 503 on card 3429:18167. */
const DELIVERING_RIDER_ART_LEFT = 12.748;
const DELIVERING_RIDER_ART_TOP = 338.615;
const DELIVERING_RIDER_FRAME_WIDTH = 93.76;
const DELIVERING_RIDER_FRAME_HEIGHT = 61.661;
/** Rider art vs footer frame 3429:18229. */
const DELIVERING_RIDER_LEFT_IN_FOOTER = DELIVERING_RIDER_ART_LEFT - DELIVERING_ORDER_FOOTER_INSET_LEFT;
const DELIVERING_RIDER_TOP_IN_FOOTER = DELIVERING_RIDER_ART_TOP - DELIVERING_ORDER_FOOTER_TOP;
const DELIVERING_TRACK_RIDER_LEFT = 266;
const DELIVERING_TRACK_RIDER_TOP = 29;

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

function LineItemRow({ item, scale, showDividerAfter }: { item: PastOrderLineItem; scale: number; showDividerAfter: boolean }) {
  if (item.kind === 'extra_garments') {
    return (
      <View style={{ width: '100%', gap: 12 * scale }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12 * scale }}>
          <View style={{ width: 75 * scale, height: 33 * scale, position: 'relative' }}>
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
        {showDividerAfter ? <CheckoutSectionDivider width={358 * scale} scale={scale} /> : null}
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
      {showDividerAfter ? <CheckoutSectionDivider width={358 * scale} scale={scale} /> : null}
    </View>
  );
}

function DeliveringOrderRiderArt({ scale }: { scale: number }) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: DELIVERING_RIDER_LEFT_IN_FOOTER * scale,
        top: DELIVERING_RIDER_TOP_IN_FOOTER * scale,
        width: DELIVERING_RIDER_FRAME_WIDTH * scale,
        height: DELIVERING_RIDER_FRAME_HEIGHT * scale,
        zIndex: 1,
        transform: [{ rotate: '7.3deg' }],
      }}>
      <PastOrderRiderScribbleBgIcon
        width={88 * scale}
        height={51 * scale}
        style={{ position: 'absolute', left: 0, top: 20 * scale, transform: [{ rotate: '-10.27deg' }] }}
      />
      <PastOrderRiderScribbleLineIcon
        width={143 * scale}
        height={1 * scale}
        style={{ position: 'absolute', left: -8 * scale, top: 43 * scale }}
      />
      <Image
        source={riderImage}
        style={{
          position: 'absolute',
          left: -0.75 * scale,
          top: 3.23 * scale,
          width: 53.75 * scale,
          height: 62.65 * scale,
          transform: [{ rotate: '-12.1deg' }],
        }}
        contentFit="contain"
      />
    </View>
  );
}

/** Figma 3429:18229 footer + 3429:18168 rider anchored to the footer frame. */
function DeliveringOrderFooter({ order, scale }: { order: PastOrderSummary; scale: number }) {
  const footerOffsetLeft = (DELIVERING_ORDER_FOOTER_INSET_LEFT - 16) * scale;

  return (
    <View
      style={{
        position: 'relative',
        marginLeft: footerOffsetLeft,
        width: DELIVERING_ORDER_FOOTER_WIDTH * scale,
        minHeight: DELIVERING_ORDER_FOOTER_HEIGHT * scale,
        overflow: 'visible',
      }}>
      <DeliveringOrderRiderArt scale={scale} />
      <View
        style={{
          minHeight: DELIVERING_ORDER_FOOTER_HEIGHT * scale,
          paddingTop: 12 * scale,
          paddingLeft: 90 * scale,
          paddingRight: 80 * scale,
          justifyContent: 'center',
          gap: 8 * scale,
          zIndex: 2,
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
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Track rider"
        style={{
          position: 'absolute',
          left: DELIVERING_TRACK_RIDER_LEFT * scale,
          top: DELIVERING_TRACK_RIDER_TOP * scale,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6 * scale,
          paddingHorizontal: 4 * scale,
          minWidth: 60 * scale,
          height: 18 * scale,
        }}>
        <PastOrderTrackRiderIcon width={20 * scale} height={20 * scale} />
        <Text
          style={[
            searchFont('medium'),
            {
              fontSize: 12 * scale,
              lineHeight: 10 * scale,
              letterSpacing: 0.5 * scale,
              color: SwashoColors.primary600,
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
  const innerWidth = 368 * scale;
  const [cardHeight, setCardHeight] = useState(0);

  const handleCardLayout = useCallback((event: LayoutChangeEvent) => {
    if (!isDelivering) {
      return;
    }
    const nextHeight = event.nativeEvent.layout.height;
    setCardHeight((prev) => (prev === nextHeight ? prev : nextHeight));
  }, [isDelivering]);

  const cardBody = (
    <>
      <View style={{ width: innerWidth, gap: 8 * scale, position: 'relative' }}>
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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 * scale, flexWrap: 'wrap' }}>
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
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Download invoice"
          style={{
            position: 'absolute',
            right: 0,
            top: isDelivering ? 3 * scale : 4 * scale,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6 * scale,
            borderWidth: 0.5 * scale,
            borderColor: SwashoColors.neutral300,
            borderRadius: SwashoRadii.md * scale,
            paddingHorizontal: 12 * scale,
            paddingVertical: 8 * scale,
            minWidth: 60 * scale,
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
                flex: 1,
              },
            ]}>
            Invoice
          </Text>
        </Pressable>
      </View>

      <CheckoutSectionDivider width={innerWidth} scale={scale} />

      <View style={{ width: innerWidth, gap: 12 * scale, padding: 12 * scale }}>
        {order.lineItems.map((line, index) => (
          <LineItemRow
            key={line.id}
            item={line}
            scale={scale}
            showDividerAfter={index < order.lineItems.length - 1}
          />
        ))}
      </View>

      <CheckoutSectionDivider width={innerWidth} scale={scale} />

      <View
        style={{
          width: innerWidth,
          flexDirection: 'row',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          paddingTop: 12 * scale,
          paddingLeft: 12 * scale,
        }}>
        <View style={{ gap: 8 * scale, maxWidth: 89 * scale }}>
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

      <CheckoutSectionDivider width={innerWidth} scale={scale} />

      {isDelivering ? (
        <DeliveringOrderFooter order={order} scale={scale} />
      ) : (
        <View style={{ width: innerWidth, alignItems: 'center', gap: 16 * scale, paddingTop: 12 * scale, paddingHorizontal: 80 * scale }}>
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
    </>
  );

  const deliveringCardFallbackHeight = 410 * scale;

  return (
    <View
      onLayout={handleCardLayout}
      style={[
        styles.orderCard,
        {
          width: cardWidth,
          borderRadius: SwashoRadii.lg * scale,
          paddingLeft: 16 * scale,
          paddingRight: 12 * scale,
          paddingVertical: 16 * scale,
          gap: 16 * scale,
          overflow: 'hidden',
          ...(isDelivering
            ? figmaShadow({ offsetX: 0, offsetY: 0, blur: 8, color: '#000000', opacity: 0.1 }, scale)
            : figmaShadow(FigmaShadows.checkoutScheduleCard, scale)),
        },
      ]}>
      {isDelivering ? (
        <PastOrderDeliveringCardBackground
          width={cardWidth}
          height={cardHeight > 0 ? cardHeight : deliveringCardFallbackHeight}
        />
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
              Orders
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 * scale }}>
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

        <View
          style={[
            styles.filterBar,
            {
              top: FILTER_BAR_TOP * scale,
              height: FILTER_BAR_HEIGHT * scale,
              paddingHorizontal: 20 * scale,
              paddingVertical: 13 * scale,
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

        <View style={[styles.homeIndicatorWrap, { paddingBottom: insets.bottom }]}>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
