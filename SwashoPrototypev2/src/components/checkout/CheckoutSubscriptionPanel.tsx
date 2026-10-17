import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AltArrowDownIcon } from '@/components/home/figma-icons';
import { figmaShadow, FigmaShadows } from '@/components/home/figma-shadows';
import { InfoCircleIcon } from '@/components/service-selection/service-selection-icons';
import {
  SUBSCRIPTION_FREQUENCY_OPTIONS,
  type SubscriptionFrequencyOption,
} from '@/lib/checkout-flow';
import { CHECKOUT_SCHEDULE_CARD_WIDTH } from '@/lib/checkout-figma-layout';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

/** Figma 3346:13424 — Popular badge on Frame 860 (once-weekly row) */
const POPULAR_BADGE_TOP = -12.6015625;
const POPULAR_BADGE_RIGHT = 12;
const POPULAR_BADGE_WIDTH = 74;
const POPULAR_BADGE_MIN_HEIGHT = 22;

type CheckoutSubscriptionPanelProps = {
  scale: number;
  selectedFrequency: SubscriptionFrequencyOption | null;
  onSelectFrequency: (id: SubscriptionFrequencyOption) => void;
};

function FrequencyOptionRow({
  option,
  selected,
  onSelect,
  scale,
}: {
  option: (typeof SUBSCRIPTION_FREQUENCY_OPTIONS)[number];
  selected: boolean;
  onSelect: () => void;
  scale: number;
}) {
  const borderWidth = (selected ? 1.5 : 0.95) * scale;

  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onSelect}
      style={({ pressed }) => [
        styles.frequencyRow,
        {
          borderWidth,
          borderColor: SwashoColors.neutral200,
          borderRadius: SwashoRadii.md * scale,
          paddingHorizontal: 16 * scale,
          paddingVertical: 12 * scale,
          opacity: pressed ? 0.92 : 1,
          overflow: 'visible',
        },
      ]}>
      {option.popular ? (
        <LinearGradient
          colors={['#14532b', '#16a34a']}
          start={{ x: 0.5, y: 1 }}
          end={{ x: 0.5, y: 0 }}
          style={[
            styles.popularBadge,
            {
              top: POPULAR_BADGE_TOP * scale,
              right: POPULAR_BADGE_RIGHT * scale,
              minWidth: POPULAR_BADGE_WIDTH * scale,
              minHeight: POPULAR_BADGE_MIN_HEIGHT * scale,
              paddingHorizontal: 12 * scale,
              paddingVertical: 4 * scale,
              borderBottomLeftRadius: SwashoRadii.md * scale,
              borderBottomRightRadius: SwashoRadii.md * scale,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              ...figmaShadow(FigmaShadows.providerCard, scale),
            },
          ]}>
          <Text
            style={[
              searchFont('medium'),
              styles.popularLabel,
              { fontSize: 12 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
            ]}>
            Popular
          </Text>
        </LinearGradient>
      ) : null}
      <View style={{ gap: 8 * scale, flex: 1 }}>
        <View style={[styles.titleRow, { gap: 8 * scale }]}>
          <Text
            style={[
              searchFont('semibold'),
              styles.frequencyTitle,
              { fontSize: 15 * scale, lineHeight: 14 * scale, letterSpacing: 0.3 * scale },
            ]}>
            {option.title}
          </Text>
          <InfoCircleIcon width={16 * scale} height={16 * scale} />
        </View>
        <Text
          style={[
            searchFont('medium'),
            styles.frequencyDescription,
            { fontSize: 13 * scale, lineHeight: 20 * scale, letterSpacing: 0.5 * scale },
          ]}>
          {option.description}
        </Text>
      </View>
    </Pressable>
  );
}

function CollapsedAccordionRow({ label, scale }: { label: string; scale: number }) {
  const cardWidth = CHECKOUT_SCHEDULE_CARD_WIDTH * scale;

  return (
    <View
      style={[
        styles.collapsedRow,
        {
          width: cardWidth,
          maxWidth: cardWidth,
          borderRadius: SwashoRadii.lg * scale,
          paddingVertical: 16 * scale,
          paddingHorizontal: 16 * scale,
          gap: 10 * scale,
          ...figmaShadow(FigmaShadows.checkoutScheduleCard, scale),
        },
      ]}>
      <Text
        style={[
          searchFont('medium'),
          styles.collapsedLabel,
          {
            fontSize: 16 * scale,
            lineHeight: 14 * scale,
            letterSpacing: 0.5 * scale,
            flex: 1,
            maxWidth: 326 * scale,
          },
        ]}>
        {label}
      </Text>
      <AltArrowDownIcon
        width={24 * scale}
        height={24 * scale}
        stroke={SwashoColors.neutral950}
      />
    </View>
  );
}

export function CheckoutSubscriptionPanel({
  scale,
  selectedFrequency,
  onSelectFrequency,
}: CheckoutSubscriptionPanelProps) {
  const cardWidth = CHECKOUT_SCHEDULE_CARD_WIDTH * scale;

  return (
    <View style={[styles.column, { width: cardWidth, gap: 12 * scale }]}>
      <View
        style={[
          styles.frequencyCard,
          {
            width: cardWidth,
            maxWidth: cardWidth,
            borderRadius: SwashoRadii.lg * scale,
            paddingVertical: 16 * scale,
            paddingHorizontal: 16 * scale,
            gap: 16 * scale,
            overflow: 'visible',
            ...figmaShadow(FigmaShadows.checkoutScheduleCard, scale),
          },
        ]}>
        <Text
          style={[
            searchFont('medium'),
            styles.panelTitle,
            {
              fontSize: 16 * scale,
              lineHeight: 14 * scale,
              letterSpacing: 0.5 * scale,
              alignSelf: 'stretch',
            },
          ]}>
          Choose your laundry frequency
        </Text>
        <View
          style={{
            gap: 16 * scale,
            width: '100%',
            maxWidth: 366 * scale,
            alignSelf: 'center',
            overflow: 'visible',
          }}>
          {SUBSCRIPTION_FREQUENCY_OPTIONS.map((option) => (
            <FrequencyOptionRow
              key={option.id}
              option={option}
              selected={selectedFrequency === option.id}
              onSelect={() => onSelectFrequency(option.id)}
              scale={scale}
            />
          ))}
        </View>
      </View>

      <CollapsedAccordionRow label="Choose Day & Time" scale={scale} />
      <CollapsedAccordionRow label="Start Date" scale={scale} />
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  frequencyCard: {
    backgroundColor: SwashoColors.surface,
    alignItems: 'stretch',
  },
  panelTitle: {
    color: SwashoColors.darkHeaderText,
    textAlign: 'left',
  },
  frequencyRow: {
    backgroundColor: SwashoColors.surface,
    position: 'relative',
    width: '100%',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  frequencyTitle: {
    color: SwashoColors.neutral950,
  },
  frequencyDescription: {
    color: SwashoColors.neutral600,
  },
  popularBadge: {
    position: 'absolute',
    zIndex: 1,
  },
  popularLabel: {
    color: '#f0fdf5',
  },
  collapsedRow: {
    backgroundColor: SwashoColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  collapsedLabel: {
    color: SwashoColors.darkHeaderText,
  },
});
