import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CalendarBoldIcon } from '@/components/home/figma-icons';
import { searchFont } from '@/components/search/search-fonts';
import type { CheckoutDayOption } from '@/lib/checkout-flow';
import { SwashoColors } from '@/constants/swasho-tokens';

import { CheckoutStartDateCalendarModal } from './CheckoutStartDateCalendarModal';
import { CheckoutWeekdayScrollRow } from './CheckoutWeekdayScrollRow';

type CheckoutStartDateSectionProps = {
  days: CheckoutDayOption[];
  selectedKey: string | null;
  onSelectDay: (day: CheckoutDayOption) => void;
  scale: number;
  cardWidth: number;
};

export function CheckoutStartDateSection({
  days,
  selectedKey,
  onSelectDay,
  scale,
  cardWidth,
}: CheckoutStartDateSectionProps) {
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <>
      <View style={{ width: '100%', gap: 16.022 * scale }}>
        <View
          style={[
            styles.headerRow,
            {
              paddingHorizontal: 16.022 * scale,
              gap: 10 * scale,
            },
          ]}>
          <Text
            style={[
              searchFont('medium'),
              styles.title,
              {
                fontSize: 16.022 * scale,
                lineHeight: 14.019 * scale,
                letterSpacing: 0.5007 * scale,
                flex: 1,
              },
            ]}>
            Start from
          </Text>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Open calendar to choose start date"
            onPress={() => setCalendarOpen(true)}
            hitSlop={8}
            style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }]}>
            <CalendarBoldIcon width={24 * scale} height={24 * scale} />
          </Pressable>
        </View>
        <View style={[styles.scrollClip, { width: cardWidth, maxWidth: cardWidth }]}>
          <CheckoutWeekdayScrollRow
            days={days}
            selectedKey={selectedKey}
            onSelectDay={onSelectDay}
            scale={scale}
            viewportWidth={cardWidth}
          />
        </View>
      </View>

      <CheckoutStartDateCalendarModal
        visible={calendarOpen}
        onClose={() => setCalendarOpen(false)}
        days={days}
        selectedKey={selectedKey}
        onSelectDay={onSelectDay}
        scale={scale}
      />
    </>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  title: {
    color: SwashoColors.darkHeaderText,
    textAlign: 'left',
  },
  scrollClip: {
    alignSelf: 'center',
    overflow: 'hidden',
  },
});
