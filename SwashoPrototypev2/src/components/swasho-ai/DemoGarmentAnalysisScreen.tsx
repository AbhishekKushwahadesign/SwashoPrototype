import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
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
import {
  getSwashoAiDemoScenario,
  SWASHO_AI_DEMO_PROVIDER_ID,
  type SwashoAiDemoScenario,
} from '@/constants/swasho-ai-demo-scenarios';
import { SwashoColors } from '@/constants/swasho-tokens';
import { useProviderCart } from '@/context/provider-cart-context';
import {
  buildUpcomingCheckoutDays,
  checkoutPlaceholderHref,
  getNextPickupTimeSlot,
} from '@/lib/checkout-flow';
import { checkoutBasketItemCount } from '@/lib/build-checkout-basket';
import { hasProviderCartSelection, type ProviderGarmentCartSelection } from '@/lib/provider-cart-selection';

import { AnalyzingGradientStatusPill } from './AnalyzingGradientStatusPill';
import { AiServiceRecommendedModal } from './AiServiceRecommendedModal';
import { Image } from 'expo-image';
import { ArrowLeftScan, DangerTriangleScan } from './garment-scan-icons';

const FIGMA_FRAME_HEIGHT = 896;
const STATUS_BAR_HEIGHT = 32;
const HOME_INDICATOR_HEIGHT = 24;

/** Simulated stage labels — not real AI inference. */
const DEMO_STAGE_LABELS = ['Analyzing garment', 'Analyzing stain', 'Recommending services'] as const;

/** Simulated analysis duration before the recommendation modal (ms). */
const DEMO_ANALYSIS_TOTAL_MS = 3500;
const STAGE_MS = DEMO_ANALYSIS_TOTAL_MS / DEMO_STAGE_LABELS.length;

type DemoAnalysisPhase = 'running' | 'complete';

function providerCartHasItems(
  entries: { serviceId: string; selection: ProviderGarmentCartSelection }[],
): boolean {
  if (checkoutBasketItemCount(entries) > 0) {
    return true;
  }
  return entries.some((entry) => hasProviderCartSelection(entry.selection, entry.serviceId));
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
  const [recommendationModalVisible, setRecommendationModalVisible] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const recommendationModalOpenedRef = useRef(false);

  const {
    setSelection,
    clearSelection,
    getProviderCartEntries,
    setOneTimeSchedule,
    setFulfillmentMode,
  } = useProviderCart();

  const commitGoToCart = useCallback(
    (activeScenario: SwashoAiDemoScenario, quantity: number) => {
      const providerId = SWASHO_AI_DEMO_PROVIDER_ID;
      const { recommendation } = activeScenario;
      const query = recommendation.providerName;

      for (const entry of getProviderCartEntries(providerId)) {
        clearSelection(providerId, entry.serviceId);
      }

      setFulfillmentMode(providerId, 'one-time');
      const today = buildUpcomingCheckoutDays(1)[0];
      setOneTimeSchedule(providerId, {
        pickupWeekday: today.weekdayId,
        pickupTimeSlot: getNextPickupTimeSlot(),
        deliverySameAsPickup: true,
        deliveryTimeSlot: undefined,
      });

      setSelection(providerId, recommendation.serviceSelectionId, {
        quantities: { [recommendation.catalogOptionId]: quantity },
        savedCombos: [],
      });

      setRecommendationModalVisible(false);
      router.push(
        checkoutPlaceholderHref(providerId, query, {
          scheduleConfirmed: true,
          fromAiDemo: true,
        }),
      );
    },
    [
      clearSelection,
      getProviderCartEntries,
      setFulfillmentMode,
      setOneTimeSchedule,
      setSelection,
    ],
  );

  const handleGoToCart = useCallback(
    (quantity: number) => {
      if (!scenario || quantity <= 0) {
        return;
      }
      const providerId = SWASHO_AI_DEMO_PROVIDER_ID;
      const existingEntries = getProviderCartEntries(providerId);
      if (!providerCartHasItems(existingEntries)) {
        commitGoToCart(scenario, quantity);
        return;
      }
      Alert.alert(
        'Replace cart?',
        'Your Laundry Pro cart already has items. Replace it with this AI recommendation?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Replace',
            style: 'destructive',
            onPress: () => commitGoToCart(scenario, quantity),
          },
        ],
      );
    },
    [commitGoToCart, getProviderCartEntries, scenario],
  );

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
    setRecommendationModalVisible(false);
    recommendationModalOpenedRef.current = false;

    DEMO_STAGE_LABELS.forEach((_, index) => {
      const timer = setTimeout(() => {
        setStageIndex(index);
      }, index * STAGE_MS);
      timersRef.current.push(timer);
    });

    const completeTimer = setTimeout(() => {
      setPhase('complete');
    }, DEMO_ANALYSIS_TOTAL_MS);
    timersRef.current.push(completeTimer);

    return () => {
      timersRef.current.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [scenario?.id]);

  useEffect(() => {
    if (phase !== 'complete' || !scenario || recommendationModalOpenedRef.current) {
      return;
    }
    recommendationModalOpenedRef.current = true;
    setRecommendationModalVisible(true);
  }, [phase, scenario]);

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

  const stagePillLabel = (index: number) => {
    const label = DEMO_STAGE_LABELS[index] ?? DEMO_STAGE_LABELS[0];
    if (label === 'Analyzing stain') {
      return 'Analyzing stain...';
    }
    if (label === 'Recommending services') {
      return 'Recommending services...';
    }
    return `${label}...`;
  };

  const pillLabel =
    phase === 'complete' && scenario
      ? scenario.recommendedService.trim()
      : phase === 'running'
        ? stagePillLabel(stageIndex)
        : '';

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
          contentFit={scenario.analysisContentFit ?? 'cover'}
        />

        {isAnalyzing && !reducedMotion ? (
          <Animated.View
            pointerEvents="none"
            style={[styles.scanLine, { width: contentWidth, height: 3 * scale }, scanLineStyle]}
          />
        ) : null}

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

        {!recommendationModalVisible && pillLabel ? (
          <View
            style={[
              styles.analyzingPillWrap,
              {
                top: figmaY(685),
                width: contentWidth,
              },
            ]}>
            <AnalyzingGradientStatusPill scale={scale} label={pillLabel} />
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

      <AiServiceRecommendedModal
        visible={recommendationModalVisible}
        scenario={scenario}
        scale={scale}
        contentWidth={contentWidth}
        onClose={() => setRecommendationModalVisible(false)}
        onScanAnother={() => {
          setRecommendationModalVisible(false);
          router.replace('/swasho-ai/demo-select');
        }}
        onGoToCart={handleGoToCart}
      />
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
    zIndex: 18,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    backgroundColor: 'rgba(93, 48, 247, 0.55)',
    zIndex: 8,
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
