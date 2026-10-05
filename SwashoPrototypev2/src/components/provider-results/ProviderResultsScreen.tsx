import { useRouter } from 'expo-router';
import { useCallback } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
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
const LIST_PADDING_TOP = 174;
const LIST_WIDTH = 390;
const LIST_GAP = 8;
const FILTER_PADDING_LEFT = 20;
const FILTER_PADDING_RIGHT = 21;
const FILTER_GAP = 8;

type ProviderResultsScreenProps = {
  query: string;
};

export function ProviderResultsScreen({ query }: ProviderResultsScreenProps) {
  const router = useRouter();
  const { scale, contentWidth, contentHeight } = useScreenScale();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const frameHeight = contentHeight + safeTop;
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

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: LIST_PADDING_TOP * scale,
              paddingBottom: 24 * scale,
            },
          ]}
          showsVerticalScrollIndicator={false}>
          <View
            style={[
              styles.list,
              {
                width: LIST_WIDTH * scale,
                gap: LIST_GAP * scale,
              },
            ]}>
            {providers.map((provider) => (
              <ProviderResultCard
                key={provider.id}
                provider={provider}
                scale={scale}
                onPress={() => handleProviderPress(provider.id)}
              />
            ))}
          </View>
        </ScrollView>

        <View style={[styles.stickyHeader, { width: contentWidth }]}>
          <View
            style={[
              styles.headerInner,
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
        </View>

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
    zIndex: 20,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
  },
  list: {
    alignItems: 'center',
  },
  stickyHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#ffffff',
  },
  headerInner: {
    backgroundColor: '#ffffff',
  },
  filtersRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
  },
  homeIndicatorWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
  },
});
