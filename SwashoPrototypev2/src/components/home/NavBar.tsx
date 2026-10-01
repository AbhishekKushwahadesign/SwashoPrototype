import { LinearGradient } from 'expo-linear-gradient';
import { createElement } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { SvgXml } from 'react-native-svg';

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
const NAV_BACKDROP_BLUR = 1.5;
const PILL_WIDTH = 238;
const PILL_HEIGHT = 63;
const PILL_TOP = 9.03;
const PILL_BORDER = 1.5;
const ITEMS_WIDTH = 218;
const ITEM_WIDTH = 61;
const ICON_SIZE = 20.884;
const CAPSULE_RADIUS = 12.531;
const CAPSULE_BORDER = 2;

const FADE_COLORS = ['rgba(255,255,255,0.05)', SwashoColors.surface] as const;
const FADE_LOCATIONS = [0, 0.75] as const;
const ORDERS_TINT_COLORS = ['rgba(0,0,0,0)', 'rgba(0,0,0,0.01)'] as const;
const ORDERS_TINT_LOCATIONS = [0.19232, 0.87445] as const;

const CAPSULE_GEOMETRY = {
  Home: {
    width: 67.874,
    height: 52.211,
    centerOffsetX: -79,
    gradient: 'matrix(-6.08 3.1719 -0.76317 -9.3182 64.521 7.7703)',
  },
  Orders: {
    width: 83,
    height: 52,
    centerOffsetX: -1,
    gradient: 'matrix(-7.435 3.159 -0.93324 -9.2805 78.9 7.7389)',
  },
} as const;

function capsuleGradientXml(width: number, height: number, transform: string) {
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><defs><radialGradient id="navCapsuleGrad" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="10" gradientTransform="${transform}"><stop stop-color="#7e77ff" offset="0"/><stop stop-color="#7056ff" offset="0.5"/><stop stop-color="#6234ff" offset="1"/></radialGradient></defs><rect x="0" y="0" width="100%" height="100%" fill="url(#navCapsuleGrad)"/></svg>`;
}

function NavBackdrop({ variant, scale }: { variant: NavBarVariant; scale: number }) {
  const height = NAV_HEIGHT * scale;

  if (Platform.OS === 'web') {
    const fade = `linear-gradient(180deg, ${FADE_COLORS[0]} 0%, ${FADE_COLORS[1]} 75%)`;
    const tint = 'linear-gradient(180deg, rgba(0,0,0,0) 19.232%, rgba(0,0,0,0.01) 87.445%)';
    return createElement('div', {
      'data-testid': 'nav-backdrop',
      style: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        height,
        pointerEvents: 'none',
        backdropFilter: `blur(${NAV_BACKDROP_BLUR * scale}px)`,
        WebkitBackdropFilter: `blur(${NAV_BACKDROP_BLUR * scale}px)`,
        backgroundImage: variant === 'Orders' ? `${fade}, ${tint}` : fade,
      },
    });
  }

  return (
    <View pointerEvents="none" style={[styles.backdrop, { height }]}>
      <LinearGradient colors={FADE_COLORS} locations={FADE_LOCATIONS} style={StyleSheet.absoluteFill} />
      {variant === 'Orders' && (
        <LinearGradient
          colors={ORDERS_TINT_COLORS}
          locations={ORDERS_TINT_LOCATIONS}
          style={StyleSheet.absoluteFill}
        />
      )}
    </View>
  );
}

function SelectedCapsule({ scale, variant }: { scale: number; variant: NavBarVariant }) {
  const geometry = CAPSULE_GEOMETRY[variant];
  const width = geometry.width * scale;
  const height = geometry.height * scale;
  const borderRadius = CAPSULE_RADIUS * scale;
  const innerWidth = (PILL_WIDTH - PILL_BORDER * 2) * scale;
  const innerHeight = (PILL_HEIGHT - PILL_BORDER * 2) * scale;
  const left = innerWidth / 2 + geometry.centerOffsetX * scale - width / 2;
  const top = variant === 'Home' ? (innerHeight - height) / 2 : 5 * scale;

  return (
    <Animated.View
      key={variant}
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      pointerEvents="none"
      style={[
        styles.capsule,
        { width, height, borderRadius, left, top, borderWidth: CAPSULE_BORDER * scale },
      ]}>
      <View style={[StyleSheet.absoluteFill, { borderRadius, overflow: 'hidden' }]}>
        <SvgXml
          xml={capsuleGradientXml(geometry.width, geometry.height, geometry.gradient)}
          width="100%"
          height="100%"
        />
      </View>
      <View
        style={[
          styles.capsuleInsetShadow,
          { borderRadius, top: -scale, left: -scale, right: -scale, bottom: -scale },
          figmaShadow(FigmaShadows.selectedNavCapsule, scale),
        ]}
      />
    </Animated.View>
  );
}

function SwashoAiIcon({ scale, offsetX }: { scale: number; offsetX: number }) {
  const x = (value: number) => (value + offsetX) * scale;
  return (
    <View style={{ width: 23.345 * scale, height: 19.176 * scale }}>
      <View style={[styles.clip, { left: x(13.26), top: 1.51 * scale, width: 8.684 * scale, height: 8.684 * scale }]}>
        <View
          style={[
            styles.rotatedStar,
            { left: 0.25 * scale, top: -4.33 * scale, width: 13.724 * scale, height: 12.899 * scale },
          ]}>
          <StarsIcon width={12.629 * scale} height={13.471 * scale} style={styles.starRotation} />
        </View>
      </View>
      <View style={[styles.clip, { left: x(20.7), top: 0.07 * scale, width: 3.722 * scale, height: 3.722 * scale }]}>
        <View
          style={[
            styles.rotatedStar,
            { left: -0.62 * scale, top: -2.48 * scale, width: 6.943 * scale, height: 6.526 * scale },
          ]}>
          <StarsSmallIcon width={6.389 * scale} height={6.815 * scale} style={styles.starRotation} />
        </View>
      </View>
      <View style={{ position: 'absolute', left: x(0.85), top: 3.92 * scale, width: 14.637 * scale, height: 15.432 * scale }}>
        <AiAIcon
          width={14.455 * scale}
          height={14.722 * scale}
          style={{ position: 'absolute', left: 0.091 * scale, top: 0.71 * scale }}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          left: x(16.74),
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
  );
}

function NavLabel({ label, active, scale }: { label: string; active: boolean; scale: number }) {
  return (
    <Text
      numberOfLines={1}
      style={[
        styles.navLabel,
        {
          fontSize: 10 * scale,
          lineHeight: 14.619 * scale,
          letterSpacing: 0.5221 * scale,
          color: active ? SwashoColors.surface : SwashoColors.neutral500,
          fontFamily: active ? 'Poppins_600SemiBold' : 'Poppins_500Medium',
        },
      ]}>
      {label}
    </Text>
  );
}

export function NavBar({ variant, scale, onSubscriptionPress }: NavBarProps) {
  const isHome = variant === 'Home';
  const iconSize = ICON_SIZE * scale;
  const itemStyle = (active: boolean, gap = 2.088) => [
    styles.item,
    { width: ITEM_WIDTH * scale, gap: gap * scale, height: (active ? 51 : 47) * scale },
  ];

  return (
    <View style={[styles.container, { height: NAV_HEIGHT * scale, paddingTop: PILL_TOP * scale }]}>
      <NavBackdrop variant={variant} scale={scale} />

      <View
        style={[
          styles.pill,
          {
            width: PILL_WIDTH * scale,
            height: PILL_HEIGHT * scale,
            borderRadius: SwashoRadii.xl * scale,
            borderWidth: PILL_BORDER * scale,
            transform: [{ translateX: (isHome ? 0.5 : 0) * scale }],
          },
          figmaShadow(FigmaShadows.navPill, scale),
        ]}>
        <SelectedCapsule scale={scale} variant={variant} />

        <View style={[styles.items, { width: ITEMS_WIDTH * scale }]}>
          <View style={itemStyle(isHome)}>
            {isHome ? (
              <HomeSmileIcon width={iconSize} height={iconSize} />
            ) : (
              <HomeSmileLinearIcon width={iconSize} height={iconSize} />
            )}
            <NavLabel label="Home" active={isHome} scale={scale} />
          </View>

          <Pressable onPress={onSubscriptionPress} style={itemStyle(!isHome)}>
            {isHome ? (
              <CalendarLinearIcon width={iconSize} height={iconSize} />
            ) : (
              <CalendarBoldIcon width={iconSize} height={iconSize} />
            )}
            <NavLabel label="Subscription" active={!isHome} scale={scale} />
          </Pressable>

          <View style={itemStyle(false, 4.177)}>
            <SwashoAiIcon scale={scale} offsetX={isHome ? 0 : -1} />
            <NavLabel label="Swasho AI" active={false} scale={scale} />
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
  },
  backdrop: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  pill: {
    backgroundColor: SwashoColors.surface,
    borderColor: SwashoColors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  capsule: {
    position: 'absolute',
    borderColor: SwashoColors.surface,
    overflow: 'hidden',
  },
  capsuleInsetShadow: {
    position: 'absolute',
  },
  items: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  navLabel: {
    textAlign: 'center',
  },
  clip: {
    position: 'absolute',
    overflow: 'hidden',
  },
  rotatedStar: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  starRotation: {
    transform: [{ rotate: '-88.84deg' }],
  },
});
