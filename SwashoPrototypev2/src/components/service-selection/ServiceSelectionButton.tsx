import type { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, type StyleProp, type ViewStyle } from 'react-native';

import { figmaShadow, FigmaShadows } from '@/components/home/figma-shadows';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { AddSquareIcon } from './service-selection-icons';

export type ServiceSelectionButtonVariant = 'primary' | 'secondary' | 'secondaryDashed' | 'tertiary';

type ServiceSelectionButtonProps = {
  label: string;
  variant?: ServiceSelectionButtonVariant;
  size?: 'compact' | 'default';
  disabled?: boolean;
  loading?: boolean;
  showAddIcon?: boolean;
  leadingIcon?: ReactNode;
  onPress?: () => void;
  scale: number;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function ServiceSelectionButton({
  label,
  variant = 'primary',
  size = 'default',
  disabled = false,
  loading = false,
  showAddIcon = false,
  leadingIcon,
  onPress,
  scale,
  style,
  accessibilityLabel,
}: ServiceSelectionButtonProps) {
  const isDisabled = disabled || loading;
  const height = (size === 'compact' ? 32 : 45) * scale;
  const fontSize = (size === 'compact' ? 14 : 16) * scale;
  const lineHeight = (size === 'compact' ? 12 : 14) * scale;

  const handlePress = () => {
    if (!isDisabled) {
      onPress?.();
    }
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.base,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'secondaryDashed' && styles.secondaryDashed,
        variant === 'tertiary' && styles.tertiary,
        isDisabled && variant === 'primary' && styles.primaryDisabled,
        isDisabled && variant === 'secondary' && styles.secondaryDisabled,
        isDisabled && variant === 'tertiary' && styles.tertiaryDisabled,
        {
          height,
          borderRadius: SwashoRadii.md * scale,
          paddingHorizontal: 16 * scale,
          paddingVertical: 8 * scale,
          gap: 6 * scale,
          opacity: pressed && !isDisabled ? 0.85 : 1,
          ...(variant === 'tertiary' ? figmaShadow(FigmaShadows.addButton, scale) : {}),
        },
        style,
      ]}>
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' && !isDisabled ? SwashoColors.surface : SwashoColors.primary600}
          size="small"
        />
      ) : (
        <>
          {leadingIcon}
          <Text
            numberOfLines={1}
            style={[
              searchFont(variant === 'primary' && !isDisabled ? 'semibold' : 'semibold'),
              styles.label,
              variant === 'primary' && !isDisabled && styles.primaryLabel,
              variant === 'primary' && isDisabled && styles.primaryDisabledLabel,
              variant === 'secondary' && styles.secondaryLabel,
              variant === 'secondaryDashed' && styles.dashedLabel,
              variant === 'tertiary' && styles.tertiaryLabel,
              { fontSize, lineHeight, letterSpacing: 0.5 * scale },
            ]}>
            {label}
          </Text>
          {showAddIcon ? <AddSquareIcon width={18 * scale} height={18 * scale} /> : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 60,
  },
  label: {
    textAlign: 'center',
  },
  primary: {
    backgroundColor: SwashoColors.primary600,
    borderWidth: 1,
    borderColor: SwashoColors.primary600,
  },
  primaryDisabled: {
    backgroundColor: SwashoColors.neutral200,
    borderColor: SwashoColors.neutral200,
  },
  primaryLabel: {
    color: '#f2f2f2',
  },
  primaryDisabledLabel: {
    color: SwashoColors.neutral600,
  },
  secondary: {
    backgroundColor: SwashoColors.surface,
    borderWidth: 1,
    borderColor: SwashoColors.neutral200,
  },
  secondaryDisabled: {
    opacity: 0.6,
  },
  secondaryLabel: {
    color: SwashoColors.neutral600,
  },
  secondaryDashed: {
    backgroundColor: SwashoColors.surface,
    borderWidth: 1,
    borderColor: 'rgba(120, 97, 255, 0.88)',
    borderStyle: 'dashed',
  },
  dashedLabel: {
    color: SwashoColors.primary600,
  },
  tertiary: {
    backgroundColor: SwashoColors.surface,
    borderWidth: 0.5,
    borderColor: SwashoColors.primary300,
  },
  tertiaryDisabled: {
    opacity: 0.5,
  },
  tertiaryLabel: {
    color: SwashoColors.primary600,
  },
});
