import { Image, type ImageSourcePropType } from 'react-native';

import AddSquareIcon from '@/assets/images/home/location-modal/add-square-icon.svg';
import HomeBoldIcon from '@/assets/images/home/location-modal/home-bold-icon.svg';
import PenEditIcon from '@/assets/images/home/location-modal/pen-edit-icon.svg';

export const locationPinHeroImage =
  require('@/assets/images/home/location-modal/location-pin-hero.png') as ImageSourcePropType;
export const locationCloudAccentImage =
  require('@/assets/images/home/location-modal/cloud-accent.png') as ImageSourcePropType;

type IconProps = {
  width: number;
  height: number;
};

export function LocationModalHomeIcon({ width, height }: IconProps) {
  return <HomeBoldIcon width={width} height={height} />;
}

export function LocationModalPenEditIcon({ width, height }: IconProps) {
  return <PenEditIcon width={width} height={height} />;
}

export function LocationModalAddSquareIcon({ width, height }: IconProps) {
  return <AddSquareIcon width={width} height={height} />;
}

export function LocationModalPinHero({ width, height }: IconProps) {
  return (
    <Image
      source={locationPinHeroImage}
      style={{ width, height }}
      resizeMode="contain"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}

export function LocationModalCloudAccent({
  width,
  height,
  style,
}: IconProps & { style?: object }) {
  return (
    <Image
      source={locationCloudAccentImage}
      style={[{ width, height }, style]}
      resizeMode="contain"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    />
  );
}
