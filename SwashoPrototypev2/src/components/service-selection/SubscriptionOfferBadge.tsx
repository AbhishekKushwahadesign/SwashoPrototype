import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { MoneyTagIcon } from './service-selection-icons';

type SubscriptionOfferBadgeProps = {
  message?: string;
  scale: number;
};

export function SubscriptionOfferBadge({
  message = 'Save more with subscription at checkout',
  scale,
}: SubscriptionOfferBadgeProps) {
  return (
    <LinearGradient
      colors={['#ece6fe', SwashoColors.surface]}
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[
        styles.wrap,
        {
          width: 373 * scale,
          borderTopLeftRadius: SwashoRadii.md * scale,
          borderBottomLeftRadius: SwashoRadii.md * scale,
          paddingHorizontal: 4 * scale,
          paddingVertical: 2 * scale,
          gap: 4 * scale,
        },
      ]}>
      <MoneyTagIcon width={20 * scale} height={20 * scale} />
      <View style={styles.textWrap}>
        <Text
          style={[
            searchFont('medium'),
            styles.text,
            { fontSize: 13 * scale, lineHeight: 10 * scale, letterSpacing: 0.5 * scale },
          ]}>
          {message}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textWrap: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: SwashoColors.primary600,
  },
});
