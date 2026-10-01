import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { LineDividerIcon, MagnifierIcon, MicrophoneIcon } from './figma-icons';
import { FigmaShadows, figmaShadow } from './figma-shadows';

type SearchFieldProps = {
  scale: number;
  onPress?: () => void;
};

export function SearchField({ scale, onPress }: SearchFieldProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        {
          width: 372 * scale,
          height: 45 * scale,
          borderRadius: SwashoRadii.md * scale,
          paddingLeft: 16 * scale,
          paddingRight: 12 * scale,
          gap: 10 * scale,
          alignSelf: 'center',
          ...figmaShadow(FigmaShadows.search, scale),
        },
      ]}>
      <MagnifierIcon width={20 * scale} height={20 * scale} />
      <Text style={[styles.placeholder, { fontSize: 16 * scale, lineHeight: 14 * scale, flex: 1 }]}>Search</Text>
      <View
        style={{
          width: 0,
          height: 28 * scale,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{ transform: [{ rotate: '90deg' }] }}>
          <LineDividerIcon width={28 * scale} height={1} />
        </View>
      </View>
      <MicrophoneIcon width={20 * scale} height={20 * scale} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholder: {
    fontFamily: 'Poppins_500Medium',
    color: SwashoColors.neutral500,
    letterSpacing: 0.5,
  },
});
