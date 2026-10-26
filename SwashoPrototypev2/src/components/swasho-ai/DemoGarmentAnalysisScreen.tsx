import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeIndicator } from '@/components/home/HomeIndicator';
import { StatusBar } from '@/components/home/StatusBar';
import { useSafeTopInset, useScreenScale } from '@/components/home/scale';
import { searchFont } from '@/components/search/search-fonts';
import { getSwashoAiDemoScenario } from '@/constants/swasho-ai-demo-scenarios';
import { SwashoColors } from '@/constants/swasho-tokens';

import { Image } from 'expo-image';
import {
  ArrowLeftScan,
  DangerTriangleScan,
  StainOverlay1,
  StainOverlay2,
  StainOverlay3,
  StainOverlay4,
  StainOverlay5,
} from './garment-scan-icons';

const FIGMA_FRAME_HEIGHT = 896;
const STATUS_BAR_HEIGHT = 32;
const HOME_INDICATOR_HEIGHT = 24;

const ANALYZING_GRADIENT = ['#E40000', '#5D30F7', '#208AEF', '#00C853', '#FFB300', '#E40000'] as const;

/** Simulated stage labels — not real AI inference. */
const DEMO_STAGE_LABELS = ['Analyzing garment', 'Analyzing stain', 'Recommending services'] as const;

const STAGE_MS = 1500;

const STAIN_OVERLAYS = [
  { Component: StainOverlay1, left: 71.58, top: 246.12, width: 131.504, height: 289.252 },
  { Component: StainOverlay2, left: 205 - 1.11, top: 554.6, width: 35.105, height: 49.798 },
  { Component: StainOverlay3, left: 103 + 71.37, top: 609.98, width: 9.387, height: 12.037 },
  { Component: StainOverlay4, left: 103 + 75.21, top: 657.3, width: 9.387, height: 19.16 },
  { Component: StainOverlay5, left: 206 + 11.29, top: 416.57, width: 14.393, height: 39.048 },
] as const;

type DemoAnalysisPhase = 'running' | 'complete';

function GradientBorderPill({
  scale,
  label,
  variant = 'analyzing',
}: {
  scale: number;
  label: string;
  variant?: 'analyzing' | 'success';
}) {
  const innerBg = 'rgba(250, 250, 250, 0.8)';

  return (
    <LinearGradient
      colors={[...ANALYZING_GRADIENT]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        padding: 1.875 * scale,
        borderRadius: 9999 * scale,
      }}>
      <View
        style={{
          backgroundColor: innerBg,
          paddingHorizontal: 12 * scale,
          paddingVertical: 12 * scale,
          borderRadius: 9999 * scale,
        }}>
        <Text
          style={[
            searchFont('medium'),
            styles.pillLabel,
            {
              fontSize: 14 * scale,
              lineHeight: 16 * scale,
              letterSpacing: 0.28 * scale,
            },
          ]}>
          {label}
        </Text>
      </View>
    </LinearGradient>
  );
}

export function DemoGarmentAnalysisScreen() {
  const { scenarioId } = useLocalSearchParams<{ scenarioId?: string }>();
  const scenario = getSwashoAiDemoScenario(scenarioId);

  const { scale, contentWidth } = useScreenScale();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const reducedMotion = useReducedMotion();

  const [phase, setPhase] = useState<DemoAnalysisPhase>('running');
  const [stageIndex, setStageIndex] = useState(0);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const layoutHeight = FIGMA_FRAME_HEIGHT * scale;
  const figmaY = (y: number) => y * scale;
  const figmaX = (x: number) => x * scale;

  const scanLineY = useSharedValue(0);
  const isAnalyzing = phase === 'running';

  useEffect(() => {
    if (!scenario) {
      return;
    }
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
    setPhase('running');
    setStageIndex(0);

    DEMO_STAGE_LABELS.forEach((_, index) => {
      const timer = setTimeout(() => {
        setStageIndex(index);
      }, index * STAGE_MS);
      timersRef.current.push(timer);
    });

    const completeTimer = setTimeout(() => {
      setPhase('complete');
    }, DEMO_STAGE_LABELS.length * STAGE_MS);
    timersRef.current.push(completeTimer);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [scenario?.id]);

  useEffect(() => {
    if (!isAnalyzing || reducedMotion) {
      cancelAnimation(scanLineY);
      scanLineY.value = 0;
      return;
    }
    scanLineY.value = 0;
    scanLineY.value = withRepeat(
      withTiming(layoutHeight, { duration: 2200, easing: Easing.inOut(Easing.quad) }),
      -1,
      false,
    );
    return () => {
      cancelAnimation(scanLineY);
    };
  }, [isAnalyzing, layoutHeight, reducedMotion, scanLineY]);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineY.value }],
  }));

  const pillLabel =
    phase === 'complete' && scenario
      ? `Recommended: ${scenario.recommendedService.trim()}`
      : phase === 'running'
        ? DEMO_STAGE_LABELS[stageIndex]
        : 'Unknown demo scenario';

  const showOverlays = isAnalyzing || phase === 'complete';

  if (!scenario) {
    return (
      <View style={[styles.root, { backgroundColor: SwashoColors.neutral50 }]}>
        <View style={[styles.messagePanel, { padding: 24 * scale, marginTop: safeTop + 40 }]}>
          <Text style={[searchFont('medium'), { fontSize: 16 * scale, color: SwashoColors.neutral800 }]}>
            Demo scenario not found.
          </Text>
          <Pressable accessibilityRole="button" onPress={() => router.replace('/swasho-ai/demo-select')}>
            <Text style={[searchFont('medium'), { fontSize: 14 * scale, color: SwashoColors.primary600 }]}>
              Back to garment selection
            </Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.root, { backgroundColor: SwashoColors.neutral50 }]}>
      <View style={[styles.frame, { width: contentWidth, height: layoutHeight + safeTop, marginTop: safeTop }]}>
        <Image
          source={scenario.analysisImage}
          style={StyleSheet.absoluteFill}
          contentFit="contain"
        />

        {isAnalyzing && !reducedMotion ? (
          <Animated.View
            pointerEvents="none"
            style={[styles.scanLine, { width: contentWidth, height: 3 * scale }, scanLineStyle]}
          />
        ) : null}

        {showOverlays
          ? STAIN_OVERLAYS.map(({ Component, left, top, width, height }, index) => (
              <View
                key={index}
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  left: figmaX(left),
                  top: figmaY(top),
                  width: width * scale,
                  height: height * scale,
                }}>
                <Component width="100%" height="100%" />
              </View>
            ))
          : null}

        <View style={[styles.statusBar, { height: STATUS_BAR_HEIGHT * scale }]}>
          <StatusBar scale={scale} tone="camera" />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => {
            timersRef.current.forEach(clearTimeout);
            router.replace('/swasho-ai/demo-select');
          }}
          style={[
            styles.backButton,
            {
              left: figmaX(19.62),
              top: figmaY(57.82),
              padding: 6 * scale,
              borderRadius: 9999 * scale,
            },
          ]}>
          <ArrowLeftScan width={24 * scale} height={24 * scale} />
        </Pressable>

        <View
          style={[
            styles.issuePill,
            {
              top: figmaY(57.82),
              left: contentWidth * 0.75 + 0.62 * scale,
              paddingHorizontal: 8 * scale,
              paddingVertical: 6 * scale,
              borderRadius: 9999 * scale,
              gap: 4 * scale,
            },
          ]}>
          <DangerTriangleScan width={24 * scale} height={24 * scale} />
          <Text
            style={[
              searchFont('medium'),
              styles.issueLabel,
              { fontSize: 14 * scale, lineHeight: 16 * scale, letterSpacing: 0.28 * scale },
            ]}>
            issue
          </Text>
        </View>

        <View
          style={[
            styles.analyzingPillWrap,
            {
              top: figmaY(685),
              width: contentWidth,
            },
          ]}>
          <GradientBorderPill
            scale={scale}
            label={pillLabel}
            variant={phase === 'complete' ? 'success' : 'analyzing'}
          />
        </View>

        {phase === 'complete' ? (
          <View
            style={[
              styles.resultBlock,
              {
                top: figmaY(740),
                width: contentWidth,
                paddingHorizontal: 24 * scale,
                gap: 8 * scale,
              },
            ]}>
            <Text
              style={[
                searchFont('semibold'),
                styles.resultLine,
                { fontSize: 13 * scale, lineHeight: 18 * scale, textAlign: 'center' },
              ]}>
              {scenario.fabricLabel} · {scenario.stainLabel}
            </Text>
            <Text
              style={[
                searchFont('regular'),
                styles.resultLine,
                { fontSize: 13 * scale, lineHeight: 18 * scale, textAlign: 'center' },
              ]}>
              {scenario.resultSummary}
            </Text>
            <Pressable
              accessibilityRole="button"
              onPress={() => router.replace('/swasho-ai')}
              style={[
                styles.doneButton,
                {
                  marginTop: 6 * scale,
                  paddingVertical: 10 * scale,
                  paddingHorizontal: 20 * scale,
                  borderRadius: 9999 * scale,
                },
              ]}>
              <Text style={[searchFont('semibold'), styles.doneButtonText, { fontSize: 14 * scale }]}>
                Back to Swasho AI
              </Text>
            </Pressable>
          </View>
        ) : null}

        <View
          style={[
            styles.homeIndicatorWrap,
            {
              top: figmaY(FIGMA_FRAME_HEIGHT),
              height: HOME_INDICATOR_HEIGHT * scale,
            },
          ]}>
          <HomeIndicator scale={scale} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#000',
  },
  frame: {
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 20,
  },
  backButton: {
    position: 'absolute',
    zIndex: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  issuePill: {
    position: 'absolute',
    zIndex: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  issueLabel: {
    color: '#000000',
    textTransform: 'lowercase',
  },
  analyzingPillWrap: {
    position: 'absolute',
    zIndex: 12,
    alignItems: 'center',
  },
  pillLabel: {
    color: SwashoColors.neutral900,
    textAlign: 'center',
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    backgroundColor: 'rgba(93, 48, 247, 0.55)',
    zIndex: 8,
  },
  resultBlock: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 13,
  },
  resultLine: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  doneButton: {
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  doneButtonText: {
    color: SwashoColors.neutral900,
  },
  homeIndicatorWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 14,
  },
  messagePanel: {
    backgroundColor: SwashoColors.surface,
    borderRadius: 16,
    gap: 12,
    maxWidth: 340,
    alignItems: 'stretch',
  },
});
