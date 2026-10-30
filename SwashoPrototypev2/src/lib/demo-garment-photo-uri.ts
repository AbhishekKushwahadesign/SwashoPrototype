import { Image, type ImageSourcePropType } from 'react-native';

import { CONTACTLESS_BAG_SERVICE_ID } from '@/lib/contactless-garment-photos';

const PROTOTYPE_GARMENT_PHOTOS = [
  require('@/assets/images/checkout/prototype-garments/white-tee-coffee-stain.png'),
  require('@/assets/images/checkout/prototype-garments/blue-jeans-mud.png'),
  require('@/assets/images/checkout/prototype-garments/white-shirt-collar-stain.png'),
] as const satisfies readonly ImageSourcePropType[];

export const PROTOTYPE_LAUNDRY_BAG_PHOTO = require('@/assets/images/checkout/prototype-laundry-bag.jpg') as ImageSourcePropType;

/** Bundled demo asset → URI string for `<Image source={{ uri }}>` on native and web. */
export function resolveDemoGarmentPhotoUri(source: ImageSourcePropType): string {
  const resolved = Image.resolveAssetSource(source);
  if (!resolved?.uri) {
    throw new Error('Unable to resolve demo garment photo asset');
  }
  return resolved.uri;
}

function pickRandomPrototypeGarmentSource(): ImageSourcePropType {
  const index = Math.floor(Math.random() * PROTOTYPE_GARMENT_PHOTOS.length);
  return PROTOTYPE_GARMENT_PHOTOS[index] ?? PROTOTYPE_GARMENT_PHOTOS[0];
}

/**
 * Prototype contactless capture: random garment photo, or laundry bag for bag slots.
 */
export function demoGarmentPhotoUriForSlot(_garmentServiceId: string, laundryServiceId: string): string {
  if (laundryServiceId === CONTACTLESS_BAG_SERVICE_ID) {
    return resolveDemoGarmentPhotoUri(PROTOTYPE_LAUNDRY_BAG_PHOTO);
  }
  return resolveDemoGarmentPhotoUri(pickRandomPrototypeGarmentSource());
}
