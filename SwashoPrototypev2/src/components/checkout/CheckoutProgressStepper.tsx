import { StyleSheet, Text, View } from 'react-native';
import Svg, { Line } from 'react-native-svg';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';

/** Figma 3346:13457 — connector geometry at 1× (196px row). */
const STEPS_ROW_WIDTH = 196;
const TRACK_LEFT = 23.82;
const TRACK_WIDTH = 151.476;
const TRACK_DESIGN_HEIGHT = 2.004;

type CheckoutProgressStepperProps = {
  scale: number;
  activeStep: 1 | 2;
  /**
   * Fill along the dotted track (0–1) while on step 1.
   * Step 2 always renders a full brand line.
   */
  stepOneProgress?: number;
};

export function CheckoutProgressStepper({
  scale,
  activeStep,
  stepOneProgress = 97.896 / TRACK_WIDTH,
}: CheckoutProgressStepperProps) {
  const stepSize = 25 * scale;
  const rowWidth = STEPS_ROW_WIDTH * scale;
  const trackLeft = TRACK_LEFT * scale;
  const trackWidth = TRACK_WIDTH * scale;
  const trackHeight = Math.max(1, TRACK_DESIGN_HEIGHT * scale);
  const fillRatio = activeStep === 2 ? 1 : Math.min(1, Math.max(0, stepOneProgress));
  const progressWidth = trackWidth * fillRatio;

  return (
    <View style={[styles.wrap, { gap: 4 * scale, width: 263 * scale }]}>
      <View style={[styles.stepsRow, { width: rowWidth, height: 25 * scale }]}>
        <View
          pointerEvents="none"
          style={[
            styles.trackLayer,
            {
              left: trackLeft,
              width: trackWidth,
              height: trackHeight,
              top: (25 * scale - trackHeight) / 2,
            },
          ]}>
          <Svg
            width={trackWidth}
            height={trackHeight}
            viewBox={`0 0 ${TRACK_WIDTH} ${TRACK_DESIGN_HEIGHT}`}
            preserveAspectRatio="none">
            <Line
              x1={0}
              y1={TRACK_DESIGN_HEIGHT / 2}
              x2={TRACK_WIDTH}
              y2={TRACK_DESIGN_HEIGHT / 2}
              stroke={SwashoColors.neutral600}
              strokeOpacity={0.5}
              strokeWidth={TRACK_DESIGN_HEIGHT}
              strokeDasharray="2.5 7"
              strokeLinecap="round"
            />
          </Svg>
          {progressWidth > 0 ? (
            <View
              style={[
                styles.progressClip,
                {
                  width: progressWidth,
                  height: trackHeight,
                },
              ]}>
              <Svg
                width={trackWidth}
                height={trackHeight}
                viewBox={`0 0 ${TRACK_WIDTH} ${TRACK_DESIGN_HEIGHT}`}
                preserveAspectRatio="none">
                <Line
                  x1={0}
                  y1={TRACK_DESIGN_HEIGHT / 2}
                  x2={TRACK_WIDTH}
                  y2={TRACK_DESIGN_HEIGHT / 2}
                  stroke={SwashoColors.primary600}
                  strokeWidth={2.505}
                  strokeLinecap="round"
                />
              </Svg>
            </View>
          ) : null}
        </View>

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
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  trackLayer: {
    position: 'absolute',
  },
  progressClip: {
    position: 'absolute',
    left: 0,
    top: 0,
    overflow: 'hidden',
  },
  stepCircle: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
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
