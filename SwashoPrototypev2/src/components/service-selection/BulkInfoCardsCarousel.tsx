import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';
import { getBulkServiceRatePerKg } from '@/lib/bulk-load-tiers';

import { BULK_LOAD_PRICE_ASTERISK_XML, BULK_LOAD_WEIGHING_SCALE_XML } from './bulk-load-icons';

const AUTO_ADVANCE_MS = 5000;
const CARD_COUNT = 2;
const CARD_GAP_PX = 20;
const MODAL_HORIZONTAL_INSET_PX = 16;

type BulkInfoCardsCarouselProps = {
  serviceId: string;
  scale: number;
  /** Full modal sheet width (412 at design scale). */
  contentWidth: number;
};

function BulkInfoCardShell({
  scale,
  children,
}: {
  scale: number;
  children: ReactNode;
}) {
  return (
    <View
      style={[
        styles.infoCard,
        {
          borderRadius: SwashoRadii.md * scale,
          paddingHorizontal: 8 * scale,
          paddingVertical: 10 * scale,
        },
      ]}>
      {children}
    </View>
  );
}

function BulkWeightEstimateCard({ scale }: { scale: number }) {
  return (
    <BulkInfoCardShell scale={scale}>
      <View style={[styles.cardRow, { gap: 8 * scale }]}>
        <SvgXml xml={BULK_LOAD_WEIGHING_SCALE_XML} width={33 * scale} height={33 * scale} />
        <View style={[styles.infoCopy, { gap: 4 * scale, flex: 1 }]}>
          <Text
            style={[
              searchFont('medium'),
              styles.infoTitle,
              { fontSize: 13 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
            ]}>
            These sizes are estimates
          </Text>
          <Text
            style={[
              searchFont('medium'),
              styles.infoBody,
              { fontSize: 13 * scale, lineHeight: 18 * scale },
            ]}>
            We&apos;ll confirm the actual weight at pickup
          </Text>
        </View>
      </View>
    </BulkInfoCardShell>
  );
}

function BulkPriceEstimateCard({ scale, ratePerKg }: { scale: number; ratePerKg: number }) {
  return (
    <BulkInfoCardShell scale={scale}>
      <View style={[styles.cardRow, { gap: 8 * scale }]}>
        <SvgXml xml={BULK_LOAD_PRICE_ASTERISK_XML} width={33 * scale} height={33 * scale} />
        <View style={[styles.infoCopy, { gap: 4 * scale, flex: 1 }]}>
          <Text
            style={[
              searchFont('medium'),
              styles.infoTitle,
              { fontSize: 13 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
            ]}>
            Prices are estimates, @{ratePerKg}/kg
          </Text>
          <Text
            style={[
              searchFont('medium'),
              styles.infoBody,
              { fontSize: 13 * scale, lineHeight: 18 * scale },
            ]}>
            Actual price will be confirmed at pickup
          </Text>
        </View>
      </View>
    </BulkInfoCardShell>
  );
}

function InfoCarouselPagination({ activeIndex, scale }: { activeIndex: number; scale: number }) {
  return (
    <View style={[styles.paginationRow, { gap: 4 * scale, height: 7.2 * scale }]}>
      {[0, 1].map((index) => {
        const active = index === activeIndex;
        return (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                width: (active ? 7.2 : 4) * scale,
                height: 4 * scale,
                borderRadius: SwashoRadii.sm * scale,
                backgroundColor: active ? SwashoColors.neutral800 : SwashoColors.neutral300,
              },
            ]}
          />
        );
      })}
    </View>
  );
}

export function BulkInfoCardsCarousel({ serviceId, scale, contentWidth }: BulkInfoCardsCarouselProps) {
  const ratePerKg = getBulkServiceRatePerKg(serviceId);
  const scrollRef = useRef<ScrollView>(null);
  const activeIndexRef = useRef(0);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const inset = MODAL_HORIZONTAL_INSET_PX * scale;
  const gap = CARD_GAP_PX * scale;
  const pageWidth = Math.max(0, Math.round(contentWidth));
  const cardWidth = Math.max(0, Math.round(pageWidth - inset * 2));
  /** One full page plus inter-card gap (second snap position). */
  const scrollStride = pageWidth + gap;
  const snapOffsets = [0, scrollStride];

  const clearAutoAdvance = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearInterval(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }, []);

  const scrollToIndex = useCallback(
    (index: number, animated = true) => {
      if (scrollStride <= 0) {
        return;
      }
      const clamped = ((index % CARD_COUNT) + CARD_COUNT) % CARD_COUNT;
      scrollRef.current?.scrollTo({ x: clamped * scrollStride, animated });
      activeIndexRef.current = clamped;
      setActiveIndex(clamped);
    },
    [scrollStride],
  );

  const scheduleAutoAdvance = useCallback(() => {
    clearAutoAdvance();
    if (scrollStride <= 0) {
      return;
    }
    autoAdvanceTimerRef.current = setInterval(() => {
      scrollToIndex(activeIndexRef.current + 1);
    }, AUTO_ADVANCE_MS);
  }, [scrollStride, clearAutoAdvance, scrollToIndex]);

  useEffect(() => {
    scheduleAutoAdvance();
    return clearAutoAdvance;
  }, [scrollStride, scheduleAutoAdvance, clearAutoAdvance]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ x: 0, animated: false });
    activeIndexRef.current = 0;
    setActiveIndex(0);
  }, [pageWidth, gap]);

  const syncIndexFromOffset = useCallback(
    (offsetX: number) => {
      if (scrollStride <= 0) {
        return;
      }
      const index = Math.min(
        CARD_COUNT - 1,
        Math.max(0, Math.round(offsetX / scrollStride)),
      );
      if (activeIndexRef.current !== index) {
        activeIndexRef.current = index;
        setActiveIndex(index);
      }
    },
    [scrollStride],
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      syncIndexFromOffset(event.nativeEvent.contentOffset.x);
    },
    [syncIndexFromOffset],
  );

  const snapToNearestCard = useCallback(
    (offsetX: number, animated = true) => {
      if (scrollStride <= 0) {
        return;
      }
      const index = offsetX >= scrollStride * 0.5 ? 1 : 0;
      const targetX = index * scrollStride;
      if (Math.abs(offsetX - targetX) > 0.5) {
        scrollRef.current?.scrollTo({ x: targetX, animated });
      }
      activeIndexRef.current = index;
      setActiveIndex(index);
    },
    [scrollStride],
  );

  const handleScrollSettled = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      snapToNearestCard(offsetX, true);
      if (Platform.OS === 'web') {
        requestAnimationFrame(() => snapToNearestCard(offsetX, true));
      }
      scheduleAutoAdvance();
    },
    [snapToNearestCard, scheduleAutoAdvance],
  );

  const handleScrollBeginDrag = useCallback(() => {
    clearAutoAdvance();
  }, [clearAutoAdvance]);

  if (pageWidth <= 0 || cardWidth <= 0) {
    return null;
  }

  return (
    <View style={[styles.carouselColumn, { gap: 8 * scale, width: pageWidth }]}>
      <ScrollView
        ref={scrollRef}
        horizontal
        decelerationRate="fast"
        snapToOffsets={snapOffsets}
        snapToAlignment="start"
        disableIntervalMomentum
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onMomentumScrollEnd={handleScrollSettled}
        onScrollEndDrag={handleScrollSettled}
        style={[
          { width: pageWidth },
          Platform.OS === 'web' ? styles.scrollWeb : null,
        ]}
        contentContainerStyle={Platform.OS === 'web' ? styles.scrollContentWeb : undefined}>
        <View
          style={[
            styles.carouselPage,
            { width: pageWidth, paddingHorizontal: inset },
            Platform.OS === 'web' ? styles.scrollSnapPageWeb : null,
          ]}>
          <View style={{ width: cardWidth, flexShrink: 0 }}>
            <BulkWeightEstimateCard scale={scale} />
          </View>
        </View>
        <View style={{ width: gap, flexShrink: 0 }} />
        <View
          style={[
            styles.carouselPage,
            { width: pageWidth, paddingHorizontal: inset },
            Platform.OS === 'web' ? styles.scrollSnapPageWeb : null,
          ]}>
          <View style={{ width: cardWidth, flexShrink: 0 }}>
            <BulkPriceEstimateCard scale={scale} ratePerKg={ratePerKg} />
          </View>
        </View>
      </ScrollView>
      <InfoCarouselPagination activeIndex={activeIndex} scale={scale} />
    </View>
  );
}

const styles = StyleSheet.create({
  carouselColumn: {
    width: '100%',
    alignItems: 'center',
  },
  carouselPage: {
    flexShrink: 0,
  },
  infoCard: {
    backgroundColor: SwashoColors.info100,
    borderWidth: 1,
    borderColor: SwashoColors.info300,
    width: '100%',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoCopy: {
    alignItems: 'flex-start',
  },
  infoTitle: {
    color: SwashoColors.info700,
  },
  infoBody: {
    color: SwashoColors.info700,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationDot: {},
  scrollWeb: {
    overflowX: 'auto',
    scrollSnapType: 'x mandatory',
  },
  scrollContentWeb: {
    scrollSnapType: 'x mandatory',
  },
  scrollSnapPageWeb: {
    scrollSnapAlign: 'start',
    scrollSnapStop: 'always',
  },
});
