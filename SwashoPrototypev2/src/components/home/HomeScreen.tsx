import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
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

const HEADER_REGION_TOP = 54.5835;
const HEADER_GRADIENT_OFFSET = -25;
const HEADER_GRADIENT_HEIGHT = 271;
const SEARCH_BAR_TOP = 70.5;
const PROMISE_SECTION_TOP = 131.5;
const SEARCH_FIELD_HEIGHT = 45;
const SEARCH_BAR_BOTTOM_GAP = SwashoSpacing.lg;
const STATUS_BAR_HEIGHT = 32;
/** Minimum gap between search field bottom and promise section top while collapsing. */
const PROMISE_SEARCH_MIN_GAP = 32;

const SEARCH_ABSOLUTE_TOP = HEADER_REGION_TOP + HEADER_GRADIENT_OFFSET + SEARCH_BAR_TOP;
const PROMISE_ABSOLUTE_TOP = HEADER_REGION_TOP + HEADER_GRADIENT_OFFSET + PROMISE_SECTION_TOP;
const SEARCH_STICKY_TOP = STATUS_BAR_HEIGHT + SEARCH_BAR_BOTTOM_GAP;
/** Concave Subtract notch depth (path y=48). Sticky search bottom (89) + 12px = 101 at the notch. */
const SUBTRACT_NOTCH_DEPTH = 48;
const SHEET_NOTCH_STICKY_BOTTOM =
  SEARCH_STICKY_TOP + SEARCH_FIELD_HEIGHT + SEARCH_BAR_BOTTOM_GAP;
/** Sheet container top when collapsed so the curve wraps the stuck search. */
const SHEET_STICKY_TOP = SHEET_NOTCH_STICKY_BOTTOM - SUBTRACT_NOTCH_DEPTH;
const SHEET_REGION_TOP = 206.5835;
const SEARCH_COLLAPSE_DISTANCE = SEARCH_ABSOLUTE_TOP - SEARCH_STICKY_TOP;
const SHEET_COLLAPSE_DISTANCE = SHEET_REGION_TOP - SHEET_STICKY_TOP;
const HEADER_COLLAPSE_SCROLL = Math.max(SEARCH_COLLAPSE_DISTANCE, SHEET_COLLAPSE_DISTANCE);

const SHEET_STICKY_PADDING = 120;
const SUBTRACT_TOP = 57.5;
const SUBTRACT_HEIGHT = 908.1035;

const NAV_HEIGHT = 101;
const HOME_INDICATOR_HEIGHT = 24;
/** Figma Service Cards (3344:8773) inner offset: top 0.5 + first card y 16.105. */
const SERVICE_GRID_PADDING_TOP = 16.605;

export function HomeScreen() {
  const { scale, contentWidth, contentHeight } = useScreenScale();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const { nav } = useLocalSearchParams<{ nav?: string }>();
  const [navVariant, setNavVariant] = useState<NavBarVariant>(() =>
    nav === 'orders' ? 'Orders' : 'Home',
  );
  const [collapseScrollY, setCollapseScrollY] = useState(0);
  const collapseScrollYRef = useRef(0);
  const sheetScrollRef = useRef<ScrollView>(null);
  const sheetScrollOffsetRef = useRef(0);
  const ignoreSheetScrollRef = useRef(false);
  const maxCollapseScrollRef = useRef(0);

  useEffect(() => {
    if (nav === 'orders') {
      setNavVariant('Orders');
    } else if (nav === 'home') {
      setNavVariant('Home');
    }
  }, [nav]);

  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
      return;
    }

    const onWheel = (event: WheelEvent) => {
      const max = maxCollapseScrollRef.current;
      const current = collapseScrollYRef.current;

      if (event.deltaY > 0 && current < max) {
        event.preventDefault();
        const next = Math.min(current + event.deltaY, max);
        collapseScrollYRef.current = next;
        setCollapseScrollY(next);
        return;
      }

      if (event.deltaY < 0 && sheetScrollOffsetRef.current <= 1 && current > 0) {
        event.preventDefault();
        const next = Math.max(0, current + event.deltaY);
        collapseScrollYRef.current = next;
        setCollapseScrollY(next);
      }
    };

    window.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => window.removeEventListener('wheel', onWheel, { capture: true });
  }, []);

  const frameHeight = contentHeight + safeTop;
  const bottomChromeHeight = (NAV_HEIGHT + HOME_INDICATOR_HEIGHT) * scale;
  const maxCollapseScroll = HEADER_COLLAPSE_SCROLL * scale;

  useEffect(() => {
    maxCollapseScrollRef.current = maxCollapseScroll;
  }, [maxCollapseScroll]);

  const collapsedProgress = Math.min(collapseScrollY / scale, HEADER_COLLAPSE_SCROLL);
  // Search pins at SEARCH_STICKY_TOP (44). Sheet pins at SHEET_STICKY_TOP (~53) so
  // the Subtract notch (~48px) lands at 101 — 12px below stuck search bottom (89).
  const searchTopUnscaled = Math.max(SEARCH_STICKY_TOP, SEARCH_ABSOLUTE_TOP - collapsedProgress);
  const searchTop = searchTopUnscaled * scale;
  const searchBottomUnscaled = searchTopUnscaled + SEARCH_FIELD_HEIGHT;
  const sheetTopUnscaled = Math.max(SHEET_STICKY_TOP, SHEET_REGION_TOP - collapsedProgress);
  const sheetTop = sheetTopUnscaled * scale;
  // Sheet runs under the bottom chrome so content scrolls behind the nav's backdrop blur.
  const sheetHeight = frameHeight - sheetTop;
  // Address always tracks full collapse so it fully exits; promise stops once it
  // would get closer than PROMISE_SEARCH_MIN_GAP below the current/sticky search.
  const maxPromiseCollapse = Math.max(
    0,
    PROMISE_ABSOLUTE_TOP - (searchBottomUnscaled + PROMISE_SEARCH_MIN_GAP),
  );
  const addressTranslateY = -collapsedProgress * scale;
  const promiseTranslateY = -Math.min(collapsedProgress, maxPromiseCollapse) * scale;
  // Curve sits at Figma Subtract y=57.5 at rest; subtractTop → 0 when collapsed so
  // the concave wrap sits at the sheet top and embraces the stuck search.
  const sheetTravelDone = Math.min(
    Math.max(SHEET_REGION_TOP - sheetTopUnscaled, 0) / SHEET_COLLAPSE_DISTANCE,
    1,
  );
  const subtractTop = SUBTRACT_TOP * (1 - sheetTravelDone);
  const sheetContentPaddingTop = SHEET_STICKY_PADDING - SUBTRACT_TOP * sheetTravelDone;

  const applyCollapse = (nextY: number) => {
    const clamped = Math.max(0, Math.min(nextY, maxCollapseScroll));
    if (clamped === collapseScrollYRef.current) {
      return 0;
    }
    const consumed = clamped - collapseScrollYRef.current;
    collapseScrollYRef.current = clamped;
    setCollapseScrollY(clamped);
    return consumed;
  };

  const handleSheetScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;

    if (ignoreSheetScrollRef.current) {
      sheetScrollOffsetRef.current = y;
      if (y <= 1) {
        ignoreSheetScrollRef.current = false;
      }
      return;
    }

    const deltaY = y - sheetScrollOffsetRef.current;
    sheetScrollOffsetRef.current = y;

    if (deltaY > 0 && collapseScrollYRef.current < maxCollapseScroll) {
      applyCollapse(collapseScrollYRef.current + deltaY);
      ignoreSheetScrollRef.current = true;
      sheetScrollOffsetRef.current = 0;
      sheetScrollRef.current?.scrollTo({ y: 0, animated: false });
      return;
    }

    if (deltaY < 0 && y <= 1 && collapseScrollYRef.current > 0) {
      applyCollapse(collapseScrollYRef.current + deltaY);
      if (y > 0) {
        ignoreSheetScrollRef.current = true;
        sheetScrollOffsetRef.current = 0;
        sheetScrollRef.current?.scrollTo({ y: 0, animated: false });
      }
    }
  };

  const sheetSections = (
    <>
      <View style={[styles.section, { width: 373 * scale, gap: 12 * scale }]}>
        <SectionTitle title="Personalized Recommendation" scale={scale} />
        <RecommendationCard scale={scale} onViewPlanPress={() => undefined} />
      </View>

      <View style={[styles.section, { width: 373 * scale, gap: 12 * scale }]}>
        <SectionTitle title="Search by Service" scale={scale} headerHeight={18} />
        <View
          style={[
            styles.serviceGrid,
            {
              width: 373 * scale,
              gap: 12 * scale,
              rowGap: 28 * scale,
              paddingTop: SERVICE_GRID_PADDING_TOP * scale,
            },
          ]}>
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

        {/* Header gradient — fixed background shared by address, search, and promise */}
        <View
          pointerEvents="none"
          style={[
            styles.headerLayer,
            {
              top: HEADER_REGION_TOP * scale,
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
            <View
              style={[
                styles.headerContent,
                {
                  height: HEADER_GRADIENT_HEIGHT * scale,
                },
              ]}>
              <View
                style={[
                  styles.headerAddress,
                  {
                    top: 5.5 * scale,
                    transform: [{ translateY: addressTranslateY }],
                  },
                ]}>
                <AddressHeader scale={scale} />
              </View>
              <View
                style={[
                  styles.headerPromise,
                  {
                    top: PROMISE_SECTION_TOP * scale,
                    transform: [{ translateY: promiseTranslateY }],
                  },
                ]}>
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
          <SearchField scale={scale} onPress={() => router.push('/search')} />
        </View>

        {/* White sheet — pins so the concave notch wraps the stuck search */}
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
        >
          {/* Subtract curve — at rest y=57.5; collapsed at sheet top wrapping search */}
          <View
            pointerEvents="none"
            style={[
              styles.sheetBackground,
              {
                top: subtractTop * scale,
                height: SUBTRACT_HEIGHT * scale,
              },
            ]}>
            <SubtractIcon width={contentWidth} height={SUBTRACT_HEIGHT * scale} />
          </View>
          <ScrollView
            ref={sheetScrollRef}
            style={styles.sheetScroll}
            contentContainerStyle={[
              styles.sheetScrollContent,
              {
                paddingTop: sheetContentPaddingTop * scale,
                paddingHorizontal: SwashoSpacing.xxl * scale,
                paddingBottom: 16 * scale + bottomChromeHeight,
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
            onHomePress={() => setNavVariant('Home')}
            onSubscriptionPress={() => setNavVariant('Orders')}
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
    backgroundColor: 'transparent',
  },
  sheetContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  sheetBackground: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 0,
  },
  sheetScroll: {
    flex: 1,
    width: '100%',
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  sheetScrollContent: {
    width: '100%',
    backgroundColor: 'transparent',
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
    backgroundColor: '#ffffff',
  },
  homeIndicatorWrap: {
    backgroundColor: '#ffffff',
  },
});
