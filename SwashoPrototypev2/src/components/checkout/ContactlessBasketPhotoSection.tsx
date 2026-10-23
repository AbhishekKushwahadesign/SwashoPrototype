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

const MOCK_GARMENT_PHOTO = require('@/assets/checkout/contactless-workflow-upload.png');

export type ContactlessBasketPhotoMap = Record<string, boolean>;

export function contactlessPhotoSlotKey(serviceId: string, slotId: string) {
  return `${serviceId}::${slotId}`;
}

type ContactlessBasketPhotoSectionProps = {
  line: CheckoutBasketLine;
  isBulk: boolean;
  scale: number;
  photos: ContactlessBasketPhotoMap;
  onTogglePhoto: (slotKey: string) => void;
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
  onPress,
  accessibilityLabel,
  children,
}: {
  scale: number;
  variant: 'primary' | 'muted';
  uploaded: boolean;
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
      {uploaded ? (
        <Image source={MOCK_GARMENT_PHOTO} style={{ width: size, height: size }} resizeMode="cover" />
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
  photos,
  onTogglePhoto,
}: ContactlessBasketPhotoSectionProps) {
  const detailLines = line.detailLines;
  const optionalSingle = !isBulk && detailLines.length === 1;
  const showBlock = isBulk || detailLines.length > 0;

  if (!showBlock) {
    return null;
  }

  const slotIds = isBulk ? ['bag'] : detailLines.map((_, index) => `svc-${index}`);
  const uploadedCount = slotIds.filter((id) => photos[contactlessPhotoSlotKey(line.serviceId, id)]).length;
  const requiredCount = 1;

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
            {uploadedCount}/{requiredCount} Bag Image Uploaded
          </Text>
        ) : (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 * scale, flexWrap: 'wrap' }}>
            <Text style={[searchFont('medium'), statusMuted]}>
              {uploadedCount}/{requiredCount} Image Uploaded
            </Text>
            <StatusDot scale={scale} />
            <Text style={[searchFont('medium'), statusMuted]}>Any 1 Service</Text>
          </View>
        )}
      </View>

      <View style={{ paddingLeft: 32 * scale, gap: 20 * scale }}>
        {isBulk ? (
          <PhotoSlotRow
            scale={scale}
            variant="primary"
            uploaded={Boolean(photos[contactlessPhotoSlotKey(line.serviceId, 'bag')])}
            title={line.weightSubline ?? 'Bag'}
            actionLabel="+ Add bag Photo"
            actionColor={SwashoColors.primary600}
            onPress={() => onTogglePhoto(contactlessPhotoSlotKey(line.serviceId, 'bag'))}
            tileContent={<ContactlessBagBoldIcon width={24 * scale} height={24 * scale} />}
            gap={10}
          />
        ) : (
          detailLines.map((detail, index) => {
            const slotKey = contactlessPhotoSlotKey(line.serviceId, `svc-${index}`);
            const uploaded = Boolean(photos[slotKey]);
            const isOptional = optionalSingle;
            return (
              <View key={detail} style={{ width: '100%', gap: 20 * scale }}>
                {index > 0 ? <ServiceRowDivider variant="dotted" width={349} scale={scale} /> : null}
                <PhotoSlotRow
                  scale={scale}
                  variant={isOptional ? 'muted' : 'primary'}
                  uploaded={uploaded}
                  title={detail}
                  actionLabel="+ Add garment Photo"
                  actionColor={isOptional ? SwashoColors.neutral500 : SwashoColors.primary600}
                  onPress={() => onTogglePhoto(slotKey)}
                  gap={isOptional ? 8 : 10}
                  paddingHorizontal={isOptional ? 14 : 14}
                />
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}
