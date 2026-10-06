import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeIndicator } from '@/components/home/HomeIndicator';
import { useSafeTopInset, useScreenScale } from '@/components/home/scale';
import { SearchStatusBar } from '@/components/search/SearchStatusBar';
import { getProviderResultsForQuery, PROVIDER_RESULT_FILTERS } from '@/data/providers';

import { FilterChip } from './FilterChip';
import { ProviderResultCard } from './ProviderResultCard';
import { ProviderResultsSearchBar } from './ProviderResultsSearchBar';

const STATUS_BAR_HEIGHT = 32;
const HEADER_TOP_PADDING = 64;
const HEADER_GAP = 12;
const LIST_TOP_GAP = 8;
const LIST_GAP = 8;
const FILTER_PADDING_LEFT = 20;
const FILTER_PADDING_RIGHT = 21;
const FILTER_GAP = 8;
const SCROLL_BOTTOM_GAP = 200;

type ProviderResultsScreenProps = {
  query: string;
};

export function ProviderResultsScreen({ query }: ProviderResultsScreenProps) {
  const router = useRouter();
  const { scale, contentWidth, contentHeight } = useScreenScale();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const frameHeight = contentHeight + safeTop;
  const scrollBottomGap = SCROLL_BOTTOM_GAP * scale;
  const providers = getProviderResultsForQuery(query);
  const displayQuery = query.trim() || 'Dry Cleaning';

  const handleBackPress = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/search');
  }, [router]);

  const handleClearPress = useCallback(() => {
    router.replace('/search');
  }, [router]);

  const handleProviderPress = useCallback(
    (providerId: string) => {
      router.push({
        pathname: '/provider/[id]',
        params: { id: providerId, q: displayQuery },
      });
    },
    [displayQuery, router],
  );

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

        <View
          style={[
            styles.headerSection,
            {
              paddingTop: HEADER_TOP_PADDING * scale,
              gap: HEADER_GAP * scale,
            },
          ]}>
          <ProviderResultsSearchBar
            scale={scale}
            query={displayQuery}
            onBackPress={handleBackPress}
            onClearPress={handleClearPress}
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[
              styles.filtersRow,
              {
                paddingLeft: FILTER_PADDING_LEFT * scale,
                paddingRight: FILTER_PADDING_RIGHT * scale,
                gap: FILTER_GAP * scale,
              },
            ]}>
            {PROVIDER_RESULT_FILTERS.map((filter) => (
              <FilterChip
                key={filter.id}
                label={filter.label}
                scale={scale}
                hasDropdown={filter.hasDropdown}
              />
            ))}
          </ScrollView>
        </View>

        <ScrollView
          style={[styles.scroll, Platform.OS === 'web' ? styles.scrollWeb : null]}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: LIST_TOP_GAP * scale,
              gap: LIST_GAP * scale,
            },
          ]}
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled>
          {providers.map((provider) => (
            <ProviderResultCard
              key={provider.id}
              provider={provider}
              scale={scale}
              onPress={() => handleProviderPress(provider.id)}
            />
          ))}
          <View style={{ height: scrollBottomGap, width: '100%' }} />
        </ScrollView>

        <HomeIndicator scale={scale} />
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
    flexDirection: 'column',
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  headerSection: {
    backgroundColor: '#ffffff',
    zIndex: 10,
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollWeb: {
    overflowY: 'auto',
  },
  scrollContent: {
    alignItems: 'center',
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
});
