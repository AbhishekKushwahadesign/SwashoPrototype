import { Pressable, StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';

import { ChevronDownIcon } from './service-selection-icons';

export type ServiceSectionHeaderVariant = 'category' | 'combo' | 'emphasis';

type ServiceSectionHeaderProps = {
  title: string;
  variant?: ServiceSectionHeaderVariant;
  expanded?: boolean;
  onToggle?: () => void;
  scale: number;
};

export function ServiceSectionHeader({
  title,
  variant = 'category',
  expanded = true,
  onToggle,
  scale,
}: ServiceSectionHeaderProps) {
  const titleColor =
    variant === 'category' ? '#464646' : variant === 'emphasis' ? SwashoColors.darkHeaderText : SwashoColors.darkHeaderText;
  const fontSize = (variant === 'emphasis' ? 18 : 16) * scale;
  const lineHeight = (variant === 'emphasis' ? 16 : 14) * scale;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ expanded }}
      accessibilityLabel={title}
      onPress={onToggle}
      style={[styles.row, { gap: 16 * scale, width: 366 * scale }]}>
      <Text
        style={[
          searchFont('medium'),
          styles.title,
          { color: titleColor, fontSize, lineHeight, letterSpacing: 0.5 * scale, flex: 1 },
        ]}>
        {title}
      </Text>
      <View
        style={{
          transform: [{ rotate: expanded ? '0deg' : '-90deg' }],
        }}>
        <ChevronDownIcon width={24 * scale} height={24 * scale} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    textAlign: 'left',
  },
});
