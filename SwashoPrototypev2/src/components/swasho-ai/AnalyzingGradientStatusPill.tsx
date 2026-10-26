import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';

/** Figma 3415:17879 — rainbow ring + frosted inner pill. */
export const ANALYZING_STATUS_GRADIENT = [
  '#E40000',
  '#5D30F7',
  '#208AEF',
  '#00C853',
  '#FFB300',
  '#E40000',
] as const;

const FIGMA_PILL = {
  borderWidth: 1.875,
  paddingHorizontal: 12,
  paddingVertical: 12,
  radius: 9999,
  fontSize: 14,
  lineHeight: 16,
  letterSpacing: 0.28,
  innerBackground: 'rgba(250, 250, 250, 0.8)',
} as const;

type AnalyzingGradientStatusPillProps = {
  scale: number;
  label: string;
};

export function AnalyzingGradientStatusPill({ scale, label }: AnalyzingGradientStatusPillProps) {
  const borderWidth = FIGMA_PILL.borderWidth * scale;
  const outerRadius = FIGMA_PILL.radius * scale;
  const innerRadius = Math.max(0, outerRadius - borderWidth);

  return (
    <View
      style={[
        styles.clip,
        {
          borderRadius: outerRadius,
        },
      ]}>
      <LinearGradient
        colors={[...ANALYZING_STATUS_GRADIENT]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          padding: borderWidth,
          borderRadius: outerRadius,
        }}>
        <View
          style={{
            backgroundColor: FIGMA_PILL.innerBackground,
            paddingHorizontal: FIGMA_PILL.paddingHorizontal * scale,
            paddingVertical: FIGMA_PILL.paddingVertical * scale,
            borderRadius: innerRadius,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            numberOfLines={1}
            style={[
              searchFont('medium'),
              styles.label,
              {
                fontSize: FIGMA_PILL.fontSize * scale,
                lineHeight: FIGMA_PILL.lineHeight * scale,
                letterSpacing: FIGMA_PILL.letterSpacing * scale,
              },
            ]}>
            {label}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  clip: {
    alignSelf: 'center',
    flexShrink: 0,
    maxWidth: '100%',
    overflow: 'hidden',
  },
  label: {
    color: SwashoColors.neutral900,
    textAlign: 'center',
  },
});
