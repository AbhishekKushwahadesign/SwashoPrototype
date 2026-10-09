import { StyleSheet, View } from 'react-native';

import { ListDividerIcon } from '@/components/provider-page/provider-page-icons';
import { SwashoColors } from '@/constants/swasho-tokens';

type ServiceRowDividerProps = {
  variant?: 'dotted' | 'solid';
  width?: number;
  scale: number;
};

export function ServiceRowDivider({ variant = 'dotted', width = 362, scale }: ServiceRowDividerProps) {
  if (variant === 'dotted') {
    return (
      <View style={{ width: width * scale, height: 1 * scale }}>
        <ListDividerIcon width={width * scale} height={1 * scale} />
      </View>
    );
  }

  return (
    <View
      style={[
        styles.solid,
        {
          width: width * scale,
          height: StyleSheet.hairlineWidth,
        },
      ]}
    />
  );
}

const styles = StyleSheet.create({
  solid: {
    backgroundColor: SwashoColors.neutral200,
  },
});
