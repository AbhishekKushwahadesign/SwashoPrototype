import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import {
  PromiseDeco490Icon,
  PromiseDeco491Icon,
  PromiseDeco492Icon,
  PromiseDeco493Icon,
  PromiseDeco494Icon,
  PromiseDeco495Icon,
  PromiseDeco496Icon,
  PromiseIcon,
  PromiseLight486Icon,
  PromiseLight488Icon,
  PromiseLight489Icon,
} from './figma-icons';

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

const DECORATIONS = [
  { Icon: PromiseLight488Icon, left: 46, top: 59.74, width: 64.998, height: 76.264 },
  { Icon: PromiseDeco490Icon, left: 25.77, top: 104.88, width: 19.714, height: 17.255 },
  { Icon: PromiseDeco491Icon, left: 103.13, top: 53.75, width: 19.714, height: 17.255 },
  { Icon: PromiseLight486Icon, left: 169, top: 59.74, width: 64.998, height: 76.264 },
  { Icon: PromiseLight489Icon, left: 297, top: 59.51, width: 64.998, height: 76.264 },
  { Icon: PromiseDeco495Icon, left: -5, top: 30, width: 19.714, height: 17.255 },
  { Icon: PromiseDeco496Icon, left: 397.29, top: 110.87, width: 19.714, height: 17.255 },
  { Icon: PromiseDeco492Icon, left: 267.29, top: 98.14, width: 19.714, height: 17.255 },
  { Icon: PromiseDeco493Icon, left: 356, top: 49.52, width: 19.714, height: 17.255 },
  { Icon: PromiseDeco494Icon, left: 176.41, top: 38.02, width: 19.714, height: 17.255 },
];

export function PromiseSection({ scale, onLearnMorePress }: PromiseSectionProps) {
  return (
    <View style={[styles.container, { height: 140 * scale }]}>
      {DECORATIONS.map(({ Icon, left, top, width, height }, index) => (
        <View
          key={index}
          pointerEvents="none"
          style={{
            position: 'absolute',
            left: left * scale,
            top: top * scale,
            width: width * scale,
            height: height * scale,
          }}>
          <Icon width={width * scale} height={height * scale} />
        </View>
      ))}

      <View
        style={[
          styles.titleBlock,
          { top: 6 * scale, transform: [{ translateX: -48.585 * scale }] },
        ]}>
        <Image
          source={require('@/assets/images/home/our.png')}
          style={{ width: 30 * scale, height: 10 * scale }}
          contentFit="contain"
        />
        <PromiseIcon width={97.17 * scale} height={18.49 * scale} />
      </View>

      <Pressable
        onPress={onLearnMorePress}
        style={[styles.learnMorePressable, { top: 6 * scale, marginLeft: 113.5 * scale }]}>
        <Text style={[styles.learnMore, { fontSize: 12 * scale, lineHeight: 16 * scale }]}>Learn more</Text>
      </Pressable>

      <View style={[styles.steps, { left: 32 * scale, top: 52.49 * scale, gap: 20 * scale }]}>
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
    position: 'relative',
  },
  titleBlock: {
    position: 'absolute',
    left: '50%',
    alignItems: 'center',
    gap: 0,
  },
  learnMorePressable: {
    position: 'absolute',
    left: '50%',
  },
  learnMore: {
    fontFamily: 'Poppins_400Regular',
    color: SwashoColors.primary600,
    letterSpacing: 0.5,
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
  steps: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
