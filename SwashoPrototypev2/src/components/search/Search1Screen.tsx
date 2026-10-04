import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AltArrowRightIcon } from '@/components/home/figma-icons';
import { HomeIndicator } from '@/components/home/HomeIndicator';
import { useSafeTopInset, useScreenScale } from '@/components/home/scale';
import { ProviderCard } from '@/components/provider/ProviderCard';
import { SwashoColors } from '@/constants/swasho-tokens';
import { RECENT_SEARCHES, SEARCH_OFFERS } from '@/data/providers';

import { searchFont } from '@/components/search/search-fonts';

import { RecentSearchChip } from './RecentSearchChip';
import { SearchNavigationBar } from './SearchNavigationBar';
import { SearchStatusBar } from './SearchStatusBar';

const STATUS_BAR_HEIGHT = 32;
const CONTENT_TOP_OFFSET = 23.67;
const CHIPS_PADDING_LEFT = 16;
const CHIPS_PADDING_RIGHT = 17;
const CHIPS_GAP = 8;
const SEARCH_TO_OFFERS_GAP = 40;
const SEARCH_INTERNAL_GAP = 16;
const OFFERS_HEADER_TO_GRID_GAP = 12;
const OFFERS_SECTION_PADDING_X = 20;
const OFFERS_HEADER_HEIGHT = 18;
const OFFERS_TITLE_SIZE = 18;
const OFFERS_TITLE_LINE_HEIGHT = 16;
const EXPLORE_LABEL_SIZE = 14;
const EXPLORE_LABEL_LINE_HEIGHT = 12;
const EXPLORE_BUTTON_GAP = 4;
const EXPLORE_BUTTON_MIN_WIDTH = 60;
const EXPLORE_ICON_SIZE = 20;
const CARD_GAP = 16;
const GRID_HEIGHT = 403.74;

function buildOfferColumns() {
  const columns: (typeof SEARCH_OFFERS)[] = [];
  for (let i = 0; i < SEARCH_OFFERS.length; i += 2) {
    columns.push(SEARCH_OFFERS.slice(i, i + 2));
  }
  return columns;
}

export function Search1Screen() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const { scale, contentWidth, contentHeight } = useScreenScale();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const frameHeight = contentHeight + safeTop;
  const offerColumns = buildOfferColumns();
  const offersHeaderWidth = contentWidth - OFFERS_SECTION_PADDING_X * 2 * scale;
  const offersViewportWidth = contentWidth - OFFERS_SECTION_PADDING_X * scale;

  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  }, [router]);

  const handleSubmit = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      return;
    }
    router.push({
      pathname: '/search-2',
      params: { q: trimmed },
    });
  }, [query, router]);

  const handleRecentSearchPress = useCallback((label: string) => {
    setQuery(label);
  }, []);

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
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled">
          <View style={[styles.searchBlock, { gap: SEARCH_INTERNAL_GAP * scale, width: contentWidth }]}>
            <SearchNavigationBar
              scale={scale}
              value={query}
              onChangeText={setQuery}
              onSubmit={handleSubmit}
              onBackPress={handleBackPress}
              autoFocus
            />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{ width: contentWidth }}
              contentContainerStyle={[
                styles.chipsRow,
                {
                  paddingLeft: CHIPS_PADDING_LEFT * scale,
                  paddingRight: CHIPS_PADDING_RIGHT * scale,
                  gap: CHIPS_GAP * scale,
                },
              ]}
              keyboardShouldPersistTaps="handled">
              {RECENT_SEARCHES.map((label, index) => (
                <RecentSearchChip
                  key={`${label}-${index}`}
                  label={label}
                  scale={scale}
                  onPress={() => handleRecentSearchPress(label)}
                />
              ))}
            </ScrollView>
          </View>

          <View style={{ height: SEARCH_TO_OFFERS_GAP * scale }} />

          <View
            style={[
              styles.offersSection,
              {
                paddingLeft: OFFERS_SECTION_PADDING_X * scale,
                gap: OFFERS_HEADER_TO_GRID_GAP * scale,
              },
            ]}>
            <View
              style={[
                styles.offersHeader,
                {
                  width: offersHeaderWidth,
                  height: OFFERS_HEADER_HEIGHT * scale,
                },
              ]}>
              <Text
                style={[
                  styles.offersTitle,
                  searchFont('medium'),
                  {
                    fontSize: OFFERS_TITLE_SIZE * scale,
                    lineHeight: OFFERS_TITLE_LINE_HEIGHT * scale,
                  },
                ]}>
                Top Offers
              </Text>
              <Pressable
                style={[
                  styles.exploreButton,
                  {
                    gap: EXPLORE_BUTTON_GAP * scale,
                    height: OFFERS_HEADER_HEIGHT * scale,
                    minWidth: EXPLORE_BUTTON_MIN_WIDTH * scale,
                  },
                ]}>
                <Text
                  style={[
                    styles.exploreLabel,
                    searchFont('medium'),
                    {
                      fontSize: EXPLORE_LABEL_SIZE * scale,
                      lineHeight: EXPLORE_LABEL_LINE_HEIGHT * scale,
                    },
                  ]}>
                  Explore
                </Text>
                <View style={{ width: EXPLORE_ICON_SIZE * scale, height: EXPLORE_ICON_SIZE * scale }}>
                  <AltArrowRightIcon width={EXPLORE_ICON_SIZE * scale} height={EXPLORE_ICON_SIZE * scale} />
                </View>
              </Pressable>
            </View>

            <ScrollView
              horizontal
              nestedScrollEnabled
              directionalLockEnabled
              showsHorizontalScrollIndicator={false}
              style={[
                styles.offersGrid,
                {
                  width: offersViewportWidth,
                  height: GRID_HEIGHT * scale,
                },
                Platform.OS === 'web' ? styles.offersGridWeb : null,
              ]}
              contentContainerStyle={{
                flexDirection: 'row',
                alignItems: 'flex-end',
                gap: CARD_GAP * scale,
                paddingRight: OFFERS_SECTION_PADDING_X * scale,
              }}>
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
    overflow: 'hidden',
  },
  offersGrid: {
    flexGrow: 0,
    flexShrink: 0,
  },
  offersGridWeb: {
    overflowX: 'auto',
    overflowY: 'hidden',
  },
  offersHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offersTitle: {
    flex: 1,
    color: SwashoColors.neutral900,
    letterSpacing: 0.5,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  exploreLabel: {
    flex: 1,
    color: SwashoColors.darkText,
    letterSpacing: 0.5,
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
