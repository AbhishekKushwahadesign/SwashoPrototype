import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SwashoFonts } from '@/constants/swasho-tokens';
import { DEMO_USER } from '@/data/mock-user';

import { AltArrowDownIcon } from './figma-icons';
import { UserAvatar } from './UserAvatar';

type AddressHeaderProps = {
  scale: number;
  onAvatarPress?: () => void;
};

export function AddressHeader({ scale, onAvatarPress }: AddressHeaderProps) {
  return (
    <View style={[styles.row, { width: 372 * scale, gap: 36 * scale, alignSelf: 'center' }]}>
      <View style={[styles.left, { gap: 8 * scale }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open profile"
          disabled={!onAvatarPress}
          onPress={onAvatarPress}
          hitSlop={8}
          style={({ pressed }) => [pressed && onAvatarPress ? { opacity: 0.85 } : null]}>
          <UserAvatar scale={scale} size={45} />
        </Pressable>
        <View style={[styles.textBlock, { gap: 4 * scale }]}>
          <View style={[styles.homeRow, { gap: 4 * scale }]}>
            <Text style={[styles.homeLabel, { fontSize: 18 * scale, lineHeight: 16 * scale }]}>
              {DEMO_USER.homeLabel}
            </Text>
            <AltArrowDownIcon width={20 * scale} height={20 * scale} />
          </View>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.address, { fontSize: 14 * scale, lineHeight: 12 * scale, maxWidth: 240 * scale }]}>
            {DEMO_USER.homeAddressLine}
          </Text>
        </View>
      </View>
      <View style={{ width: 43 * scale, height: 43 * scale }} />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
  },
  textBlock: {
    flex: 1,
    justifyContent: 'center',
  },
  homeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  homeLabel: {
    fontFamily: 'Poppins_500Medium',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  address: {
    fontFamily: 'Poppins_500Medium',
    color: 'rgba(255,255,255,0.8)',
    letterSpacing: 0.5,
  },
});
