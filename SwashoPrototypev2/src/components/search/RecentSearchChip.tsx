import { Pressable, StyleSheet, Text } from 'react-native';

import { SwashoColors } from '@/constants/swasho-tokens';

import { searchFont } from '@/components/search/search-fonts';

type RecentSearchChipProps = {
  label: string;
  scale: number;
  onPress?: () => void;
};

export function RecentSearchChip({ label, scale, onPress }: RecentSearchChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          paddingHorizontal: 16 * scale,
          paddingVertical: 10 * scale,
          borderRadius: 9999 * scale,
        },
      ]}>
      <Text
        style={[
          styles.label,
          searchFont('medium'),
          {
            fontSize: 12 * scale,
            lineHeight: 10 * scale,
          },
        ]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: SwashoColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    color: '#000000',
    letterSpacing: 0.5,
  },
});
