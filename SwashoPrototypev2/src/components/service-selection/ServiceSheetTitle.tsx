import { StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';

import { SubscriptionOfferBadge } from './SubscriptionOfferBadge';

type ServiceSheetTitleProps = {
  garmentLabel: string;
  showOfferBadge?: boolean;
  offerMessage?: string;
  scale: number;
};

export function ServiceSheetTitle({
  garmentLabel,
  showOfferBadge = true,
  offerMessage,
  scale,
}: ServiceSheetTitleProps) {
  return (
    <View style={[styles.column, { gap: 12 * scale }]}>
      <View style={{ width: '100%', paddingLeft: 20 * scale }}>
        <Text
          style={[
            searchFont('medium'),
            styles.title,
            { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
          ]}>
          {garmentLabel}
        </Text>
      </View>
      {showOfferBadge ? <SubscriptionOfferBadge message={offerMessage} scale={scale} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    width: '100%',
    alignItems: 'center',
  },
  title: {
    color: SwashoColors.neutral600,
    textAlign: 'center',
  },
});
