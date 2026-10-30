import { StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';

import { ServiceSelectionButton } from './ServiceSelectionButton';
import { ServiceSelectionStickyDeleteButton } from './ServiceSelectionStickyDeleteButton';

type ServiceSelectionStickyBarProps = {
  itemCount: number;
  itemLabel?: string;
  summaryLine?: string;
  confirmLabel?: string;
  totalPrice?: number | string;
  disabled?: boolean;
  loading?: boolean;
  onConfirm?: () => void;
  onDelete?: () => void;
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
  onDelete,
  scale,
}: ServiceSelectionStickyBarProps) {
  const confirmDisabled = disabled ?? itemCount <= 0;

  return (
    <View
      style={[
        styles.bar,
        {
          paddingHorizontal: 16 * scale,
          paddingVertical: 8 * scale,
          gap: 22 * scale,
        },
      ]}>
      {onDelete ? <ServiceSelectionStickyDeleteButton scale={scale} onPress={onDelete} /> : null}
      <View style={[styles.barMain, { gap: 12 * scale }]}>
      <View style={[styles.summary, { gap: 4 * scale }]}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: SwashoColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  barMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    minWidth: 0,
  },
  summary: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  itemCount: {
    color: SwashoColors.darkHeaderText,
  },
  summaryLine: {
    color: SwashoColors.neutral600,
  },
});
