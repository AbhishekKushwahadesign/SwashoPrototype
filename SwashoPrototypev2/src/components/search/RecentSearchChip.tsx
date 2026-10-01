import { Pressable, StyleSheet, Text } from 'react-native';

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
          borderRadius: 9999,
        },
      ]}>
      <Text
        style={[
          styles.label,
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
    backgroundColor: '#ffffff',
  },
  label: {
    fontFamily: 'Poppins_500Medium',
    color: '#000000',
    letterSpacing: 0.5,
  },
});
