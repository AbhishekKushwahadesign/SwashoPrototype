import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { SwashoColors, SwashoFonts, SwashoRadii } from '@/constants/swasho-tokens';

import { FigmaShadows, figmaShadow } from './figma-shadows';

type PromiseStepProps = {
  number: string;
  label: string;
  scale: number;
  width: number;
};

export function PromiseStep({ number, label, scale, width }: PromiseStepProps) {
  const size = 31.14 * scale;

  return (
    <View style={[styles.column, { gap: 12 * scale, width: width * scale }]}>
      <View
        style={[
          styles.numberOuter,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 1,
          },
        ]}>
        <LinearGradient
          colors={[SwashoColors.primary500, 'rgba(135,129,255,0.44)', SwashoColors.primary200]}
          locations={[0, 0.5, 1]}
          style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }]}
        />
        <Text style={[styles.number, { fontSize: 14.534 * scale, lineHeight: 10.382 * scale }]}>{number}</Text>
        <View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, { borderRadius: size / 2 }, figmaShadow(FigmaShadows.promiseStepInner, scale)]}
        />
      </View>
      <View
        style={[
          styles.chip,
          {
            paddingHorizontal: 6 * scale,
            paddingVertical: 4 * scale,
            borderRadius: SwashoRadii.sm * scale,
            borderBottomWidth: 2,
            ...figmaShadow(FigmaShadows.promiseChip, scale),
          },
        ]}>
        <Text style={[styles.chipText, { fontSize: 13 * scale, lineHeight: 10 * scale }]}>{label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    alignItems: 'center',
  },
  numberOuter: {
    borderColor: SwashoColors.primary400,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  number: {
    fontFamily: SwashoFonts.quandoRegular,
    color: '#ffffff',
    letterSpacing: 0.4833,
  },
  chip: {
    backgroundColor: SwashoColors.promiseChip,
    borderBottomColor: SwashoColors.promiseChipBorder,
  },
  chipText: {
    fontFamily: 'Poppins_400Regular',
    color: SwashoColors.primary900,
    letterSpacing: 0.4655,
    textAlign: 'center',
  },
});
