import { StyleSheet, Text, View } from 'react-native';

type RecentSearchChipProps = {
  label: string;
  scale: number;
};

export function RecentSearchChip({ label, scale }: RecentSearchChipProps) {
  return (
    <View
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
    </View>
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
