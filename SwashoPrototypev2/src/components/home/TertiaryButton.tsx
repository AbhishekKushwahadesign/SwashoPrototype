import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ReviewOrderArrowIcon } from '@/components/subscription/subscription-icons';
import { DoubleAltArrowRightIcon } from '@/components/service-selection/service-selection-icons';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { AltArrowRightIcon, ArrowRightIcon } from './figma-icons';

function ReviewOrderTrailingIcon({ scale }: { scale: number }) {
  return (
    <View style={{ width: 20 * scale, height: 20 * scale }}>
      <ReviewOrderArrowIcon width={20 * scale} height={20 * scale} />
    </View>
  );
}

type TertiaryButtonProps = {
  label: string;
  variant?: 'filled' | 'text' | 'accent';
  showTrailingIcon?: boolean;
  trailingIcon?: 'arrow' | 'alt-arrow' | 'double-alt-arrow' | 'review-order';
  onPress?: () => void;
  scale: number;
};

export function TertiaryButton({
  label,
  variant = 'text',
  showTrailingIcon = false,
  trailingIcon = 'arrow',
  onPress,
  scale,
}: TertiaryButtonProps) {
  const isFilled = variant === 'filled';
  const isAccent = variant === 'accent';
  const Icon =
    trailingIcon === 'double-alt-arrow'
      ? DoubleAltArrowRightIcon
      : trailingIcon === 'alt-arrow'
        ? AltArrowRightIcon
        : trailingIcon === 'review-order'
          ? null
          : ArrowRightIcon;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isFilled ? styles.filled : styles.text,
        {
          minWidth: isFilled ? 83 * scale : undefined,
          paddingHorizontal: isFilled ? 8 * scale : (showTrailingIcon ? 4 * scale : 0),
          height: isFilled ? 24 * scale : 18 * scale,
          borderRadius: isFilled ? SwashoRadii.sm * scale : 0,
          gap: (isFilled || isAccent ? 6 : 4) * scale,
          flexShrink: isFilled ? 0 : undefined,
          opacity: pressed ? 0.7 : 1,
        },
      ]}>
      <Text
        numberOfLines={1}
        style={[
          isFilled ? styles.filledLabel : isAccent ? styles.accentLabel : styles.textLabel,
          {
            fontSize: (isFilled ? 12 : 14) * scale,
            lineHeight: (isFilled ? 16 : 12) * scale,
          },
        ]}>
        {label}
      </Text>
      {showTrailingIcon && trailingIcon === 'review-order' ? (
        <ReviewOrderTrailingIcon scale={scale} />
      ) : showTrailingIcon && Icon ? (
        <View style={{ width: 20 * scale, height: 20 * scale }}>
          <Icon width={20 * scale} height={20 * scale} />
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  filled: {
    backgroundColor: SwashoColors.neutral900,
  },
  text: {
    backgroundColor: 'transparent',
  },
  filledLabel: {
    fontFamily: 'Poppins_600SemiBold',
    color: SwashoColors.neutral50,
    textAlign: 'center',
    letterSpacing: 0.5,
    flexShrink: 0,
  },
  textLabel: {
    fontFamily: 'Poppins_500Medium',
    color: SwashoColors.darkText,
    textAlign: 'center',
    letterSpacing: 0.5,
    flex: 1,
  },
  accentLabel: {
    fontFamily: 'Poppins_500Medium',
    color: SwashoColors.primary600,
    textAlign: 'center',
    letterSpacing: 0.5,
    flexShrink: 0,
  },
});
