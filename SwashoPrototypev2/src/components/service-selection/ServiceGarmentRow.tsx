import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';

import { ServiceAddButton } from './ServiceAddButton';
import { ServicePriceDisplay } from './ServicePriceDisplay';
import { ServiceQuantitySelector } from './ServiceQuantitySelector';

export type ServiceGarmentRowState = 'idle' | 'quantity';

type ServiceGarmentRowProps = {
  title: string;
  amount: number | string;
  unit?: string;
  subscriptionAmount?: number | string;
  titleStyle?: 'semibold' | 'medium';
  state?: ServiceGarmentRowState;
  quantity?: number;
  addMode?: 'add' | 'select' | 'tertiary';
  titleFontSize?: 14 | 15 | 16;
  disabled?: boolean;
  onAddPress?: () => void;
  onIncrement?: () => void;
  onDecrement?: () => void;
  trailing?: ReactNode;
  scale: number;
};

export function ServiceGarmentRow({
  title,
  amount,
  unit,
  subscriptionAmount,
  titleStyle = 'semibold',
  state = 'idle',
  quantity = 0,
  addMode = 'add',
  titleFontSize,
  disabled = false,
  onAddPress,
  onIncrement,
  onDecrement,
  trailing,
  scale,
}: ServiceGarmentRowProps) {
  const resolvedTitleSize =
    titleFontSize ?? (titleStyle === 'semibold' ? 15 : titleStyle === 'medium' ? 14 : 15);
  const titleColor =
    titleStyle === 'semibold' ? SwashoColors.neutral950 : SwashoColors.neutral900;
  const priceVariant = resolvedTitleSize >= 16 ? 'default' : 'compact';

  const trailingNode =
    trailing ??
    (state === 'quantity' ? (
      <ServiceQuantitySelector
        value={quantity}
        disabled={disabled}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        scale={scale}
      />
    ) : (
      <ServiceAddButton mode={addMode} disabled={disabled} onPress={onAddPress} scale={scale} />
    ));

  return (
    <View
      style={[
        styles.row,
        {
          width: 366 * scale,
          paddingHorizontal: 8 * scale,
          gap: 12 * scale,
        },
      ]}>
      <View style={[styles.content, { gap: 12 * scale }]}>
        <Text
          style={[
            titleStyle === 'semibold' ? searchFont('semibold') : searchFont('medium'),
            styles.title,
            {
              fontSize: resolvedTitleSize * scale,
              lineHeight: (titleStyle === 'semibold' ? 14 : resolvedTitleSize >= 16 ? 14 : 12) * scale,
              letterSpacing: titleStyle === 'semibold' ? 0.3 * scale : 0.5 * scale,
              color: titleColor,
            },
          ]}>
          {title}
        </Text>
        <ServicePriceDisplay
          amount={amount}
          unit={unit}
          subscriptionAmount={subscriptionAmount}
          titleVariant={priceVariant}
          scale={scale}
        />
      </View>
      {trailingNode}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  title: {},
});
