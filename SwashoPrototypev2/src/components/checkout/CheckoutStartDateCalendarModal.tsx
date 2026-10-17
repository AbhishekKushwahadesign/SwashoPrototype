import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import type { CheckoutDayOption } from '@/lib/checkout-flow';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

const WEEKDAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

type CheckoutStartDateCalendarModalProps = {
  visible: boolean;
  onClose: () => void;
  days: CheckoutDayOption[];
  selectedKey: string | null;
  onSelectDay: (day: CheckoutDayOption) => void;
  scale: number;
};

type CalendarCell =
  | { kind: 'empty' }
  | { kind: 'day'; option: CheckoutDayOption; disabled: boolean };

function monthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1);
}

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function buildMonthCells(month: Date, dayByKey: Map<string, CheckoutDayOption>): CalendarCell[] {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  const firstWeekday = new Date(year, monthIndex, 1).getDay();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: CalendarCell[] = [];

  for (let i = 0; i < firstWeekday; i += 1) {
    cells.push({ kind: 'empty' });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const key = new Date(year, monthIndex, day).toISOString().slice(0, 10);
    const option = dayByKey.get(key);
    if (option) {
      cells.push({ kind: 'day', option, disabled: false });
    } else {
      cells.push({ kind: 'empty' });
    }
  }

  while (cells.length % 7 !== 0) {
    cells.push({ kind: 'empty' });
  }

  return cells;
}

export function CheckoutStartDateCalendarModal({
  visible,
  onClose,
  days,
  selectedKey,
  onSelectDay,
  scale,
}: CheckoutStartDateCalendarModalProps) {
  const dayByKey = useMemo(() => new Map(days.map((day) => [day.key, day])), [days]);

  const initialMonth = useMemo(() => {
    if (selectedKey && dayByKey.has(selectedKey)) {
      const date = new Date(selectedKey);
      return monthStart(date);
    }
    if (days.length > 0) {
      return monthStart(new Date(days[0].key));
    }
    return monthStart(new Date());
  }, [dayByKey, days, selectedKey]);

  const [visibleMonth, setVisibleMonth] = useState(initialMonth);

  useEffect(() => {
    if (visible) {
      setVisibleMonth(initialMonth);
    }
  }, [initialMonth, visible]);

  const monthKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const day of days) {
      const date = new Date(day.key);
      keys.add(`${date.getFullYear()}-${date.getMonth()}`);
    }
    return keys;
  }, [days]);

  const cells = useMemo(
    () => buildMonthCells(visibleMonth, dayByKey),
    [dayByKey, visibleMonth],
  );

  const canGoPrev = [...monthKeys].some((key) => {
    const [y, m] = key.split('-').map(Number);
    return y < visibleMonth.getFullYear() || (y === visibleMonth.getFullYear() && m < visibleMonth.getMonth());
  });
  const canGoNext = [...monthKeys].some((key) => {
    const [y, m] = key.split('-').map(Number);
    return y > visibleMonth.getFullYear() || (y === visibleMonth.getFullYear() && m > visibleMonth.getMonth());
  });

  const cardWidth = 340 * scale;
  const cellSize = 40 * scale;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <Pressable accessibilityRole="button" accessibilityLabel="Close calendar" onPress={onClose} style={styles.scrim}>
        <View style={styles.centerWrap} pointerEvents="box-none">
          <Pressable
            accessibilityRole="none"
            onPress={(event) => event.stopPropagation()}
            style={[
              styles.card,
              {
                width: cardWidth,
                borderRadius: SwashoRadii.lg * scale,
                padding: 16 * scale,
                gap: 12 * scale,
              },
            ]}>
            <View style={[styles.monthRow, { gap: 8 * scale }]}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Previous month"
                disabled={!canGoPrev}
                onPress={() => setVisibleMonth((current) => addMonths(current, -1))}
                style={({ pressed }) => [
                  styles.monthNav,
                  { opacity: !canGoPrev ? 0.3 : pressed ? 0.7 : 1 },
                ]}>
                <Text style={[searchFont('semibold'), styles.monthNavLabel, { fontSize: 18 * scale }]}>‹</Text>
              </Pressable>
              <Text
                style={[
                  searchFont('medium'),
                  styles.monthTitle,
                  { fontSize: 16 * scale, lineHeight: 20 * scale, flex: 1, textAlign: 'center' },
                ]}>
                {formatMonthYear(visibleMonth)}
              </Text>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Next month"
                disabled={!canGoNext}
                onPress={() => setVisibleMonth((current) => addMonths(current, 1))}
                style={({ pressed }) => [
                  styles.monthNav,
                  { opacity: !canGoNext ? 0.3 : pressed ? 0.7 : 1 },
                ]}>
                <Text style={[searchFont('semibold'), styles.monthNavLabel, { fontSize: 18 * scale }]}>›</Text>
              </Pressable>
            </View>

            <View style={[styles.weekHeader, { gap: 4 * scale }]}>
              {WEEKDAY_HEADERS.map((label) => (
                <Text
                  key={label}
                  style={[
                    searchFont('medium'),
                    styles.weekHeaderLabel,
                    { width: cellSize, fontSize: 11 * scale, textAlign: 'center' },
                  ]}>
                  {label}
                </Text>
              ))}
            </View>

            <View style={[styles.grid, { gap: 4 * scale }]}>
              {cells.map((cell, index) => {
                if (cell.kind === 'empty') {
                  return <View key={`empty-${index}`} style={{ width: cellSize, height: cellSize }} />;
                }
                const selected = selectedKey === cell.option.key;
                return (
                  <Pressable
                    key={cell.option.key}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => {
                      onSelectDay(cell.option);
                      onClose();
                    }}
                    style={({ pressed }) => [
                      styles.dayCell,
                      selected && styles.dayCellSelected,
                      {
                        width: cellSize,
                        height: cellSize,
                        borderRadius: SwashoRadii.md * scale,
                        opacity: pressed ? 0.9 : 1,
                      },
                    ]}>
                    <Text
                      style={[
                        searchFont(selected ? 'semibold' : 'medium'),
                        selected ? styles.daySelected : styles.dayLabel,
                        { fontSize: 14 * scale },
                      ]}>
                      {cell.option.dayOfMonth}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    backgroundColor: SwashoColors.modalScrim,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  centerWrap: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: SwashoColors.surface,
    maxWidth: '100%',
  },
  monthRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthNav: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthNavLabel: {
    color: SwashoColors.primary600,
  },
  monthTitle: {
    color: SwashoColors.darkHeaderText,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weekHeaderLabel: {
    color: SwashoColors.neutral600,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  dayCell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCellSelected: {
    backgroundColor: SwashoColors.primary100,
    borderWidth: 1,
    borderColor: SwashoColors.primary600,
  },
  dayLabel: {
    color: SwashoColors.darkHeaderText,
  },
  daySelected: {
    color: SwashoColors.primary600,
  },
});
