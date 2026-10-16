import { StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';

type CheckoutProgressStepperProps = {
  scale: number;
  activeStep: 1 | 2;
};

export function CheckoutProgressStepper({ scale, activeStep }: CheckoutProgressStepperProps) {
  const stepSize = 25 * scale;
  const connectorWidth = 98 * scale;

  return (
    <View style={[styles.wrap, { gap: 4 * scale, width: 263 * scale }]}>
      <View style={[styles.stepsRow, { width: 196 * scale, height: 25 * scale }]}>
        <View
          style={[
            styles.stepCircle,
            activeStep === 1 ? styles.stepCircleActive : styles.stepCircleInactive,
            {
              width: stepSize,
              height: stepSize,
              borderRadius: stepSize / 2,
              borderWidth: 1 * scale,
            },
          ]}>
          <Text
            style={[
              searchFont(activeStep === 1 ? 'semibold' : 'medium'),
              activeStep === 1 ? styles.stepLabelActive : styles.stepLabelInactive,
              { fontSize: 15 * scale, lineHeight: 14 * scale },
            ]}>
            1
          </Text>
        </View>
        <View
          style={[
            styles.connector,
            activeStep === 1 ? styles.connectorActive : styles.connectorInactive,
            { width: connectorWidth, height: 2 * scale, marginHorizontal: 8 * scale },
          ]}
        />
        <View
          style={[
            styles.stepCircle,
            activeStep === 2 ? styles.stepCircleActive : styles.stepCircleInactive,
            {
              width: stepSize,
              height: stepSize,
              borderRadius: stepSize / 2,
              borderWidth: 1 * scale,
            },
          ]}>
          <Text
            style={[
              searchFont('medium'),
              activeStep === 2 ? styles.stepLabelActive : styles.stepLabelInactive,
              { fontSize: 15 * scale, lineHeight: 14 * scale },
            ]}>
            2
          </Text>
        </View>
      </View>
      <View style={[styles.labelsRow, { width: 271 * scale }]}>
        <Text
          style={[
            searchFont('medium'),
            activeStep === 1 ? styles.labelActive : styles.labelInactive,
            { fontSize: 15 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
          ]}>
          Subscriptions
        </Text>
        <Text
          style={[
            searchFont('medium'),
            activeStep === 2 ? styles.labelActive : styles.labelInactive,
            { fontSize: 15 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
          ]}>
          Checkout
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignSelf: 'center',
    alignItems: 'center',
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepCircle: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCircleActive: {
    backgroundColor: SwashoColors.primary600,
    borderColor: SwashoColors.primary600,
  },
  stepCircleInactive: {
    backgroundColor: SwashoColors.neutral100,
    borderColor: SwashoColors.neutral600,
  },
  stepLabelActive: {
    color: SwashoColors.surface,
  },
  stepLabelInactive: {
    color: SwashoColors.neutral600,
  },
  connector: {
    borderRadius: 1,
  },
  connectorActive: {
    backgroundColor: SwashoColors.primary600,
  },
  connectorInactive: {
    backgroundColor: SwashoColors.neutral300,
  },
  labelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  labelActive: {
    color: SwashoColors.primary600,
  },
  labelInactive: {
    color: SwashoColors.neutral600,
  },
});
