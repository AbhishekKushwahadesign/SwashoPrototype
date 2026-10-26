import { LinearGradient } from 'expo-linear-gradient';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';

/**
 * Figma 3415:17879 — stroke sweeps green → amber → red → purple → blue (loop).
 * Used on a rotating layer so the border animates around the pill.
 */
export const ANALYZING_STATUS_GRADIENT = [
  '#00C853',
  '#FFB300',
  '#E40000',
  '#5D30F7',
  '#208AEF',
  '#00C853',
] as const;

const FIGMA_PILL = {
  borderWidth: 1.875,
  paddingHorizontal: 12,
  paddingVertical: 12,
  radius: 9999,
  fontSize: 14,
  lineHeight: 16,
  letterSpacing: 0.28,
  /** #FAFAFA @ 80% opacity (Figma 3415:17879) */
  innerBackground: '#FAFAFACC',
  /** One full rotation of the stroke gradient (ms). */
  spinDurationMs: 3200,
} as const;

export const ANALYZING_STATUS_PILL_FILL = FIGMA_PILL.innerBackground;

type AnalyzingGradientStatusPillProps = {
  scale: number;
  label: string;
  /** When false, stroke stays static (e.g. reduced motion). */
  animateStroke?: boolean;
};

export function AnalyzingGradientStatusPill({
  scale,
  label,
  animateStroke = true,
}: AnalyzingGradientStatusPillProps) {
  const reducedMotion = useReducedMotion();
  const shouldSpin = animateStroke && !reducedMotion;

  const borderWidth = FIGMA_PILL.borderWidth * scale;
  const outerRadius = FIGMA_PILL.radius * scale;
  const innerRadius = Math.max(0, outerRadius - borderWidth);
  const spinnerSize = 220 * scale;

  const rotation = useSharedValue(0);

  useEffect(() => {
    if (!shouldSpin) {
      cancelAnimation(rotation);
      rotation.value = 0;
      return;
    }
    rotation.value = 0;
    rotation.value = withRepeat(
      withTiming(360, {
        duration: FIGMA_PILL.spinDurationMs,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
    return () => {
      cancelAnimation(rotation);
    };
  }, [rotation, shouldSpin]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View
      style={[
        styles.outer,
        {
          borderRadius: outerRadius,
        },
      ]}>
      <Animated.View
        pointerEvents="none"
        style={[
          styles.spinner,
          spinStyle,
          {
            width: spinnerSize,
            height: spinnerSize,
            marginLeft: -spinnerSize / 2,
            marginTop: -spinnerSize / 2,
          },
        ]}>
        <LinearGradient
          colors={[...ANALYZING_STATUS_GRADIENT]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      <View
        style={{
          margin: borderWidth,
          backgroundColor: FIGMA_PILL.innerBackground,
          paddingHorizontal: FIGMA_PILL.paddingHorizontal * scale,
          paddingVertical: FIGMA_PILL.paddingVertical * scale,
          borderRadius: innerRadius,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text
          numberOfLines={1}
          style={[
            searchFont('medium'),
            styles.label,
            {
              fontSize: FIGMA_PILL.fontSize * scale,
              lineHeight: FIGMA_PILL.lineHeight * scale,
              letterSpacing: FIGMA_PILL.letterSpacing * scale,
            },
          ]}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignSelf: 'center',
    flexShrink: 0,
    maxWidth: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  spinner: {
    position: 'absolute',
    left: '50%',
    top: '50%',
  },
  label: {
    color: SwashoColors.neutral900,
    textAlign: 'center',
  },
});
