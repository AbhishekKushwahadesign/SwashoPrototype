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

const CARD_HEIGHT = 157;
const HEADER_WIDTH = 346;
const TIMELINE_WIDTH = 344.584;
const TIMELINE_HEIGHT = 59;

// Absolute square positions inside Frame 98 (parent offset + inner frame offset).
const PICKUP_SQUARE = { left: 15.792, top: 2, size: 36 };
const LAUNDRY_SQUARE = { left: 21.376, top: 1, size: 38 };
const RIDER_SQUARE = { left: 28.668, top: 0, size: 40 };
const DELIVERED_SQUARE = { left: 284.792, top: 0.033, size: 40 };
const LINE = { left: 69, top: 33, width: 227 };
const MINS_AWAY = { left: 127.584, top: 11, width: 90 };
const OUT_FOR_DELIVERY_LABEL = { left: 4.168, top: 48, width: 89 };

export function OrderCard({ scale, onTrackPress }: OrderCardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          height: CARD_HEIGHT * scale,
          borderRadius: SwashoRadii.lg * scale,
          ...figmaShadow(FigmaShadows.orderCard, scale),
        },
      ]}>
      <View
        style={[
          styles.content,
          {
            paddingHorizontal: 13 * scale,
            paddingTop: 6 * scale,
            paddingBottom: 8 * scale,
            gap: 8 * scale,
          },
        ]}>
        <View style={{ gap: 20 * scale, width: HEADER_WIDTH * scale, alignSelf: 'center' }}>
          <View style={[styles.headerRow, { paddingRight: 5 * scale, width: HEADER_WIDTH * scale }]}>
            <Text style={[styles.delivery, { fontSize: 13 * scale, lineHeight: 18 * scale, width: 105 * scale }]}>
              <Text style={{ fontFamily: 'Poppins_400Regular' }}>Delivering </Text>
              <Text style={{ fontFamily: 'Poppins_600SemiBold' }}>Today by 6pm</Text>
            </Text>
            <Text style={[styles.orderId, { fontSize: 14 * scale, lineHeight: 18 * scale }]}>
              <Text style={{ fontFamily: 'Poppins_400Regular' }}>Order Id-</Text>
              <Text style={{ fontFamily: 'Poppins_600SemiBold', lineHeight: 14 * scale }}>9817</Text>
            </Text>
          </View>

          <View style={{ width: TIMELINE_WIDTH * scale, height: TIMELINE_HEIGHT * scale }}>
            <View style={StyleSheet.absoluteFill}>
              <View
                style={{
                  position: 'absolute',
                  left: LINE.left * scale,
                  top: LINE.top * scale,
                  width: LINE.width * scale,
                  height: 2 * scale,
                }}>
                <Line13Icon width={LINE.width * scale} height={2 * scale} />
              </View>

              <Text
                style={[
                  styles.minsAway,
                  {
                    position: 'absolute',
                    left: MINS_AWAY.left * scale,
                    top: MINS_AWAY.top * scale,
                    width: MINS_AWAY.width * scale,
                    fontSize: 13 * scale,
                    lineHeight: 16 * scale,
                  },
                ]}>
                20 mins away
              </Text>

              <View
                style={[
                  styles.stepSquare,
                  {
                    position: 'absolute',
                    left: PICKUP_SQUARE.left * scale,
                    top: PICKUP_SQUARE.top * scale,
                    width: PICKUP_SQUARE.size * scale,
                    height: PICKUP_SQUARE.size * scale,
                    borderRadius: SwashoRadii.lg * scale,
                    backgroundColor: SwashoColors.neutral200,
                    ...figmaShadow(FigmaShadows.pickupMark, scale),
                  },
                ]}>
                <CheckSquareIcon
                  width={43.2 * scale}
                  height={43.2 * scale}
                  style={{ position: 'absolute', left: -3.6 * scale, top: -3.6 * scale }}
                />
              </View>

              <View
                style={[
                  styles.stepSquare,
                  {
                    position: 'absolute',
                    left: LAUNDRY_SQUARE.left * scale,
                    top: LAUNDRY_SQUARE.top * scale,
                    width: LAUNDRY_SQUARE.size * scale,
                    height: LAUNDRY_SQUARE.size * scale,
                    borderRadius: SwashoRadii.lg * scale,
                    backgroundColor: SwashoColors.neutral200,
                    ...figmaShadow(FigmaShadows.underLaundryMark, scale),
                  },
                ]}>
                <CheckSquare2Icon
                  width={45.6 * scale}
                  height={45.6 * scale}
                  style={{ position: 'absolute', left: -4.38 * scale, top: -4 * scale }}
                />
              </View>

              <View
                style={[
                  styles.stepSquareActive,
                  {
                    position: 'absolute',
                    left: RIDER_SQUARE.left * scale,
                    top: RIDER_SQUARE.top * scale,
                    width: RIDER_SQUARE.size * scale,
                    height: RIDER_SQUARE.size * scale,
                    borderRadius: SwashoRadii.lg * scale,
                    ...figmaShadow(FigmaShadows.outForDelivery, scale),
                  },
                ]}>
                <Image
                  source={require('@/assets/images/home/rider.png')}
                  style={{
                    position: 'absolute',
                    left: 3.208 * scale,
                    top: 5.518 * scale,
                    width: 32.214 * scale,
                    height: 37.072 * scale,
                    transform: [{ rotate: '-7.24deg' }],
                  }}
                  contentFit="contain"
                />
              </View>

              <Text
                style={[
                  styles.outForDelivery,
                  {
                    position: 'absolute',
                    left: OUT_FOR_DELIVERY_LABEL.left * scale,
                    top: OUT_FOR_DELIVERY_LABEL.top * scale,
                    width: OUT_FOR_DELIVERY_LABEL.width * scale,
                    fontSize: 13 * scale,
                    lineHeight: 16 * scale,
                  },
                ]}>
                Out for delivery
              </Text>

              <View
                style={[
                  styles.stepSquare,
                  {
                    position: 'absolute',
                    left: DELIVERED_SQUARE.left * scale,
                    top: DELIVERED_SQUARE.top * scale,
                    width: DELIVERED_SQUARE.size * scale,
                    height: DELIVERED_SQUARE.size * scale,
                    borderRadius: SwashoRadii.lg * scale,
                    backgroundColor: SwashoColors.surface,
                    ...figmaShadow(FigmaShadows.deliveredMark, scale),
                  },
                ]}>
                <Image
                  source={require('@/assets/images/home/swasho-package.png')}
                  style={{
                    position: 'absolute',
                    left: 7.792 * scale,
                    top: 7.967 * scale,
                    width: 24 * scale,
                    height: 25 * scale,
                  }}
                  contentFit="contain"
                />
              </View>
            </View>
          </View>
        </View>

        <TertiaryButton label="Track" variant="accent" showTrailingIcon onPress={onTrackPress} scale={scale} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: SwashoColors.surface,
    width: '100%',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  delivery: {
    color: '#000000',
    letterSpacing: 0.5,
  },
  orderId: {
    color: '#000000',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
  stepSquare: {
    overflow: 'hidden',
  },
  stepSquareActive: {
    backgroundColor: SwashoColors.surface,
    overflow: 'hidden',
  },
  minsAway: {
    fontFamily: 'Poppins_400Regular',
    color: '#000000',
    textAlign: 'center',
    letterSpacing: 0,
  },
  outForDelivery: {
    fontFamily: 'Poppins_500Medium',
    color: SwashoColors.darkHeaderText,
    textAlign: 'center',
    letterSpacing: 0.4655,
  },
});
