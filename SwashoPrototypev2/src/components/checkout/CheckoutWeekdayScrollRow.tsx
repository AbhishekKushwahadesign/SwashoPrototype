import { Platform, Pressable, ScrollView, StyleSheet, Text } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import type { CheckoutDayOption } from '@/lib/checkout-flow';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

/** Figma 58965:2680 / 3346:13499 — horizontal scroll day picker */
/** Wide enough for top line `31 Dec` at 15px (was 65 — month was clipped). */
const CHIP_WIDTH = 82;
const CHIP_GAP = 12;
const CHIP_PADDING_X = 10.014;
const CHIP_PADDING_Y = 10.014;
const CHIP_INNER_GAP = 8;

type CheckoutWeekdayScrollRowProps = {
  days: CheckoutDayOption[];
  selectedKey: string | null;
  onSelectDay: (day: CheckoutDayOption) => void;
  scale: number;
  /** Width of the scroll viewport (card inner width). Prevents chips wrapping into one row on web. */
  viewportWidth?: number;
};

export function CheckoutWeekdayScrollRow({
  days,
  selectedKey,
  onSelectDay,
  scale,
  viewportWidth,
}: CheckoutWeekdayScrollRowProps) {
  const edgeInset = 16.022 * scale;

  return (
    <ScrollView
      horizontal
      nestedScrollEnabled
      showsHorizontalScrollIndicator={false}
      style={[
        styles.scroll,
        viewportWidth != null
          ? { width: viewportWidth, maxWidth: viewportWidth, alignSelf: 'center' }
          : { width: '100%', alignSelf: 'stretch' },
        Platform.OS === 'web' ? { overflowX: 'scroll' as const } : null,
      ]}
      contentContainerStyle={[
        styles.row,
        {
          gap: CHIP_GAP * scale,
          paddingVertical: 8.011 * scale,
          paddingHorizontal: edgeInset,
          flexWrap: 'nowrap',
        },
      ]}>
      {days.map((day) => {
        const selected = selectedKey === day.key;
        return (
          <Pressable
            key={day.key}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={`${day.dateLine} ${day.label}`}
            onPress={() => onSelectDay(day)}
            style={({ pressed }) => [
              styles.chip,
              selected && styles.chipSelected,
              {
                width: CHIP_WIDTH * scale,
                flexShrink: 0,
                paddingHorizontal: CHIP_PADDING_X * scale,
                paddingVertical: CHIP_PADDING_Y * scale,
                borderRadius: SwashoRadii.md * scale,
                borderWidth: (selected ? 1.502 : 1.001) * scale,
                gap: CHIP_INNER_GAP * scale,
                opacity: pressed ? 0.92 : 1,
                ...(Platform.OS === 'web' ? { boxSizing: 'border-box' as const } : null),
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
              {day.dateLine}
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
  scroll: {
    flexGrow: 0,
  },
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
