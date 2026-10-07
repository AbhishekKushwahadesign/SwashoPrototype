import { Image } from 'expo-image';
import type { ImageSourcePropType, StyleProp, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

import type { ProviderBulkService, ProviderListService } from '@/data/providers';

type IconProps = {
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
};

export function PhoneIcon({ width, height }: IconProps) {
  return (
    <Image
      source={require('@/assets/images/provider-page/phone.svg')}
      style={{ width, height }}
      contentFit="contain"
    />
  );
}

const ChevronDownIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Linear / Arrows / Alt Arrow Down">
<path d="M19 9L12 16L5 9" stroke="#464646" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>`;

export function ChevronDownIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={ChevronDownIconXml} width={width} height={height} style={style} />;
}

const AddSquareIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Linear / Essentional, UI / Add Square">
<path d="M6.75 9H11.25M9 6.75V11.25M4.5 15.75H13.5C14.7426 15.75 15.75 14.7426 15.75 13.5V4.5C15.75 3.25736 14.7426 2.25 13.5 2.25H4.5C3.25736 2.25 2.25 3.25736 2.25 4.5V13.5C2.25 14.7426 3.25736 15.75 4.5 15.75Z" stroke="#5D30F7" stroke-width="1.5" stroke-linecap="round"/>
</g>
</svg>`;

export function AddSquareIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={AddSquareIconXml} width={width} height={height} style={style} />;
}

const ListIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Bold / List / List">
<path d="M6 7.5C6 8.32843 5.32843 9 4.5 9C3.67157 9 3 8.32843 3 7.5C3 6.67157 3.67157 6 4.5 6C5.32843 6 6 6.67157 6 7.5Z" fill="#292929"/>
<path d="M6 12.5C6 13.3284 5.32843 14 4.5 14C3.67157 14 3 13.3284 3 12.5C3 11.6716 3.67157 11 4.5 11C5.32843 11 6 11.6716 6 12.5Z" fill="#292929"/>
<path d="M6 17.5C6 18.3284 5.32843 19 4.5 19C3.67157 19 3 18.3284 3 17.5C3 16.6716 3.67157 16 4.5 16C5.32843 16 6 16.6716 6 17.5Z" fill="#292929"/>
<path d="M9 7.5C9 7.22386 9.22386 7 9.5 7H20.5C20.7761 7 21 7.22386 21 7.5C21 7.77614 20.7761 8 20.5 8H9.5C9.22386 8 9 7.77614 9 7.5Z" fill="#292929"/>
<path d="M9 12.5C9 12.2239 9.22386 12 9.5 12H20.5C20.7761 12 21 12.2239 21 12.5C21 12.7761 20.7761 13 20.5 13H9.5C9.22386 13 9 12.7761 9 12.5Z" fill="#292929"/>
<path d="M9 17.5C9 17.2239 9.22386 17 9.5 17H20.5C20.7761 17 21 17.2239 21 17.5C21 17.7761 20.7761 18 20.5 18H9.5C9.22386 18 9 17.7761 9 17.5Z" fill="#292929"/>
</g>
</svg>`;

export function ListIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={ListIconXml} width={width} height={height} style={style} />;
}

const GridToggleIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="29" height="14.5" viewBox="0 0 29 14.5" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.5" y="0.5" width="28" height="13.5" rx="6.75" fill="#DCDCDC" stroke="#BDBDBD"/>
<circle cx="7.25" cy="7.25" r="5.75" fill="white"/>
</svg>`;

export function GridToggleIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={GridToggleIconXml} width={width} height={height} style={style} />;
}

const BULK_SERVICE_ICONS: Record<ProviderBulkService['icon'], ImageSourcePropType> = {
  ironing: require('@/assets/images/provider-page/ironing.svg'),
  'wash-iron': require('@/assets/images/provider-page/wash-iron.svg'),
  'wash-fold': require('@/assets/images/provider-page/wash-fold.svg'),
};

const LIST_SERVICE_ICONS: Record<ProviderListService['icon'], ImageSourcePropType> = {
  shirt: require('@/assets/images/provider-page/shirt.svg'),
  tshirt: require('@/assets/images/provider-page/tshirt.svg'),
  trouser: require('@/assets/images/provider-page/trouser.svg'),
  jeans: require('@/assets/images/provider-page/jeans.svg'),
};

export function getBulkServiceIcon(icon: ProviderBulkService['icon']): ImageSourcePropType {
  return BULK_SERVICE_ICONS[icon];
}

export function getListServiceIcon(icon: ProviderListService['icon']): ImageSourcePropType {
  return LIST_SERVICE_ICONS[icon];
}
