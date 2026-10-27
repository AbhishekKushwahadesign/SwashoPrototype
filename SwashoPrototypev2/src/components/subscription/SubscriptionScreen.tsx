import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useCallback, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CheckoutEditPenSquareIcon } from '@/components/checkout/checkout-review-icons';
import { ArrowLeftIcon, LineDividerIcon, MagnifierIcon } from '@/components/home/figma-icons';
import { FigmaShadows, figmaShadow } from '@/components/home/figma-shadows';
import { HomeIndicator } from '@/components/home/HomeIndicator';
import { NavBar, NAV_BAR_BOTTOM_INSET } from '@/components/home/NavBar';
import { StatusBar } from '@/components/home/StatusBar';
import { useSafeTopInset, useScreenScale } from '@/components/home/scale';
import { ListServiceIcon } from '@/components/provider-page/provider-page-icons';
import { ScooterBoldIcon } from '@/components/provider-results/provider-results-icons';
import { TertiaryButton } from '@/components/home/TertiaryButton';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';
import {
  DEMO_SUBSCRIPTION,
  SUBSCRIPTION_FILTERS,
  subscriptionsForFilter,
  type SubscriptionFilterId,
  type SubscriptionGarmentLine,
  type SubscriptionSummary,
} from '@/data/subscriptions';
import { checkoutPlaceholderHref } from '@/lib/checkout-flow';

import { BillListIcon, VerticalRuleIcon } from './subscription-icons';

const STATUS_BAR_HEIGHT = 32;
const HEADER_HEIGHT = 101;
const HOME_INDICATOR_HEIGHT = 24;
const PAGE_BG = '#f2f2f2';
const PICKUP_BANNER_BORDER = '#6155f5';

const riderImage = require('@/assets/images/subscription/rider-with-bike.png');

function SubscriptionFilterChip({
  label,
  active,
  flex,
  scale,
  onPress,
}: {
  label: string;
  active: boolean;
  flex?: boolean;
  scale: number;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filterChip,
        flex ? styles.filterChipFlex : null,
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

function ServiceBreakdown({ services, scale }: { services: string[]; scale: number }) {
  return (
    <View style={[styles.serviceBreakdownRow, { gap: 8 * scale, paddingLeft: 13 * scale }]}>
      {services.map((service, index) => (
        <View key={`${service}-${index}`} style={[styles.serviceBreakdownItem, { gap: 8 * scale }]}>
          {index > 0 ? (
            <View style={{ width: 1 * scale, height: 18 * scale, alignItems: 'center', justifyContent: 'center' }}>
              <VerticalRuleIcon width={1 * scale} height={18 * scale} />
            </View>
          ) : null}
          <Text
            style={[
              searchFont('semibold'),
              {
                fontSize: 14 * scale,
                lineHeight: 14 * scale,
                letterSpacing: 0.5 * scale,
                color: SwashoColors.neutral800,
              },
            ]}>
            {service}
          </Text>
        </View>
      ))}
    </View>
  );
}

function GarmentThumb({ line, scale }: { line: SubscriptionGarmentLine; scale: number }) {
  const thumbSize = 35 * scale;
  return (
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
  );
}

function SubscriptionCard({
  subscription,
  scale,
  onReviewOrder,
}: {
  subscription: SubscriptionSummary;
  scale: number;
  onReviewOrder: (item: SubscriptionSummary) => void;
}) {
  const cardWidth = 396 * scale;
  const innerWidth = 372 * scale;

  return (
    <View
      style={[
        styles.subscriptionCard,
        {
          width: cardWidth,
          borderRadius: SwashoRadii.lg * scale,
          paddingVertical: 16 * scale,
          gap: 16 * scale,
          ...figmaShadow(FigmaShadows.orderCard, scale),
        },
      ]}>
      <View style={[styles.cardHeaderRow, { paddingLeft: 12 * scale, gap: 8 * scale }]}>
        <View style={{ flex: 1, gap: 8 * scale }}>
          <View style={[styles.titleRow, { gap: 8 * scale }]}>
            <Text
              style={[
                searchFont('medium'),
                styles.cardTitle,
                { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
              ]}>
              {subscription.reference}
            </Text>
            <View style={{ height: 20 * scale, justifyContent: 'center' }}>
              <LineDividerIcon width={20 * scale} height={1} />
            </View>
            <Text
              style={[
                searchFont('medium'),
                styles.cardTitle,
                { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale, flexShrink: 1 },
              ]}
              numberOfLines={1}>
              {subscription.title}
            </Text>
            <Pressable accessibilityRole="button" accessibilityLabel="Edit subscription name">
              <CheckoutEditPenSquareIcon width={20 * scale} height={20 * scale} />
            </Pressable>
          </View>
          <View style={[styles.providerRow, { gap: 4 * scale }]}>
            <Text
              style={[
                searchFont('medium'),
                {
                  fontSize: 13 * scale,
                  lineHeight: 20 * scale,
                  letterSpacing: 0.5 * scale,
                  color: SwashoColors.neutral700,
                },
              ]}>
              {subscription.providerName}
            </Text>
            <Text
              style={[
                searchFont('medium'),
                {
                  fontSize: 13 * scale,
                  lineHeight: 20 * scale,
                  letterSpacing: 0.5 * scale,
                  color: SwashoColors.neutral700,
                },
              ]}>
              {subscription.frequencyLabel}
            </Text>
          </View>
        </View>
        <View style={{ width: 63 * scale, height: 46 * scale, justifyContent: 'center' }}>
          <Text
            style={[
              searchFont('semibold'),
              {
                fontSize: 16 * scale,
                lineHeight: 20 * scale,
                letterSpacing: 0.5 * scale,
                color: SwashoColors.darkHeaderText,
              },
            ]}>
            ₹{subscription.weeklyPriceInr}
          </Text>
          <Text
            style={[
              searchFont('regular'),
              {
                fontSize: 12 * scale,
                lineHeight: 16 * scale,
                letterSpacing: 0.5 * scale,
                color: SwashoColors.neutral700,
              },
            ]}>
            per week
          </Text>
        </View>
      </View>

      <View style={[styles.cardDivider, { width: innerWidth }]} />

      <View style={{ width: '100%', gap: 16 * scale, paddingHorizontal: 8 * scale }}>
        {subscription.garments.map((line, garmentIndex) => (
          <View key={line.id} style={{ width: '100%', gap: 12 * scale }}>
            <View style={[styles.garmentRow, { paddingLeft: 12 * scale, gap: 8 * scale }]}>
              <GarmentThumb line={line} scale={scale} />
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
            <ServiceBreakdown services={line.services} scale={scale} />
            {garmentIndex < subscription.garments.length - 1 ? (
              <View style={[styles.cardDividerDashed, { width: 358 * scale, alignSelf: 'center' }]} />
            ) : null}
          </View>
        ))}

        {subscription.extraGarmentCount > 0 ? (
          <>
            <View style={[styles.cardDividerDashed, { width: 358 * scale, alignSelf: 'center' }]} />
            <View style={[styles.extraGarmentStack, { paddingLeft: 12 * scale, height: 28.8 * scale }]}>
              {[0, 1].map((index) => (
                <View
                  key={index}
                  style={[
                    styles.extraGarmentBubble,
                    {
                      left: index * 18 * scale,
                      width: 28.8 * scale,
                      height: 28.8 * scale,
                      borderRadius: 8999 * scale,
                      borderWidth: 0.45 * scale,
                    },
                    figmaShadow({ offsetX: 0, offsetY: 0, blur: 4, color: '#000000', opacity: 0.25 }, scale),
                  ]}>
                  {index === 0 ? (
                    <ListServiceIcon icon="shirt" width={20 * scale} height={20 * scale} />
                  ) : (
                    <ListServiceIcon icon="tshirt" width={14 * scale} height={22 * scale} />
                  )}
                </View>
              ))}
              <View
                style={[
                  styles.extraGarmentBubble,
                  {
                    left: 36 * scale,
                    width: 28.8 * scale,
                    height: 28.8 * scale,
                    borderRadius: 8999 * scale,
                    borderWidth: 0.45 * scale,
                  },
                  figmaShadow({ offsetX: 0, offsetY: 0, blur: 4, color: '#000000', opacity: 0.25 }, scale),
                ]}>
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
                  +{subscription.extraGarmentCount}
                </Text>
              </View>
            </View>
          </>
        ) : null}
      </View>

      <View style={[styles.cardDivider, { width: innerWidth }]} />

      <View style={[styles.upcomingRow, { width: innerWidth }]}>
        <View style={{ flex: 1, gap: 10 * scale }}>
          <Text
            style={[
              searchFont('regular'),
              {
                fontSize: 14 * scale,
                lineHeight: 14 * scale,
                letterSpacing: 0.5 * scale,
                color: SwashoColors.neutral600,
              },
            ]}>
            Upcoming:
          </Text>
          <View style={[styles.pickupRow, { gap: 8 * scale }]}>
            <ScooterBoldIcon width={20 * scale} height={20 * scale} />
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
              Pickup in {subscription.pickupInDays} days
            </Text>
          </View>
        </View>
        <TertiaryButton
          label="Review Order"
          variant="accent"
          showTrailingIcon
          trailingIcon="review-order"
          scale={scale}
          onPress={() => onReviewOrder(subscription)}
        />
      </View>
    </View>
  );
}

function PickupBanner({
  subscription,
  scale,
  onReviewOrder,
}: {
  subscription: SubscriptionSummary;
  scale: number;
  onReviewOrder: (item: SubscriptionSummary) => void;
}) {
  return (
    <View
      style={[
        styles.pickupBanner,
        {
          width: 384 * scale,
          borderRadius: SwashoRadii.lg * scale,
          padding: 12 * scale,
          gap: 12 * scale,
          borderWidth: 1 * scale,
        },
      ]}>
      <View style={{ width: 33.446 * scale, height: 29.624 * scale, overflow: 'visible' }}>
        <View
          style={{
            position: 'absolute',
            left: 0.66 * scale,
            top: -7.45 * scale,
            width: 35.449 * scale,
            height: 39.859 * scale,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: 28.841 * scale,
              height: 34.581 * scale,
              transform: [{ rotate: '-12.1deg' }],
            }}>
            <Image source={riderImage} style={{ width: '100%', height: '100%' }} contentFit="contain" />
          </View>
        </View>
      </View>
      <View style={[styles.pickupBannerContent, { gap: 8 * scale }]}>
        <View style={{ flex: 1, gap: 8 * scale }}>
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
            Pickup in {subscription.pickupInDays} days
          </Text>
          <Text
            style={[
              searchFont('medium'),
              {
                fontSize: 14 * scale,
                lineHeight: 12 * scale,
                letterSpacing: 0.5 * scale,
                color: SwashoColors.neutral900,
              },
            ]}>
            Daily Wear Weekly
          </Text>
        </View>
        <TertiaryButton
          label="Review Order"
          variant="accent"
          showTrailingIcon
          trailingIcon="review-order"
          scale={scale}
          onPress={() => onReviewOrder(subscription)}
        />
      </View>
    </View>
  );
}

export function SubscriptionScreen() {
  const { scale, contentWidth, contentHeight } = useScreenScale();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const [filter, setFilter] = useState<SubscriptionFilterId>('all');

  const frameHeight = contentHeight + safeTop;
  const bottomChromeHeight = (101 + HOME_INDICATOR_HEIGHT) * scale;
  const bottomNavLift = NAV_BAR_BOTTOM_INSET * scale;
  const headerTop = STATUS_BAR_HEIGHT * scale;

  const visibleSubscriptions = useMemo(() => subscriptionsForFilter(filter), [filter]);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  }, []);

  const handleReviewOrder = useCallback((item: SubscriptionSummary) => {
    router.push(
      checkoutPlaceholderHref(item.providerId, item.searchQuery, {
        subscription: true,
        scheduleConfirmed: true,
      }),
    );
  }, []);

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
            styles.stickyHeader,
            {
              top: headerTop,
              height: HEADER_HEIGHT * scale,
              paddingTop: 23.3 * scale,
              paddingRight: 15.8447 * scale,
              paddingLeft: 8 * scale,
              paddingBottom: 0,
              ...figmaShadow({ offsetX: 0, offsetY: 2, blur: 4, color: '#000000', opacity: 0.1 }, scale),
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
                },
              ]}>
              Subscriptions
            </Text>
          </View>
          <View style={[styles.headerActions, { gap: 12 * scale, height: 34 * scale }]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Search subscriptions"
              onPress={() => router.push('/search')}
              style={[
                styles.iconPill,
                {
                  height: 34 * scale,
                  paddingHorizontal: 8 * scale,
                  borderRadius: 9999 * scale,
                  borderWidth: 0.5 * scale,
                  gap: 6 * scale,
                },
              ]}>
              <MagnifierIcon width={18 * scale} height={18 * scale} />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Past orders"
              style={[
                styles.iconPill,
                {
                  height: 34 * scale,
                  paddingHorizontal: 8 * scale,
                  borderRadius: 24 * scale,
                  borderWidth: 0.5 * scale,
                  gap: 4 * scale,
                },
              ]}>
              <BillListIcon width={20 * scale} height={20 * scale} />
              <Text
                style={[
                  searchFont('medium'),
                  {
                    fontSize: 14 * scale,
                    lineHeight: 12 * scale,
                    letterSpacing: 0.5 * scale,
                    color: '#000000',
                  },
                ]}>
                Past orders
              </Text>
            </Pressable>
          </View>
        </View>

        <ScrollView
          style={[styles.scroll, { marginTop: headerTop + HEADER_HEIGHT * scale }]}
          contentContainerStyle={{
            paddingBottom: bottomChromeHeight + bottomNavLift + 24 * scale,
            paddingTop: 8 * scale,
            alignItems: 'center',
            gap: 16 * scale,
          }}
          showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.filterRow,
              {
                width: contentWidth,
                paddingHorizontal: 20 * scale,
                gap: 8 * scale,
                minHeight: 52 * scale,
                paddingVertical: 8 * scale,
              },
            ]}>
            <SubscriptionFilterChip
              label="All"
              active={filter === 'all'}
              scale={scale}
              onPress={() => setFilter('all')}
            />
            <View style={{ width: 1 * scale, height: 26 * scale, justifyContent: 'center' }}>
              <LineDividerIcon width={26 * scale} height={1} />
            </View>
            {SUBSCRIPTION_FILTERS.slice(1).map((chip) => (
              <SubscriptionFilterChip
                key={chip.id}
                label={chip.label}
                active={filter === chip.id}
                flex
                scale={scale}
                onPress={() => setFilter(chip.id)}
              />
            ))}
          </View>

          {visibleSubscriptions.length > 0 ? (
            <>
              <PickupBanner
                subscription={visibleSubscriptions[0] ?? DEMO_SUBSCRIPTION}
                scale={scale}
                onReviewOrder={handleReviewOrder}
              />
              {visibleSubscriptions.map((item) => (
                <SubscriptionCard
                  key={item.id}
                  subscription={item}
                  scale={scale}
                  onReviewOrder={handleReviewOrder}
                />
              ))}
            </>
          ) : (
            <View style={{ paddingHorizontal: 20 * scale, paddingTop: 40 * scale }}>
              <Text
                style={[
                  searchFont('medium'),
                  {
                    fontSize: 14 * scale,
                    lineHeight: 20 * scale,
                    color: SwashoColors.neutral600,
                    textAlign: 'center',
                  },
                ]}>
                No {filter} subscriptions in this prototype.
              </Text>
            </View>
          )}
        </ScrollView>

        <View
          style={[
            styles.navBarWrap,
            { height: bottomChromeHeight, bottom: bottomNavLift },
          ]}>
          <NavBar
            variant="Orders"
            scale={scale}
            onHomePress={() => router.replace('/')}
            onSubscriptionPress={() => {}}
            onSwashoAiPress={() => router.push('/swasho-ai')}
          />
          <View style={styles.homeIndicatorWrap}>
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
  stickyHeader: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 11,
    backgroundColor: SwashoColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  iconPill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: SwashoColors.neutral300,
    backgroundColor: SwashoColors.surface,
  },
  scroll: {
    flex: 1,
    width: '100%',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SwashoColors.surface,
    flexWrap: 'wrap',
  },
  filterChip: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterChipFlex: {
    flex: 1,
    minWidth: 0,
  },
  filterChipActive: {
    backgroundColor: SwashoColors.primary50,
    borderColor: SwashoColors.primary600,
  },
  filterChipIdle: {
    backgroundColor: SwashoColors.surface,
    borderColor: SwashoColors.neutral400,
  },
  pickupBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SwashoColors.primary50,
    borderColor: PICKUP_BANNER_BORDER,
  },
  pickupBannerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subscriptionCard: {
    backgroundColor: SwashoColors.surface,
    alignSelf: 'center',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  cardTitle: {
    color: SwashoColors.neutral950,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  cardDivider: {
    alignSelf: 'center',
    height: 1,
    backgroundColor: SwashoColors.neutral200,
  },
  cardDividerDashed: {
    height: 1,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderColor: SwashoColors.neutral300,
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
  serviceBreakdownRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    width: '100%',
  },
  serviceBreakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  extraGarmentStack: {
    position: 'relative',
    width: 65 * 1,
  },
  extraGarmentBubble: {
    position: 'absolute',
    top: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderColor: SwashoColors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  upcomingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  pickupRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 18,
  },
  navBarWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: 'transparent',
  },
  homeIndicatorWrap: {
    backgroundColor: 'transparent',
  },
});
