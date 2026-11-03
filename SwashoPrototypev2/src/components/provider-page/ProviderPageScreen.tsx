import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Fragment, useCallback, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArrowLeftIcon, LineDividerIcon, MicrophoneIcon, StarRatingIcon } from '@/components/home/figma-icons';
import { PenEditIcon } from '@/components/service-selection/service-selection-icons';
import { useProviderCart } from '@/context/provider-cart-context';
import {
  formatProviderServiceSummaryParts,
  garmentAssignmentItemCount,
  hasProviderCartSelection,
  type ProviderGarmentCartSelection,
} from '@/lib/provider-cart-selection';
import { HomeIndicator, homeIndicatorScreenBottomStyle } from '@/components/home/HomeIndicator';
import { FigmaShadows, figmaDropShadow, figmaShadow } from '@/components/home/figma-shadows';
import { useSafeTopInset, useScreenScale } from '@/components/home/scale';
import { DocumentIcon, SaleIcon } from '@/components/provider-results/provider-results-icons';
import { ProviderSpecialistTag } from '@/components/provider/ProviderSpecialistTag';
import { SearchStatusBar } from '@/components/search/SearchStatusBar';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoFonts, SwashoRadii } from '@/constants/swasho-tokens';
import type {
  ProviderBulkService,
  ProviderListService,
  ProviderResult,
  ProviderServiceSection,
} from '@/data/providers';
import { webNativeVerticalScrollStyle } from '@/lib/web-native-scroll';

import {
  AddSquareIcon,
  BulkServiceIcon,
  TopPicksBadgeIcon,
  ChevronDownIcon,
  GridToggleIcon,
  ListDividerIcon,
  SectionDividerIcon,
  ListIcon,
  ListServiceIcon,
  PhoneIcon,
} from './provider-page-icons';
import { checkoutPlaceholderHref, oneTimeCheckoutHref } from '@/lib/checkout-flow';

import { ProviderCartBottomBar } from './ProviderCartBottomBar';

const STATUS_BAR_HEIGHT = 32;
const CONTENT_TOP_OFFSET = 87;
const SCROLL_BOTTOM_GAP = 120;
const SCROLL_BOTTOM_GAP_CART = 200;
const HOME_INDICATOR_HEIGHT = 24;
const HEADER_CONTENT_WIDTH = 371;
const BULK_SECTION_WIDTH = 388;
const LIST_SECTION_WIDTH = 388;
const LIST_HEADER_WIDTH = 372;

type ProviderPageScreenProps = {
  provider: ProviderResult;
  query: string;
  returnToCheckoutReview?: boolean;
  checkoutReviewIsSubscription?: boolean;
};

function OfferText({ provider, scale }: { provider: ProviderResult; scale: number }) {
  const { boldSegments, regularText } = provider.offerText;

  if (boldSegments.length === 3) {
    return (
      <Text style={[styles.offerText, { fontSize: 14 * scale, lineHeight: 20 * scale, letterSpacing: 0.5 * scale, flex: 1 }]}>
        <Text style={[styles.offerBold, searchFont('medium')]}>{boldSegments[0]}</Text>
        <Text style={searchFont('medium')}> </Text>
        <Text style={[styles.offerBold, searchFont('medium')]}>{boldSegments[1]}</Text>
        <Text style={{ fontFamily: SwashoFonts.poppinsRegular }}> and </Text>
        <Text style={[styles.offerBold, searchFont('medium')]}>{boldSegments[2]}</Text>
        <Text style={{ fontFamily: SwashoFonts.poppinsRegular }}>{regularText.replace(' and ', '')}</Text>
      </Text>
    );
  }

  return (
    <Text style={[styles.offerText, { fontSize: 14 * scale, lineHeight: 20 * scale, letterSpacing: 0.5 * scale, flex: 1 }]}>
      <Text style={[styles.offerBold, searchFont('medium')]}>{boldSegments[0]}</Text>
      <Text style={{ fontFamily: SwashoFonts.poppinsRegular }}> and </Text>
      <Text style={[styles.offerBold, searchFont('medium')]}>{boldSegments[1]}</Text>
      <Text style={{ fontFamily: SwashoFonts.poppinsRegular }}>{regularText.replace(' and ', '')}</Text>
    </Text>
  );
}

/** Figma 3346:8472 — Top Quality Tag horizontal gradient. */
const TOP_PICKS_GRADIENT_COLORS = ['#FFFFFF', SwashoColors.primary100, '#FFFFFF'] as const;
const TOP_PICKS_GRADIENT_LOCATIONS = [0.096687, 0.19834, 1] as const;

function TopPicksTag({ scale }: { scale: number }) {
  const tagStyle = [
    styles.topPicksTag,
    {
      paddingHorizontal: 4 * scale,
      paddingVertical: 1 * scale,
      minWidth: 75 * scale,
      gap: 4 * scale,
      borderRadius: SwashoRadii.sm * scale,
    },
  ];

  const content = (
    <>
      <TopPicksBadgeIcon width={19 * scale} height={21 * scale} />
      <Text
        numberOfLines={1}
        style={[
          styles.topPicksLabel,
          searchFont('semibold'),
          {
            fontSize: 10 * scale,
            lineHeight: 21 * scale,
            letterSpacing: 0.2717 * scale,
            flexShrink: 0,
          },
        ]}>
        Top Picks
      </Text>
    </>
  );

  return (
    <LinearGradient
      colors={[...TOP_PICKS_GRADIENT_COLORS]}
      locations={[...TOP_PICKS_GRADIENT_LOCATIONS]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={tagStyle}>
      {content}
    </LinearGradient>
  );
}

function AddButton({ scale, onPress }: { scale: number; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.addButton,
        {
          height: 32 * scale,
          width: 86 * scale,
          borderRadius: SwashoRadii.md * scale,
          paddingHorizontal: 16 * scale,
          paddingVertical: 8 * scale,
          gap: 6 * scale,
          ...figmaShadow(FigmaShadows.search, scale),
        },
      ]}>
      <Text
        style={[
          styles.addButtonLabel,
          searchFont('medium'),
          { fontSize: 14 * scale, lineHeight: 12 * scale, letterSpacing: 0.5 * scale },
        ]}>
        ADD
      </Text>
      <AddSquareIcon width={18 * scale} height={18 * scale} />
    </Pressable>
  );
}

function BulkWeightButton({
  label,
  scale,
  onPress,
}: {
  label: string;
  scale: number;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.bulkWeightButton,
        {
          height: 32 * scale,
          width: 86 * scale,
          borderRadius: SwashoRadii.md * scale,
          paddingHorizontal: 16 * scale,
          paddingVertical: 8 * scale,
          ...figmaShadow(FigmaShadows.search, scale),
        },
      ]}>
      <Text
        numberOfLines={1}
        style={[
          styles.bulkWeightLabel,
          searchFont('semibold'),
          { fontSize: 12 * scale, lineHeight: 20 * scale, letterSpacing: 0.5 * scale },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

function EditServiceButton({ scale, onPress }: { scale: number; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.editServiceButton,
        {
          height: 32 * scale,
          width: 86 * scale,
          borderRadius: SwashoRadii.md * scale,
          paddingHorizontal: 16 * scale,
          paddingVertical: 8 * scale,
          gap: 6 * scale,
          ...figmaShadow(FigmaShadows.search, scale),
        },
      ]}>
      <Text
        style={[
          styles.editServiceLabel,
          searchFont('semibold'),
          { fontSize: 12 * scale, lineHeight: 20 * scale, letterSpacing: 0.5 * scale },
        ]}>
        EDIT
      </Text>
      <PenEditIcon width={16 * scale} height={16 * scale} color={SwashoColors.surface} />
    </Pressable>
  );
}

function BulkServiceCard({
  service,
  scale,
  selection,
  onPress,
}: {
  service: ProviderBulkService;
  scale: number;
  selection?: ProviderGarmentCartSelection;
  onPress?: () => void;
}) {
  return (
    <View
      style={[
        styles.bulkCard,
        {
          borderRadius: 12 * scale,
          paddingHorizontal: 16 * scale,
          paddingVertical: 12 * scale,
          gap: 16 * scale,
        },
      ]}>
      <View style={[styles.bulkCardContent, { gap: 10 * scale, width: 100 * scale }]}>
        <View style={[styles.bulkIconBlock, { gap: 8 * scale, paddingVertical: 4 * scale }]}>
          <View style={[styles.bulkIconGroup, { gap: 12 * scale }]}>
            <View
              style={[
                styles.bulkIconWrap,
                {
                  width: 35 * scale,
                  height: 35 * scale,
                  borderRadius: 3.5 * scale,
                  borderWidth: 0.438 * scale,
                },
              ]}>
              <BulkServiceIcon
                icon={service.icon}
                width={28 * scale}
                height={20 * scale}
                frameSize={35 * scale}
              />
            </View>
            <Text
              style={[
                styles.bulkName,
                searchFont('semibold'),
                { fontSize: 14 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
              ]}>
              {service.name}
            </Text>
          </View>
          <Text
            style={[
              styles.bulkPrice,
              searchFont('medium'),
              { fontSize: 13 * scale, lineHeight: 20 * scale, letterSpacing: 0.5 * scale },
            ]}>
            {service.priceLabel}
          </Text>
        </View>
      </View>
      {selection?.bulkWeightLabel ? (
        <BulkWeightButton label={selection.bulkWeightLabel} scale={scale} onPress={onPress} />
      ) : (
        <AddButton scale={scale} onPress={onPress} />
      )}
    </View>
  );
}

function ServiceListRow({
  service,
  serviceName,
  listPrice,
  scale,
  onPress,
}: {
  service: ProviderListService;
  serviceName: string;
  listPrice: number;
  scale: number;
  onPress?: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.listRow,
        {
          width: LIST_SECTION_WIDTH * scale,
          paddingHorizontal: 12 * scale,
          paddingVertical: 12 * scale,
          gap: 16 * scale,
          borderRadius: SwashoRadii.lg * scale,
        },
      ]}>
      <View style={[styles.listRowContent, { gap: 8 * scale, paddingRight: 8 * scale }]}>
        <View style={[styles.listRowTitle, { gap: 8 * scale }]}>
          <View style={[styles.listIconWrap, { width: 35 * scale, height: 35 * scale, borderRadius: 3.5 * scale }]}>
            <ListServiceIcon icon={service.icon} width={26 * scale} height={25 * scale} />
          </View>
          <Text
            style={[
              styles.listName,
              searchFont('semibold'),
              { fontSize: 14 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale, flex: 1 },
            ]}>
            {service.name}
          </Text>
        </View>
        <Text
          style={[
            styles.listPrice,
            searchFont('medium'),
            { fontSize: 13 * scale, lineHeight: 20 * scale, letterSpacing: 0.5 * scale },
          ]}>
          {serviceName} at ₹{listPrice}
        </Text>
      </View>
      <AddButton scale={scale} onPress={onPress} />
    </Pressable>
  );
}

function SelectedServiceListRow({
  service,
  serviceName,
  listPrice,
  selection,
  scale,
  onEditPress,
}: {
  service: ProviderListService;
  serviceName: string;
  listPrice: number;
  selection: ProviderGarmentCartSelection;
  scale: number;
  onEditPress?: () => void;
}) {
  const garmentCount = garmentAssignmentItemCount(selection, service.id);
  const summaryParts = formatProviderServiceSummaryParts(selection);

  return (
    <View
      style={[
        styles.selectedListRow,
        {
          width: LIST_SECTION_WIDTH * scale,
          paddingHorizontal: 12 * scale,
          paddingVertical: 12 * scale,
          gap: 12 * scale,
        },
      ]}>
      <View style={[styles.selectedListMain, { gap: 12 * scale, flex: 1 }]}>
        <View style={[styles.selectedTitleRow, { gap: 8 * scale }]}>
          <View style={[styles.listIconWrap, { width: 35 * scale, height: 35 * scale, borderRadius: 3.5 * scale }]}>
            <ListServiceIcon icon={service.icon} width={26 * scale} height={25 * scale} />
          </View>
          <Text
            style={[
              styles.listName,
              searchFont('semibold'),
              { fontSize: 14 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
            ]}>
            {service.name}
            {garmentCount > 1 ? ` x ${garmentCount}` : ''}
          </Text>
        </View>
        {summaryParts.length > 0 ? (
          <View style={[styles.selectedSummaryLine, { gap: 6 * scale }]}>
            {summaryParts.map((part, index) => (
              <Fragment key={`${part}-${index}`}>
                {index > 0 ? (
                  <View style={[styles.summaryDivider, { height: 18 * scale }]}>
                    <LineDividerIcon width={18 * scale} height={1} />
                  </View>
                ) : null}
                <Text
                  numberOfLines={1}
                  style={[
                    styles.selectedSummaryText,
                    searchFont('medium'),
                    {
                      fontSize: 13 * scale,
                      lineHeight: 20 * scale,
                      letterSpacing: 0.5 * scale,
                      maxWidth: index === summaryParts.length - 1 ? 131 * scale : undefined,
                    },
                  ]}>
                  {part}
                </Text>
              </Fragment>
            ))}
          </View>
        ) : (
          <Text
            style={[
              styles.listPrice,
              searchFont('medium'),
              { fontSize: 13 * scale, lineHeight: 20 * scale, letterSpacing: 0.5 * scale },
            ]}>
            {serviceName} at ₹{listPrice}
          </Text>
        )}
      </View>
      <EditServiceButton scale={scale} onPress={onEditPress} />
    </View>
  );
}

function SectionDivider({ scale }: { scale: number }) {
  return (
    <View style={styles.sectionDividerWrap}>
      <SectionDividerIcon width={412 * scale} height={1} />
    </View>
  );
}

function OfferPagination({ scale }: { scale: number }) {
  return (
    <View style={[styles.paginationGroup, { gap: 4 * scale }]}>
      <View style={[styles.pagination, { width: 30 * scale, height: 4 * scale }]}>
        <View style={[styles.paginationTrack, { width: 30 * scale, height: 4 * scale, borderRadius: SwashoRadii.sm * scale }]} />
        <View
          style={[
            styles.paginationActive,
            {
              width: 15.472 * scale,
              height: 4 * scale,
              borderRadius: SwashoRadii.sm * scale,
            },
          ]}
        />
      </View>
      <View style={[styles.paginationDot, { width: 4 * scale, height: 4 * scale, borderRadius: SwashoRadii.sm * scale }]} />
      <View style={[styles.paginationDot, { width: 4 * scale, height: 4 * scale, borderRadius: SwashoRadii.sm * scale }]} />
    </View>
  );
}

const BULK_SERVICES_SECTION_ID = 'bulk-services';

function CollapsibleSectionHeader({
  title,
  expanded,
  onToggle,
  scale,
  width,
  paddingHorizontal,
  alignSelf,
}: {
  title: string;
  expanded: boolean;
  onToggle: () => void;
  scale: number;
  width: number;
  paddingHorizontal?: number;
  alignSelf?: 'auto' | 'center';
}) {
  return (
    <Pressable
      onPress={onToggle}
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      style={[
        styles.sectionHeader,
        {
          gap: 8 * scale,
          height: 24 * scale,
          width,
          paddingHorizontal: paddingHorizontal !== undefined ? paddingHorizontal * scale : undefined,
          alignSelf,
        },
      ]}>
      <Text
        style={[
          styles.sectionTitle,
          searchFont('medium'),
          { fontSize: 18 * scale, lineHeight: 16 * scale, letterSpacing: 0.5 * scale, flex: 1 },
        ]}>
        {title}
      </Text>
      <View style={{ transform: [{ rotate: expanded ? '0deg' : '-90deg' }] }}>
        <ChevronDownIcon width={24 * scale} height={24 * scale} />
      </View>
    </Pressable>
  );
}

function ServiceSection({
  section,
  serviceName,
  scale,
  expanded,
  onToggle,
  onServicePress,
  getGarmentSelection,
}: {
  section: ProviderServiceSection;
  serviceName: string;
  scale: number;
  expanded: boolean;
  onToggle: () => void;
  onServicePress: (serviceId: string) => void;
  getGarmentSelection: (serviceId: string) => ProviderGarmentCartSelection | undefined;
}) {
  return (
    <View style={[styles.serviceSection, { gap: 16 * scale, width: LIST_SECTION_WIDTH * scale }]}>
      <CollapsibleSectionHeader
        title={section.title}
        expanded={expanded}
        onToggle={onToggle}
        scale={scale}
        width={LIST_HEADER_WIDTH * scale}
        alignSelf="center"
      />
      {expanded
        ? section.items.map((item, index) => {
            const listPrice = getProviderListServicePrice(item, serviceName);
            return (
        <View key={item.id}>
          {hasProviderCartSelection(getGarmentSelection(item.id), item.id) ? (
            <SelectedServiceListRow
              service={item}
              serviceName={serviceName}
              listPrice={listPrice}
              selection={getGarmentSelection(item.id)!}
              scale={scale}
              onEditPress={() => onServicePress(item.id)}
            />
          ) : (
            <ServiceListRow
              service={item}
              serviceName={serviceName}
              listPrice={listPrice}
              scale={scale}
              onPress={() => onServicePress(item.id)}
            />
          )}
          {index < section.items.length - 1 ? (
            <ListDividerIcon width={362 * scale} height={1} style={{ alignSelf: 'center' }} />
          ) : null}
        </View>
            );
          })
        : null}
    </View>
  );
}

export function ProviderPageScreen({
  provider,
  query,
  returnToCheckoutReview = false,
  checkoutReviewIsSubscription = false,
}: ProviderPageScreenProps) {
  const router = useRouter();
  const { getSelection, getProviderCartTotals, setFulfillmentMode } = useProviderCart();
  const { scale, contentWidth } = useScreenScale();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const displayQuery = query.trim() || provider.serviceName;

  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace({ pathname: '/provider-results', params: { q: displayQuery } });
  }, [displayQuery, router]);

  const handleServicePress = useCallback(
    (serviceId: string) => {
      router.push({
        pathname: '/service-selection/[serviceId]' as const,
        params: { serviceId, providerId: provider.id, q: displayQuery },
      } as never);
    },
    [displayQuery, provider.id, router],
  );

  const bulkServices = provider.bulkServices ?? [];
  const serviceSections = provider.serviceSections ?? [];

  const [sectionExpanded, setSectionExpanded] = useState<Record<string, boolean>>({});
  const [showCompactProviderName, setShowCompactProviderName] = useState(false);
  const providerNameRef = useRef<View>(null);
  const backHeaderRef = useRef<View>(null);
  const scrollRef = useRef<ScrollView>(null);

  const cartTotals = useMemo(() => getProviderCartTotals(provider.id), [getProviderCartTotals, provider.id]);
  const showCartBar = cartTotals.itemCount > 0;

  const getGarmentSelection = useCallback(
    (serviceId: string) => getSelection(provider.id, serviceId),
    [getSelection, provider.id],
  );

  const scrollToCartSummary = useCallback(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, []);

  const cartProceedLockRef = useRef(false);
  const handleCartProceed = useCallback(() => {
    if (cartProceedLockRef.current || cartTotals.itemCount <= 0) {
      return;
    }
    cartProceedLockRef.current = true;
    if (returnToCheckoutReview) {
      router.push(
        checkoutPlaceholderHref(provider.id, displayQuery, {
          subscription: checkoutReviewIsSubscription,
          scheduleConfirmed: true,
        }),
      );
    } else {
      setFulfillmentMode(provider.id, 'one-time');
      router.push(oneTimeCheckoutHref(provider.id, displayQuery));
    }
    setTimeout(() => {
      cartProceedLockRef.current = false;
    }, 600);
  }, [
    cartTotals.itemCount,
    checkoutReviewIsSubscription,
    displayQuery,
    provider.id,
    returnToCheckoutReview,
    router,
    setFulfillmentMode,
  ]);

  const updateCompactProviderName = useCallback(() => {
    const nameEl = providerNameRef.current;
    const headerEl = backHeaderRef.current;
    if (!nameEl || !headerEl) {
      return;
    }
    nameEl.measureInWindow((_nameX, nameTop, _nameWidth, nameHeight) => {
      headerEl.measureInWindow((_headerX, headerTop, _headerWidth, headerHeight) => {
        const headerBottom = headerTop + headerHeight;
        const nameBottom = nameTop + nameHeight;
        setShowCompactProviderName(nameBottom <= headerBottom);
      });
    });
  }, []);

  const isSectionExpanded = useCallback(
    (sectionId: string) => sectionExpanded[sectionId] ?? true,
    [sectionExpanded],
  );

  const toggleSection = useCallback((sectionId: string) => {
    setSectionExpanded((prev) => ({
      ...prev,
      [sectionId]: !(prev[sectionId] ?? true),
    }));
  }, []);

  return (
    <View style={styles.root}>
      <View style={[styles.frame, { width: contentWidth, marginTop: safeTop }]}>
        <View style={[styles.statusBar, { height: STATUS_BAR_HEIGHT * scale }]}>
          <SearchStatusBar scale={scale} />
        </View>

        <View
          ref={backHeaderRef}
          onLayout={updateCompactProviderName}
          style={[
            styles.backHeader,
            showCompactProviderName
              ? figmaDropShadow(FigmaShadows.providerStickyNav, scale)
              : null,
            {
              width: contentWidth,
              paddingTop: 64 * scale,
              paddingHorizontal: 20 * scale,
              gap: 12 * scale,
            },
          ]}>
          <Pressable
            onPress={handleBackPress}
            hitSlop={8}
            style={[styles.stickyNavBackHit, { width: 20 * scale, height: 20 * scale }]}>
            <ArrowLeftIcon width={20 * scale} height={20 * scale} />
          </Pressable>
          {showCompactProviderName ? (
            <Text
              numberOfLines={1}
              style={[
                styles.stickyNavTitle,
                searchFont('medium'),
                {
                  fontSize: 16 * scale,
                  lineHeight: 16 * scale,
                  letterSpacing: 0.5 * scale,
                  flex: 1,
                },
              ]}>
              {provider.category}
            </Text>
          ) : null}
        </View>

        <ScrollView
          ref={scrollRef}
          style={[styles.scroll, Platform.OS === 'web' ? styles.scrollWeb : null]}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: CONTENT_TOP_OFFSET * scale,
              paddingBottom:
                ((showCartBar ? SCROLL_BOTTOM_GAP_CART : SCROLL_BOTTOM_GAP) + HOME_INDICATOR_HEIGHT) * scale,
            },
          ]}
          onScroll={updateCompactProviderName}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}>
          <View style={[styles.headerCardWrap, { gap: 20 * scale }]}>
            <View
              style={[
                styles.headerCardShadow,
                {
                  borderBottomLeftRadius: SwashoRadii.xl * scale,
                  borderBottomRightRadius: SwashoRadii.xl * scale,
                  ...figmaDropShadow(FigmaShadows.providerPageHeader, scale),
                },
              ]}>
              <LinearGradient
                colors={['#ffffff', 'rgba(255,255,255,0)']}
                locations={[0.7024, 0.9749]}
                style={styles.headerGradient}>
                <View
                  style={[
                    styles.headerCard,
                    {
                      paddingHorizontal: 20.5 * scale,
                      paddingVertical: 16 * scale,
                      gap: 12 * scale,
                      borderBottomLeftRadius: SwashoRadii.xl * scale,
                      borderBottomRightRadius: SwashoRadii.xl * scale,
                    },
                  ]}>
                  <View style={[styles.badgeRow, { gap: 12 * scale }]}>
                    {provider.topPicks ? <TopPicksTag scale={scale} /> : null}
                    {provider.specialistTag ? (
                      <ProviderSpecialistTag tag={provider.specialistTag} scale={scale} layout="inline" />
                    ) : null}
                  </View>

                  <View style={[styles.nameDetailsCol, { gap: 8 * scale, width: HEADER_CONTENT_WIDTH * scale }]}>
                  <View style={[styles.nameRow, { width: HEADER_CONTENT_WIDTH * scale }]}>
                    <View style={[styles.nameLeft, { gap: 16 * scale, width: 176 * scale }]}>
                      <View ref={providerNameRef} onLayout={updateCompactProviderName} collapsable={false}>
                        <Text
                          style={[
                            styles.providerName,
                            searchFont('semibold'),
                            { fontSize: 20 * scale, lineHeight: 18 * scale },
                          ]}>
                          {provider.category}
                        </Text>
                      </View>
                      <View
                        style={[
                          styles.phoneButton,
                          {
                            width: 30 * scale,
                            height: 30 * scale,
                            borderRadius: 9999,
                          },
                        ]}>
                        <PhoneIcon width={20 * scale} height={20 * scale} />
                      </View>
                    </View>
                    <View
                      style={[
                        styles.rating,
                        {
                          paddingHorizontal: 4.844 * scale,
                          paddingVertical: 4 * scale,
                          borderRadius: SwashoRadii.md * scale,
                          gap: 2.398 * scale,
                        },
                      ]}>
                      <StarRatingIcon width={15.537 * scale} height={15.537 * scale} />
                      <Text
                        style={[
                          styles.ratingText,
                          searchFont('semibold'),
                          {
                            fontSize: 14.531 * scale,
                            lineHeight: 11.509 * scale,
                            letterSpacing: 0.4795 * scale,
                          },
                        ]}>
                        {provider.rating.toFixed(1)}
                      </Text>
                    </View>
                  </View>

                  <View style={[styles.rateCardRow, { gap: 6 * scale, height: 18 * scale }]}>
                    <DocumentIcon width={20 * scale} height={20 * scale} />
                    <Text
                      style={[
                        styles.rateCardLabel,
                        searchFont('medium'),
                        { fontSize: 12 * scale, lineHeight: 10 * scale, letterSpacing: 0.5 * scale },
                      ]}>
                      Rate Card
                    </Text>
                  </View>
                  </View>

                  {provider.trustedCustomerCount ? (
                    <Text
                      style={[
                        styles.trustedText,
                        {
                          fontSize: 13 * scale,
                          lineHeight: 12 * scale,
                          letterSpacing: 0.5 * scale,
                          width: HEADER_CONTENT_WIDTH * scale,
                        },
                      ]}>
                      <Text style={{ fontFamily: SwashoFonts.poppinsRegular, color: SwashoColors.darkHeaderText }}>
                        Trusted by {provider.trustedCustomerCount}+ customers
                      </Text>
                    </Text>
                  ) : null}

                  <View style={[styles.offerDivider, { width: HEADER_CONTENT_WIDTH * scale }]} />

                  <View style={[styles.offerRow, { gap: 6 * scale, paddingHorizontal: 16 * scale }]}>
                    <View style={[styles.offerContent, { gap: 8 * scale, flex: 1 }]}>
                      <View style={{ paddingVertical: 2.4 * scale }}>
                        <SaleIcon width={24 * scale} height={24 * scale} />
                      </View>
                      <OfferText provider={provider} scale={scale} />
                    </View>
                    <OfferPagination scale={scale} />
                  </View>
                </View>
              </LinearGradient>
            </View>

            <View
              style={[
                styles.servicesPanel,
                {
                  paddingTop: 20 * scale,
                  paddingBottom: 25 * scale,
                  gap: 20 * scale,
                },
              ]}>
              <View style={[styles.serviceBar, { gap: 13 * scale, width: 372 * scale }]}>
                <View
                  style={[
                    styles.searchField,
                    {
                      width: 264 * scale,
                      height: 40 * scale,
                      borderRadius: SwashoRadii.md * scale,
                      paddingHorizontal: 12 * scale,
                      gap: 12 * scale,
                    },
                  ]}>
                  <Text
                    style={[
                      styles.searchQuery,
                      searchFont('medium'),
                      { fontSize: 14 * scale, lineHeight: 12 * scale, letterSpacing: 0.5 * scale, flex: 1 },
                    ]}>
                    {displayQuery}
                  </Text>
                  <View style={{ width: 0, height: 28 * scale, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ transform: [{ rotate: '90deg' }] }}>
                      <LineDividerIcon width={28 * scale} height={1} />
                    </View>
                  </View>
                  <MicrophoneIcon width={20 * scale} height={20 * scale} />
                </View>
                <View
                  style={[
                    styles.gridToggleRow,
                    { gap: 8 * scale },
                  ]}>
                  <GridToggleIcon width={43 * scale} height={23 * scale} />
                  <Text
                    numberOfLines={1}
                    selectable={false}
                    style={[
                      styles.gridToggleLabel,
                      searchFont('medium'),
                      {
                        fontSize: 12 * scale,
                        lineHeight: 14 * scale,
                        letterSpacing: 0.5 * scale,
                        flexShrink: 0,
                      },
                    ]}>
                    Grid View
                  </Text>
                </View>
              </View>

              <SectionDivider scale={scale} />

              {bulkServices.length > 0 ? (
                <View style={[styles.bulkSection, { gap: 16 * scale, width: BULK_SECTION_WIDTH * scale }]}>
                  <CollapsibleSectionHeader
                    title="Bulk Services"
                    expanded={isSectionExpanded(BULK_SERVICES_SECTION_ID)}
                    onToggle={() => toggleSection(BULK_SERVICES_SECTION_ID)}
                    scale={scale}
                    width={BULK_SECTION_WIDTH * scale}
                    paddingHorizontal={8}
                  />
                  {isSectionExpanded(BULK_SERVICES_SECTION_ID) ? (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      nestedScrollEnabled
                      style={[
                        styles.bulkScroll,
                        { width: BULK_SECTION_WIDTH * scale },
                        Platform.OS === 'web' ? styles.bulkScrollWeb : null,
                      ]}
                      contentContainerStyle={[
                        styles.bulkRow,
                        { gap: 20 * scale, paddingHorizontal: 12 * scale },
                      ]}>
                      {bulkServices.map((service) => (
                        <BulkServiceCard
                          key={service.id}
                          service={service}
                          selection={getGarmentSelection(service.id)}
                          scale={scale}
                          onPress={() => handleServicePress(service.id)}
                        />
                      ))}
                    </ScrollView>
                  ) : null}
                </View>
              ) : null}

              {bulkServices.length > 0 ? <SectionDivider scale={scale} /> : null}

              {serviceSections.map((section, index) => (
                <Fragment key={section.id}>
                  <View style={{ alignItems: 'center', width: '100%' }}>
                    <ServiceSection
                      section={section}
                      serviceName={displayQuery}
                      scale={scale}
                      expanded={isSectionExpanded(section.id)}
                      onToggle={() => toggleSection(section.id)}
                      onServicePress={handleServicePress}
                      getGarmentSelection={getGarmentSelection}
                    />
                  </View>
                  {index < serviceSections.length - 1 ? <SectionDivider scale={scale} /> : null}
                </Fragment>
              ))}
            </View>
          </View>
        </ScrollView>

        <Pressable
          onPress={scrollToCartSummary}
          style={[
            styles.itemsFab,
            {
              left: (contentWidth * 0.875 - 25.5) * scale,
              bottom: showCartBar ? 168 * scale : 120,
              borderRadius: SwashoRadii.lg * scale,
              paddingHorizontal: 12 * scale,
              paddingVertical: 8 * scale,
              gap: 4 * scale,
              ...figmaShadow(FigmaShadows.providerCard, scale),
            },
          ]}>
          <ListIcon width={24 * scale} height={24 * scale} />
          <Text
            style={[
              styles.itemsFabLabel,
              searchFont('medium'),
              { fontSize: 12 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
            ]}>
            Items
          </Text>
        </Pressable>

        {showCartBar ? (
          <View
            style={{
              bottom: HOME_INDICATOR_HEIGHT * scale,
              position: 'absolute',
              left: 0,
              right: 0,
              zIndex: 30,
            }}>
            <ProviderCartBottomBar
              itemCount={cartTotals.itemCount}
              scale={scale}
              contentWidth={contentWidth}
              proceedLabel={returnToCheckoutReview ? 'Checkout' : 'Continue'}
              onProceed={handleCartProceed}
              onItemCountPress={scrollToCartSummary}
            />
          </View>
        ) : null}

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
    backgroundColor: '#f0f0f0',
  },
  frame: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    overflow: 'hidden',
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 30,
  },
  backHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: SwashoColors.surface,
    paddingBottom: 4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  stickyNavBackHit: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stickyNavTitle: {
    color: SwashoColors.neutral800,
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollWeb: webNativeVerticalScrollStyle,
  scrollContent: {
    alignItems: 'center',
  },
  headerCardWrap: {
    width: '100%',
    alignItems: 'center',
  },
  headerCardShadow: {
    width: '100%',
    overflow: 'hidden',
  },
  headerGradient: {
    width: '100%',
  },
  headerCard: {
    backgroundColor: SwashoColors.surface,
    width: '100%',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  topPicksTag: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    overflow: 'hidden',
  },
  topPicksLabel: {
    color: '#6940e0',
    textAlign: 'left',
  },
  nameDetailsCol: {
    alignItems: 'flex-start',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nameLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  providerName: {
    color: SwashoColors.darkHeaderText,
  },
  phoneButton: {
    borderWidth: 1,
    borderColor: SwashoColors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rating: {
    backgroundColor: '#86efad',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    color: '#292929',
    textAlign: 'center',
  },
  rateCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rateCardLabel: {
    color: SwashoColors.primary,
    textAlign: 'center',
  },
  trustedText: {
    width: '100%',
  },
  offerDivider: {
    height: 1,
    backgroundColor: SwashoColors.neutral200,
  },
  offerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    width: '100%',
  },
  offerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerText: {
    color: '#000000',
  },
  offerBold: {
    color: '#000000',
  },
  paginationGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pagination: {
    position: 'relative',
    justifyContent: 'center',
  },
  paginationTrack: {
    backgroundColor: SwashoColors.neutral200,
  },
  paginationActive: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: SwashoColors.primary,
  },
  paginationDot: {
    backgroundColor: SwashoColors.neutral200,
  },
  servicesPanel: {
    backgroundColor: SwashoColors.surface,
    width: '100%',
    alignItems: 'center',
  },
  serviceBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchField: {
    backgroundColor: SwashoColors.neutral50,
    borderWidth: 1,
    borderColor: SwashoColors.neutral200,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchQuery: {
    color: '#292929',
  },
  gridToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
    marginLeft: 'auto',
  },
  gridToggleLabel: {
    color: SwashoColors.darkText,
  },
  sectionDividerWrap: {
    width: '100%',
    alignItems: 'center',
  },
  bulkSection: {
    alignItems: 'flex-start',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  sectionTitle: {
    color: '#464646',
  },
  bulkScroll: {
    flexGrow: 0,
  },
  bulkScrollWeb: {
    overflowX: 'auto',
    overflowY: 'visible',
  },
  bulkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  bulkCard: {
    borderWidth: 1,
    borderColor: SwashoColors.neutral200,
    backgroundColor: SwashoColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  bulkCardContent: {
    alignItems: 'flex-start',
  },
  bulkIconBlock: {
    alignItems: 'flex-start',
    width: '100%',
  },
  bulkIconGroup: {
    alignItems: 'flex-start',
  },
  bulkIconWrap: {
    borderColor: '#dbdbdb',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bulkName: {
    color: SwashoColors.darkHeaderText,
  },
  bulkPrice: {
    color: '#464646',
  },
  addButton: {
    backgroundColor: SwashoColors.surface,
    borderWidth: 0.5,
    borderColor: SwashoColors.primary300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonLabel: {
    color: SwashoColors.primary,
    textAlign: 'center',
  },
  serviceSection: {
    alignItems: 'center',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listRowContent: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  listRowTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  listIconWrap: {
    borderWidth: 0.438,
    borderColor: '#dbdbdb',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  listName: {
    color: SwashoColors.darkHeaderText,
  },
  listPrice: {
    color: '#464646',
  },
  bulkWeightButton: {
    backgroundColor: SwashoColors.primary,
    borderWidth: 0.5,
    borderColor: SwashoColors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulkWeightLabel: {
    color: SwashoColors.surface,
    textAlign: 'center',
  },
  editServiceButton: {
    backgroundColor: SwashoColors.primary,
    borderWidth: 0.5,
    borderColor: SwashoColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editServiceLabel: {
    color: SwashoColors.surface,
    textAlign: 'center',
  },
  selectedListRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  selectedListMain: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  selectedTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  selectedSummaryLine: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    maxWidth: '100%',
  },
  summaryDivider: {
    justifyContent: 'center',
    transform: [{ rotate: '90deg' }],
  },
  selectedSummaryText: {
    color: SwashoColors.neutral600,
  },
  itemsFab: {
    position: 'absolute',
    zIndex: 15,
    backgroundColor: '#f2f2f2',
    borderWidth: 0.5,
    borderColor: SwashoColors.neutral300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemsFabLabel: {
    color: '#292929',
    textAlign: 'center',
  },
  homeIndicatorWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
});
