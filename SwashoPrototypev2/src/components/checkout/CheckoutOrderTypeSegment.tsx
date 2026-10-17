import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { figmaShadow, FigmaShadows } from '@/components/home/figma-shadows';
import { searchFont } from '@/components/search/search-fonts';
import {
  CHECKOUT_ORDER_TYPE_SEGMENT_HEIGHT,
  CHECKOUT_ORDER_TYPE_SEGMENT_WIDTH,
} from '@/lib/checkout-figma-layout';
import type { ProviderOrderFulfillmentMode } from '@/lib/checkout-flow';
import { SwashoColors } from '@/constants/swasho-tokens';

/** Figma 3346:13477 — segment gradient stops */
const ONE_TIME_GRADIENT = ['#7e77ff', '#7056ff', '#6234ff'] as const;
/** Active pill stroke (design / web computed edge) */
const ACTIVE_PILL_BORDER = '#352a55';

type CheckoutOrderTypeSegmentProps = {
  activeMode: ProviderOrderFulfillmentMode;
  onSelectMode: (mode: ProviderOrderFulfillmentMode) => void;
  scale: number;
};

export function CheckoutOrderTypeSegment({
  activeMode,
  onSelectMode,
  scale,
}: CheckoutOrderTypeSegmentProps) {
  const isOneTime = activeMode === 'one-time';
  const isSubscribe = activeMode === 'subscribe';
  const segmentWidth = CHECKOUT_ORDER_TYPE_SEGMENT_WIDTH * scale;
  const segmentHeight = CHECKOUT_ORDER_TYPE_SEGMENT_HEIGHT * scale;
  const outerRadius = 12.572 * scale;
  const trackInset = 2 * scale;
  const pillRadius = (12.572 - 1.048) * scale;
  const pillCorners = {
    borderTopLeftRadius: pillRadius,
    borderBottomLeftRadius: pillRadius,
    borderTopRightRadius: pillRadius,
    borderBottomRightRadius: pillRadius,
  };

  const pillDrop = figmaShadow(FigmaShadows.checkoutSegmentActive, scale);
  const pillInset = figmaShadow(FigmaShadows.checkoutSegmentActiveInset, scale);
  const pillBorderWidth = 1.048 * scale;

  const activePillShell = (child: ReactNode, side: 'left' | 'right') => (
    <View
      pointerEvents="none"
      style={[
        StyleSheet.absoluteFill,
        pillCorners,
        side === 'left' ? { right: -1 * scale } : { left: -1 * scale },
        { zIndex: 2, overflow: 'visible' },
        pillDrop,
      ]}>
      <View
        style={[
          StyleSheet.absoluteFill,
          pillCorners,
          {
            overflow: 'hidden',
            borderWidth: pillBorderWidth,
            borderColor: ACTIVE_PILL_BORDER,
            borderStyle: 'solid',
          },
        ]}>
        {child}
        {Platform.OS === 'web' ? (
          <View
            pointerEvents="none"
            style={[
              {
                position: 'absolute',
                top: -0.524 * scale,
                left: -0.524 * scale,
                right: -0.524 * scale,
                bottom: -0.524 * scale,
              },
              pillCorners,
              pillInset,
            ]}
          />
        ) : null}
      </View>
    </View>
  );

  return (
    <View
      style={[
        styles.outer,
        {
          width: segmentWidth,
          borderRadius: outerRadius,
          borderWidth: 1.048 * scale,
          height: segmentHeight,
          padding: trackInset,
          ...figmaShadow(FigmaShadows.checkoutSegmentTrack, scale),
        },
      ]}>
      <View style={styles.row}>
        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: isOneTime }}
          onPress={() => onSelectMode('one-time')}
          style={({ pressed }) => [
            styles.half,
            pillCorners,
            { opacity: pressed ? 0.95 : 1, borderWidth: 0 },
          ]}>
          {isOneTime
            ? activePillShell(
                <LinearGradient
                  colors={[...ONE_TIME_GRADIENT]}
                  start={{ x: 0.92, y: 0.08 }}
                  end={{ x: 0.08, y: 0.92 }}
                  style={StyleSheet.absoluteFill}
                />,
                'left',
              )
            : (
              <View style={[StyleSheet.absoluteFill, styles.inactiveFill, pillCorners]} />
            )}
          <View style={[styles.copy, { gap: 6 * scale, paddingVertical: 10 * scale }]}>
            <Text
              style={[
                searchFont('medium'),
                isOneTime ? styles.titleOnGradient : styles.titleMuted,
                { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
              ]}>
              One-Time
            </Text>
            <Text
              style={[
                searchFont('regular'),
                isOneTime ? styles.subOnGradient : styles.subMuted,
                { fontSize: 12 * scale, lineHeight: 17 * scale, letterSpacing: 0.5 * scale },
              ]}>
              Pay Standard Pricing
            </Text>
          </View>
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityState={{ selected: isSubscribe }}
          onPress={() => onSelectMode('subscribe')}
          style={({ pressed }) => [
            styles.half,
            pillCorners,
            { opacity: pressed ? 0.95 : 1, borderWidth: 0 },
          ]}>
          {isSubscribe
            ? activePillShell(
                <LinearGradient
                  colors={[...ONE_TIME_GRADIENT]}
                  start={{ x: 0.92, y: 0.08 }}
                  end={{ x: 0.08, y: 0.92 }}
                  style={StyleSheet.absoluteFill}
                />,
                'right',
              )
            : (
              <View style={[StyleSheet.absoluteFill, styles.halfRight, pillCorners]} />
            )}
          <View style={[styles.copy, { gap: 7 * scale, paddingVertical: 10 * scale }]}>
            <Text
              style={[
                searchFont('medium'),
                isSubscribe ? styles.titleOnGradient : styles.titleDark,
                { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
              ]}>
              Subscribe
            </Text>
            <Text
              style={[
                searchFont('regular'),
                isSubscribe ? styles.subOnGradient : styles.subDark,
                {
                  fontSize: 12 * scale,
                  lineHeight: isSubscribe ? 17 * scale : 14 * scale,
                  letterSpacing: isSubscribe ? 0.5 * scale : 0,
                },
              ]}>
              Unlock Exclusive Pricing
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    alignSelf: 'center',
    borderColor: '#d7d7d7',
    backgroundColor: '#e0e0e0',
    overflow: 'visible',
  },
  row: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'stretch',
  },
  half: {
    flex: 1,
    overflow: 'visible',
    alignItems: 'center',
    justifyContent: 'center',
  },
  halfRight: {
    backgroundColor: SwashoColors.surface,
  },
  inactiveFill: {
    backgroundColor: SwashoColors.neutral50,
  },
  copy: {
    alignItems: 'center',
    zIndex: 3,
  },
  titleOnGradient: {
    color: SwashoColors.primary100,
  },
  subOnGradient: {
    color: SwashoColors.primary100,
  },
  titleMuted: {
    color: SwashoColors.neutral800,
  },
  subMuted: {
    color: SwashoColors.neutral600,
  },
  titleDark: {
    color: SwashoColors.neutral950,
  },
  subDark: {
    color: SwashoColors.neutral800,
  },
});
