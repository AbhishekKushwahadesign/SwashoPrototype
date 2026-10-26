import { useEffect, useId, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedProps,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Defs, LinearGradient as SvgLinearGradient, Rect, Stop } from 'react-native-svg';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';

/** Figma 3415:17879 — stroke sweeps green → amber → red → purple → blue (loop). */
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
  minWidth: 156,
  height: 40,
  fontSize: 14,
  lineHeight: 16,
  letterSpacing: 0.28,
  /** #FAFAFA @ 80% opacity (Figma 3415:17879) — SVG fill, not over gradient layer. */
  innerBackground: '#FAFAFACC',
  strokeSpinDurationMs: 3200,
} as const;

export const ANALYZING_STATUS_PILL_FILL = FIGMA_PILL.innerBackground;

const AnimatedSvgLinearGradient = Animated.createAnimatedComponent(SvgLinearGradient);

type AnalyzingGradientStatusPillProps = {
  scale: number;
  label: string;
  /** When false, stroke gradient stays static. */
  animateStroke?: boolean;
};

type PillSize = { width: number; height: number };

export function AnalyzingGradientStatusPill({
  scale,
  label,
  animateStroke = true,
}: AnalyzingGradientStatusPillProps) {
  const reducedMotion = useReducedMotion();
  const shouldAnimateStroke = animateStroke && !reducedMotion;

  const gradientId = useId().replace(/:/g, '');
  const borderWidth = FIGMA_PILL.borderWidth * scale;
  const paddingHorizontal = FIGMA_PILL.paddingHorizontal * scale;
  const paddingVertical = FIGMA_PILL.paddingVertical * scale;
  const minPillWidth = FIGMA_PILL.minWidth * scale;
  const minPillHeight = FIGMA_PILL.height * scale;

  const [pillSize, setPillSize] = useState<PillSize>({
    width: minPillWidth,
    height: minPillHeight,
  });

  const pillWidth = Math.max(minPillWidth, pillSize.width);
  const pillHeight = Math.max(minPillHeight, pillSize.height);
  const cornerRadius = pillHeight / 2;
  const strokeInset = borderWidth / 2;

  const strokeRotation = useSharedValue(0);

  useEffect(() => {
    if (!shouldAnimateStroke) {
      cancelAnimation(strokeRotation);
      strokeRotation.value = 0;
      return;
    }
    strokeRotation.value = 0;
    strokeRotation.value = withRepeat(
      withTiming(360, {
        duration: FIGMA_PILL.strokeSpinDurationMs,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
    return () => {
      cancelAnimation(strokeRotation);
    };
  }, [shouldAnimateStroke, strokeRotation]);

  const animatedGradientProps = useAnimatedProps(() => ({
    gradientTransform: `rotate(${strokeRotation.value} 0.5 0.5)`,
  }));

  return (
    <View style={[styles.outer, { minWidth: minPillWidth, minHeight: minPillHeight }]}>
      <Svg
        pointerEvents="none"
        width={pillWidth}
        height={pillHeight}
        style={StyleSheet.absoluteFill}>
        <Defs>
          <AnimatedSvgLinearGradient
            id={gradientId}
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
            gradientUnits="objectBoundingBox"
            animatedProps={animatedGradientProps}>
            {ANALYZING_STATUS_GRADIENT.map((color, index) => (
              <Stop
                key={`${index}-${color}`}
                offset={`${(index / (ANALYZING_STATUS_GRADIENT.length - 1)) * 100}%`}
                stopColor={color}
              />
            ))}
          </AnimatedSvgLinearGradient>
        </Defs>
        <Rect
          x={strokeInset}
          y={strokeInset}
          width={Math.max(0, pillWidth - borderWidth)}
          height={Math.max(0, pillHeight - borderWidth)}
          rx={Math.max(0, cornerRadius - strokeInset)}
          ry={Math.max(0, cornerRadius - strokeInset)}
          fill={FIGMA_PILL.innerBackground}
          stroke={`url(#${gradientId})`}
          strokeWidth={borderWidth}
        />
      </Svg>

      <View
        onLayout={(event) => {
          const { width, height } = event.nativeEvent.layout;
          if (width > 0 && height > 0) {
            setPillSize((current) => {
              if (current.width === width && current.height === height) {
                return current;
              }
              return { width, height };
            });
          }
        }}
        style={{
          paddingHorizontal,
          paddingVertical,
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: minPillWidth,
          minHeight: minPillHeight,
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
    position: 'relative',
  },
  label: {
    color: SwashoColors.neutral900,
    textAlign: 'center',
  },
});
