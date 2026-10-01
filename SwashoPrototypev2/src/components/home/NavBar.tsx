import { LinearGradient } from 'expo-linear-gradient';
import { createElement } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import {
  AiAIcon,
  CalendarBoldIcon,
  CalendarLinearIcon,
  HomeSmileIcon,
  HomeSmileLinearIcon,
  StarsIcon,
  StarsSmallIcon,
} from './figma-icons';

import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { FigmaShadows, figmaShadow } from './figma-shadows';

export type NavBarVariant = 'Home' | 'Orders';

type NavBarProps = {
  variant: NavBarVariant;
  scale: number;
  onSubscriptionPress?: () => void;
};

const NAV_HEIGHT = 101;
const NAV_PILL_SHADOW = { offsetX: 0, offsetY: 0, blur: 2, color: '#000000', opacity: 0.19 } as const;

const BLUR_LAYERS = [
  { blurPx: 1.5, fadeStart: '0%', fadeEnd: '100%' },
  { blurPx: 6, fadeStart: '30%', fadeEnd: '100%' },
  { blurPx: 14, fadeStart: '55%', fadeEnd: '100%' },
  { blurPx: 24, fadeStart: '75%', fadeEnd: '100%' },
] as const;

function webBlurLayerStyle(blurPx: number, fadeStart: string, fadeEnd: string, height: number) {
  const mask = `linear-gradient(to top, black ${fadeStart}, transparent ${fadeEnd})`;
  return {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height,
    pointerEvents: 'none',
    backdropFilter: `blur(${blurPx}px)`,
    WebkitBackdropFilter: `blur(${blurPx}px)`,
    maskImage: mask,
    WebkitMaskImage: mask,
  } as const;
}

function WebBlurLayer({
  blurPx,
  fadeStart,
  fadeEnd,
  height,
}: {
  blurPx: number;
  fadeStart: string;
  fadeEnd: string;
  height: number;
}) {
  return createElement('div', {
    style: webBlurLayerStyle(blurPx, fadeStart, fadeEnd, height),
  });
}

function ProgressiveBlurFade({ scale }: { scale: number }) {
  const height = NAV_HEIGHT * scale;
  const fadeStyle = [styles.blurFade, { height }];

  if (Platform.OS !== 'web') {
    return (
      <LinearGradient
        colors={['rgba(255,255,255,0.05)', '#ffffff']}
        locations={[0, 0.75]}
        style={fadeStyle}
        pointerEvents="none"
      />
    );
  }

  return (
    <View pointerEvents="none" style={fadeStyle}>
      {BLUR_LAYERS.map((layer) => (
        <WebBlurLayer
          key={`${layer.blurPx}-${layer.fadeStart}`}
          blurPx={layer.blurPx}
          fadeStart={layer.fadeStart}
          fadeEnd={layer.fadeEnd}
          height={height}
        />
      ))}
      <LinearGradient
        colors={['rgba(255,255,255,0.05)', '#ffffff']}
        locations={[0, 0.75]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.01)']}
        locations={[0.19232, 0.87445]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
    </View>
  );
}

type SelectedCapsuleProps = {
  scale: number;
  left: number;
  variant: NavBarVariant;
};

function SelectedCapsule({ scale, left, variant }: SelectedCapsuleProps) {
  const isHome = variant === 'Home';
  const width = (isHome ? 67.874 : 83) * scale;
  const height = (isHome ? 52.211 : 52) * scale;
  const borderRadius = 12.531 * scale;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={[
        styles.capsule,
        {
          width,
          height,
          borderRadius,
          left,
          top: '50%',
          transform: [{ translateY: -height / 2 }],
          paddingLeft: 41.769 * scale,
          paddingRight: 26.106 * scale,
          paddingVertical: 12.531 * scale,
          borderWidth: 2,
        },
      ]}>
      <LinearGradient
        colors={['#7e77ff', '#7056ff', '#6234ff']}
        style={[StyleSheet.absoluteFill, { borderRadius }]}
      />
      {!isHome && (
        <CalendarBoldIcon
          width={37.596 * scale}
          height={37.596 * scale}
          style={{ position: 'absolute', left: 0.3 * scale, top: 8.96 * scale }}
        />
      )}
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { borderRadius }, figmaShadow(FigmaShadows.selectedNavCapsule, scale)]}
      />
    </Animated.View>
  );
}

export function NavBar({ variant, scale, onSubscriptionPress }: NavBarProps) {
  const isHome = variant === 'Home';
  const pillWidth = 238 * scale;
  const pillHeight = 63 * scale;
  const itemsWidth = 218 * scale;
  const itemWidth = 61 * scale;
  const pillInset = (pillWidth - itemsWidth) / 2;
  const homeCenter = pillInset + itemWidth / 2;
  const subscriptionCenter = pillInset + itemWidth + (itemsWidth - itemWidth * 3) / 2 + itemWidth / 2;
  const homeCapsuleLeft = homeCenter - (67.874 * scale) / 2;
  const ordersCapsuleLeft = subscriptionCenter - (83 * scale) / 2;
  const iconSize = 20.884 * scale;

  return (
    <View style={[styles.container, { height: NAV_HEIGHT * scale, paddingTop: 9.03 * scale }]}>
      <ProgressiveBlurFade scale={scale} />

      <View
        style={[
          styles.pill,
          styles.pillSharp,
          {
            width: pillWidth,
            height: pillHeight,
            borderRadius: SwashoRadii.xl * scale,
            borderWidth: 1.5,
            ...figmaShadow(NAV_PILL_SHADOW, scale),
          },
        ]}>
        <SelectedCapsule scale={scale} left={isHome ? homeCapsuleLeft : ordersCapsuleLeft} variant={variant} />

        <View style={[styles.items, { width: itemsWidth }]}>
          <View
            style={[
              styles.item,
              { width: itemWidth, gap: 2.088 * scale, height: isHome ? 51 * scale : 47 * scale },
            ]}>
            {isHome ? (
              <HomeSmileIcon width={iconSize} height={iconSize} />
            ) : (
              <HomeSmileLinearIcon width={iconSize} height={iconSize} />
            )}
            <Text
              style={[
                styles.navLabel,
                {
                  fontSize: 10 * scale,
                  lineHeight: 14.619 * scale,
                  color: isHome ? '#ffffff' : SwashoColors.neutral500,
                  fontFamily: isHome ? 'Poppins_600SemiBold' : 'Poppins_500Medium',
                },
              ]}>
              Home
            </Text>
          </View>

          <Pressable
            onPress={onSubscriptionPress}
            style={[
              styles.item,
              { width: itemWidth, gap: 2.088 * scale, height: !isHome ? 51 * scale : 47 * scale },
            ]}>
            {!isHome ? (
              <CalendarBoldIcon width={iconSize} height={iconSize} />
            ) : (
              <CalendarLinearIcon width={iconSize} height={iconSize} />
            )}
            <Text
              style={[
                styles.navLabel,
                {
                  fontSize: 10 * scale,
                  lineHeight: 14.619 * scale,
                  color: !isHome ? '#ffffff' : SwashoColors.neutral500,
                  fontFamily: !isHome ? 'Poppins_600SemiBold' : 'Poppins_500Medium',
                },
              ]}>
              Subscription
            </Text>
          </Pressable>

          <View style={[styles.item, { width: itemWidth, gap: 4.177 * scale, height: 47 * scale }]}>
            <View style={{ width: 23.345 * scale, height: 19.176 * scale, position: 'relative' }}>
              <StarsIcon
                width={12.629 * scale}
                height={13.471 * scale}
                style={{ position: 'absolute', right: 0, top: 1.51 * scale }}
              />
              <StarsSmallIcon
                width={6.389 * scale}
                height={6.815 * scale}
                style={{ position: 'absolute', right: -2 * scale, top: 0.07 * scale }}
              />
              <AiAIcon
                width={14.637 * scale}
                height={15.432 * scale}
                style={{ position: 'absolute', left: 0.85 * scale, bottom: 0 }}
              />
              <View
                style={{
                  position: 'absolute',
                  left: 16.74 * scale,
                  top: 9.8 * scale,
                  width: 2.918 * scale,
                  height: 9.554 * scale,
                  borderTopLeftRadius: 7711.109 * scale,
                  borderTopRightRadius: 7711.109 * scale,
                  borderBottomLeftRadius: 7711.111 * scale,
                  borderBottomRightRadius: 620.88 * scale,
                  backgroundColor: SwashoColors.neutral500,
                }}
              />
            </View>
            <Text style={[styles.navLabel, { fontSize: 10 * scale, lineHeight: 14.619 * scale }]}>
              Swasho AI
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
    ...Platform.select({
      web: { overflow: 'visible' as const },
      default: { overflow: 'hidden' as const },
    }),
  },
  blurFade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 0,
  },
  pill: {
    backgroundColor: '#ffffff',
    borderColor: SwashoColors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pillSharp: {
    zIndex: 2,
  },
  capsule: {
    position: 'absolute',
    borderColor: '#ffffff',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 0,
  },
  items: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    fontFamily: 'Poppins_500Medium',
    color: SwashoColors.neutral500,
    letterSpacing: 0.5221,
    textAlign: 'center',
  },
});
