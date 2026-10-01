import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, StyleSheet, Text, View, type ViewStyle } from 'react-native';
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

const NAV_PILL_SHADOW = { offsetX: 0, offsetY: 0, blur: 2, color: '#000000', opacity: 0.19 } as const;

function webBlurLayer(blurPx: number, fadeStart: string, fadeEnd: string): ViewStyle {
  const mask = `linear-gradient(to top, black ${fadeStart}, transparent ${fadeEnd})`;
  return {
    backdropFilter: `blur(${blurPx}px)`,
    WebkitBackdropFilter: `blur(${blurPx}px)`,
    maskImage: mask,
    WebkitMaskImage: mask,
  } as ViewStyle;
}

function ProgressiveBlurFade({ scale }: { scale: number }) {
  const height = 101 * scale;

  if (Platform.OS !== 'web') {
    return (
      <LinearGradient
        colors={['rgba(255,255,255,0.05)', '#ffffff']}
        locations={[0, 0.75]}
        style={[StyleSheet.absoluteFill, { height }]}
        pointerEvents="none"
      />
    );
  }

  return (
    <>
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { height }, webBlurLayer(1.5, '0%', '100%')]}
      />
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { height }, webBlurLayer(6, '30%', '100%')]}
      />
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { height }, webBlurLayer(14, '55%', '100%')]}
      />
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { height }, webBlurLayer(24, '75%', '100%')]}
      />
      <LinearGradient
        colors={['rgba(255,255,255,0.05)', '#ffffff']}
        locations={[0, 0.75]}
        style={[StyleSheet.absoluteFill, { height }]}
        pointerEvents="none"
      />
      <LinearGradient
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.01)']}
        locations={[0.19232, 0.87445]}
        style={[StyleSheet.absoluteFill, { height }]}
        pointerEvents="none"
      />
    </>
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
    <View style={[styles.container, { height: 101 * scale, paddingTop: 9.03 * scale }]}>
      <ProgressiveBlurFade scale={scale} />

      <View
        style={[
          styles.pill,
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
    overflow: 'hidden',
  },
  pill: {
    backgroundColor: '#ffffff',
    borderColor: SwashoColors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 1,
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
