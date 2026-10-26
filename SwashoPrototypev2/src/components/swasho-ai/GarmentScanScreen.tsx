import { CameraView, useCameraPermissions } from 'expo-camera';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useIsFocused } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
  cancelAnimation,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HomeIndicator } from '@/components/home/HomeIndicator';
import { StatusBar } from '@/components/home/StatusBar';
import { useSafeTopInset, useScreenScale } from '@/components/home/scale';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';
import { useGarmentScanFlow } from '@/hooks/use-garment-scan-flow';

import { ANALYZING_STATUS_PILL_FILL, AnalyzingGradientStatusPill } from './AnalyzingGradientStatusPill';
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

const STAIN_OVERLAYS = [
  { Component: StainOverlay1, left: 71.58, top: 246.12, width: 131.504, height: 289.252 },
  { Component: StainOverlay2, left: 205 - 1.11, top: 554.6, width: 35.105, height: 49.798 },
  { Component: StainOverlay3, left: 103 + 71.37, top: 609.98, width: 9.387, height: 12.037 },
  { Component: StainOverlay4, left: 103 + 75.21, top: 657.3, width: 9.387, height: 19.16 },
  { Component: StainOverlay5, left: 206 + 11.29, top: 416.57, width: 14.393, height: 39.048 },
] as const;

function GradientBorderPill({
  scale,
  label,
  variant = 'analyzing',
}: {
  scale: number;
  label: string;
  variant?: 'analyzing' | 'failed' | 'success';
}) {
  const innerBg = variant === 'failed' ? 'rgba(255, 250, 250, 0.92)' : ANALYZING_STATUS_PILL_FILL;

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

export function GarmentScanScreen() {
  const { scale, contentWidth } = useScreenScale();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const isFocused = useIsFocused();
  const reducedMotion = useReducedMotion();

  const [permission, requestPermission] = useCameraPermissions();
  const [webCameraLimited, setWebCameraLimited] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  const permissionGranted = permission?.granted ?? null;
  const permissionDenied = permission != null && !permission.granted && !permission.canAskAgain;

  const flow = useGarmentScanFlow({
    permissionGranted,
    permissionDenied: Boolean(permissionDenied),
    cameraUnavailable: false,
    onRequestPermission: () => {
      void requestPermission();
    },
  });

  const layoutHeight = FIGMA_FRAME_HEIGHT * scale;
  const figmaY = (y: number) => y * scale;
  const figmaX = (x: number) => x * scale;

  const scanLineY = useSharedValue(0);

  useEffect(() => {
    if (flow.phase !== 'analyzing' && flow.phase !== 'capturing') {
      cancelAnimation(scanLineY);
      scanLineY.value = 0;
      return;
    }
    if (reducedMotion) {
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
  }, [flow.phase, layoutHeight, reducedMotion, scanLineY]);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineY.value }],
  }));

  useEffect(() => {
    if (!isFocused) {
      flow.cancelAsync();
    }
  }, [flow, isFocused]);

  useEffect(() => {
    if (webCameraLimited && (flow.phase === 'initializing' || flow.phase === 'detecting')) {
      void flow.onCameraReady();
    }
  }, [flow, webCameraLimited]);

  const takePicture = useCallback(async (): Promise<string | null> => {
    if (webCameraLimited && Platform.OS === 'web') {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.85,
      });
      if (result.canceled || !result.assets[0]?.uri) {
        return null;
      }
      return result.assets[0].uri;
    }
    const photo = await cameraRef.current?.takePictureAsync({ quality: 0.85 });
    return photo?.uri ?? null;
  }, [webCameraLimited]);

  const handleCapture = useCallback(() => {
    void flow.capturePhoto(takePicture);
  }, [flow, takePicture]);

  const showLiveCamera =
    isFocused &&
    (flow.phase === 'preview' ||
      flow.phase === 'initializing' ||
      flow.phase === 'detecting' ||
      flow.phase === 'capturing' ||
      flow.phase === 'retake') &&
    !flow.capturedUri;

  const showFrozenFrame = Boolean(flow.capturedUri);

  const renderPermission = () => (
    <View style={[styles.messagePanel, { padding: 24 * scale, gap: 16 * scale }]}>
      <Text style={[searchFont('medium'), styles.messageTitle, { fontSize: 16 * scale }]}>
        Camera access needed
      </Text>
      <Text style={[searchFont('regular'), styles.messageBody, { fontSize: 14 * scale, lineHeight: 20 * scale }]}>
        Allow camera access to scan garments and analyze stains with Swasho AI.
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={flow.requestPermission}
        style={[styles.primaryButton, { paddingVertical: 12 * scale, paddingHorizontal: 20 * scale, borderRadius: 12 * scale }]}>
        <Text style={[searchFont('semibold'), styles.primaryButtonText, { fontSize: 15 * scale }]}>
          Enable camera
        </Text>
      </Pressable>
      <Pressable accessibilityRole="button" onPress={() => router.replace('/swasho-ai')}>
        <Text style={[searchFont('medium'), styles.linkText, { fontSize: 14 * scale }]}>Back to Swasho AI</Text>
      </Pressable>
    </View>
  );

  const renderWebFallback = () => (
    <View style={[styles.messagePanel, { padding: 24 * scale, gap: 12 * scale }]}>
      <Text style={[searchFont('medium'), styles.messageTitle, { fontSize: 16 * scale }]}>
        Live camera preview is limited here
      </Text>
      <Text style={[searchFont('regular'), styles.messageBody, { fontSize: 14 * scale, lineHeight: 20 * scale }]}>
        This browser cannot show a live camera feed. You can still capture a photo manually to run the scan flow.
      </Text>
      <Pressable
        accessibilityRole="button"
        onPress={handleCapture}
        style={[styles.primaryButton, { paddingVertical: 12 * scale, paddingHorizontal: 20 * scale, borderRadius: 12 * scale }]}>
        <Text style={[searchFont('semibold'), styles.primaryButtonText, { fontSize: 15 * scale }]}>
          Capture photo
        </Text>
      </Pressable>
    </View>
  );

  return (
    <View style={[styles.root, { backgroundColor: SwashoColors.neutral50 }]}>
      <View style={[styles.frame, { width: contentWidth, height: layoutHeight + safeTop, marginTop: safeTop }]}>
        {showLiveCamera && !webCameraLimited ? (
          <CameraView
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            facing="back"
            active={isFocused && flow.phase !== 'analyzing' && flow.phase !== 'failed' && flow.phase !== 'success'}
            onCameraReady={() => {
              void flow.onCameraReady();
            }}
            onMountError={() => {
              setWebCameraLimited(true);
            }}
          />
        ) : null}

        {webCameraLimited && Platform.OS === 'web' && flow.phase === 'preview' && !flow.capturedUri ? (
          <View style={[StyleSheet.absoluteFill, styles.webFallbackBackdrop]}>{renderWebFallback()}</View>
        ) : null}

        {showFrozenFrame && flow.capturedUri ? (
          <Image source={{ uri: flow.capturedUri }} style={StyleSheet.absoluteFill} contentFit="cover" />
        ) : null}

        {!permission?.granted && permission != null ? (
          <View style={[StyleSheet.absoluteFill, styles.permissionBackdrop]}>{renderPermission()}</View>
        ) : null}

        {flow.phase === 'initializing' || flow.phase === 'detecting' ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator color="#FFFFFF" size="large" />
          </View>
        ) : null}

        {(flow.phase === 'analyzing' || flow.phase === 'capturing') && !reducedMotion ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.scanLine,
              { width: contentWidth, height: 3 * scale },
              scanLineStyle,
            ]}
          />
        ) : null}

        {flow.showAnalyzingChrome ? (
          <>
            {STAIN_OVERLAYS.map(({ Component, left, top, width, height }, index) => (
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
            ))}
          </>
        ) : null}

        <View style={[styles.statusBar, { height: STATUS_BAR_HEIGHT * scale }]}>
          <StatusBar scale={scale} tone="camera" />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={() => {
            flow.cancelAsync();
            router.replace('/swasho-ai');
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

        {flow.analyzingLabel ? (
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
              label={flow.analyzingLabel}
              variant={flow.phase === 'failed' ? 'failed' : flow.phase === 'success' ? 'success' : 'analyzing'}
            />
          </View>
        ) : null}

        {flow.phase === 'failed' ? (
          <View
            style={[
              styles.failedActions,
              {
                top: figmaY(740),
                width: contentWidth,
                paddingHorizontal: 24 * scale,
                gap: 10 * scale,
              },
            ]}>
            <Text
              style={[
                searchFont('regular'),
                styles.failureText,
                { fontSize: 13 * scale, lineHeight: 18 * scale, textAlign: 'center' },
              ]}>
              {flow.failureMessage}
            </Text>
            <View style={[styles.failedRow, { gap: 10 * scale }]}>
              <Pressable
                accessibilityRole="button"
                onPress={() => void flow.retryAnalysis()}
                style={[styles.secondaryButton, { paddingVertical: 10 * scale, paddingHorizontal: 16 * scale, borderRadius: 9999 * scale }]}>
                <Text style={[searchFont('semibold'), styles.secondaryButtonText, { fontSize: 14 * scale }]}>Retry</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                onPress={flow.retake}
                style={[styles.secondaryButton, { paddingVertical: 10 * scale, paddingHorizontal: 16 * scale, borderRadius: 9999 * scale }]}>
                <Text style={[searchFont('semibold'), styles.secondaryButtonText, { fontSize: 14 * scale }]}>Retake</Text>
              </Pressable>
            </View>
          </View>
        ) : null}

        {flow.phase === 'success' && flow.analysisResult?.ok ? (
          <View
            style={[
              styles.failedActions,
              {
                top: figmaY(740),
                width: contentWidth,
                paddingHorizontal: 24 * scale,
              },
            ]}>
            <Text
              style={[
                searchFont('regular'),
                styles.failureText,
                { fontSize: 13 * scale, lineHeight: 18 * scale, textAlign: 'center' },
              ]}>
              {flow.analysisResult.stainSummary ?? 'Recommendations are ready when analysis is connected.'}
            </Text>
          </View>
        ) : null}

        {flow.phase === 'preview' && flow.detectionNotice ? (
          <View
            pointerEvents="none"
            style={[
              styles.detectionHint,
              {
                bottom: figmaY(FIGMA_FRAME_HEIGHT - 640),
                paddingHorizontal: 20 * scale,
                width: contentWidth,
              },
            ]}>
            <Text
              style={[
                searchFont('regular'),
                styles.detectionHintText,
                { fontSize: 12 * scale, lineHeight: 16 * scale, textAlign: 'center' },
              ]}>
              Auto-detect is unavailable — tap the shutter to capture manually.
            </Text>
          </View>
        ) : null}

        {flow.phase === 'preview' && !webCameraLimited ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Capture garment photo"
            onPress={handleCapture}
            style={[
              styles.shutter,
              {
                bottom: figmaY(FIGMA_FRAME_HEIGHT - 780),
                width: 64 * scale,
                height: 64 * scale,
                borderRadius: 32 * scale,
                borderWidth: 3 * scale,
                marginLeft: -32 * scale,
              },
            ]}
          />
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
  homeIndicatorWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 14,
  },
  shutter: {
    position: 'absolute',
    left: '50%',
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.35)',
    zIndex: 11,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    backgroundColor: 'rgba(93, 48, 247, 0.55)',
    zIndex: 8,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.25)',
    zIndex: 7,
  },
  permissionBackdrop: {
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 25,
  },
  webFallbackBackdrop: {
    backgroundColor: SwashoColors.neutral100,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 6,
  },
  messagePanel: {
    backgroundColor: SwashoColors.surface,
    borderRadius: 16,
    maxWidth: 340,
    alignItems: 'stretch',
  },
  messageTitle: {
    color: SwashoColors.neutral800,
  },
  messageBody: {
    color: SwashoColors.neutral700,
  },
  primaryButton: {
    backgroundColor: SwashoColors.primary500,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: SwashoColors.surface,
  },
  linkText: {
    color: SwashoColors.primary600,
    textAlign: 'center',
  },
  failedActions: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 13,
  },
  failedRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  failureText: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.45)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  secondaryButton: {
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  secondaryButtonText: {
    color: SwashoColors.neutral900,
  },
  detectionHint: {
    position: 'absolute',
    zIndex: 10,
  },
  detectionHintText: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
