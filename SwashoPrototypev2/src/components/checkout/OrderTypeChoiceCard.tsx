import { Pressable, StyleSheet, Text, View } from 'react-native';

import { CalendarLinearIcon } from '@/components/home/figma-icons';
import { figmaShadow, FigmaShadows } from '@/components/home/figma-shadows';
import { searchFont } from '@/components/search/search-fonts';
import type { ProviderOrderFulfillmentMode } from '@/lib/checkout-flow';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

type OrderTypeChoiceCardProps = {
  mode: ProviderOrderFulfillmentMode;
  title: string;
  description: string;
  selected: boolean;
  onSelect: () => void;
  scale: number;
};

export function OrderTypeChoiceCard({
  mode,
  title,
  description,
  selected,
  onSelect,
  scale,
}: OrderTypeChoiceCardProps) {
  const isSubscribe = mode === 'subscribe';

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${title}. ${description}`}
      onPress={onSelect}
      style={({ pressed }) => [
        styles.card,
        selected && styles.cardSelected,
        isSubscribe && selected && styles.cardSubscribeSelected,
        {
          borderRadius: SwashoRadii.lg * scale,
          paddingHorizontal: 16 * scale,
          paddingVertical: 16 * scale,
          gap: 12 * scale,
          opacity: pressed ? 0.92 : 1,
          ...(selected ? figmaShadow(FigmaShadows.providerCard, scale) : {}),
        },
      ]}>
      <View style={[styles.row, { gap: 12 * scale }]}>
        {isSubscribe ? (
          <CalendarLinearIcon width={28 * scale} height={28 * scale} style={{ opacity: selected ? 1 : 0.85 }} />
        ) : (
          <View
            style={[
              styles.oneTimeBadge,
              {
                width: 28 * scale,
                height: 28 * scale,
                borderRadius: 14 * scale,
              },
            ]}>
            <Text style={[searchFont('semibold'), styles.oneTimeBadgeLabel, { fontSize: 14 * scale }]}>1</Text>
          </View>
        )}
        <View style={[styles.copy, { gap: 6 * scale, flex: 1 }]}>
          <Text
            style={[
              searchFont('semibold'),
              isSubscribe && selected ? styles.titleOnSubscribe : styles.title,
              { fontSize: 16 * scale, lineHeight: 18 * scale, letterSpacing: 0.3 * scale },
            ]}>
            {title}
          </Text>
          <Text
            style={[
              searchFont('medium'),
              isSubscribe && selected ? styles.descriptionOnSubscribe : styles.description,
              { fontSize: 13 * scale, lineHeight: 18 * scale, letterSpacing: 0.5 * scale },
            ]}>
            {description}
          </Text>
        </View>
        <View
          style={[
            styles.radioOuter,
            selected && styles.radioOuterSelected,
            {
              width: 20 * scale,
              height: 20 * scale,
              borderRadius: 10 * scale,
              borderWidth: 1.5 * scale,
            },
          ]}>
          {selected ? (
            <View
              style={{
                width: 10 * scale,
                height: 10 * scale,
                borderRadius: 5 * scale,
                backgroundColor: isSubscribe && selected ? SwashoColors.surface : SwashoColors.primary600,
              }}
            />
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: SwashoColors.surface,
    borderWidth: 1,
    borderColor: SwashoColors.neutral200,
    width: '100%',
  },
  cardSelected: {
    borderWidth: 1.5,
    borderColor: SwashoColors.primary600,
  },
  cardSubscribeSelected: {
    backgroundColor: SwashoColors.primary600,
    borderColor: SwashoColors.primary600,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  copy: {
    minWidth: 0,
  },
  title: {
    color: SwashoColors.neutral950,
  },
  titleOnSubscribe: {
    color: SwashoColors.primary100,
  },
  description: {
    color: SwashoColors.neutral600,
  },
  descriptionOnSubscribe: {
    color: SwashoColors.primary100,
  },
  oneTimeBadge: {
    backgroundColor: SwashoColors.primary50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  oneTimeBadgeLabel: {
    color: SwashoColors.primary600,
  },
  radioOuter: {
    borderColor: SwashoColors.neutral300,
    backgroundColor: SwashoColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: SwashoColors.primary600,
  },
});
