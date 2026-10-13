import { StyleSheet, View } from 'react-native';

import { ServiceGarmentRow } from './ServiceGarmentRow';

type ServiceComboDetailCardProps = {
  title: string;
  amount: number | string;
  unit?: string;
  quantity: number;
  disabled?: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
  scale: number;
};

export function ServiceComboDetailCard({
  title,
  amount,
  unit,
  quantity,
  disabled = false,
  onIncrement,
  onDecrement,
  scale,
}: ServiceComboDetailCardProps) {
  return (
    <View style={[styles.card, { width: 366 * scale }]}>
      <ServiceGarmentRow
        title={title}
        amount={amount}
        unit={unit}
        state="quantity"
        quantity={quantity}
        disabled={disabled}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        scale={scale}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
  },
});
