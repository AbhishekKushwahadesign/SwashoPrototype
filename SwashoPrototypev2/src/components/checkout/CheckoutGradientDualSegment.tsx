import { LinearGradient } from 'expo-linear-gradient';
import type { ReactNode } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { figmaShadow, FigmaShadows } from '@/components/home/figma-shadows';
import { searchFont } from '@/components/search/search-fonts';
import {
  CHECKOUT_ORDER_TYPE_SEGMENT_HEIGHT,
  CHECKOUT_ORDER_TYPE_SEGMENT_WIDTH,
} from '@/lib/checkout-figma-layout';
import { SwashoColors } from '@/constants/swasho-tokens';

/** Figma 3346:13477 — segment gradient stops */
const SEGMENT_GRADIENT = ['#7e77ff', '#7056ff', '#6234ff'] as const;
const ACTIVE_PILL_BORDER = '#352a55';

export type CheckoutDualSegmentSide = {
  title: string;
  subtitle: string;
};

export type CheckoutGradientDualSegmentTypography = 'order-type' | 'service-handover';

type CheckoutGradientDualSegmentProps = {
  left: CheckoutDualSegmentSide;
  right: CheckoutDualSegmentSide;
  activeSide: 'left' | 'right';
  onSelect: (side: 'left' | 'right') => void;
  scale: number;
  typography: CheckoutGradientDualSegmentTypography;
};

export function CheckoutGradientDualSegment({
  left,
  right,
  activeSide,
  onSelect,
  scale,
  typography,
}: CheckoutGradientDualSegmentProps) {
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

  const isServiceHandover = typography === 'service-handover';
  const titleSize = (isServiceHandover ? 15.715 : 16) * scale;
  const subtitleSize = (isServiceHandover ? 12.572 : 12) * scale;
  const titleLineHeight = (isServiceHandover ? 13.934 : 14) * scale;
  const subtitleLineHeight = (isServiceHandover ? 16.762 : 17) * scale;
  const titleLetterSpacing = (isServiceHandover ? 0.4976 : 0.5) * scale;
  const subtitleLetterSpacing = (isServiceHandover ? 0.5238 : 0.5) * scale;

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

  const renderHalf = (side: 'left' | 'right', option: CheckoutDualSegmentSide, selected: boolean) => {
    const titleWeight = selected
      ? isServiceHandover
        ? 'semibold'
        : 'medium'
      : isServiceHandover
        ? 'semibold'
        : side === 'left'
          ? 'medium'
          : 'medium';
    const subtitleWeight = selected ? (isServiceHandover ? 'semibold' : 'regular') : 'regular';

    return (
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ selected }}
        onPress={() => onSelect(side)}
        style={({ pressed }) => [
          styles.half,
          pillCorners,
          { opacity: pressed ? 0.95 : 1, borderWidth: 0 },
        ]}>
        {selected
          ? activePillShell(
              <LinearGradient
                colors={[...SEGMENT_GRADIENT]}
                start={{ x: 0.92, y: 0.08 }}
                end={{ x: 0.08, y: 0.92 }}
                style={StyleSheet.absoluteFill}
              />,
              side,
            )
          : (
            <View style={[StyleSheet.absoluteFill, styles.inactiveHalf, pillCorners]} />
          )}
        <View
          style={[
            styles.copy,
            {
              gap: (isServiceHandover ? 5.573 : side === 'right' && !isServiceHandover ? 5 : 6) * scale,
              paddingVertical: 10 * scale,
            },
          ]}>
          <Text
            style={[
              searchFont(titleWeight),
              selected ? styles.titleOnGradient : isServiceHandover ? styles.titleDark : side === 'left' ? styles.titleMuted : styles.titleDark,
              {
                fontSize: titleSize,
                lineHeight: titleLineHeight,
                letterSpacing: titleLetterSpacing,
                textAlign: isServiceHandover ? 'center' : undefined,
              },
            ]}>
            {option.title}
          </Text>
          <Text
            style={[
              searchFont(subtitleWeight),
              selected
                ? styles.subOnGradient
                : isServiceHandover
                  ? styles.subMuted
                  : side === 'left'
                    ? styles.subMuted
                    : styles.subDark,
              {
                fontSize: subtitleSize,
                lineHeight: isServiceHandover
                  ? subtitleLineHeight
                  : selected
                    ? 17 * scale
                    : side === 'right' && !selected
                      ? 14 * scale
                      : 17 * scale,
                letterSpacing: isServiceHandover && selected ? subtitleLetterSpacing : isServiceHandover ? 0 : selected ? 0.5 * scale : 0,
              },
            ]}>
            {option.subtitle}
          </Text>
        </View>
      </Pressable>
    );
  };

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
        {renderHalf('left', left, activeSide === 'left')}
        {renderHalf('right', right, activeSide === 'right')}
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
  inactiveHalf: {
    backgroundColor: SwashoColors.surface,
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
