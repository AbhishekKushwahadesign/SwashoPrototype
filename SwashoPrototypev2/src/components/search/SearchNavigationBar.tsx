import { useRef } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { ArrowLeftIcon, LineDividerIcon, MicrophoneIcon } from '@/components/home/figma-icons';
import { FigmaShadows, figmaShadow } from '@/components/home/figma-shadows';
import { searchFont } from '@/components/search/search-fonts';

type SearchNavigationBarProps = {
  scale: number;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
  onBackPress?: () => void;
  onMicrophonePress?: () => void;
  autoFocus?: boolean;
};

export function SearchNavigationBar({
  scale,
  value,
  onChangeText,
  onSubmit,
  onBackPress,
  onMicrophonePress,
  autoFocus = false,
}: SearchNavigationBarProps) {
  const inputRef = useRef<TextInput>(null);

  const handleMicrophonePress = () => {
    if (onMicrophonePress) {
      onMicrophonePress();
      return;
    }
    inputRef.current?.focus();
  };

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
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSubmit}
          placeholder="Search"
          placeholderTextColor={SwashoColors.neutral500}
          autoFocus={autoFocus}
          returnKeyType="search"
          style={[
            styles.input,
            searchFont('medium'),
            {
              fontSize: 16 * scale,
              lineHeight: 14 * scale,
              height: 14 * scale,
              flex: 1,
            },
          ]}
        />
        <View style={{ width: 0, height: 28 * scale, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ transform: [{ rotate: '90deg' }] }}>
            <LineDividerIcon width={28 * scale} height={1} />
          </View>
        </View>
        <Pressable onPress={handleMicrophonePress} hitSlop={8} style={{ width: 20 * scale, height: 20 * scale }}>
          <MicrophoneIcon width={20 * scale} height={20 * scale} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  bar: {
    backgroundColor: SwashoColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  input: {
    color: '#3d3d3d',
    letterSpacing: 0.5,
    paddingVertical: 0,
    margin: 0,
    textAlignVertical: 'center',
  },
});
