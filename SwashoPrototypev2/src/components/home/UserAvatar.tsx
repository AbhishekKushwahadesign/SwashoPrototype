import { StyleSheet, Text, View } from 'react-native';

import { SwashoColors, SwashoFonts } from '@/constants/swasho-tokens';
import { DEMO_USER } from '@/data/mock-user';

type UserAvatarProps = {
  scale: number;
  size: number;
  initial?: string;
};

export function UserAvatar({ scale, size, initial = DEMO_USER.avatarInitial }: UserAvatarProps) {
  const radius = size / 2;
  const fontSize = size * 0.75;
  const lineHeight = size * 0.875;

  return (
    <View
      style={[
        styles.avatar,
        {
          width: size * scale,
          height: size * scale,
          borderRadius: radius * scale,
        },
      ]}>
      <Text
        style={[
          styles.avatarText,
          {
            fontSize: fontSize * scale,
            lineHeight: lineHeight * scale,
            letterSpacing: -0.5 * scale,
          },
        ]}>
        {initial}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    backgroundColor: SwashoColors.avatarRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: SwashoFonts.publicSansBold,
    color: '#ffffff',
  },
});
