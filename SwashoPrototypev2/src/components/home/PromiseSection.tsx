import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { PromiseIcon } from './figma-icons';

import { SwashoColors } from '@/constants/swasho-tokens';

import { PromiseStep } from './PromiseStep';

type PromiseSectionProps = {
  scale: number;
  onLearnMorePress?: () => void;
};

const STEPS = [
  { number: '1', label: 'Expert Care', width: 92 },
  { number: '2', label: 'Gentle Process', width: 115 },
  { number: '3', label: 'Safe Delivery', width: 101 },
];

export function PromiseSection({ scale, onLearnMorePress }: PromiseSectionProps) {
  return (
    <View style={[styles.container, { height: 140 * scale, paddingTop: 6 * scale }]}>
      <View style={styles.titleRow}>
        <View style={styles.titleBlock}>
          <Image
            source={require('@/assets/images/home/our.png')}
            style={{ width: 30 * scale, height: 10 * scale }}
            contentFit="contain"
          />
          <PromiseIcon width={97.17 * scale} height={18.49 * scale} />
        </View>
        <Pressable onPress={onLearnMorePress}>
          <Text
            style={[
              styles.learnMore,
              { fontSize: 12 * scale, lineHeight: 16 * scale, right: 24 * scale },
            ]}>
            Learn more
          </Text>
        </Pressable>
      </View>
      <View style={[styles.steps, { gap: 20 * scale, marginTop: 18 * scale, paddingHorizontal: 32 * scale }]}>
        {STEPS.map((step) => (
          <PromiseStep key={step.number} number={step.number} label={step.label} width={step.width} scale={scale} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    position: 'relative',
  },
  titleBlock: {
    alignItems: 'center',
    gap: 0,
  },
  learnMore: {
    position: 'absolute',
    top: 0,
    fontFamily: 'Poppins_400Regular',
    color: SwashoColors.primary600,
    letterSpacing: 0.5,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
  steps: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
