import { StyleSheet, Text, View } from 'react-native';

import { SwashoColors } from '@/constants/swasho-tokens';

import { TertiaryButton } from './TertiaryButton';

type SectionTitleProps = {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
  scale: number;
};

export function SectionTitle({ title, actionLabel, onActionPress, scale }: SectionTitleProps) {
  return (
    <View style={styles.row}>
      <Text style={[styles.title, { fontSize: 16 * scale, lineHeight: 14 * scale }]}>{title}</Text>
      {actionLabel ? (
        <TertiaryButton
          label={actionLabel}
          showTrailingIcon
          trailingIcon="alt-arrow"
          onPress={onActionPress}
          scale={scale}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    flex: 1,
    fontFamily: 'Poppins_500Medium',
    color: SwashoColors.neutral600,
    letterSpacing: 0.5,
  },
});
