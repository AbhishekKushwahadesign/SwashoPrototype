import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SubtractIcon } from './figma-icons';

import { ScreenHeight, SwashoColors, SwashoRadii, SwashoSpacing } from '@/constants/swasho-tokens';

import { AddressHeader } from './AddressHeader';
import { BulkLaundryCard } from './BulkLaundryCard';
import { HomeIndicator } from './HomeIndicator';
import { NavBar, NavBarVariant } from './NavBar';
import { OrderCard } from './OrderCard';
import { PromiseSection } from './PromiseSection';
import { RecommendationCard } from './RecommendationCard';
import { SearchField } from './SearchField';
import { SectionTitle } from './SectionTitle';
import { ServiceTile, ServiceTileLayout } from './ServiceTile';
import { StatusBar } from './StatusBar';
import { FigmaShadows, figmaShadow } from './figma-shadows';
import { useSafeTopInset, useScreenScale } from './scale';

const SERVICES: ServiceTileLayout[] = [
  {
    label: 'Ironing Only',
    image: require('@/assets/images/home/ironing.png'),
    imageWidth: 70.618,
    imageHeight: 50.442,
    contentGap: 9,
    labelWidth: 52.136,
    contentCenterOffsetY: 8.88,
    contentFit: 'fill',
    contentPosition: 'bottom',
  },
  {
    label: ' Wash & Fold',
    image: require('@/assets/images/home/wash-fold.png'),
    imageWidth: 70.878,
    imageHeight: 55.319,
    contentGap: 13,
    labelWidth: 59.584,
    contentTop: -14.95,
    contentFit: 'fill',
    contentPosition: 'bottom',
  },
  {
    label: 'Wash & Iron',
    image: require('@/assets/images/home/wash-iron.png'),
    imageWidth: 67.032,
    imageHeight: 55.86,
    contentGap: 10,
    labelWidth: 57.722,
    contentTop: -12.83,
    contentFit: 'fill',
    contentPosition: 'bottom',
  },
  {
    label: 'Dry Cleaning',
    image: require('@/assets/images/home/dry-cleaning.png'),
    imageWidth: 71.442,
    imageHeight: 62.123,
    contentGap: 6,
    labelWidth: 51.94,
    contentTop: -14.99,
    contentFit: 'fill',
    contentPosition: 'bottom',
  },
  {
    label: ' Stain Removal',
    image: require('@/assets/images/home/stain-removal.png'),
    imageWidth: 66.988,
    imageHeight: 63.378,
    contentGap: 8,
    labelWidth: 57.722,
    contentTop: -17.69,
    contentFit: 'fill',
    contentPosition: 'bottom',
  },
  {
    label: ' Specialty Cleaning',
    image: require('@/assets/images/home/specialty-cleaning.png'),
    imageWidth: 52.038,
    imageHeight: 64.338,
    contentGap: 7,
    labelWidth: 63.308,
    contentTop: -17.62,
    contentFit: 'fill',
    contentPosition: 'bottom',
  },
];

const HEADER_REGION_TOP = 55;
const HEADER_GRADIENT_OFFSET = -25;
const HEADER_GRADIENT_HEIGHT = 312;
const SEARCH_BAR_TOP = 70.5;
const PROMISE_SECTION_TOP = 131.5;
const SEARCH_FIELD_HEIGHT = 45;
const SEARCH_BAR_BOTTOM_GAP = SwashoSpacing.lg;
const STATUS_BAR_HEIGHT = 32;

const SEARCH_ABSOLUTE_TOP = HEADER_REGION_TOP + HEADER_GRADIENT_OFFSET + SEARCH_BAR_TOP;
const SEARCH_STICKY_TOP = STATUS_BAR_HEIGHT + SEARCH_BAR_BOTTOM_GAP;
const SHEET_STICKY_TOP = SEARCH_STICKY_TOP + SEARCH_FIELD_HEIGHT + SEARCH_BAR_BOTTOM_GAP;
const SHEET_REGION_TOP = 155.58;
const SEARCH_COLLAPSE_DISTANCE = SEARCH_ABSOLUTE_TOP - SEARCH_STICKY_TOP;
const SHEET_COLLAPSE_DISTANCE = SHEET_REGION_TOP - SHEET_STICKY_TOP;
const HEADER_COLLAPSE_SCROLL = Math.max(SEARCH_COLLAPSE_DISTANCE, SHEET_COLLAPSE_DISTANCE);

const SHEET_STICKY_PADDING = SwashoSpacing.sheetTop;
const SUBTRACT_TOP = 98.42;
const SUBTRACT_HEIGHT = 905.187;

const NAV_HEIGHT = 101;
const HOME_INDICATOR_HEIGHT = 24;

export function HomeScreen() {
  const { scale, contentWidth, contentHeight } = useScreenScale();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const [navVariant, setNavVariant] = useState<NavBarVariant>('Home');
  const [collapseScrollY, setCollapseScrollY] = useState(0);
  const collapseScrollYRef = useRef(0);
  const sheetScrollRef = useRef<ScrollView>(null);
  const sheetScrollOffsetRef = useRef(0);
  const collapseScrollRef = useRef<ScrollView>(null);

  const frameHeight = contentHeight + safeTop;
  const bottomChromeHeight = (NAV_HEIGHT + HOME_INDICATOR_HEIGHT) * scale;
  const collapseViewportHeight = SHEET_REGION_TOP * scale;
  const maxCollapseScroll = HEADER_COLLAPSE_SCROLL * scale;
  const collapseScrollContentHeight = collapseViewportHeight + maxCollapseScroll;

  const collapsedProgress = Math.min(collapseScrollY / scale, HEADER_COLLAPSE_SCROLL);
  const isFullyCollapsed = collapsedProgress >= HEADER_COLLAPSE_SCROLL;
  const sheetTop = Math.max(SHEET_STICKY_TOP, SHEET_REGION_TOP - collapsedProgress) * scale;
  const sheetHeight = frameHeight - sheetTop - bottomChromeHeight;
  const headerTranslateY = -collapsedProgress * scale;
  const searchTop = Math.max(SEARCH_STICKY_TOP, SEARCH_ABSOLUTE_TOP - collapsedProgress) * scale;
  const sheetCoverHeight =
    Math.min(collapsedProgress / SHEET_COLLAPSE_DISTANCE, 1) * SUBTRACT_TOP * scale;

  const setCollapsedOffset = (nextY: number) => {
    const clamped = Math.max(0, Math.min(nextY, maxCollapseScroll));
    collapseScrollYRef.current = clamped;
    setCollapseScrollY(clamped);
    collapseScrollRef.current?.scrollTo({ y: clamped, animated: false });
    return clamped;
  };

  const absorbCollapseDelta = (deltaY: number) => {
    if (deltaY === 0) {
      return 0;
    }

    const current = collapseScrollYRef.current;
    const clamped = Math.max(0, Math.min(current + deltaY, maxCollapseScroll));
    const consumed = clamped - current;
    if (consumed !== 0) {
      collapseScrollYRef.current = clamped;
      setCollapseScrollY(clamped);
      collapseScrollRef.current?.scrollTo({ y: clamped, animated: false });
    }
    return consumed;
  };

  const handleCollapseScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    setCollapsedOffset(y);
  };

  const handleSheetScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const deltaY = y - sheetScrollOffsetRef.current;
    sheetScrollOffsetRef.current = y;

    if (!isFullyCollapsed && deltaY !== 0) {
      const consumed = absorbCollapseDelta(deltaY);
      if (consumed !== 0) {
        const nextSheetOffset = Math.max(0, y - consumed);
        sheetScrollOffsetRef.current = nextSheetOffset;
        sheetScrollRef.current?.scrollTo({ y: nextSheetOffset, animated: false });
      }
      return;
    }

    if (deltaY < 0 && y <= 0 && collapseScrollYRef.current > 0) {
      absorbCollapseDelta(deltaY);
      sheetScrollOffsetRef.current = 0;
      sheetScrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  };

  const handleCollapseWheel = (event: { deltaY: number }) => {
    if (Platform.OS !== 'web') {
      return;
    }

    if (event.deltaY < 0 && collapseScrollYRef.current > 0) {
      absorbCollapseDelta(event.deltaY);
    } else if (event.deltaY > 0 && collapseScrollYRef.current < maxCollapseScroll) {
      absorbCollapseDelta(event.deltaY);
    }
  };

  const handleSheetWheel = (event: { deltaY: number }) => {
    if (Platform.OS !== 'web') {
      return;
    }

    if (sheetScrollOffsetRef.current > 0) {
      return;
    }

    if (event.deltaY < 0 && collapseScrollYRef.current > 0) {
      absorbCollapseDelta(event.deltaY);
    } else if (event.deltaY > 0 && !isFullyCollapsed) {
      absorbCollapseDelta(event.deltaY);
    }
  };

  const sheetSections = (
    <>
      <View
        style={[
          styles.sheetBackground,
          {
            top: SUBTRACT_TOP * scale,
            height: SUBTRACT_HEIGHT * scale,
          },
        ]}>
        <SubtractIcon width={contentWidth} height={SUBTRACT_HEIGHT * scale} />
      </View>

      <View style={[styles.section, { width: 373 * scale, gap: 12 * scale }]}>
        <SectionTitle title="Personalized Recommendation" scale={scale} />
        <RecommendationCard scale={scale} onViewPlanPress={() => undefined} />
      </View>

      <View style={[styles.section, { width: 373 * scale, gap: 12 * scale }]}>
        <SectionTitle title="Search by Service" scale={scale} />
        <View style={[styles.serviceGrid, { width: 373 * scale, gap: 12 * scale, rowGap: 28 * scale }]}>
          {SERVICES.map((service) => (
            <ServiceTile key={service.label} {...service} scale={scale} />
          ))}
          <BulkLaundryCard scale={scale} />
        </View>
      </View>

      <View style={[styles.section, { width: 372 * scale, gap: 12 * scale }]}>
        <SectionTitle title="Your Orders" actionLabel="All" onActionPress={() => undefined} scale={scale} />
        <OrderCard scale={scale} onTrackPress={() => undefined} />
      </View>
    </>
  );

  return (
    <View style={[styles.root, { backgroundColor: SwashoColors.surface }]}>
      <View
        style={[
          styles.frame,
          {
            width: contentWidth,
            height: frameHeight,
            marginTop: safeTop,
            ...figmaShadow(FigmaShadows.screen, scale),
          },
        ]}>
        <View style={[styles.statusBar, { height: STATUS_BAR_HEIGHT * scale }]}>
          <StatusBar scale={scale} />
        </View>

        {/* Collapse scroll — header zone only; sheet scroll drives collapse over the promise area */}
        <ScrollView
          ref={collapseScrollRef}
          pointerEvents={isFullyCollapsed ? 'none' : 'box-none'}
          style={[styles.collapseScroll, { height: sheetTop }]}
          contentContainerStyle={{ height: collapseScrollContentHeight }}
          showsVerticalScrollIndicator={false}
          onScroll={handleCollapseScroll}
          scrollEventThrottle={16}
          bounces={collapseScrollY > 0}
          overScrollMode="always"
          nestedScrollEnabled
          {...(Platform.OS === 'web' ? { onWheel: handleCollapseWheel } : {})} />

        {/* Header gradient — address + promise scroll up with collapse */}
        <View
          pointerEvents="none"
          style={[
            styles.headerLayer,
            {
              top: HEADER_REGION_TOP * scale,
              transform: [{ translateY: headerTranslateY }],
              zIndex: 2,
            },
          ]}>
          <LinearGradient
            colors={[SwashoColors.primary500, SwashoColors.primary100]}
            locations={[0.003, 1]}
            style={[
              styles.headerGradient,
              {
                marginTop: HEADER_GRADIENT_OFFSET * scale,
                height: HEADER_GRADIENT_HEIGHT * scale,
                borderBottomLeftRadius: SwashoRadii.header * scale,
                borderBottomRightRadius: SwashoRadii.header * scale,
              },
            ]}>
            <View style={[styles.headerContent, { height: HEADER_GRADIENT_HEIGHT * scale }]}>
              <View style={[styles.headerAddress, { top: 5.5 * scale }]}>
                <AddressHeader scale={scale} />
              </View>
              <View style={[styles.headerPromise, { top: PROMISE_SECTION_TOP * scale }]}>
                <PromiseSection scale={scale} onLearnMorePress={() => undefined} />
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Sticky search — pins below status bar with 12px gap */}
        <View
          pointerEvents="box-none"
          style={[
            styles.searchLayer,
            {
              top: searchTop,
              zIndex: 6,
            },
          ]}>
          <SearchField scale={scale} />
        </View>

        {/* White sheet — slides up to 12px below sticky search, covering promise on collapse */}
        <View
          pointerEvents="box-none"
          style={[
            styles.sheetContainer,
            {
              top: sheetTop,
              height: sheetHeight,
              zIndex: 4,
            },
          ]}
          {...(Platform.OS === 'web' ? { onWheel: handleSheetWheel } : {})}>
          {sheetCoverHeight > 0 ? (
            <View
              pointerEvents="none"
              style={[styles.sheetCollapseFill, { height: sheetCoverHeight }]}
            />
          ) : null}
          <ScrollView
            ref={sheetScrollRef}
            style={styles.sheetScroll}
            contentContainerStyle={[
              styles.sheetScrollContent,
              {
                paddingTop: SHEET_STICKY_PADDING * scale,
                paddingHorizontal: SwashoSpacing.xxl * scale,
                paddingBottom: 16 * scale,
                gap: SwashoSpacing.section * scale,
              },
            ]}
            showsVerticalScrollIndicator={false}
            onScroll={handleSheetScroll}
            scrollEventThrottle={16}
            nestedScrollEnabled
            bounces
            overScrollMode="always">
            {sheetSections}
          </ScrollView>
        </View>

        <View style={[styles.navBarWrap, { height: bottomChromeHeight }]}>
          <NavBar
            variant={navVariant}
            scale={scale}
            onSubscriptionPress={() => setNavVariant('Orders')}
          />
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
    backgroundColor: SwashoColors.surface,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        maxHeight: ScreenHeight,
        overflow: 'visible',
      },
    }),
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  collapseScroll: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 5,
    backgroundColor: 'transparent',
  },
  headerLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
  },
  headerGradient: {
    overflow: 'hidden',
  },
  headerContent: {
    position: 'relative',
    width: '100%',
  },
  headerAddress: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  headerPromise: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  searchLayer: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  sheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  sheetCollapseFill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: SwashoColors.surface,
    zIndex: 0,
  },
  sheetScroll: {
    flex: 1,
    width: '100%',
  },
  sheetScrollContent: {
    width: '100%',
  },
  sheetBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 0,
  },
  section: {
    alignSelf: 'center',
    zIndex: 1,
  },
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  navBarWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 8,
  },
});
