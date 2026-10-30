import { Image, type ImageSourcePropType } from 'react-native';
import { SvgXml } from 'react-native-svg';

import AddSquareIcon from '@/assets/images/home/location-modal/add-square-icon.svg';
import HomeBoldIcon from '@/assets/images/home/location-modal/home-bold-icon.svg';
import { SwashoColors } from '@/constants/swasho-tokens';

/** Figma 3445:11064 — Bold / Pen 2 (20×20), flattened for web (no shared SVG defs). */
const LOCATION_MODAL_PEN_EDIT_ICON_XML = `<svg preserveAspectRatio="xMidYMid meet" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path fill-rule="evenodd" clip-rule="evenodd" d="M2.70833 18.3333C2.70833 17.9882 2.98816 17.7083 3.33333 17.7083H16.6667C17.0118 17.7083 17.2917 17.9882 17.2917 18.3333C17.2917 18.6785 17.0118 18.9583 16.6667 18.9583H3.33333C2.98816 18.9583 2.70833 18.6785 2.70833 18.3333Z" fill="${SwashoColors.primary600}"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M8.81078 13.1834C9.0229 13.0179 9.21531 12.8255 9.60007 12.4408L14.5306 7.51021C13.8596 7.23091 13.0648 6.77214 12.3131 6.02045C11.5613 5.26865 11.1025 4.47372 10.8232 3.8026L5.89255 8.73327L5.89253 8.73329C5.50777 9.11804 5.31538 9.31043 5.14993 9.52256C4.95476 9.77279 4.78742 10.0435 4.65089 10.33C4.53516 10.5729 4.44912 10.831 4.27704 11.3472L3.36963 14.0694C3.28495 14.3235 3.35107 14.6036 3.54042 14.7929C3.72977 14.9823 4.00985 15.0484 4.26389 14.9637L6.98612 14.0563C7.50234 13.8842 7.76047 13.7982 8.00332 13.6824C8.28979 13.5459 8.56054 13.3786 8.81078 13.1834Z" fill="${SwashoColors.primary600}"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M15.8988 6.14204C16.9226 5.11823 16.9226 3.45832 15.8988 2.43452C14.875 1.41072 13.2151 1.41072 12.1913 2.43452L11.5999 3.02588C11.608 3.05033 11.6164 3.07512 11.6251 3.10024C11.8419 3.725 12.2509 4.544 13.0202 5.31335C13.7896 6.08269 14.6086 6.49166 15.2333 6.70841C15.2583 6.71708 15.283 6.72545 15.3073 6.73351L15.8988 6.14204Z" fill="${SwashoColors.primary600}"/>
</svg>`;

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
  return (
    <SvgXml xml={LOCATION_MODAL_PEN_EDIT_ICON_XML} width={width} height={height} />
  );
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
