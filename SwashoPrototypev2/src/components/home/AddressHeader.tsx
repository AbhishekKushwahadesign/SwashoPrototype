import { StyleSheet, Text, View } from 'react-native';

import { SwashoColors, SwashoFonts } from '@/constants/swasho-tokens';

import { AltArrowDownIcon } from './figma-icons';

type AddressHeaderProps = {
  scale: number;
};

export function AddressHeader({ scale }: AddressHeaderProps) {
  return (
    <View style={[styles.row, { width: 372 * scale, gap: 36 * scale, alignSelf: 'center' }]}>
      <View style={[styles.left, { gap: 8 * scale }]}>
        <View style={[styles.avatar, { width: 45 * scale, height: 45 * scale, borderRadius: 22.5 * scale }]}>
          <Text style={[styles.avatarText, { fontSize: 27 * scale, lineHeight: 31.5 * scale }]}>A</Text>
        </View>
        <View style={[styles.textBlock, { gap: 4 * scale }]}>
          <View style={[styles.homeRow, { gap: 4 * scale }]}>
            <Text style={[styles.homeLabel, { fontSize: 18 * scale, lineHeight: 16 * scale }]}>Home</Text>
            <AltArrowDownIcon width={20 * scale} height={20 * scale} />
          </View>
          <Text
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.address, { fontSize: 14 * scale, lineHeight: 12 * scale, maxWidth: 240 * scale }]}>
            2O1, lodha luxuria, kolshet road
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
  avatar: {
    backgroundColor: SwashoColors.avatarRed,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: SwashoFonts.publicSansBold,
    color: '#ffffff',
    letterSpacing: -0.28125,
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
