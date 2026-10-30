import type { ReactNode } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { ServiceRowDivider } from '@/components/service-selection/ServiceRowDivider';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';
import type { CheckoutBasketLine } from '@/lib/build-checkout-basket';

import { CheckoutInfoBoldIcon } from './checkout-review-icons';
import {
  ContactlessBagBoldIcon,
  ContactlessCameraStatusIcon,
  ContactlessGalleryAddMutedIcon,
  ContactlessGalleryAddPrimaryIcon,
} from './contactless-basket-photo-icons';

import {
  CONTACTLESS_BAG_SERVICE_ID,
  contactlessGarmentPhotoSlotKey,
  garmentBasketPhotoSatisfied,
  garmentPhotoSlotsFromBasketLine,
  type ContactlessGarmentPhotoStore,
  type GarmentPhotoServiceSlot,
} from '@/lib/contactless-garment-photos';
import { PROTOTYPE_LAUNDRY_BAG_PHOTO, resolveDemoGarmentPhotoUri } from '@/lib/demo-garment-photo-uri';
import type { ProviderGarmentCartSelection } from '@/lib/provider-cart-selection';

export type ContactlessBasketPhotoMap = Record<string, boolean>;

export function contactlessPhotoSlotKey(garmentId: string, serviceId: string) {
  return contactlessGarmentPhotoSlotKey(garmentId, serviceId);
}

type ContactlessBasketPhotoSectionProps = {
  line: CheckoutBasketLine;
  isBulk: boolean;
  scale: number;
  photoStore: ContactlessGarmentPhotoStore;
  selection?: ProviderGarmentCartSelection;
  onOpenPhotoUpload: (garmentId: string, serviceId: string) => void;
};

function StatusDot({ scale }: { scale: number }) {
  return (
    <View
      style={{
        width: 4 * scale,
        height: 4 * scale,
        borderRadius: 2 * scale,
        backgroundColor: SwashoColors.neutral500,
      }}
    />
  );
}

function PhotoUploadTile({
  scale,
  variant,
  uploaded,
  uploadedSource,
  onPress,
  accessibilityLabel,
  children,
}: {
  scale: number;
  variant: 'primary' | 'muted';
  uploaded: boolean;
  uploadedSource?: { uri: string } | number;
  onPress: () => void;
  accessibilityLabel: string;
  children?: ReactNode;
}) {
  const borderColor = variant === 'primary' ? SwashoColors.primary600 : '#B3B3B3';
  const size = 40 * scale;
  const radius = 4 * scale;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        borderWidth: 0.5 * scale,
        borderColor,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
      }}>
      {uploaded && uploadedSource ? (
        <Image source={uploadedSource} style={{ width: size, height: size }} resizeMode="cover" />
      ) : variant === 'primary' ? (
        children ?? <ContactlessGalleryAddPrimaryIcon width={24 * scale} height={24 * scale} />
      ) : (
        <ContactlessGalleryAddMutedIcon width={24 * scale} height={24 * scale} />
      )}
    </Pressable>
  );
}

function PhotoSlotRow({
  scale,
  variant,
  uploaded,
  uploadedSource,
  title,
  actionLabel,
  actionColor,
  onPress,
  tileContent,
  gap = 10,
  paddingHorizontal = 14,
}: {
  scale: number;
  variant: 'primary' | 'muted';
  uploaded: boolean;
  uploadedSource?: { uri: string } | number;
  title: string;
  actionLabel: string;
  actionColor: string;
  onPress: () => void;
  tileContent?: ReactNode;
  gap?: number;
  paddingHorizontal?: number;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: gap * scale, paddingHorizontal: paddingHorizontal * scale }}>
      <PhotoUploadTile
        scale={scale}
        variant={variant}
        uploaded={uploaded}
        uploadedSource={uploadedSource}
        onPress={onPress}
        accessibilityLabel={actionLabel}>
        {tileContent}
      </PhotoUploadTile>
      <View style={{ gap: 6 * scale, justifyContent: 'center' }}>
        <Text
          style={[
            searchFont('semibold'),
            {
              fontSize: 14 * scale,
              lineHeight: 14 * scale,
              letterSpacing: 0.5 * scale,
              color: SwashoColors.neutral950,
            },
          ]}>
          {title}
        </Text>
        {!uploaded ? (
          <Text
            style={[
              searchFont('semibold'),
              {
                fontSize: 12 * scale,
                lineHeight: 20 * scale,
                letterSpacing: 0.5 * scale,
                color: actionColor,
              },
            ]}>
            {actionLabel}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

/** Figma 59110 — contactless photo upload block inside basket line rows. */
export function ContactlessBasketPhotoSection({
  line,
  isBulk,
  scale,
  photoStore,
  selection,
  onOpenPhotoUpload,
}: ContactlessBasketPhotoSectionProps) {
  const slots: GarmentPhotoServiceSlot[] = garmentPhotoSlotsFromBasketLine(line, selection);
  const optionalSingle = !isBulk && slots.length === 1 && slots[0]?.optional;
  const showBlock = isBulk || slots.length > 0;

  if (!showBlock) {
    return null;
  }

  const requiredCount = 1;
  const garmentSatisfied = garmentBasketPhotoSatisfied(photoStore, line.serviceId, slots);

  const statusMuted = { fontSize: 12 * scale, lineHeight: 20 * scale, letterSpacing: 0.5 * scale, color: SwashoColors.neutral500 };

  return (
    <View style={{ width: '100%', gap: 16 * scale }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 * scale, paddingLeft: 46 * scale }}>
        {optionalSingle ? (
          <CheckoutInfoBoldIcon width={16 * scale} height={16 * scale} />
        ) : (
          <ContactlessCameraStatusIcon width={16 * scale} height={16 * scale} />
        )}
        {optionalSingle ? (
          <Text style={[searchFont('medium'), statusMuted]}>No Upload Required</Text>
        ) : isBulk ? (
          <Text style={[searchFont('medium'), statusMuted]}>
            {garmentSatisfied ? 1 : 0}/{requiredCount} Bag Image Uploaded
          </Text>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 * scale, flexWrap: 'wrap' }}>
            <Text style={[searchFont('medium'), statusMuted]}>
              {garmentSatisfied ? 1 : 0}/{requiredCount} Image Uploaded
            </Text>
            <StatusDot scale={scale} />
            <Text style={[searchFont('medium'), statusMuted]}>Any 1 Service</Text>
          </View>
        )}
      </View>

      <View style={{ paddingLeft: 32 * scale, gap: 20 * scale }}>
        {slots.map((slot, index) => {
          const slotPhotos = photoStore[line.serviceId]?.[slot.serviceId] ?? [];
          const uploaded = slotPhotos.length > 0;
          const uploadedUri = slotPhotos[0];
          const isOptional = slot.optional;
          const isBag = isBulk || slot.serviceId === CONTACTLESS_BAG_SERVICE_ID;
          const uploadedSource = uploaded
            ? uploadedUri
              ? { uri: uploadedUri }
              : isBag
                ? { uri: resolveDemoGarmentPhotoUri(PROTOTYPE_LAUNDRY_BAG_PHOTO) }
                : undefined
            : undefined;
          return (
            <View key={slot.serviceId} style={{ width: '100%', gap: 20 * scale }}>
              {index > 0 ? <ServiceRowDivider variant="dotted" width={349} scale={scale} /> : null}
              <PhotoSlotRow
                scale={scale}
                variant={isOptional ? 'muted' : 'primary'}
                uploaded={uploaded}
                uploadedSource={uploadedSource}
                title={isBag ? (line.weightSubline ?? slot.title) : `${slot.quantity}x ${slot.title}`}
                actionLabel={isBag ? '+ Add bag Photo' : '+ Add garment Photo'}
                actionColor={isOptional ? SwashoColors.neutral500 : SwashoColors.primary600}
                onPress={() => onOpenPhotoUpload(line.serviceId, slot.serviceId)}
                gap={isOptional ? 8 : 10}
                paddingHorizontal={14}
                tileContent={
                  isBag ? <ContactlessBagBoldIcon width={24 * scale} height={24 * scale} /> : undefined
                }
              />
            </View>
          );
        })}
      </View>
    </View>
  );
}
