import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { ServiceSectionHeader, type ServiceSectionHeaderVariant } from './ServiceSectionHeader';

export type ServiceSelectionCardState = 'default' | 'expanded' | 'selected';

type ServiceSelectionCardProps = {
  title: string;
  state?: ServiceSelectionCardState;
  headerVariant?: ServiceSectionHeaderVariant;
  expanded?: boolean;
  onToggle?: () => void;
  children?: ReactNode;
  scale: number;
};

export function ServiceSelectionCard({
  title,
  state = 'default',
  headerVariant: headerVariantProp,
  expanded = true,
  onToggle,
  children,
  scale,
}: ServiceSelectionCardProps) {
  const headerVariant =
    headerVariantProp ?? (state === 'expanded' ? 'combo' : 'category');

  return (
    <View
      style={[
        styles.card,
        state === 'selected' && styles.cardSelected,
        {
          gap: 16 * scale,
          borderRadius: SwashoRadii.md * scale,
          paddingVertical: state === 'selected' ? 8 * scale : 0,
        },
      ]}>
      <ServiceSectionHeader
        title={title}
        variant={headerVariant}
        expanded={expanded}
        onToggle={onToggle}
        scale={scale}
      />
      {expanded ? children : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    width: '100%',
  },
  cardSelected: {
    backgroundColor: SwashoColors.primary50,
  },
});
