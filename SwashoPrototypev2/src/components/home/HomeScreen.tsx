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

const SHEET_STICKY_TOP =
  SEARCH_BAR_TOP + HEADER_GRADIENT_OFFSET + SEARCH_FIELD_HEIGHT + SEARCH_BAR_BOTTOM_GAP;
const SHEET_REGION_TOP = 155.58;
const HEADER_COLLAPSE_SCROLL = SHEET_REGION_TOP - SHEET_STICKY_TOP;
const SHEET_STICKY_PADDING = SwashoSpacing.sheetTop;
const SUBTRACT_TOP = 98.42;
const SUBTRACT_HEIGHT = 905.187;

const SEARCH_ABSOLUTE_TOP = HEADER_REGION_TOP + HEADER_GRADIENT_OFFSET + SEARCH_BAR_TOP;

const NAV_HEIGHT = 101;
const HOME_INDICATOR_HEIGHT = 24;

export function HomeScreen() {
  const { scale, contentWidth, contentHeight } = useScreenScale();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const [navVariant, setNavVariant] = useState<NavBarVariant>('Home');
  const [headerScrollY, setHeaderScrollY] = useState(0);
  const headerScrollRef = useRef<ScrollView>(null);

  const frameHeight = contentHeight + safeTop;
  const bottomChromeHeight = (NAV_HEIGHT + HOME_INDICATOR_HEIGHT) * scale;
  const collapseScrollY = HEADER_COLLAPSE_SCROLL * scale;
  const sheetTop =
    (SHEET_STICKY_TOP + HEADER_COLLAPSE_SCROLL - headerScrollY / scale) * scale;
  const sheetHeight = frameHeight - sheetTop - bottomChromeHeight;

  const handleHeaderScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const y = event.nativeEvent.contentOffset.y;
    const clampedY = Math.min(y, collapseScrollY);
    setHeaderScrollY(clampedY);
    if (y > collapseScrollY) {
      headerScrollRef.current?.scrollTo({ y: collapseScrollY, animated: false });
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
        <View style={[styles.statusBar, { height: 32 * scale }]}>
          <StatusBar scale={scale} />
        </View>

        {/* Header collapse scroll — address + promise scroll away behind sheet */}
        <ScrollView
          ref={headerScrollRef}
          style={styles.headerScroll}
          contentContainerStyle={{
            paddingTop: HEADER_REGION_TOP * scale,
            paddingBottom: sheetHeight,
          }}
          showsVerticalScrollIndicator={false}
          onScroll={handleHeaderScroll}
          scrollEventThrottle={16}
          bounces={false}
          overScrollMode="never">
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
          <View style={{ height: collapseScrollY }} />
        </ScrollView>

        {/* Search — fixed at Figma position, always visible */}
        <View
          pointerEvents="box-none"
          style={[
            styles.searchOverlay,
            {
              top: SEARCH_ABSOLUTE_TOP * scale,
              zIndex: 6,
            },
          ]}>
          <SearchField scale={scale} />
        </View>

        {/* White sheet — fixed below search, content scrolls inside */}
        <View
          style={[
            styles.sheetContainer,
            {
              top: sheetTop,
              height: sheetHeight,
              zIndex: 4,
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
  headerScroll: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2,
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
    zIndex: 3,
  },
  searchOverlay: {
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
