import { Image, View, type ImageSourcePropType } from 'react-native';
import { SvgXml } from 'react-native-svg';

import type { ContactlessClothesLocationId } from '@/lib/checkout-flow';

import { CheckoutInstructionPenIcon } from './checkout-review-icons';

const optionIconsSource = require('@/assets/checkout/clothes-location-option-icons.png') as ImageSourcePropType;
const headerIllustrationSource =
  require('@/assets/checkout/clothes-location-header-illustration.png') as ImageSourcePropType;

const radioSelectedXml = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="18" height="18" rx="9" stroke="#5D30F7" stroke-width="2"/><circle cx="10" cy="10" r="5" fill="#5D30F7"/></svg>`;

/** Figma 59153:4651 — sprite crop in 32×32 frame (% of frame). */
const OPTION_SPRITE_CROPS: Record<
  Exclude<ContactlessClothesLocationId, 'other'>,
  { leftPercent: number; widthPercent: number; heightPercent: number; topPercent: number }
> = {
  'flat-door': { leftPercent: 0, widthPercent: 473.36, heightPercent: 158.05, topPercent: -29.61 },
  'society-gate': { leftPercent: -85.9, widthPercent: 476.98, heightPercent: 158.05, topPercent: -29.61 },
  'society-lobby': { leftPercent: -186.42, widthPercent: 472.77, heightPercent: 158.05, topPercent: -29.61 },
  maid: { leftPercent: -292.63, widthPercent: 480.83, heightPercent: 158.05, topPercent: -29.61 },
};

export function ClothesLocationHeaderIllustration({ scale }: { scale: number }) {
  const width = 86.039 * scale;
  const height = 98.082 * scale;
  return (
    <Image
      source={headerIllustrationSource}
      accessibilityIgnoresInvertColors
      style={{
        position: 'absolute',
        right: 0,
        top: -18.04 * scale,
        width,
        height,
      }}
      resizeMode="cover"
    />
  );
}

export function ClothesLocationSheetGrabber({ scale }: { scale: number }) {
  return (
    <View
      style={{
        width: 35 * scale,
        height: 3.5 * scale,
        borderRadius: 11 * scale,
        backgroundColor: '#d9d9d9',
        alignSelf: 'center',
      }}
    />
  );
}

export function ClothesLocationOptionSpriteIcon({
  optionId,
  scale,
  frameSize = 32,
}: {
  optionId: Exclude<ContactlessClothesLocationId, 'other'>;
  scale: number;
  /** Icon frame in design px (Figma chip uses 24, sheet options use 32). */
  frameSize?: number;
}) {
  const frame = frameSize * scale;
  const crop = OPTION_SPRITE_CROPS[optionId];
  const imageWidth = (crop.widthPercent / 100) * frame;
  const imageHeight = (crop.heightPercent / 100) * frame;
  const left = (crop.leftPercent / 100) * frame;
  const top = (crop.topPercent / 100) * frame;

  return (
    <View style={{ width: frame, height: frame, overflow: 'hidden' }}>
      <Image
        source={optionIconsSource}
        style={{
          position: 'absolute',
          width: imageWidth,
          height: imageHeight,
          left,
          top,
        }}
        resizeMode="stretch"
      />
    </View>
  );
}

export function ClothesLocationPencilIcon({ scale }: { scale: number }) {
  const size = 21.53 * scale;
  return <CheckoutInstructionPenIcon width={size} height={size} />;
}

export function ClothesLocationRadioSelected({ scale }: { scale: number }) {
  const size = 20 * scale;
  return <SvgXml xml={radioSelectedXml} width={size} height={size} />;
}
