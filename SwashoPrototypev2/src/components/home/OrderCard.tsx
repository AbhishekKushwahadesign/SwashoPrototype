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
const TIMELINE_LEFT = 1.416;
const TIMELINE_WIDTH = 344.584;
const TIMELINE_HEIGHT = 59;
const STEP_CONTAINER_WIDTH = 59.584;

// Frame 98 layout from Figma node 3344:8821.
const PICKUP = { left: 4, top: 2, size: 36 };
const LAUNDRY = { left: 10.584, top: 1, size: 38 };
const OUT_FOR_DELIVERY = { left: 4.168, top: 0, squareSize: 40, labelWidth: 89 };
const DELIVERED = { left: 275, top: 0.033, size: 40 };
const LINE = { left: 69, top: 33, width: 227 };
const MINS_AWAY = { left: 127.584, top: 11, width: 90 };

const PICKUP_ICON_OFFSET = { left: -3.6, top: -3.6, size: 43.2 };
const LAUNDRY_ICON_OFFSET = { left: -4.38, top: -4, size: 45.6 };
const RIDER_IMAGE = { left: 3.208, top: 5.518, width: 32.214, height: 37.072 };
const PACKAGE_IMAGE = { left: 7.792, top: 7.967, width: 24, height: 25 };

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

          <View
            style={{
              marginLeft: TIMELINE_LEFT * scale,
              width: TIMELINE_WIDTH * scale,
              height: TIMELINE_HEIGHT * scale,
            }}>
            <View style={StyleSheet.absoluteFill}>
              <View
                style={{
                  position: 'absolute',
                  left: LINE.left * scale,
                  top: LINE.top * scale,
                  width: LINE.width * scale,
                  height: 2 * scale,
                  zIndex: 0,
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
                    zIndex: 1,
                  },
                ]}>
                20 mins away
              </Text>

              <View
                style={{
                  position: 'absolute',
                  left: PICKUP.left * scale,
                  top: PICKUP.top * scale,
                  width: STEP_CONTAINER_WIDTH * scale,
                  alignItems: 'center',
                  zIndex: 2,
                }}>
                <View
                  style={[
                    styles.stepSquare,
                    {
                      width: PICKUP.size * scale,
                      height: PICKUP.size * scale,
                      borderRadius: SwashoRadii.lg * scale,
                      backgroundColor: SwashoColors.neutral200,
                      ...figmaShadow(FigmaShadows.pickupMark, scale),
                    },
                  ]}>
                  <CheckSquareIcon
                    width={PICKUP_ICON_OFFSET.size * scale}
                    height={PICKUP_ICON_OFFSET.size * scale}
                    style={{
                      position: 'absolute',
                      left: PICKUP_ICON_OFFSET.left * scale,
                      top: PICKUP_ICON_OFFSET.top * scale,
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  position: 'absolute',
                  left: LAUNDRY.left * scale,
                  top: LAUNDRY.top * scale,
                  width: STEP_CONTAINER_WIDTH * scale,
                  alignItems: 'center',
                  zIndex: 3,
                }}>
                <View
                  style={[
                    styles.stepSquare,
                    {
                      width: LAUNDRY.size * scale,
                      height: LAUNDRY.size * scale,
                      borderRadius: SwashoRadii.lg * scale,
                      backgroundColor: SwashoColors.neutral200,
                      ...figmaShadow(FigmaShadows.underLaundryMark, scale),
                    },
                  ]}>
                  <CheckSquare2Icon
                    width={LAUNDRY_ICON_OFFSET.size * scale}
                    height={LAUNDRY_ICON_OFFSET.size * scale}
                    style={{
                      position: 'absolute',
                      left: LAUNDRY_ICON_OFFSET.left * scale,
                      top: LAUNDRY_ICON_OFFSET.top * scale,
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  position: 'absolute',
                  left: OUT_FOR_DELIVERY.left * scale,
                  top: OUT_FOR_DELIVERY.top * scale,
                  width: OUT_FOR_DELIVERY.labelWidth * scale,
                  alignItems: 'center',
                  gap: 8 * scale,
                  zIndex: 4,
                }}>
                <View
                  style={[
                    styles.stepSquareActive,
                    {
                      width: OUT_FOR_DELIVERY.squareSize * scale,
                      height: OUT_FOR_DELIVERY.squareSize * scale,
                      borderRadius: SwashoRadii.lg * scale,
                      ...figmaShadow(FigmaShadows.outForDelivery, scale),
                    },
                  ]}>
                  <Image
                    source={require('@/assets/images/home/rider.png')}
                    style={{
                      position: 'absolute',
                      left: RIDER_IMAGE.left * scale,
                      top: RIDER_IMAGE.top * scale,
                      width: RIDER_IMAGE.width * scale,
                      height: RIDER_IMAGE.height * scale,
                      transform: [{ rotate: '-7.24deg' }],
                    }}
                    contentFit="contain"
                  />
                </View>
                <Text
                  style={[
                    styles.outForDelivery,
                    {
                      width: OUT_FOR_DELIVERY.labelWidth * scale,
                      fontSize: 13 * scale,
                      lineHeight: 16 * scale,
                    },
                  ]}>
                  Out for delivery
                </Text>
              </View>

              <View
                style={{
                  position: 'absolute',
                  left: DELIVERED.left * scale,
                  top: DELIVERED.top * scale,
                  width: STEP_CONTAINER_WIDTH * scale,
                  alignItems: 'center',
                  zIndex: 5,
                }}>
                <View
                  style={[
                    styles.stepSquare,
                    {
                      width: DELIVERED.size * scale,
                      height: DELIVERED.size * scale,
                      borderRadius: SwashoRadii.lg * scale,
                      backgroundColor: SwashoColors.surface,
                      ...figmaShadow(FigmaShadows.deliveredMark, scale),
                    },
                  ]}>
                  <Image
                    source={require('@/assets/images/home/swasho-package.png')}
                    style={{
                      position: 'absolute',
                      left: PACKAGE_IMAGE.left * scale,
                      top: PACKAGE_IMAGE.top * scale,
                      width: PACKAGE_IMAGE.width * scale,
                      height: PACKAGE_IMAGE.height * scale,
                    }}
                    contentFit="contain"
                  />
                </View>
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
