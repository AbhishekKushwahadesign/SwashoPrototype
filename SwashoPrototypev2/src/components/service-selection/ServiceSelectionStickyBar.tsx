import { StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';

import { ServiceSelectionButton } from './ServiceSelectionButton';

type ServiceSelectionStickyBarProps = {
  itemCount: number;
  itemLabel?: string;
  summaryLine?: string;
  confirmLabel?: string;
  totalPrice?: number | string;
  disabled?: boolean;
  loading?: boolean;
  onConfirm?: () => void;
  scale: number;
};

function formatConfirmLabel(confirmLabel: string, totalPrice?: number | string) {
  if (totalPrice == null) {
    return confirmLabel;
  }
  const price = typeof totalPrice === 'number' ? `₹${totalPrice}` : totalPrice;
  return `${price} | ${confirmLabel}`;
}

export function ServiceSelectionStickyBar({
  itemCount,
  itemLabel = 'items',
  summaryLine,
  confirmLabel = 'Confirm',
  totalPrice,
  disabled,
  loading,
  onConfirm,
  scale,
}: ServiceSelectionStickyBarProps) {
  const confirmDisabled = disabled ?? itemCount <= 0;

  return (
    <View
      style={[
        styles.bar,
        {
          paddingLeft: 20 * scale,
          paddingRight: 11 * scale,
          paddingVertical: 8 * scale,
          gap: 20 * scale,
        },
      ]}>
      <View style={[styles.summary, { gap: 4 * scale, width: 156 * scale }]}>
        <Text
          style={[
            searchFont('semibold'),
            styles.itemCount,
            { fontSize: 15 * scale, lineHeight: 14 * scale, letterSpacing: 0.3 * scale },
          ]}>
          {`${itemCount} ${itemLabel} `}
        </Text>
        {summaryLine ? (
          <Text
            style={[
              searchFont('semibold'),
              styles.summaryLine,
              { fontSize: 14 * scale, lineHeight: 20 * scale, letterSpacing: 0.5 * scale },
            ]}>
            {summaryLine}
          </Text>
        ) : null}
      </View>
      <ServiceSelectionButton
        label={formatConfirmLabel(confirmLabel, totalPrice)}
        variant="primary"
        disabled={confirmDisabled}
        loading={loading}
        onPress={onConfirm}
        scale={scale}
        style={{ width: 199 * scale, flexShrink: 0 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: SwashoColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    width: '100%',
  },
  summary: {
    justifyContent: 'center',
  },
  itemCount: {
    color: SwashoColors.darkHeaderText,
  },
  summaryLine: {
    color: SwashoColors.neutral600,
  },
});
