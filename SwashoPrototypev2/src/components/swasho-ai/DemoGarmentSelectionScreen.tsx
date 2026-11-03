import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useRef } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import ForbiddenCircle from '@/assets/images/swasho-ai/demo/forbidden-circle.svg';
import TapArrow from '@/assets/images/swasho-ai/demo/tap-arrow.svg';
import { HomeIndicator, homeIndicatorScreenBottomStyle } from '@/components/home/HomeIndicator';
import { StatusBar } from '@/components/home/StatusBar';
import { useSafeTopInset, useScreenScale } from '@/components/home/scale';
import { searchFont } from '@/components/search/search-fonts';
import { SWASHO_AI_DEMO_SCENARIOS, type SwashoAiDemoScenarioId } from '@/constants/swasho-ai-demo-scenarios';
import { SwashoColors } from '@/constants/swasho-tokens';

import { ArrowLeftScan } from './garment-scan-icons';

const FIGMA_FRAME_HEIGHT = 896;
const STATUS_BAR_HEIGHT = 32;
const HOME_INDICATOR_HEIGHT = 24;

const FIGMA_THUMBS_TOP = 713.66;
const FIGMA_THUMBS_WIDTH = 272.042;
const FIGMA_THUMB_WIDTH = 79.593;
const FIGMA_THUMB_HEIGHT = 117.607;
const FIGMA_THUMB_GAP = 96.22 - FIGMA_THUMB_WIDTH;

export function DemoGarmentSelectionScreen() {
  const { scale, contentWidth } = useScreenScale();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const navigatingRef = useRef(false);

  const layoutHeight = FIGMA_FRAME_HEIGHT * scale;
  const figmaY = (y: number) => y * scale;
  const figmaX = (x: number) => x * scale;

  const thumbsWidth = FIGMA_THUMBS_WIDTH * scale;
  const thumbWidth = FIGMA_THUMB_WIDTH * scale;
  const thumbHeight = FIGMA_THUMB_HEIGHT * scale;
  const thumbGap = FIGMA_THUMB_GAP * scale;
  const thumbsLeft = (contentWidth - thumbsWidth) / 2;

  const openScenario = (scenarioId: SwashoAiDemoScenarioId) => {
    if (navigatingRef.current) {
      return;
    }
    navigatingRef.current = true;
    router.push({
      pathname: '/swasho-ai/demo-analysis',
      params: { scenarioId },
    });
    setTimeout(() => {
      navigatingRef.current = false;
    }, 600);
  };

  return (
    <View style={[styles.root, { backgroundColor: SwashoColors.neutral50 }]}>
      <View style={[styles.frame, { width: contentWidth, height: layoutHeight + safeTop, marginTop: safeTop }]}>
        <View style={StyleSheet.absoluteFill}>
          <Image
            source={require('@/assets/images/swasho-ai/demo/selection-backdrop.png')}
            style={StyleSheet.absoluteFill}
            contentFit="cover"
          />
          <View style={[StyleSheet.absoluteFill, styles.backdropDim]} />
        </View>

        <View style={[styles.statusBar, { height: STATUS_BAR_HEIGHT * scale }]}>
          <StatusBar scale={scale} tone="camera" />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => router.replace('/swasho-ai')}
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
            styles.centerMessage,
            {
              top: figmaY(273),
              width: 203.436 * scale,
              left: (contentWidth - 203.436 * scale) / 2,
              gap: 12 * scale,
            },
          ]}>
          <ForbiddenCircle width={47.52 * scale} height={47.52 * scale} />
          <Text
            style={[
              searchFont('semibold'),
              styles.disabledTitle,
              {
                fontSize: 14 * scale,
                lineHeight: 14 * scale,
                letterSpacing: 0.5 * scale,
              },
            ]}>
            Camera is disabled in this prototype.
          </Text>
        </View>

        <View
          style={[
            styles.hintBlock,
            {
              top: figmaY(632.86),
              left: figmaX(66.53),
              width: 278.937 * scale,
            },
          ]}>
          <Text
            style={[
              searchFont('medium'),
              styles.hintText,
              {
                fontSize: 13 * scale,
                lineHeight: 16 * scale,
                letterSpacing: 0.5 * scale,
              },
            ]}>
            Tap any demo garment below to test the flow!
          </Text>
          <View
            style={[
              styles.hintArrow,
              {
                left: 178.47 * scale,
                top: 13 * scale,
                width: 44.616 * scale,
                height: 57.196 * scale,
              },
            ]}>
            <View style={{ transform: [{ rotate: '-25.81deg' }] }}>
              <TapArrow width={24.58 * scale} height={51.646 * scale} />
            </View>
          </View>
        </View>

        <View
          style={[
            styles.thumbRow,
            {
              top: figmaY(FIGMA_THUMBS_TOP),
              left: thumbsLeft,
              width: thumbsWidth,
              height: thumbHeight,
              gap: thumbGap,
            },
          ]}>
          {SWASHO_AI_DEMO_SCENARIOS.map((scenario) => (
            <Pressable
              key={scenario.id}
              accessibilityRole="button"
              accessibilityLabel={`Select demo garment: ${scenario.title}`}
              onPress={() => openScenario(scenario.id)}
              style={[
                styles.thumbCard,
                {
                  width: thumbWidth,
                  height: thumbHeight,
                  borderRadius: 9.504 * scale,
                },
              ]}>
              <Image source={scenario.cardImage} style={StyleSheet.absoluteFill} contentFit="cover" />
            </Pressable>
          ))}
        </View>

        <View style={[styles.homeIndicatorWrap, homeIndicatorScreenBottomStyle]}>
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
  backdropDim: {
    backgroundColor: '#000000',
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
  centerMessage: {
    position: 'absolute',
    zIndex: 10,
    alignItems: 'center',
  },
  disabledTitle: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  hintBlock: {
    position: 'absolute',
    zIndex: 10,
  },
  hintText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  hintArrow: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumbRow: {
    position: 'absolute',
    flexDirection: 'row',
    zIndex: 12,
    ...Platform.select({
      web: { cursor: 'default' } as object,
    }),
  },
  thumbCard: {
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    ...Platform.select({
      web: { cursor: 'pointer' } as object,
    }),
  },
  homeIndicatorWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 14,
  },
});
