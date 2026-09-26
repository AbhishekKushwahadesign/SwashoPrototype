import { LinearGradient } from 'expo-linear-gradient';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import {
  AiAIcon,
  CalendarBoldIcon,
  CalendarLinearIcon,
  HomeSmileIcon,
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

function SelectedCapsule({ scale, left }: { scale: number; left: number }) {
  const size = 67.87 * scale;
  const height = 52.21 * scale;

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(200)}
      style={[
        styles.capsule,
        {
          width: size,
          height,
          borderRadius: 12.53 * scale,
          left,
          top: '50%',
          transform: [{ translateY: -(52.21 * scale) / 2 }],
          paddingLeft: 41.77 * scale,
          paddingRight: 26.11 * scale,
          paddingVertical: 12.53 * scale,
          borderWidth: 2,
        },
      ]}>
      <LinearGradient
        colors={['#7e77ff', '#7056ff', '#6234ff']}
        style={[StyleSheet.absoluteFill, { borderRadius: 12.53 * scale }]}
      />
      <CalendarBoldIcon
        width={37.6 * scale}
        height={37.6 * scale}
        style={{ position: 'absolute', left: -7.27 * scale, top: 9.08 * scale }}
      />
      <View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, { borderRadius: 12.53 * scale }, figmaShadow(FigmaShadows.selectedNavCapsule, scale)]}
      />
    </Animated.View>
  );
}

export function NavBar({ variant, scale, onSubscriptionPress }: NavBarProps) {
  const isHome = variant === 'Home';
  const pillWidth = 238 * scale;
  const pillHeight = 63 * scale;
  const homeLeft = 41 * scale;
  const ordersLeft = 118 * scale;

  return (
    <LinearGradient
      colors={['rgba(255,255,255,0.05)', 'rgba(255,255,255,0.85)', '#ffffff']}
      locations={[0, 0.35, 1]}
      style={[styles.container, { height: 101 * scale, paddingTop: 9 * scale }]}>
      <View
        style={[
          styles.pill,
          {
            width: pillWidth,
            height: pillHeight,
            borderRadius: SwashoRadii.xl * scale,
            borderWidth: 1.5,
            ...figmaShadow(FigmaShadows.navPill, scale),
          },
        ]}>
        <SelectedCapsule scale={scale} left={isHome ? homeLeft : ordersLeft} />

        <View style={[styles.items, { width: 218 * scale, gap: 25.06 * scale }]}>
          <View style={[styles.item, { width: 61 * scale, gap: 2.09 * scale }]}>
            <HomeSmileIcon width={20.88 * scale} height={20.88 * scale} />
            <Text
              style={[
                styles.homeLabel,
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

          <Pressable onPress={onSubscriptionPress} style={[styles.item, { width: 61 * scale, gap: 2.09 * scale }]}>
            <CalendarLinearIcon width={20.88 * scale} height={20.88 * scale} />
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

          <View style={[styles.item, { width: 61 * scale, gap: 4.18 * scale }]}>
            <View style={{ width: 23.35 * scale, height: 19.18 * scale, position: 'relative' }}>
              <StarsIcon width={12.63 * scale} height={13.47 * scale} style={{ position: 'absolute', right: 0, top: 1 }} />
              <StarsSmallIcon width={6.39 * scale} height={6.82 * scale} style={{ position: 'absolute', right: -2, top: 0 }} />
              <AiAIcon width={14.64 * scale} height={15.43 * scale} style={{ position: 'absolute', left: 0, bottom: 0 }} />
            </View>
            <Text style={[styles.navLabel, { fontSize: 10 * scale, lineHeight: 14.619 * scale }]}>Swasho AI</Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  pill: {
    backgroundColor: '#ffffff',
    borderColor: SwashoColors.neutral200,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
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
  homeLabel: {
    letterSpacing: 0.522,
    textAlign: 'center',
  },
  navLabel: {
    fontFamily: 'Poppins_500Medium',
    color: SwashoColors.neutral500,
    letterSpacing: 0.522,
    textAlign: 'center',
  },
});
