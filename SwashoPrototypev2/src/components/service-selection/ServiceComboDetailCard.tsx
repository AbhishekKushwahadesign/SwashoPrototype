import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SwashoColors } from '@/constants/swasho-tokens';

import { ServiceCheckbox } from './ServiceCheckbox';
import { ServiceGarmentRow } from './ServiceGarmentRow';
import { InfoCircleIcon, PenEditIcon } from './service-selection-icons';

type ServiceComboDetailCardProps = {
  title: string;
  amount: number | string;
  unit?: string;
  quantity: number;
  imageUri?: string | null;
  pickupPersonChecked: boolean;
  disabled?: boolean;
  onIncrement?: () => void;
  onDecrement?: () => void;
  onEditImagePress?: () => void;
  onPickupPersonChange?: (checked: boolean) => void;
  scale: number;
};

export function ServiceComboDetailCard({
  title,
  amount,
  unit,
  quantity,
  imageUri,
  pickupPersonChecked,
  disabled = false,
  onIncrement,
  onDecrement,
  onEditImagePress,
  onPickupPersonChange,
  scale,
}: ServiceComboDetailCardProps) {
  return (
    <View style={[styles.card, { width: 366 * scale, gap: 12 * scale }]}>
      <ServiceGarmentRow
        title={title}
        amount={amount}
        unit={unit}
        state="quantity"
        quantity={quantity}
        disabled={disabled}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        scale={scale}
      />
      <View style={[styles.imageRow, { gap: 12 * scale }]}>
        <View style={[styles.thumbnailWrap, { width: 50 * scale, height: 50 * scale, borderRadius: 5.828 * scale }]}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={StyleSheet.absoluteFill} contentFit="cover" />
          ) : (
            <Text style={[styles.placeholder, { fontSize: 10 * scale, lineHeight: 11 * scale }]}>Image</Text>
          )}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Edit garment image"
            disabled={disabled}
            onPress={() => {
              if (!disabled) {
                onEditImagePress?.();
              }
            }}
            style={[
              styles.editChip,
              {
                width: 50 * scale,
                height: 15 * scale,
                borderBottomLeftRadius: 5.83 * scale,
                borderBottomRightRadius: 5.83 * scale,
              },
            ]}>
            <PenEditIcon width={16 * scale} height={16 * scale} />
            <Text style={[styles.editLabel, { fontSize: 10 * scale, lineHeight: 11 * scale }]}>Edit</Text>
          </Pressable>
        </View>
        <View style={[styles.infoRow, { gap: 8 * scale, flex: 1 }]}>
          <InfoCircleIcon width={18 * scale} height={18 * scale} />
          <Text style={[styles.infoText, { fontSize: 12 * scale, lineHeight: 14 * scale }]}>
            Image of cloth(s) ensure hassle free experience
          </Text>
        </View>
      </View>
      <ServiceCheckbox
        checked={pickupPersonChecked}
        disabled={disabled}
        label="I will tell Pickup Person"
        onChange={onPickupPersonChange}
        scale={scale}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'flex-start',
  },
  imageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: '100%',
  },
  thumbnailWrap: {
    borderWidth: 0.728,
    borderColor: SwashoColors.neutral200,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SwashoColors.surface,
  },
  placeholder: {
    fontFamily: 'Poppins_400Regular',
    color: SwashoColors.primary600,
    textAlign: 'center',
    letterSpacing: 0.641,
  },
  editChip: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(255,255,255,0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  editLabel: {
    fontFamily: 'Poppins_400Regular',
    color: SwashoColors.neutral900,
    textAlign: 'center',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    fontFamily: 'Poppins_400Regular',
    color: SwashoColors.neutral900,
    flexShrink: 1,
  },
});
