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
                  left: 69 * scale,
                  top: 33 * scale,
                  width: 227 * scale,
                  height: 2 * scale,
                }}>
                <Line13Icon width={227 * scale} height={2 * scale} />
              </View>
              <Text
                style={[
                  styles.minsAway,
                  {
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 11 * scale,
                    fontSize: 13 * scale,
                    lineHeight: 16 * scale,
                  },
                ]}>
                20 mins away
              </Text>

              <View
                style={[
                  styles.stepCircle,
                  {
                    position: 'absolute',
                    left: 4 * scale,
                    top: 2 * scale,
                    width: 36 * scale,
                    height: 36 * scale,
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
                  styles.stepCircle,
                  {
                    position: 'absolute',
                    left: 10.58 * scale,
                    top: 1 * scale,
                    width: 38 * scale,
                    height: 38 * scale,
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
                style={{
                  position: 'absolute',
                  left: 4.17 * scale,
                  top: 0,
                  alignItems: 'center',
                  gap: 8 * scale,
                }}>
                <View
                  style={[
                    styles.stepCircleActive,
                    {
                      width: 40 * scale,
                      height: 40 * scale,
                      borderRadius: SwashoRadii.lg * scale,
                      ...figmaShadow(FigmaShadows.outForDelivery, scale),
                    },
                  ]}>
                  <Image
                    source={require('@/assets/images/home/rider.png')}
                    style={{
                      width: 28.181 * scale,
                      height: 33.79 * scale,
                      transform: [{ rotate: '-7.24deg' }],
                    }}
                    contentFit="contain"
                  />
                </View>
                <Text
                  style={[
                    styles.outForDelivery,
                    {
                      fontSize: 13 * scale,
                      lineHeight: 16 * scale,
                      width: 89 * scale,
                    },
                  ]}>
                  Out for delivery
                </Text>
              </View>

              <View
                style={[
                  styles.stepCircle,
                  {
                    position: 'absolute',
                    left: 275 * scale,
                    top: 0.03 * scale,
                    width: 40 * scale,
                    height: 40 * scale,
                    borderRadius: SwashoRadii.lg * scale,
                    backgroundColor: SwashoColors.surface,
                    ...figmaShadow(FigmaShadows.deliveredMark, scale),
                  },
                ]}>
                <Image
                  source={require('@/assets/images/home/swasho-package.png')}
                  style={{
                    position: 'absolute',
                    left: 7.79 * scale,
                    top: 7.97 * scale,
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
  stepCircle: {
    overflow: 'hidden',
  },
  stepCircleActive: {
    backgroundColor: SwashoColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
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
