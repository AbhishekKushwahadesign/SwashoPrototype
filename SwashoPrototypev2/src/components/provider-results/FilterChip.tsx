import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';
import { searchFont } from '@/components/search/search-fonts';

import { FilterArrowDownIcon } from './provider-results-icons';

type FilterChipProps = {
  label: string;
  scale: number;
  hasDropdown?: boolean;
  onPress?: () => void;
};

export function FilterChip({ label, scale, hasDropdown = false, onPress }: FilterChipProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.chip,
        {
          borderRadius: SwashoRadii.sm * scale,
          paddingHorizontal: 12 * scale,
          paddingVertical: hasDropdown ? 7 * scale : 8 * scale,
          height: hasDropdown ? 26 * scale : undefined,
        },
      ]}>
      <View style={[styles.content, { gap: 6 * scale, minHeight: hasDropdown ? 12 * scale : undefined }]}>
        <Text
          style={[
            styles.label,
            searchFont('medium'),
            {
              fontSize: hasDropdown ? 14 * scale : 12 * scale,
              lineHeight: hasDropdown ? 12 * scale : 10 * scale,
            },
          ]}>
          {label}
        </Text>
        {hasDropdown ? (
          <View style={{ width: 20 * scale, height: 20 * scale }}>
            <FilterArrowDownIcon width={20 * scale} height={20 * scale} />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    backgroundColor: SwashoColors.surface,
    borderWidth: 1,
    borderColor: SwashoColors.neutral400,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  label: {
    color: SwashoColors.darkText,
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
