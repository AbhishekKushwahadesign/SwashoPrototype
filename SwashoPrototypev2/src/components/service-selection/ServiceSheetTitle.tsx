import { Platform, StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoFonts } from '@/constants/swasho-tokens';

import { SubscriptionOfferBadge } from './SubscriptionOfferBadge';

type ServiceSheetTitleProps = {
  garmentLabel: string;
  subtitle?: string;
  showOfferBadge?: boolean;
  offerMessage?: string;
  scale: number;
};

export function ServiceSheetTitle({
  garmentLabel,
  subtitle,
  showOfferBadge = true,
  offerMessage,
  scale,
}: ServiceSheetTitleProps) {
  const inset = 16 * scale;

  return (
    <View style={[styles.column, { gap: 12 * scale }]}>
      <View style={{ width: '100%', paddingHorizontal: inset, gap: 12 * scale }}>
        <Text
          style={[
            searchFont('medium'),
            styles.title,
            { fontSize: 16 * scale, lineHeight: 20 * scale, letterSpacing: 0.5 * scale },
          ]}>
          {garmentLabel}
        </Text>
        {subtitle ? (
          <Text
            style={[
              styles.subtitle,
              Platform.OS === 'web'
                ? { fontFamily: 'Poppins', fontWeight: '400' }
                : { fontFamily: SwashoFonts.poppinsRegular },
              { fontSize: 12 * scale, lineHeight: 20 * scale },
            ]}>
            {subtitle}
          </Text>
        ) : null}
        {showOfferBadge ? <SubscriptionOfferBadge message={offerMessage} scale={scale} /> : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    width: '100%',
    alignItems: 'flex-start',
  },
  title: {
    color: SwashoColors.neutral600,
    textAlign: 'left',
  },
  subtitle: {
    color: SwashoColors.neutral600,
    textAlign: 'left',
  },
});
