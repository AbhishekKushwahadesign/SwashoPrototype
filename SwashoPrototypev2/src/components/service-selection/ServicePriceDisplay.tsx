import { StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoFonts } from '@/constants/swasho-tokens';

type ServicePriceDisplayProps = {
  amount: number | string;
  unit?: string;
  subscriptionAmount?: number | string;
  titleVariant?: 'default' | 'compact';
  scale: number;
};

function formatPrice(amount: number | string) {
  if (typeof amount === 'number') {
    return `₹${amount}`;
  }
  return amount.startsWith('₹') ? amount : `₹${amount}`;
}

export function ServicePriceDisplay({
  amount,
  unit = 'pc',
  subscriptionAmount,
  titleVariant = 'default',
  scale,
}: ServicePriceDisplayProps) {
  const priceFontSize = (titleVariant === 'compact' ? 14 : 16) * scale;
  const priceLineHeight = (titleVariant === 'compact' ? 12 : 14) * scale;

  return (
    <View style={[styles.column, { gap: 12 * scale }]}>
      <Text
        style={[
          titleVariant === 'default' ? styles.priceRegular : searchFont('medium'),
          styles.price,
          { fontSize: priceFontSize, lineHeight: priceLineHeight, letterSpacing: 0.5 * scale },
        ]}>
        {`${formatPrice(amount)}/${unit} `}
      </Text>
      {subscriptionAmount != null ? (
        <Text style={[styles.subscription, { fontSize: 12 * scale, lineHeight: 10 * scale }]}>
          <Text style={searchFont('semibold')}>Sub</Text>
          {` ${formatPrice(subscriptionAmount)}/${unit}`}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    alignItems: 'flex-start',
  },
  price: {
    color: SwashoColors.neutral900,
  },
  priceRegular: {
    fontFamily: SwashoFonts.poppinsRegular,
  },
  subscription: {
    color: SwashoColors.neutral950,
    letterSpacing: 0.5,
  },
});
