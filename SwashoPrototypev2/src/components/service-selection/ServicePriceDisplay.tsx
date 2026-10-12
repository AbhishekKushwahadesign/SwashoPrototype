import { StyleSheet, Text } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoFonts } from '@/constants/swasho-tokens';

type ServicePriceDisplayProps = {
  amount: number | string;
  unit?: string;
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
  titleVariant = 'compact',
  scale,
}: ServicePriceDisplayProps) {
  const priceFontSize = (titleVariant === 'compact' ? 14 : 16) * scale;
  const priceLineHeight = (titleVariant === 'compact' ? 12 : 14) * scale;

  return (
    <Text
      style={[
        titleVariant === 'default' ? styles.priceRegular : searchFont('medium'),
        styles.price,
        { fontSize: priceFontSize, lineHeight: priceLineHeight, letterSpacing: 0.5 * scale },
      ]}>
      {`${formatPrice(amount)}/${unit} `}
    </Text>
  );
}

const styles = StyleSheet.create({
  price: {
    color: SwashoColors.neutral900,
  },
  priceRegular: {
    fontFamily: SwashoFonts.poppinsRegular,
  },
});
