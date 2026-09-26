import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { AltArrowRightIcon, ArrowRightIcon } from './figma-icons';

type TertiaryButtonProps = {
  label: string;
  variant?: 'filled' | 'text' | 'accent';
  showTrailingIcon?: boolean;
  trailingIcon?: 'arrow' | 'alt-arrow';
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
  const Icon = trailingIcon === 'alt-arrow' ? AltArrowRightIcon : ArrowRightIcon;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isFilled ? styles.filled : styles.text,
        {
          paddingHorizontal: isFilled ? 8 * scale : (showTrailingIcon ? 4 * scale : 0),
          height: isFilled ? 24 * scale : 18 * scale,
          borderRadius: isFilled ? SwashoRadii.sm * scale : 0,
          gap: (isFilled || isAccent ? 6 : 4) * scale,
          opacity: pressed ? 0.7 : 1,
        },
      ]}>
      <Text
        style={[
          isFilled ? styles.filledLabel : isAccent ? styles.accentLabel : styles.textLabel,
          { fontSize: (isFilled ? 12 : 14) * scale, lineHeight: (isFilled ? 16 : 12) * scale },
        ]}>
        {label}
      </Text>
      {showTrailingIcon && (
        <View style={{ width: 20 * scale, height: 20 * scale }}>
          <Icon width={20 * scale} height={20 * scale} />
        </View>
      )}
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
    letterSpacing: 1,
    flex: 1,
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
    flex: 1,
  },
});
