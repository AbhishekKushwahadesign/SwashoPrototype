import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { Image as RNImage, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AltArrowRightIcon, ArrowLeftIcon } from '@/components/home/figma-icons';
import { FigmaShadows, figmaShadow } from '@/components/home/figma-shadows';
import { HomeIndicator, homeIndicatorScreenBottomStyle } from '@/components/home/HomeIndicator';
import { useSafeTopInset, useScreenScale } from '@/components/home/scale';
import { StatusBar } from '@/components/home/StatusBar';
import { TertiaryButton } from '@/components/home/TertiaryButton';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';
import {
  defaultDeliveringOrderTracking,
  orderTrackingForId,
  type OrderTrackingViewModel,
} from '@/data/order-tracking';

import {
  OrderTrackingBasketIcon,
  OrderTrackingBatteryChargeIcon,
  OrderTrackingBoldArrowDownIcon,
  OrderTrackingCardDividerIcon,
  OrderTrackingChatIcon,
  OrderTrackingCo2LeafIcon,
  OrderTrackingDetailsDividerIcon,
  OrderTrackingDoubleAltArrowDownIcon,
  OrderTrackingHeadsetIcon,
  OrderTrackingPhoneIcon,
  OrderTrackingRoutePathIcon,
  OrderTrackingScooterIcon,
  OrderTrackingSectionRuleIcon,
  OrderTrackingVerifiedCheckIcon,
} from './order-tracking-icons';
import { OrderTrackingTimeline } from './OrderTrackingTimeline';

const STATUS_BAR_HEIGHT = 32;
const HEADER_GRADIENT_HEIGHT = 103;
const TOP_TIME_SECTION_TOP = 48.5;
const MAP_TOP = 102.5;
const MAP_HEIGHT = 472;
const MAP_SCREENSHOT_HEIGHT_RATIO = 1.9425;
const MAP_SCREENSHOT_TOP_RATIO = -0.4328;
const MAP_SCROLL_BLOCK_HEIGHT = MAP_TOP + MAP_HEIGHT;
const CARDS_MAP_OVERLAP = 42;
const PAGE_BG = '#f2f2f2';
const SUCCESS_200 = '#bbf7d0';
const SUCCESS_600 = '#16a34a';
const HOME_INDICATOR_HEIGHT = 24;

const mapScreenshot = require('@/assets/order-tracking/map-screenshot.png');
const mapPinRider = require('@/assets/order-tracking/map-pin-rider.png');
const mapPinDestination = require('@/assets/order-tracking/map-pin-destination.png');
const headerRider = require('@/assets/order-tracking/header-rider.png');

function currentTimelineStage(
  order: OrderTrackingViewModel,
): 'pickup' | 'laundry' | 'delivery' | 'delivered' {
  const current = order.stages.find((stage) => stage.state === 'current');
  if (!current) {
    return 'delivered';
  }
  if (current.id === 'pickup') return 'pickup';
  if (current.id === 'laundry') return 'laundry';
  if (current.id === 'delivered') return 'delivered';
  return 'delivery';
}

function TrackingCard({
  scale,
  children,
  style,
}: {
  scale: number;
  children: ReactNode;
  style?: object;
}) {
  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: SwashoRadii.lg * scale,
          paddingVertical: 16 * scale,
          paddingHorizontal: 20 * scale,
          ...figmaShadow({ offsetX: 0, offsetY: 0, blur: 4, color: '#000000', opacity: 0.1 }, scale),
        },
        style,
      ]}>
      {children}
    </View>
  );
}

export function OrderTrackingScreen() {
  const { orderId: orderIdParam } = useLocalSearchParams<{ orderId?: string | string[] }>();
  const orderId = useMemo(() => {
    if (orderIdParam == null) {
      return undefined;
    }
    return Array.isArray(orderIdParam) ? orderIdParam[0] : orderIdParam;
  }, [orderIdParam]);
  const { scale, contentWidth } = useScreenScale();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const [timelineExpanded, setTimelineExpanded] = useState(false);

  const order = useMemo(() => {
    return orderTrackingForId(orderId) ?? defaultDeliveringOrderTracking();
  }, [orderId]);

  const timelineStage = currentTimelineStage(order);
  const cardWidth = 390 * scale;
  const horizontalPad = 11 * scale;

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  }, []);

  const toggleTimeline = useCallback(() => {
    setTimelineExpanded((prev) => !prev);
  }, []);

  return (
    <View style={[styles.root, { backgroundColor: PAGE_BG, paddingTop: safeTop }]}>
      <View style={[styles.frame, { width: contentWidth }]}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{
            paddingBottom: HOME_INDICATOR_HEIGHT * scale + insets.bottom + 24 * scale,
          }}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              height: MAP_SCROLL_BLOCK_HEIGHT * scale,
              backgroundColor: PAGE_BG,
            }}>
            <View
              style={{
                position: 'absolute',
                top: MAP_TOP * scale,
                left: 0,
                right: 0,
                height: MAP_HEIGHT * scale,
                overflow: 'hidden',
              }}>
              <RNImage
                source={mapScreenshot}
                style={{
                  position: 'absolute',
                  left: 0,
                  width: '100%',
                  height: MAP_HEIGHT * MAP_SCREENSHOT_HEIGHT_RATIO * scale,
                  top: MAP_HEIGHT * MAP_SCREENSHOT_TOP_RATIO * scale,
                }}
                resizeMode="cover"
              />
              <LinearGradient
                colors={['rgba(255,255,255,0)', PAGE_BG]}
                locations={[0.85275, 1]}
                style={StyleSheet.absoluteFillObject}
                pointerEvents="none"
              />
              <View
                style={{
                  position: 'absolute',
                  left: 154.5 * scale,
                  top: 135.5 * scale,
                  width: 115 * scale,
                  height: 172.5 * scale,
                }}>
                <OrderTrackingRoutePathIcon width={115 * scale} height={172.5 * scale} />
              </View>
              <View
                style={{
                  position: 'absolute',
                  left: 160 * scale,
                  top: 102 * scale,
                  width: 58.924 * scale,
                  height: 58.924 * scale,
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [{ rotate: '141.24deg' }],
                }}>
                <RNImage
                  source={mapPinRider}
                  style={{ width: 41.914 * scale, height: 41.914 * scale }}
                  resizeMode="cover"
                />
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Focus map on rider"
                style={{
                  position: 'absolute',
                  left: 348 * scale,
                  top: 304 * scale,
                  backgroundColor: SwashoColors.surface,
                  borderWidth: 1 * scale,
                  borderColor: SwashoColors.neutral300,
                  borderRadius: 9999 * scale,
                  padding: 6 * scale,
                  ...figmaShadow({ offsetX: 0, offsetY: 0, blur: 3, color: '#000000', opacity: 0.15 }, scale),
                }}>
                <RNImage source={mapPinDestination} style={{ width: 24 * scale, height: 24 * scale }} resizeMode="cover" />
              </Pressable>
            </View>
          </View>

          <View
            style={{
              marginTop: -CARDS_MAP_OVERLAP * scale,
              paddingHorizontal: horizontalPad,
              gap: 20 * scale,
            }}>
            <TrackingCard scale={scale} style={{ gap: 12 * scale, width: cardWidth, alignSelf: 'center' }}>
              <View style={[styles.row, { gap: 12 * scale }]}>
                <RNImage
                  source={order.partnerAvatar}
                  style={{ width: 40 * scale, height: 40 * scale, borderRadius: 20 * scale }}
                />
                <View style={[styles.row, { flex: 1, justifyContent: 'space-between', gap: 8 * scale }]}>
                  <View style={{ gap: 6 * scale, flexShrink: 1 }}>
                    <Text
                      style={[
                        searchFont('medium'),
                        { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale, color: '#000000' },
                      ]}>
                      {order.partnerName}
                    </Text>
                    <View style={[styles.row, { gap: 4 * scale }]}>
                      <OrderTrackingBatteryChargeIcon width={20 * scale} height={20 * scale} />
                      <Text
                        style={[
                          searchFont('medium'),
                          {
                            fontSize: 13 * scale,
                            lineHeight: 12 * scale,
                            letterSpacing: 0.5 * scale,
                            color: SwashoColors.neutral600,
                          },
                        ]}>
                        {order.partnerRole}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.row, { gap: 8 * scale }]}>
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Call delivery partner"
                      style={[styles.circleAction, { width: 33 * scale, height: 33 * scale, borderRadius: 9999 * scale }]}>
                      <OrderTrackingPhoneIcon width={22 * scale} height={22 * scale} />
                    </Pressable>
                    <View style={{ width: 1 * scale, height: 26.662 * scale, backgroundColor: SwashoColors.neutral300 }} />
                    <Pressable
                      accessibilityRole="button"
                      accessibilityLabel="Message delivery partner"
                      style={[styles.circleAction, { width: 33 * scale, height: 33 * scale, borderRadius: 9999 * scale }]}>
                      <OrderTrackingChatIcon width={19.8 * scale} height={19.8 * scale} />
                    </Pressable>
                  </View>
                </View>
              </View>
              <OrderTrackingCardDividerIcon width={342 * scale} height={1 * scale} />
              <View style={[styles.row, { gap: 4 * scale, alignItems: 'flex-start' }]}>
                <OrderTrackingCo2LeafIcon width={20 * scale} height={24 * scale} />
                <Text
                  style={[
                    searchFont('medium'),
                    {
                      flex: 1,
                      fontSize: 13 * scale,
                      lineHeight: 18 * scale,
                      letterSpacing: 0.5 * scale,
                      color: SwashoColors.neutral600,
                    },
                  ]}>
                  Working toward CO₂ neutral Delivery by 2030
                </Text>
              </View>
            </TrackingCard>

            <View style={[styles.row, { width: contentWidth, justifyContent: 'center', gap: 16 * scale }]}>
              <OrderTrackingSectionRuleIcon width={120 * scale} height={1 * scale} />
              <View style={[styles.row, { gap: 6 * scale }]}>
                <OrderTrackingDoubleAltArrowDownIcon width={19.8 * scale} height={19.8 * scale} />
                <Text
                  style={[
                    searchFont('medium'),
                    {
                      fontSize: 13 * scale,
                      lineHeight: 18 * scale,
                      letterSpacing: 0.5 * scale,
                      color: SwashoColors.neutral600,
                    },
                  ]}>
                  All details here
                </Text>
                <OrderTrackingDoubleAltArrowDownIcon width={19.8 * scale} height={19.8 * scale} />
              </View>
              <OrderTrackingSectionRuleIcon width={120 * scale} height={1 * scale} />
            </View>

            <View style={{ gap: 12 * scale, width: cardWidth, alignSelf: 'center' }}>
              <TrackingCard
                scale={scale}
                style={{
                  gap: 12 * scale,
                  paddingRight: 8 * scale,
                  position: 'relative',
                  overflow: 'visible',
                }}>
                <View style={[styles.row, { gap: 8 * scale }]}>
                  <OrderTrackingBasketIcon width={24 * scale} height={24 * scale} />
                  <Text
                    style={[
                      searchFont('medium'),
                      { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale, color: '#000000' },
                    ]}>
                    Basket
                  </Text>
                </View>
                <OrderTrackingDetailsDividerIcon width={355 * scale} height={1 * scale} />
                <View style={{ gap: 12 * scale, paddingHorizontal: 6 * scale }}>
                  <Text
                    style={[
                      searchFont('medium'),
                      {
                        fontSize: 13 * scale,
                        lineHeight: 12 * scale,
                        letterSpacing: 0.5 * scale,
                        color: SwashoColors.neutral600,
                      },
                    ]}>
                    {order.basketPrimaryLine}
                  </Text>
                  <View style={[styles.row, { gap: 6 * scale, alignItems: 'center' }]}>
                    <Text
                      numberOfLines={1}
                      style={[
                        searchFont('medium'),
                        {
                          fontSize: 13 * scale,
                          lineHeight: 12 * scale,
                          letterSpacing: 0.5 * scale,
                          color: SwashoColors.neutral600,
                          flexShrink: 1,
                        },
                      ]}>
                      {order.basketSecondaryLine}...
                    </Text>
                    {order.basketExtraCount > 0 ? (
                      <Text
                        style={[
                          searchFont('semibold'),
                          {
                            fontSize: 15 * scale,
                            lineHeight: 14 * scale,
                            letterSpacing: 0.5 * scale,
                            color: SwashoColors.neutral600,
                          },
                        ]}>
                        +{order.basketExtraCount}
                      </Text>
                    ) : null}
                  </View>
                </View>
                <View style={{ position: 'absolute', right: 8 * scale, top: '50%', marginTop: 8 * scale }}>
                  <TertiaryButton label="View Basket" variant="text" scale={scale} onPress={() => undefined} />
                </View>
              </TrackingCard>

              <TrackingCard scale={scale} style={{ gap: 8 * scale, paddingRight: 8 * scale }}>
                <View style={[styles.row, { gap: 8 * scale, alignItems: 'flex-start' }]}>
                  <OrderTrackingScooterIcon width={24 * scale} height={24 * scale} />
                  <View style={{ flex: 1, gap: 12 * scale }}>
                    <Text
                      style={[
                        searchFont('medium'),
                        { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale, color: '#000000' },
                      ]}>
                      Delivering at
                    </Text>
                    <View style={[styles.row, { gap: 6 * scale, flexWrap: 'nowrap', alignItems: 'center' }]}>
                      <Text
                        style={[
                          searchFont('medium'),
                          {
                            fontSize: 14 * scale,
                            lineHeight: 12 * scale,
                            letterSpacing: 0.5 * scale,
                            color: SwashoColors.darkHeaderText,
                          },
                        ]}>
                        {order.deliveryLocationName}
                      </Text>
                      <View style={{ width: 1 * scale, height: 14 * scale, backgroundColor: SwashoColors.neutral300 }} />
                      <Text
                        numberOfLines={1}
                        style={[
                          searchFont('medium'),
                          {
                            flex: 1,
                            fontSize: 14 * scale,
                            lineHeight: 12 * scale,
                            letterSpacing: 0.5 * scale,
                            color: SwashoColors.neutral600,
                          },
                        ]}>
                        {order.deliveryAddressLine}
                      </Text>
                    </View>
                  </View>
                  <AltArrowRightIcon width={19.8 * scale} height={19.8 * scale} />
                </View>
                <OrderTrackingCardDividerIcon width={342 * scale} height={1 * scale} />
                <Text
                  style={[
                    searchFont('regular'),
                    {
                      fontSize: 12 * scale,
                      lineHeight: 16 * scale,
                      letterSpacing: 0.5 * scale,
                      color: SwashoColors.neutral600,
                    },
                  ]}>
                  Delivery address cannot be changed once your order is out for delivery
                </Text>
              </TrackingCard>

              <TrackingCard scale={scale} style={{ paddingRight: 8 * scale }}>
                <View style={[styles.row, { gap: 8 * scale, alignItems: 'center' }]}>
                  <OrderTrackingHeadsetIcon width={24 * scale} height={24 * scale} />
                  <View style={{ flex: 1, gap: 12 * scale }}>
                    <Text
                      style={[
                        searchFont('medium'),
                        { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale, color: '#000000' },
                      ]}>
                      Need a help?
                    </Text>
                    <Text
                      style={[
                        searchFont('medium'),
                        {
                          fontSize: 13 * scale,
                          lineHeight: 12 * scale,
                          letterSpacing: 0.5 * scale,
                          color: SwashoColors.neutral500,
                        },
                      ]}>
                      Contact Customer Support
                    </Text>
                  </View>
                  <AltArrowRightIcon width={19.8 * scale} height={19.8 * scale} />
                </View>
              </TrackingCard>
            </View>

            <View
              style={{
                width: 357.676 * scale,
                height: 194.339 * scale,
                borderRadius: 4 * scale,
                backgroundColor: '#d9d9d9',
                alignSelf: 'center',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Text style={{ fontFamily: 'Roboto_500Medium', fontSize: 14 * scale, color: '#000000' }}>AD</Text>
            </View>
          </View>
        </ScrollView>

        <LinearGradient
          colors={[SwashoColors.surface, SUCCESS_200]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          locations={[0.5008, 0.9999]}
          style={[
            styles.headerGradient,
            {
              height: HEADER_GRADIENT_HEIGHT * scale,
              ...figmaShadow({ offsetX: 0, offsetY: 2, blur: 4, color: '#000000', opacity: 0.1 }, scale),
            },
          ]}
          pointerEvents="box-none">
          <View style={[styles.statusBar, { height: STATUS_BAR_HEIGHT * scale }]}>
            <StatusBar scale={scale} tone="transparent" />
          </View>
        </LinearGradient>

        <LinearGradient
          colors={[SwashoColors.surface, SUCCESS_200]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          locations={[0.5008, 0.9999]}
          style={[
            styles.topTimeSection,
            {
              top: TOP_TIME_SECTION_TOP * scale,
              paddingLeft: 48 * scale,
              paddingRight: 37 * scale,
              paddingVertical: 8 * scale,
            },
          ]}
          pointerEvents="box-none">
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 * scale }}>
            <View style={{ width: 36.884 * scale, height: 35.162 * scale, transform: [{ rotate: '1.87deg' }] }}>
              <Image
                source={headerRider}
                style={{ width: 32.3 * scale, height: 38.729 * scale, transform: [{ rotate: '-9.11deg' }] }}
                contentFit="contain"
              />
            </View>
            <View style={{ gap: 6 * scale, flexShrink: 1 }}>
              <Text
                style={[
                  searchFont('medium'),
                  { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale, color: '#000000' },
                ]}>
                {order.deliveryEtaLabel}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Toggle delivery timeline"
                onPress={toggleTimeline}
                style={[styles.row, { gap: 2 * scale }]}>
                <Text
                  style={[
                    searchFont('medium'),
                    {
                      fontSize: 13 * scale,
                      lineHeight: 12 * scale,
                      letterSpacing: 0.5 * scale,
                      color: SwashoColors.neutral600,
                    },
                  ]}>
                  {order.deliveryPhaseLabel}
                </Text>
                <OrderTrackingBoldArrowDownIcon
                  width={18 * scale}
                  height={18 * scale}
                  style={{ transform: [{ rotate: timelineExpanded ? '180deg' : '0deg' }] }}
                />
              </Pressable>
            </View>
          </View>
          <View
            style={{
              position: 'absolute',
              left: 311.88 * scale,
              top: '50%',
              marginTop: 1.49 * scale,
              transform: [{ translateY: -9 * scale }],
              flexDirection: 'row',
              gap: 4 * scale,
              alignItems: 'center',
            }}>
            <OrderTrackingVerifiedCheckIcon width={18 * scale} height={18 * scale} />
            <Text
              style={[
                searchFont('medium'),
                {
                  fontSize: 13 * scale,
                  lineHeight: 12 * scale,
                  letterSpacing: 0.5 * scale,
                  color: SUCCESS_600,
                },
              ]}>
              {order.onTimeLabel}
            </Text>
          </View>
        </LinearGradient>

        {timelineExpanded ? (
          <View
            style={{
              position: 'absolute',
              top: HEADER_GRADIENT_HEIGHT * scale,
              left: 0,
              right: 0,
              backgroundColor: SwashoColors.surface,
              paddingVertical: 12 * scale,
              ...figmaShadow(FigmaShadows.sheet, scale),
            }}>
            <OrderTrackingTimeline scale={scale} minsAwayLabel={order.minsAwayLabel} currentStage={timelineStage} />
          </View>
        ) : null}

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={handleBack}
          style={[
            styles.backButton,
            {
              top: 56.5 * scale,
              left: 12 * scale,
              padding: 8 * scale,
            },
          ]}>
          <ArrowLeftIcon width={20 * scale} height={20 * scale} />
        </Pressable>

        <View style={[styles.homeIndicatorWrap, homeIndicatorScreenBottomStyle]} pointerEvents="none">
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
    overflow: 'hidden',
  },
  scroll: {
    flex: 1,
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  topTimeSection: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
  },
  statusBar: {
    width: '100%',
  },
  backButton: {
    position: 'absolute',
    zIndex: 11,
  },
  card: {
    backgroundColor: SwashoColors.surface,
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circleAction: {
    backgroundColor: SwashoColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicatorWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 12,
  },
});
