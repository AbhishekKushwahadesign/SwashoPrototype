import { Image } from 'expo-image';
import { StyleSheet, Text, View } from 'react-native';

import { CheckSquare2Icon, CheckSquareIcon, Line13Icon } from '@/components/home/figma-icons';
import { FigmaShadows, figmaShadow } from '@/components/home/figma-shadows';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

const TIMELINE_LEFT = 1.416;
const TIMELINE_WIDTH = 344.584;
const TIMELINE_HEIGHT = 59;
const STEP_CONTAINER_WIDTH = 59.584;
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

type OrderTrackingTimelineProps = {
  scale: number;
  minsAwayLabel: string;
  currentStage: 'pickup' | 'laundry' | 'delivery' | 'delivered';
};

export function OrderTrackingTimeline({ scale, minsAwayLabel, currentStage }: OrderTrackingTimelineProps) {
  const pickupDone = currentStage !== 'pickup';
  const laundryDone = currentStage === 'delivery' || currentStage === 'delivered';
  const deliveryActive = currentStage === 'delivery';
  const deliveredActive = currentStage === 'delivered';

  return (
    <View
      style={{
        marginLeft: TIMELINE_LEFT * scale,
        width: TIMELINE_WIDTH * scale,
        height: TIMELINE_HEIGHT * scale,
        alignSelf: 'center',
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
          {minsAwayLabel}
        </Text>

        <View
          style={{
            position: 'absolute',
            left: PICKUP.left * scale,
            top: PICKUP.top * scale,
            width: STEP_CONTAINER_WIDTH * scale,
            alignItems: 'center',
            zIndex: 2,
            opacity: pickupDone ? 1 : 0.45,
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
            opacity: laundryDone ? 1 : 0.45,
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
            opacity: deliveryActive || deliveredActive ? 1 : 0.45,
          }}>
          <View
            style={[
              deliveryActive ? styles.stepSquareActive : styles.stepSquare,
              {
                width: OUT_FOR_DELIVERY.squareSize * scale,
                height: OUT_FOR_DELIVERY.squareSize * scale,
                borderRadius: SwashoRadii.lg * scale,
                backgroundColor: deliveryActive ? SwashoColors.surface : SwashoColors.neutral200,
                ...(deliveryActive ? figmaShadow(FigmaShadows.outForDelivery, scale) : figmaShadow(FigmaShadows.pickupMark, scale)),
              },
            ]}>
            {deliveryActive || deliveredActive ? (
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
            ) : null}
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
            opacity: deliveredActive ? 1 : 0.45,
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
  );
}

const styles = StyleSheet.create({
  stepSquare: {
    overflow: 'hidden',
  },
  stepSquareActive: {
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
