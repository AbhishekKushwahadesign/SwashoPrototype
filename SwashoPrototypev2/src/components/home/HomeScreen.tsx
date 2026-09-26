import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
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

const HEADER_TOP = 30;
const SHEET_TOP = 187;
const NAV_HEIGHT = 101;
const HOME_INDICATOR_HEIGHT = 24;

export function HomeScreen() {
  const { scale, contentWidth, contentHeight } = useScreenScale();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const [navVariant, setNavVariant] = useState<NavBarVariant>('Home');

  const frameHeight = contentHeight + safeTop;
  const bottomChromeHeight = (NAV_HEIGHT + HOME_INDICATOR_HEIGHT) * scale;

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
        <LinearGradient
          colors={[SwashoColors.primary500, SwashoColors.primary100]}
          locations={[0.003, 1]}
          style={[
            styles.headerGradient,
            {
              top: HEADER_TOP * scale,
              height: 282 * scale,
              borderBottomLeftRadius: SwashoRadii.header * scale,
              borderBottomRightRadius: SwashoRadii.header * scale,
            },
          ]}>
          <View style={[styles.headerContent, { height: 312 * scale }]}>
            <View style={[styles.headerAddress, { top: 5.5 * scale }]}>
              <AddressHeader scale={scale} />
            </View>
            <View style={[styles.headerSearch, { top: 70.5 * scale }]}>
              <SearchField scale={scale} />
            </View>
            <View style={[styles.headerPromise, { top: 131.5 * scale }]}>
              <PromiseSection scale={scale} onLearnMorePress={() => undefined} />
            </View>
          </View>
        </LinearGradient>

        <View style={[styles.statusBar, { height: 32 * scale }]}>
          <StatusBar scale={scale} />
        </View>

        <ScrollView
          style={[
            styles.scroll,
            {
              top: SHEET_TOP * scale,
              bottom: bottomChromeHeight,
            },
          ]}
          contentContainerStyle={{
            paddingTop: SwashoSpacing.sheetTop * scale,
            paddingHorizontal: SwashoSpacing.xxl * scale,
            paddingBottom: 16 * scale,
            gap: SwashoSpacing.section * scale,
          }}
          showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.sheetBackground,
              {
                top: 67.42 * scale,
                height: 936.19 * scale,
              },
            ]}>
            <SubtractIcon width={contentWidth} height={936.19 * scale} />
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
  headerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 1,
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
  headerSearch: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  headerPromise: {
    position: 'absolute',
    left: 0,
    right: 0,
  },
  scroll: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 2,
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
    zIndex: 3,
  },
});
