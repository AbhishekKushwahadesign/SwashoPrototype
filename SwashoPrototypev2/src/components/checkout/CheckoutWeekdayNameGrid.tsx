import { Pressable, StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { CHECKOUT_WEEKDAY_OPTIONS, type CheckoutWeekdayId } from '@/lib/checkout-flow';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

const CHIP_WIDTH = 65.089;
const COLUMN_GAP = 12;
const ROW_GAP = 16;

type CheckoutWeekdayNameGridProps = {
  selectedWeekdays: CheckoutWeekdayId[];
  onToggleWeekday: (id: CheckoutWeekdayId) => void;
  scale: number;
};

/** Figma 3346:13291 — Mon–Sun name chips (subscription pickup days). */
export function CheckoutWeekdayNameGrid({
  selectedWeekdays,
  onToggleWeekday,
  scale,
}: CheckoutWeekdayNameGridProps) {
  return (
    <View
      style={[
        styles.grid,
        {
          columnGap: COLUMN_GAP * scale,
          rowGap: ROW_GAP * scale,
          paddingVertical: 8.011 * scale,
          maxWidth: 374 * scale,
        },
      ]}>
      {CHECKOUT_WEEKDAY_OPTIONS.map((day) => {
        const selected = selectedWeekdays.includes(day.id);
        return (
          <Pressable
            key={day.id}
            accessibilityRole="button"
            accessibilityState={{ selected }}
            accessibilityLabel={day.label}
            onPress={() => onToggleWeekday(day.id)}
            style={({ pressed }) => [
              styles.chip,
              selected && styles.chipSelected,
              {
                width: CHIP_WIDTH * scale,
                paddingHorizontal: 16.022 * scale,
                paddingVertical: 10.014 * scale,
                borderRadius: SwashoRadii.md * scale,
                borderWidth: (selected ? 1.502 : 1.001) * scale,
                opacity: pressed ? 0.92 : 1,
              },
            ]}>
            <Text
              style={[
                searchFont('semibold'),
                selected ? styles.labelSelected : styles.label,
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
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
    alignSelf: 'center',
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
  label: {
    color: SwashoColors.darkHeaderText,
  },
  labelSelected: {
    color: SwashoColors.primary600,
    textAlign: 'center',
  },
});
