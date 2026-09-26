import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { FigmaShadows, figmaShadow } from './figma-shadows';

type BulkLaundryCardProps = {
  scale: number;
};

export function BulkLaundryCard({ scale }: BulkLaundryCardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          width: 181 * scale,
          height: 85 * scale,
          borderRadius: SwashoRadii.lg * scale,
          ...figmaShadow(FigmaShadows.bulkCard, scale),
        },
      ]}>
      <View style={[styles.left, { gap: 2 * scale, left: -4 * scale, top: -15 * scale, width: 81 * scale }]}>
        <View
          style={{
            width: 54.684 * scale,
            height: 64.478 * scale,
            overflow: 'hidden',
            alignSelf: 'center',
          }}>
          <Image
            source={require('@/assets/images/home/bulk-laundry.png')}
            style={{ width: '100%', height: '100%' }}
            contentFit="fill"
            contentPosition="bottom"
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={[styles.bulkLabel, { fontSize: 10 * scale, lineHeight: 12 * scale }]}>Bulk</Text>
          <Text style={[styles.bulkLabel, { fontSize: 10 * scale, lineHeight: 12 * scale }]}>Laundry</Text>
        </View>
      </View>
      <View
        style={[
          styles.right,
          { right: 10.58 * scale, gap: 38 * scale, transform: [{ translateY: -20 * scale }] },
        ]}>
        <Text style={[styles.savingsTitle, { fontSize: 12 * scale, lineHeight: 16 * scale, width: 91.5 * scale }]}>
          Big loads? Bigger savings!!
        </Text>
        <Text style={[styles.savingsAmount, { fontSize: 11 * scale, lineHeight: 14 * scale, width: 55 * scale }]}>
          <Text style={{ fontFamily: 'Poppins_500Medium' }}>Upto </Text>
          <Text style={{ fontFamily: 'Poppins_700Bold' }}>30%</Text>
          <Text style={{ fontFamily: 'Poppins_500Medium' }}> saving</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: SwashoColors.surface,
    overflow: 'visible',
  },
  left: {
    position: 'absolute',
    alignItems: 'center',
  },
  bulkLabel: {
    fontFamily: 'Poppins_600SemiBold',
    color: SwashoColors.darkHeaderText,
    textAlign: 'center',
  },
  right: {
    position: 'absolute',
    top: '50%',
    alignItems: 'flex-end',
  },
  savingsTitle: {
    fontFamily: 'Poppins_400Regular',
    color: '#000000',
    letterSpacing: 0.5,
  },
  savingsAmount: {
    color: SwashoColors.darkHeaderText,
  },
});
