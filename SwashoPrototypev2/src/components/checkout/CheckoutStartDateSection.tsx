import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CalendarLinearIcon } from '@/components/home/figma-icons';
import { searchFont } from '@/components/search/search-fonts';
import { checkoutDaysForCalendarPick, type CheckoutDayOption } from '@/lib/checkout-flow';
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
  const [displayDays, setDisplayDays] = useState(days);

  useEffect(() => {
    setDisplayDays(days);
  }, [days]);

  const handleCalendarSelect = (day: CheckoutDayOption) => {
    setDisplayDays(checkoutDaysForCalendarPick(days, day));
    onSelectDay(day);
  };

  const handleChipSelect = (day: CheckoutDayOption) => {
    const inBaseline = days.some((option) => option.key === day.key);
    if (inBaseline) {
      setDisplayDays(days);
    }
    onSelectDay(day);
  };

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
            style={({ pressed }) => [
              styles.calendarButton,
              {
                width: 24 * scale,
                height: 24 * scale,
                opacity: pressed ? 0.85 : 1,
              },
            ]}>
            <CalendarLinearIcon
              width={24 * scale}
              height={24 * scale}
              stroke={SwashoColors.primary600}
            />
          </Pressable>
        </View>
        <View style={[styles.scrollClip, { width: cardWidth, maxWidth: cardWidth }]}>
          <CheckoutWeekdayScrollRow
            days={displayDays}
            selectedKey={selectedKey}
            onSelectDay={handleChipSelect}
            scale={scale}
            viewportWidth={cardWidth}
          />
        </View>
      </View>

      {calendarOpen ? (
        <CheckoutStartDateCalendarModal
          key={selectedKey ?? days[0]?.key ?? 'start'}
          visible
          onClose={() => setCalendarOpen(false)}
          days={displayDays}
          selectedKey={selectedKey}
          onSelectDay={handleCalendarSelect}
          scale={scale}
        />
      ) : null}
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
  calendarButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
