import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { ArrowLeftIcon, LineDividerIcon, MicrophoneIcon } from '@/components/home/figma-icons';
import { FigmaShadows, figmaShadow } from '@/components/home/figma-shadows';

type SearchNavigationBarProps = {
  scale: number;
  onBackPress?: () => void;
};

export function SearchNavigationBar({ scale, onBackPress }: SearchNavigationBarProps) {
  return (
    <View style={[styles.wrapper, { paddingHorizontal: 20 * scale }]}>
      <View
        style={[
          styles.bar,
          {
            height: 45 * scale,
            borderRadius: SwashoRadii.md * scale,
            paddingHorizontal: 12 * scale,
            gap: 10 * scale,
            ...figmaShadow(FigmaShadows.search, scale),
          },
        ]}>
        <Pressable onPress={onBackPress} hitSlop={8} style={{ width: 20 * scale, height: 20 * scale }}>
          <ArrowLeftIcon width={20 * scale} height={20 * scale} />
        </Pressable>
        <View style={{ width: 0, height: 28 * scale, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ transform: [{ rotate: '90deg' }] }}>
            <LineDividerIcon width={28 * scale} height={1} />
          </View>
        </View>
        <Text style={[styles.placeholder, { fontSize: 16 * scale, lineHeight: 14 * scale, flex: 1 }]}>
          Search
        </Text>
        <View style={{ width: 0, height: 28 * scale, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ transform: [{ rotate: '90deg' }] }}>
            <LineDividerIcon width={28 * scale} height={1} />
          </View>
        </View>
        <MicrophoneIcon width={20 * scale} height={20 * scale} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  bar: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  placeholder: {
    fontFamily: 'Poppins_500Medium',
    color: SwashoColors.neutral500,
    letterSpacing: 0.5,
  },
});
