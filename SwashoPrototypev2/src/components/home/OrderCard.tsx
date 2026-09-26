import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { CheckSquare2Icon, CheckSquareIcon, Line13Icon } from './figma-icons';

import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { TertiaryButton } from './TertiaryButton';
import { FigmaShadows, figmaShadow } from './figma-shadows';

type OrderCardProps = {
  scale: number;
  onTrackPress?: () => void;
};

export function OrderCard({ scale, onTrackPress }: OrderCardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          borderRadius: SwashoRadii.lg * scale,
          paddingHorizontal: 13 * scale,
          paddingTop: 6 * scale,
          paddingBottom: 8 * scale,
          ...figmaShadow(FigmaShadows.orderCard, scale),
        },
      ]}>
      <View style={{ gap: 20 * scale }}>
        <View style={[styles.headerRow, { paddingRight: 5 * scale }]}>
          <Text style={[styles.delivery, { fontSize: 13 * scale, lineHeight: 18 * scale }]}>
            <Text style={{ fontFamily: 'Poppins_400Regular' }}>Delivering </Text>
            <Text style={{ fontFamily: 'Poppins_500Medium' }}> </Text>
            <Text style={{ fontFamily: 'Poppins_600SemiBold' }}>Today by 6pm</Text>
          </Text>
          <Text style={[styles.orderId, { fontSize: 14 * scale, lineHeight: 18 * scale }]}>
            <Text style={{ fontFamily: 'Poppins_400Regular', lineHeight: 18 * scale }}>Order Id-</Text>
            <Text style={{ fontFamily: 'Poppins_600SemiBold', lineHeight: 14 * scale }}>9817 </Text>
          </Text>
        </View>

        <View style={{ gap: 8 * scale }}>
          <View style={styles.progressRow}>
            <View
              style={[
                styles.stepCircle,
                {
                  width: 36 * scale,
                  height: 36 * scale,
                  borderRadius: 12 * scale,
                  backgroundColor: SwashoColors.neutral200,
                  ...figmaShadow(FigmaShadows.pickupMark, scale),
                },
              ]}>
              <CheckSquareIcon width={43 * scale} height={43 * scale} style={{ position: 'absolute', left: -4 * scale, top: -4 * scale }} />
            </View>
            <Line13Icon width={229 * scale} height={2 * scale} style={{ flex: 1, minWidth: 40 * scale }} />
            <View
              style={[
                styles.stepCircle,
                {
                  width: 38 * scale,
                  height: 38 * scale,
                  borderRadius: 12 * scale,
                  backgroundColor: SwashoColors.neutral200,
                  ...figmaShadow(FigmaShadows.underLaundryMark, scale),
                },
              ]}>
              <CheckSquare2Icon width={45 * scale} height={45 * scale} style={{ position: 'absolute', left: -4 * scale, top: -4 * scale }} />
            </View>
            <View
              style={[
                styles.stepCircleActive,
                {
                  width: 40 * scale,
                  height: 40 * scale,
                  borderRadius: 12 * scale,
                  ...figmaShadow(FigmaShadows.outForDelivery, scale),
                },
              ]}>
              <Image
                source={require('@/assets/images/home/rider.png')}
                style={{ width: 28 * scale, height: 34 * scale, transform: [{ rotate: '-7.24deg' }] }}
                contentFit="contain"
              />
            </View>
            <View
              style={[
                styles.stepCircle,
                {
                  width: 40 * scale,
                  height: 40 * scale,
                  borderRadius: 12 * scale,
                  backgroundColor: '#ffffff',
                  ...figmaShadow(FigmaShadows.deliveredMark, scale),
                },
              ]}>
              <Image
                source={require('@/assets/images/home/swasho-package.png')}
                style={{ width: 24 * scale, height: 25 * scale }}
                contentFit="contain"
              />
            </View>
          </View>
          <View style={styles.progressLabels}>
            <Text style={[styles.minsAway, { fontSize: 13 * scale, lineHeight: 16 * scale }]}>20 mins away</Text>
            <Text style={[styles.outForDelivery, { fontSize: 13 * scale, lineHeight: 16 * scale, width: 89 * scale }]}>
              Out for delivery
            </Text>
          </View>
        </View>

        <View style={styles.trackRow}>
          <TertiaryButton label="Track" variant="accent" showTrailingIcon onPress={onTrackPress} scale={scale} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: SwashoColors.surface,
    width: '100%',
    alignSelf: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  delivery: {
    color: '#000000',
    letterSpacing: 0.5,
    flex: 1,
  },
  orderId: {
    color: '#000000',
    letterSpacing: 0.5,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  stepCircleActive: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  minsAway: {
    fontFamily: 'Poppins_400Regular',
    color: '#000000',
    textAlign: 'center',
    flex: 1,
  },
  outForDelivery: {
    fontFamily: 'Poppins_500Medium',
    color: SwashoColors.darkHeaderText,
    textAlign: 'center',
    letterSpacing: 0.4655,
  },
  trackRow: {
    alignItems: 'flex-end',
  },
});
