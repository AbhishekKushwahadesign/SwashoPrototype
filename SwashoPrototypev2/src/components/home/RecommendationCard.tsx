import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { Line35Icon, Line36Icon, Line37Icon } from './figma-icons';

import { SwashoColors } from '@/constants/swasho-tokens';

import { TertiaryButton } from './TertiaryButton';
import { FigmaShadows, figmaShadow } from './figma-shadows';

type RecommendationCardProps = {
  scale: number;
  onViewPlanPress?: () => void;
};

export function RecommendationCard({ scale, onViewPlanPress }: RecommendationCardProps) {
  return (
    <View
      style={[
        styles.card,
        {
          width: 373 * scale,
          height: 113 * scale,
          borderRadius: 9.6 * scale,
          ...figmaShadow(FigmaShadows.recommendationCard, scale),
        },
      ]}>
      <LinearGradient
        colors={[SwashoColors.neutral100, '#ffffff', '#ffffff']}
        locations={[0, 0.957, 0.979]}
        style={[StyleSheet.absoluteFill, { borderRadius: 9.6 * scale }]}
      />
      <View style={styles.decorLine36}>
        <Line36Icon width={166 * scale} height={28 * scale} />
      </View>
      <View style={styles.decorLine37}>
        <Line37Icon width={110 * scale} height={116 * scale} />
      </View>
      <View style={styles.decorLine35}>
        <Line35Icon width={124 * scale} height={14 * scale} />
      </View>
      <Image
        source={require('@/assets/images/home/recommendation.png')}
        style={{
          position: 'absolute',
          left: 20.03 * scale,
          top: '50%',
          width: 42.08 * scale,
          height: 62.89 * scale,
          transform: [{ translateY: -31.44 * scale }],
        }}
        contentFit="cover"
        contentPosition="bottom"
      />
      <View style={[styles.copy, { left: 83.5 * scale, top: 10 * scale, width: 269 * scale, gap: 6 * scale }]}>
        <View style={{ gap: 4 * scale }}>
          <Text style={[styles.title, { fontSize: 14 * scale, lineHeight: 18 * scale }]}>
            Save on your regular laundry
          </Text>
          <Text style={[styles.body, { fontSize: 12 * scale, lineHeight: 20 * scale }]}>
            You frequently book Wash & Fold. Save ₹85/week with a Weekly Plan.
          </Text>
        </View>
        <TertiaryButton label="View Plan" variant="filled" onPress={onViewPlanPress} scale={scale} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
  },
  decorLine36: {
    position: 'absolute',
    left: -25,
    top: -20,
    transform: [{ rotate: '-26.4deg' }],
    opacity: 0.6,
  },
  decorLine37: {
    position: 'absolute',
    left: -20,
    top: 24,
    transform: [{ rotate: '-31.76deg' }],
    opacity: 0.6,
  },
  decorLine35: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    transform: [{ rotate: '-26.4deg' }],
    opacity: 0.6,
  },
  copy: {
    position: 'absolute',
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    color: '#000000',
    letterSpacing: 0.5,
  },
  body: {
    fontFamily: 'Poppins_400Regular',
    color: SwashoColors.neutral900,
    letterSpacing: 0.5,
  },
});
