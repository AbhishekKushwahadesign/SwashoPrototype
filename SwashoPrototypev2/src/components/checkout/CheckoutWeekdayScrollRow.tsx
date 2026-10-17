import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import type { CheckoutDayOption } from '@/lib/checkout-flow';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

/** Figma 58965:2680 / 3346:13499 — horizontal scroll day picker */
const CHIP_WIDTH = 65.089;
const CHIP_GAP = 12;
const CHIP_PADDING_X = 16.022;
const CHIP_PADDING_Y = 10.014;
const CHIP_INNER_GAP = 8;

type CheckoutWeekdayScrollRowProps = {
  days: CheckoutDayOption[];
  selectedKey: string | null;
  onSelectDay: (day: CheckoutDayOption) => void;
  scale: number;
};

export function CheckoutWeekdayScrollRow({
  days,
  selectedKey,
  onSelectDay,
  scale,
}: CheckoutWeekdayScrollRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.row,
        {
          gap: CHIP_GAP * scale,
          paddingVertical: 8.011 * scale,
        },
      ]}>
      {days.map((day) => {
        const selected = selectedKey === day.key;
        return (
          <Pressable
            key={day.key}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`${day.label} ${day.dayOfMonth}`}
            onPress={() => onSelectDay(day)}
            style={({ pressed }) => [
              styles.chip,
              selected && styles.chipSelected,
              {
                width: CHIP_WIDTH * scale,
                paddingHorizontal: CHIP_PADDING_X * scale,
                paddingVertical: CHIP_PADDING_Y * scale,
                borderRadius: SwashoRadii.md * scale,
                borderWidth: (selected ? 1.502 : 1.001) * scale,
                gap: CHIP_INNER_GAP * scale,
                opacity: pressed ? 0.92 : 1,
              },
            ]}>
            <Text
              style={[
                searchFont('semibold'),
                selected ? styles.dateSelected : styles.date,
                {
                  fontSize: 15 * scale,
                  lineHeight: 14 * scale,
                  letterSpacing: 0.3 * scale,
                },
              ]}>
              {day.dayOfMonth}
            </Text>
            <Text
              style={[
                searchFont(selected ? 'semibold' : 'regular'),
                selected ? styles.daySelected : styles.day,
                {
                  fontSize: 15 * scale,
                  lineHeight: 14 * scale,
                  letterSpacing: 0.3 * scale,
                },
              ]}>
              {day.label}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  chip: {
    borderColor: SwashoColors.neutral200,
    backgroundColor: SwashoColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipSelected: {
    borderColor: SwashoColors.primary600,
    backgroundColor: SwashoColors.primary100,
  },
  day: {
    color: SwashoColors.neutral900,
  },
  daySelected: {
    color: SwashoColors.primary600,
    textAlign: 'center',
  },
  date: {
    color: SwashoColors.darkHeaderText,
  },
  dateSelected: {
    color: SwashoColors.primary600,
  },
});
