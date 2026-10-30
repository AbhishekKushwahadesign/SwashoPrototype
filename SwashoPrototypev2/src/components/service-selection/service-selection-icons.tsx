import { Image } from 'expo-image';
import type { StyleProp, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

import { AddSquareIcon, ChevronDownIcon } from '@/components/provider-page/provider-page-icons';
import { SwashoColors } from '@/constants/swasho-tokens';

type IconProps = {
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
};

export { AddSquareIcon, ChevronDownIcon };

export type CounterIconTone = 'default' | 'muted' | 'subdued';

const COUNTER_ICON_STROKE: Record<CounterIconTone, string> = {
  default: SwashoColors.neutral50,
  muted: SwashoColors.primary300,
  subdued: SwashoColors.primary100,
};

function counterMinusSquareXml(tone: CounterIconTone) {
  const stroke = COUNTER_ICON_STROKE[tone];
  return `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Linear / Essentional, UI / Minus Square">
<path d="M3 18C3 10.9289 3 7.3934 5.1967 5.1967C7.3934 3 10.9289 3 18 3C25.0711 3 28.6066 3 30.8033 5.1967C33 7.3934 33 10.9289 33 18C33 25.0711 33 28.6066 30.8033 30.8033C28.6066 33 25.0711 33 18 33C10.9289 33 7.3934 33 5.1967 30.8033C3 28.6066 3 25.0711 3 18Z" stroke="${stroke}" stroke-width="3"/>
<path d="M22.5 19C23.0523 19 23.5 18.5523 23.5 18C23.5 17.4477 23.0523 17 22.5 17V18V19ZM22.5 18V17H13.5V18V19H22.5V18Z" fill="${stroke}"/>
</g>
</svg>`;
}

function counterAddSquareXml(tone: CounterIconTone) {
  const stroke = COUNTER_ICON_STROKE[tone];
  return `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Linear / Essentional, UI / Add Square">
<path d="M3 18C3 10.9289 3 7.3934 5.1967 5.1967C7.3934 3 10.9289 3 18 3C25.0711 3 28.6066 3 30.8033 5.1967C33 7.3934 33 10.9289 33 18C33 25.0711 33 28.6066 30.8033 30.8033C28.6066 33 25.0711 33 18 33C10.9289 33 7.3934 33 5.1967 30.8033C3 28.6066 3 25.0711 3 18Z" stroke="${stroke}" stroke-width="3"/>
<path d="M22.5 18L18 18M18 18L13.5 18M18 18L18 13.5M18 18L18 22.5" stroke="${stroke}" stroke-width="2" stroke-linecap="round"/>
</g>
</svg>`;
}

export function CounterMinusSquareIcon({
  width,
  height,
  style,
  tone = 'default',
}: IconProps & { tone?: CounterIconTone }) {
  return <SvgXml xml={counterMinusSquareXml(tone)} width={width} height={height} style={style} />;
}

export function CounterAddSquareIcon({
  width,
  height,
  style,
  tone = 'default',
}: IconProps & { tone?: CounterIconTone }) {
  return <SvgXml xml={counterAddSquareXml(tone)} width={width} height={height} style={style} />;
}

/** Figma Bold / Money / Tag (`3458:6194`) — raster from official SVG (#5D30F7) for reliable Expo web rendering. */
const moneyTagImage = require('@/assets/images/service-selection/money-tag.png');

export function MoneyTagIcon({ width, height, style }: IconProps) {
  return (
    <Image
      source={moneyTagImage}
      style={[{ width, height }, style]}
      contentFit="contain"
      accessibilityLabel=""
    />
  );
}

const InfoCircleIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="9" cy="9" r="7.5" stroke="#3D3D3D" stroke-width="1.2"/>
<path d="M9 8.25V12.75" stroke="#3D3D3D" stroke-width="1.2" stroke-linecap="round"/>
<circle cx="9" cy="5.625" r="0.75" fill="#3D3D3D"/>
</svg>`;

export function InfoCircleIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={InfoCircleIconXml} width={width} height={height} style={style} />;
}

function penEditIconXml(stroke: string) {
  return `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.3333 2.00004C11.7015 1.63182 12.2985 1.63182 12.6667 2.00004C13.0349 2.36825 13.0349 2.9653 12.6667 3.33352L5.33333 10.6669L2.66667 11.3335L3.33333 8.66686L10.6667 1.33352L11.3333 2.00004Z" stroke="${stroke}" stroke-width="1.2" stroke-linejoin="round"/>
</svg>`;
}

export function PenEditIcon({
  width,
  height,
  style,
  color = '#292929',
}: IconProps & { color?: string }) {
  return <SvgXml xml={penEditIconXml(color)} width={width} height={height} style={style} />;
}

const TabDividerIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="1" height="16" viewBox="0 0 1 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<line x1="0.5" y1="0" x2="0.5" y2="16" stroke="#DCDCDC"/>
</svg>`;

export function TabDividerIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={TabDividerIconXml} width={width} height={height} style={style} />;
}

const SheetCloseIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M5 5L15 15M15 5L5 15" stroke="#656565" stroke-width="1.8" stroke-linecap="round"/>
</svg>`;

export function SheetCloseIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={SheetCloseIconXml} width={width} height={height} style={style} />;
}

/** Figma 59340:4844 — Linear / Security / Shield Cross (delete garment line). */
const SheetDeleteShieldCrossIconXml = `<svg preserveAspectRatio="xMidYMid meet" overflow="visible" style="display: block;" width="20" height="20" viewBox="0 0 64.8 64.8" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Linear / Security / Shield Cross">
<path d="M56.7 32.3767C56.7 30.8432 56.7 29.4291 56.7 28.125C56.7 19.4915 56.7 15.1748 55.6807 13.7225C54.6614 12.2703 50.6025 10.8809 42.4847 8.10214L40.9382 7.57274C36.7066 6.12425 34.5907 5.4 32.4 5.4C30.2093 5.4 28.0935 6.12425 23.8619 7.57274L22.3153 8.10214C14.1975 10.8809 10.1386 12.2703 9.11929 13.7225C8.1 15.1748 8.1 19.4915 8.1 28.125C8.1 29.4291 8.1 30.8432 8.1 32.3767C8.1 47.5995 19.5452 54.9868 26.7261 58.1236C28.674 58.9746 29.648 59.4 32.4 59.4C35.152 59.4 36.126 58.9746 38.0739 58.1237C45.2548 54.9868 56.7 47.5995 56.7 32.3767Z" stroke="#5D30F7" stroke-width="5.4"/>
<path d="M39.15 25.65L32.4 32.4M32.4 32.4L25.6501 39.1499M32.4 32.4L25.65 25.6499M32.4 32.4L39.1499 39.1499" stroke="#292929" stroke-width="2.4" stroke-linecap="round"/>
</g>
</svg>`;

export function SheetDeleteShieldCrossIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={SheetDeleteShieldCrossIconXml} width={width} height={height} style={style} />;
}

/** Figma 59340:4908 — Bold / Arrows Action / Upload Minimalistic (sticky footer remove). */
const ServiceSelectionRemoveIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Bold / Arrows Action / Upload Minimalistic">
<path d="M10.4613 2.07827C10.3429 1.94876 10.1755 1.875 10 1.875C9.82453 1.875 9.65714 1.94876 9.53873 2.07827L6.2054 5.7241C5.97248 5.97885 5.99018 6.37419 6.24494 6.6071C6.49969 6.84002 6.89502 6.82231 7.12793 6.56756L9.375 4.10984V13.3333C9.375 13.6785 9.65482 13.9583 10 13.9583C10.3452 13.9583 10.625 13.6785 10.625 13.3333V4.10984L12.8721 6.56756C13.105 6.82231 13.5003 6.84002 13.7551 6.6071C14.0098 6.37419 14.0275 5.97885 13.7946 5.7241L10.4613 2.07827Z" fill="#EF4444"/>
<path d="M3.125 12.5C3.125 12.1548 2.84518 11.875 2.5 11.875C2.15482 11.875 1.875 12.1548 1.875 12.5V12.5457C1.87498 13.6854 1.87497 14.604 1.9721 15.3265C2.07295 16.0765 2.28869 16.7081 2.79029 17.2097C3.29189 17.7113 3.92345 17.927 4.67354 18.0279C5.39601 18.125 6.31462 18.125 7.45428 18.125H12.5457C13.6854 18.125 14.604 18.125 15.3265 18.0279C16.0765 17.927 16.7081 17.7113 17.2097 17.2097C17.7113 16.7081 17.9271 16.0765 18.0279 15.3265C18.125 14.604 18.125 13.6854 18.125 12.5457V12.5C18.125 12.1548 17.8452 11.875 17.5 11.875C17.1548 11.875 16.875 12.1548 16.875 12.5C16.875 13.6962 16.8737 14.5304 16.789 15.1599C16.7068 15.7714 16.5565 16.0952 16.3258 16.3258C16.0952 16.5565 15.7714 16.7068 15.1599 16.789C14.5304 16.8737 13.6962 16.875 12.5 16.875H7.5C6.30382 16.875 5.46956 16.8737 4.8401 16.789C4.22862 16.7068 3.90481 16.5565 3.67417 16.3258C3.44354 16.0952 3.29317 15.7714 3.21096 15.1599C3.12633 14.5304 3.125 13.6962 3.125 12.5Z" fill="#EF4444"/>
</g>
</svg>`;

export function ServiceSelectionRemoveIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={ServiceSelectionRemoveIconXml} width={width} height={height} style={style} />;
}

const DoubleAltArrowRightIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.5 4.5L8.5 10L4.5 15.5" stroke="#5D30F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M10.5 4.5L14.5 10L10.5 15.5" stroke="#5D30F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
</svg>`;

export function DoubleAltArrowRightIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={DoubleAltArrowRightIconXml} width={width} height={height} style={style} />;
}
