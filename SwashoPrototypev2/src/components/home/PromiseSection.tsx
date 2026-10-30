import MaskedView from '@react-native-masked-view/masked-view';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

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
  { number: '1', label: 'Expert Care' },
  { number: '2', label: 'Gentle Process' },
  { number: '3', label: 'Safe Delivery' },
];

function OurText({ scale }: { scale: number }) {
  const textStyle = {
    fontFamily: 'Poppins_700Bold',
    fontSize: 15 * scale,
    lineHeight: 18 * scale,
    letterSpacing: 0.4655 * scale,
    textAlign: 'center' as const,
  };

  if (Platform.OS === 'web') {
    return (
      <Text
        style={[
          textStyle,
          {
            backgroundImage: 'linear-gradient(180deg, #f3f2ff 0%, #ffffff 100%)',
            backgroundClip: 'text',
            color: 'transparent',
          } as object,
        ]}>
        Our
      </Text>
    );
  }

  return (
    <MaskedView maskElement={<Text style={textStyle}>Our</Text>}>
      <LinearGradient colors={['#f3f2ff', '#ffffff']} start={{ x: 0.5, y: 0 }} end={{ x: 0.5, y: 1 }}>
        <Text style={[textStyle, { opacity: 0 }]}>Our</Text>
      </LinearGradient>
    </MaskedView>
  );
}

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
          {
            top: 6 * scale,
            gap: 2 * scale,
          },
        ]}>
        <OurText scale={scale} />
        <PromiseIcon width={97.167 * scale} height={18.487 * scale} />
      </View>

      <Pressable
        onPress={onLearnMorePress}
        style={[styles.learnMorePressable, { top: 6 * scale, marginLeft: 113.5 * scale }]}>
        <Text style={[styles.learnMore, { fontSize: 12 * scale, lineHeight: 16 * scale }]}>Learn more</Text>
      </Pressable>

      <View style={[styles.steps, { left: 32 * scale, top: 52.49 * scale, gap: 20 * scale }]}>
        {STEPS.map((step) => (
          <PromiseStep key={step.number} number={step.number} label={step.label} scale={scale} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'visible',
    position: 'relative',
  },
  titleBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
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
    flexShrink: 0,
  },
});
