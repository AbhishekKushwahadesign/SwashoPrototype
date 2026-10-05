import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ArrowLeftIcon, LineDividerIcon, MicrophoneIcon } from '@/components/home/figma-icons';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';
import { searchFont } from '@/components/search/search-fonts';

import { CloseCircleIcon } from './provider-results-icons';

type ProviderResultsSearchBarProps = {
  scale: number;
  query: string;
  onBackPress?: () => void;
  onClearPress?: () => void;
  onMicrophonePress?: () => void;
};

export function ProviderResultsSearchBar({
  scale,
  query,
  onBackPress,
  onClearPress,
  onMicrophonePress,
}: ProviderResultsSearchBarProps) {
  return (
    <View style={[styles.wrapper, { paddingHorizontal: 20 * scale, paddingBottom: 4 * scale }]}>
      <View
        style={[
          styles.bar,
          {
            height: 45 * scale,
            borderRadius: SwashoRadii.md * scale,
            paddingHorizontal: 12 * scale,
            gap: 7 * scale,
          },
        ]}>
        <Pressable onPress={onBackPress} hitSlop={8} style={{ width: 26 * scale, height: 26 * scale, justifyContent: 'center' }}>
          <View style={{ width: 20 * scale, height: 20 * scale, marginLeft: 0, marginTop: 3 * scale }}>
            <ArrowLeftIcon width={20 * scale} height={20 * scale} />
          </View>
        </Pressable>
        <View style={{ width: 0, height: 28 * scale, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ transform: [{ rotate: '90deg' }] }}>
            <LineDividerIcon width={28 * scale} height={1} />
          </View>
        </View>
        <Text
          numberOfLines={1}
          style={[
            styles.query,
            searchFont('medium'),
            {
              fontSize: 16 * scale,
              lineHeight: 14 * scale,
              flex: 1,
            },
          ]}>
          {query}
        </Text>
        <Pressable onPress={onClearPress} hitSlop={8} style={{ width: 22 * scale, height: 22 * scale }}>
          <CloseCircleIcon width={22 * scale} height={22 * scale} />
        </Pressable>
        <View style={{ width: 0, height: 28 * scale, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ transform: [{ rotate: '90deg' }] }}>
            <LineDividerIcon width={28 * scale} height={1} />
          </View>
        </View>
        <Pressable onPress={onMicrophonePress} hitSlop={8} style={{ width: 20 * scale, height: 20 * scale }}>
          <MicrophoneIcon width={20 * scale} height={20 * scale} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    backgroundColor: SwashoColors.surface,
  },
  bar: {
    backgroundColor: SwashoColors.surface,
    borderWidth: 1,
    borderColor: SwashoColors.neutral200,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  query: {
    color: '#292929',
    letterSpacing: 0.5,
  },
});
