import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { SvgXml } from 'react-native-svg';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';
import { getBulkServiceRatePerKg } from '@/lib/bulk-load-tiers';

import { BULK_LOAD_WEIGHING_SCALE_XML } from './bulk-load-icons';

const AUTO_ADVANCE_MS = 5000;
const CARD_COUNT = 2;

type BulkInfoCardsCarouselProps = {
  serviceId: string;
  scale: number;
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
        <View style={[styles.asteriskWrap, { width: 32 * scale, height: 34 * scale }]}>
          <Text
            style={[
              searchFont('medium'),
              styles.asterisk,
              {
                fontSize: 36 * scale,
                lineHeight: 16 * scale,
                letterSpacing: 0.5 * scale,
              },
            ]}>
            *
          </Text>
        </View>
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

export function BulkInfoCardsCarousel({ serviceId, scale }: BulkInfoCardsCarouselProps) {
  const ratePerKg = getBulkServiceRatePerKg(serviceId);
  const scrollRef = useRef<ScrollView>(null);
  const activeIndexRef = useRef(0);
  const autoAdvanceTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  const clearAutoAdvance = useCallback(() => {
    if (autoAdvanceTimerRef.current) {
      clearInterval(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }
  }, []);

  const scrollToIndex = useCallback(
    (index: number, animated = true) => {
      if (cardWidth <= 0) {
        return;
      }
      const clamped = ((index % CARD_COUNT) + CARD_COUNT) % CARD_COUNT;
      scrollRef.current?.scrollTo({ x: clamped * cardWidth, animated });
      activeIndexRef.current = clamped;
      setActiveIndex(clamped);
    },
    [cardWidth],
  );

  const scheduleAutoAdvance = useCallback(() => {
    clearAutoAdvance();
    if (cardWidth <= 0) {
      return;
    }
    autoAdvanceTimerRef.current = setInterval(() => {
      scrollToIndex(activeIndexRef.current + 1);
    }, AUTO_ADVANCE_MS);
  }, [cardWidth, clearAutoAdvance, scrollToIndex]);

  useEffect(() => {
    scheduleAutoAdvance();
    return clearAutoAdvance;
  }, [cardWidth, scheduleAutoAdvance, clearAutoAdvance]);

  const handleLayout = useCallback((event: LayoutChangeEvent) => {
    const width = Math.round(event.nativeEvent.layout.width);
    if (width > 0 && width !== cardWidth) {
      setCardWidth(width);
    }
  }, [cardWidth]);

  const handleMomentumScrollEnd = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (cardWidth <= 0) {
        return;
      }
      const index = Math.round(event.nativeEvent.contentOffset.x / cardWidth);
      const clamped = Math.min(Math.max(index, 0), CARD_COUNT - 1);
      activeIndexRef.current = clamped;
      setActiveIndex(clamped);
      scheduleAutoAdvance();
    },
    [cardWidth, scheduleAutoAdvance],
  );

  const handleScrollBeginDrag = useCallback(() => {
    clearAutoAdvance();
  }, [clearAutoAdvance]);

  return (
    <View
      style={[styles.carouselColumn, { gap: 8 * scale, paddingHorizontal: 16 * scale }]}
      onLayout={handleLayout}>
      {cardWidth > 0 ? (
        <>
          <ScrollView
            ref={scrollRef}
            horizontal
            pagingEnabled
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            onScrollBeginDrag={handleScrollBeginDrag}
            onMomentumScrollEnd={handleMomentumScrollEnd}
            onScrollEndDrag={handleMomentumScrollEnd}
            style={{ width: cardWidth }}
            contentContainerStyle={{ alignItems: 'stretch' }}>
            <View style={{ width: cardWidth }}>
              <BulkWeightEstimateCard scale={scale} />
            </View>
            <View style={{ width: cardWidth }}>
              <BulkPriceEstimateCard scale={scale} ratePerKg={ratePerKg} />
            </View>
          </ScrollView>
          <InfoCarouselPagination activeIndex={activeIndex} scale={scale} />
        </>
      ) : (
        <BulkWeightEstimateCard scale={scale} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  carouselColumn: {
    width: '100%',
    alignItems: 'center',
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
  asteriskWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  asterisk: {
    color: SwashoColors.info700,
    textAlign: 'center',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paginationDot: {},
});
