import { LinearGradient } from 'expo-linear-gradient';
import { createElement } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import {
  AiAIcon,
  CalendarBoldAddIcon,
  CalendarLinearIcon,
  HomeSmileIcon,
  HomeSmileLinearIcon,
  StarsIcon,
  StarsSmallIcon,
} from './figma-icons';

import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { FigmaShadows, figmaShadow } from './figma-shadows';

export type NavBarVariant = 'Home' | 'Orders' | 'AI';

type NavBarProps = {
  variant: NavBarVariant;
  scale: number;
  onHomePress?: () => void;
  onSubscriptionPress?: () => void;
  onSwashoAiPress?: () => void;
};

const NAV_HEIGHT = 101;
/** Figma bottom nav (3344:8669) — lift pill above home-indicator zone. */
export const NAV_BAR_BOTTOM_INSET = 80;
const BLUR_LAYERS = [
  { blurPx: 1.5, fadeStart: '0%', fadeEnd: '100%' },
  { blurPx: 6, fadeStart: '30%', fadeEnd: '100%' },
  { blurPx: 14, fadeStart: '55%', fadeEnd: '100%' },
  { blurPx: 24, fadeStart: '75%', fadeEnd: '100%' },
] as const;

const NAV_BLUR_GRADIENT = ['rgba(255,255,255,0)', 'rgba(255,255,255,0.1)'] as const;
const NAV_BLUR_GRADIENT_LOCATIONS = [0, 0.75] as const;

const PILL_WIDTH = 238;
const PILL_HEIGHT = 63;
const PILL_TOP = 9.03;
const PILL_BORDER = 1.5;
const ITEMS_WIDTH = 218;
const ITEM_WIDTH = 61;
const ICON_SIZE = 20.884;
const CAPSULE_RADIUS = 12.531;
const CAPSULE_BORDER = 2;

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

/** Figma 3344:8669 — stacked backdrop blur across full nav chrome (from top of bar). */
function ProgressiveBlurFade({ scale }: { scale: number }) {
  const height = NAV_HEIGHT * scale;
  const fadeStyle = [styles.blurFade, { height }];

  if (Platform.OS !== 'web') {
    return (
      <LinearGradient
        colors={[...NAV_BLUR_GRADIENT]}
        locations={[...NAV_BLUR_GRADIENT_LOCATIONS]}
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
          blurPx={layer.blurPx * scale}
          fadeStart={layer.fadeStart}
          fadeEnd={layer.fadeEnd}
          height={height}
        />
      ))}
      <LinearGradient
        colors={[...NAV_BLUR_GRADIENT]}
        locations={[...NAV_BLUR_GRADIENT_LOCATIONS]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
    </View>
  );
}

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
  AI: {
    width: 67.874,
    height: 52.211,
    centerOffsetX: 77,
    gradient: 'matrix(-6.08 3.1719 -0.76317 -9.3182 64.521 7.7703)',
  },
} as const;

function capsuleGradientXml(width: number, height: number, transform: string) {
  return `<svg viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"><defs><radialGradient id="navCapsuleGrad" gradientUnits="userSpaceOnUse" cx="0" cy="0" r="10" gradientTransform="${transform}"><stop stop-color="#7e77ff" offset="0"/><stop stop-color="#7056ff" offset="0.5"/><stop stop-color="#6234ff" offset="1"/></radialGradient></defs><rect x="0" y="0" width="100%" height="100%" fill="url(#navCapsuleGrad)"/></svg>`;
}

function SelectedCapsule({ scale, variant }: { scale: number; variant: NavBarVariant }) {
  const geometry = CAPSULE_GEOMETRY[variant];
  const width = geometry.width * scale;
  const height = geometry.height * scale;
  const borderRadius = CAPSULE_RADIUS * scale;
  const innerWidth = (PILL_WIDTH - PILL_BORDER * 2) * scale;
  const innerHeight = (PILL_HEIGHT - PILL_BORDER * 2) * scale;
  const left = innerWidth / 2 + geometry.centerOffsetX * scale - width / 2;
  const top = variant === 'Orders' ? 5 * scale : (innerHeight - height) / 2;

  const borderWidth = CAPSULE_BORDER * scale;
  const innerRadius = Math.max(0, borderRadius - borderWidth);

  return (
    <View
      pointerEvents="none"
      style={[
        styles.capsule,
        { width, height, borderRadius, left, top, borderWidth },
      ]}>
      <View
        style={[
          styles.capsuleFill,
          {
            borderRadius: innerRadius,
            top: borderWidth,
            left: borderWidth,
            right: borderWidth,
            bottom: borderWidth,
          },
        ]}>
        <SvgXml
          xml={capsuleGradientXml(geometry.width, geometry.height, geometry.gradient)}
          width="100%"
          height="100%"
        />
        <View
          pointerEvents="none"
          style={[
            styles.capsuleInsetShadow,
            {
              borderRadius: innerRadius,
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            },
            figmaShadow(FigmaShadows.selectedNavCapsule, scale),
          ]}
        />
      </View>
    </View>
  );
}

export function SwashoAiIcon({
  scale,
  offsetX,
  active = false,
}: {
  scale: number;
  offsetX: number;
  active?: boolean;
}) {
  const markColor = active ? SwashoColors.surface : SwashoColors.neutral500;
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
          backgroundColor: markColor,
        }}
      />
    </View>
  );
}

function NavLabel({ label, active, scale }: { label: string; active: boolean; scale: number }) {
  return (
    <Text
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

export function NavBar({
  variant,
  scale,
  onHomePress,
  onSubscriptionPress,
  onSwashoAiPress,
}: NavBarProps) {
  const isHome = variant === 'Home';
  const isOrders = variant === 'Orders';
  const isAi = variant === 'AI';
  const iconSize = ICON_SIZE * scale;
  const itemStyle = (active: boolean, gap = 2.088) => [
    styles.item,
    { width: ITEM_WIDTH * scale, gap: gap * scale, height: (active ? 51 : 47) * scale },
  ];
  const aiOffsetX = isHome ? 0 : -1;

  return (
    <View style={[styles.container, { height: NAV_HEIGHT * scale, paddingTop: PILL_TOP * scale }]}>
      <ProgressiveBlurFade scale={scale} />

      <View
        style={[
          styles.pill,
          styles.pillAboveBlur,
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
          <Pressable onPress={onHomePress} style={itemStyle(isHome)}>
            {isHome ? (
              <HomeSmileIcon width={iconSize} height={iconSize} />
            ) : (
              <HomeSmileLinearIcon width={iconSize} height={iconSize} />
            )}
            <NavLabel label="Home" active={isHome} scale={scale} />
          </Pressable>

          <Pressable onPress={onSubscriptionPress} style={itemStyle(isOrders)}>
            {isOrders ? (
              <CalendarBoldAddIcon width={iconSize} height={iconSize} />
            ) : (
              <CalendarLinearIcon width={iconSize} height={iconSize} stroke="#7C7C7C" />
            )}
            <NavLabel label="Subscription" active={isOrders} scale={scale} />
          </Pressable>

          <Pressable onPress={onSwashoAiPress} style={itemStyle(isAi, 4.177)}>
            <SwashoAiIcon scale={scale} offsetX={aiOffsetX} active={isAi} />
            <NavLabel label="Swasho AI" active={isAi} scale={scale} />
          </Pressable>
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
    top: 0,
    bottom: 0,
    zIndex: 0,
  },
  pill: {
    backgroundColor: SwashoColors.surface,
    borderColor: SwashoColors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  pillAboveBlur: {
    zIndex: 2,
  },
  capsule: {
    position: 'absolute',
    borderColor: '#FFFFFF',
    borderStyle: 'solid',
    backgroundColor: 'transparent',
    zIndex: 3,
    ...Platform.select({
      web: { boxSizing: 'border-box' as const },
      default: {},
    }),
  },
  capsuleFill: {
    position: 'absolute',
    overflow: 'hidden',
  },
  capsuleInsetShadow: {
    ...StyleSheet.absoluteFillObject,
  },
  items: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 4,
  },
  item: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    zIndex: 4,
  },
  navLabel: {
    textAlign: 'center',
    flexShrink: 0,
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
