import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeIndicator } from '@/components/home/HomeIndicator';
import { TertiaryButton } from '@/components/home/TertiaryButton';
import { useSafeTopInset, useScreenScale } from '@/components/home/scale';
import { ProviderCard } from '@/components/provider/ProviderCard';
import { RECENT_SEARCHES, SEARCH_OFFERS } from '@/data/providers';

import { RecentSearchChip } from './RecentSearchChip';
import { SearchNavigationBar } from './SearchNavigationBar';
import { SearchStatusBar } from './SearchStatusBar';

const STATUS_BAR_HEIGHT = 32;
const CONTENT_TOP_OFFSET = 23.67;
const SEARCH_TO_OFFERS_GAP = 40;
const SEARCH_INTERNAL_GAP = 16;
const OFFERS_HEADER_TO_GRID_GAP = 12;
const CARD_GAP = 16;
const GRID_WIDTH = 467;
const GRID_HEIGHT = 403.74;
const OFFERS_HEADER_WIDTH = 372;

function buildOfferColumns() {
  const columns: (typeof SEARCH_OFFERS)[] = [];
  for (let i = 0; i < SEARCH_OFFERS.length; i += 2) {
    columns.push(SEARCH_OFFERS.slice(i, i + 2));
  }
  return columns;
}

export function Search1Screen() {
  const { scale, contentWidth, contentHeight } = useScreenScale();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const frameHeight = contentHeight + safeTop;
  const offerColumns = buildOfferColumns();

  return (
    <View style={styles.root}>
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
          <SearchStatusBar scale={scale} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: CONTENT_TOP_OFFSET * scale,
              paddingBottom: 24 * scale,
            },
          ]}
          showsVerticalScrollIndicator={false}>
          <View style={[styles.searchBlock, { gap: SEARCH_INTERNAL_GAP * scale, width: contentWidth }]}>
            <SearchNavigationBar scale={scale} />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[
                styles.chipsRow,
                {
                  paddingLeft: 16 * scale,
                  paddingRight: 17 * scale,
                  gap: 8 * scale,
                },
              ]}>
              {RECENT_SEARCHES.map((label, index) => (
                <RecentSearchChip key={`${label}-${index}`} label={label} scale={scale} />
              ))}
            </ScrollView>
          </View>

          <View style={{ height: SEARCH_TO_OFFERS_GAP * scale }} />

          <View
            style={[
              styles.offersSection,
              {
                paddingLeft: 20 * scale,
                gap: OFFERS_HEADER_TO_GRID_GAP * scale,
              },
            ]}>
            <View
              style={[
                styles.offersHeader,
                {
                  width: OFFERS_HEADER_WIDTH * scale,
                  height: 18 * scale,
                },
              ]}>
              <Text
                style={[
                  styles.offersTitle,
                  {
                    fontSize: 18 * scale,
                    lineHeight: 16 * scale,
                  },
                ]}>
                Top Offers
              </Text>
              <TertiaryButton label="Explore" showTrailingIcon trailingIcon="alt-arrow" scale={scale} />
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ width: GRID_WIDTH * scale, height: GRID_HEIGHT * scale }}
              contentContainerStyle={{ gap: CARD_GAP * scale }}>
              {offerColumns.map((column, columnIndex) => (
                <View
                  key={`column-${columnIndex}`}
                  style={{
                    gap: CARD_GAP * scale,
                    justifyContent: 'flex-end',
                  }}>
                  {column.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} scale={scale} />
                  ))}
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>

        <View style={styles.homeIndicatorWrap}>
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
    backgroundColor: '#f2f2f2',
    overflow: 'hidden',
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
    alignItems: 'flex-start',
  },
  searchBlock: {
    alignSelf: 'flex-start',
  },
  chipsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  offersSection: {
    width: '100%',
  },
  offersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offersTitle: {
    flex: 1,
    fontFamily: 'Poppins_500Medium',
    color: '#3d3d3d',
    letterSpacing: 0.5,
  },
  homeIndicatorWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
});
