import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  type ViewStyle,
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

// Figma frame 3344:8670 — header scroll region
const HEADER_REGION_TOP = 55;
const HEADER_REGION_HEIGHT = 1104;
const HEADER_STICKY_HEIGHT = 246;
const HEADER_GRADIENT_OFFSET = -25;
const HEADER_GRADIENT_HEIGHT = 312;

// Search bar stays at Figma y=70.5 inside gradient; sheet sticks 12px below it when collapsed
const SEARCH_BAR_TOP = 70.5;
const SEARCH_FIELD_HEIGHT = 45;
const SEARCH_BAR_BOTTOM_GAP = SwashoSpacing.lg;
const SHEET_STICKY_TOP =
  SEARCH_BAR_TOP + HEADER_GRADIENT_OFFSET + SEARCH_FIELD_HEIGHT + SEARCH_BAR_BOTTOM_GAP;

// Figma frame 3344:8748 — sheet scroll region
const SHEET_REGION_TOP = 155.58;
const SHEET_COLLAPSE_SCROLL = SHEET_REGION_TOP - SHEET_STICKY_TOP;
const SHEET_STICKY_PADDING = SwashoSpacing.sheetTop;
const SUBTRACT_TOP = 98.42;
const SUBTRACT_HEIGHT = 905.187;

const NAV_HEIGHT = 101;
const HOME_INDICATOR_HEIGHT = 24;
const STATUS_BAR_HEIGHT = 32;

const stickyPosition = Platform.select<ViewStyle>({
  web: {
    position: 'sticky' as ViewStyle['position'],
    top: 0,
  },
  default: {},
});

const stickySheetPosition = (top: number): ViewStyle =>
  Platform.select<ViewStyle>({
    web: {
      position: 'sticky' as ViewStyle['position'],
      top,
    },
    default: {},
  }) ?? {};

export function HomeScreen() {
  const { scale, contentWidth, contentHeight } = useScreenScale();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const [navVariant, setNavVariant] = useState<NavBarVariant>('Home');
  const outerScrollRef = useRef<ScrollView>(null);

  const frameHeight = contentHeight + safeTop;
  const bottomChromeHeight = (NAV_HEIGHT + HOME_INDICATOR_HEIGHT) * scale;
  const sheetMaxHeight =
    contentHeight - STATUS_BAR_HEIGHT * scale - SHEET_STICKY_TOP * scale - bottomChromeHeight;
  const sheetRegionHeight = SHEET_COLLAPSE_SCROLL + sheetMaxHeight / scale;
  const scrollContentHeight = SHEET_REGION_TOP + sheetRegionHeight;
  const collapseScrollY = Math.max(SHEET_COLLAPSE_SCROLL, HEADER_REGION_TOP) * scale;

  const handleOuterScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    if (y > collapseScrollY) {
      outerScrollRef.current?.scrollTo({ y: collapseScrollY, animated: false });
    }
  };

  const headerGradient = (
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
        <View style={[styles.headerPromise, { top: 131.5 * scale }]}>
          <PromiseSection scale={scale} onLearnMorePress={() => undefined} />
        </View>
      </View>
    </LinearGradient>
  );

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
        <View style={[styles.statusBar, { height: 32 * scale }]}>
          <StatusBar scale={scale} />
        </View>

        <ScrollView
          ref={outerScrollRef}
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            {
              minHeight: scrollContentHeight * scale + bottomChromeHeight,
              paddingBottom: bottomChromeHeight + 16 * scale,
            },
          ]}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled
          onScroll={handleOuterScroll}
          scrollEventThrottle={16}
          bounces
          overScrollMode="always">
          <View
            pointerEvents="box-none"
            style={[
              styles.scrollRegion,
              {
                top: HEADER_REGION_TOP * scale,
                height: HEADER_REGION_HEIGHT * scale,
                zIndex: 2,
              },
            ]}>
            <View
              pointerEvents="auto"
              style={[
                styles.stickyHeader,
                stickyPosition,
                {
                  height: HEADER_STICKY_HEIGHT * scale,
                },
              ]}>
              {headerGradient}
            </View>
          </View>

          <View
            pointerEvents="box-none"
            style={[
              styles.scrollRegion,
              {
                top: (HEADER_REGION_TOP + HEADER_GRADIENT_OFFSET + SEARCH_BAR_TOP) * scale,
                height: (SEARCH_FIELD_HEIGHT + SEARCH_BAR_BOTTOM_GAP * 2) * scale,
                zIndex: 6,
              },
            ]}>
            <View
              pointerEvents="auto"
              style={[
                styles.stickySearch,
                stickySheetPosition((HEADER_GRADIENT_OFFSET + SEARCH_BAR_TOP) * scale),
                {
                  paddingVertical: SEARCH_BAR_BOTTOM_GAP * scale,
                },
              ]}>
              <SearchField scale={scale} />
            </View>
          </View>

          <View
            pointerEvents="box-none"
            style={[
              styles.scrollRegion,
              {
                top: SHEET_REGION_TOP * scale,
                height: sheetRegionHeight * scale,
                zIndex: 4,
              },
            ]}>
            <View
              pointerEvents="auto"
              style={[
                styles.stickySheet,
                stickySheetPosition(SHEET_STICKY_TOP * scale),
                {
                  height: sheetMaxHeight,
                  backgroundColor: SwashoColors.surface,
                },
              ]}>
              <ScrollView
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
                nestedScrollEnabled
                bounces
                overScrollMode="always">
                {sheetSections}
              </ScrollView>
            </View>
          </View>
        </ScrollView>

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
    ...Platform.select({
      web: {
        maxHeight: ScreenHeight,
        overflow: 'visible',
      },
      default: {
        overflow: 'hidden',
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    position: 'relative',
    width: '100%',
  },
  scrollRegion: {
    position: 'absolute',
    left: 0,
    right: 0,
    width: '100%',
  },
  stickyHeader: {
    overflow: 'visible',
    width: '100%',
  },
  stickySheet: {
    width: '100%',
    overflow: 'hidden',
  },
  sheetScroll: {
    flex: 1,
    width: '100%',
  },
  sheetScrollContent: {
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
  stickySearch: {
    width: '100%',
    alignItems: 'center',
  },
  headerPromise: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
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
