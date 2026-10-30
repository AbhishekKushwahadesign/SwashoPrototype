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

/** Figma 59340:4907 — sticky footer remove (dustbin). */
const ServiceSelectionRemoveIconXml = `<svg preserveAspectRatio="xMidYMid meet" overflow="visible" style="display: block;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.333 3.333h3.334l.417 1.667H16.25v1.667H3.75V5h4.166l.417-1.667z" fill="#EF4444"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M4.583 7.5h10.834l-.625 9.167c-.042.583-.542 1.042-1.125 1.042H6.333c-.583 0-1.083-.459-1.125-1.042L4.583 7.5zm2.292 1.667v6.666h1.25V9.167h-1.25zm2.5 0v6.666h1.25V9.167h-1.25zm2.5 0v6.666h1.25V9.167h-1.25z" fill="#EF4444"/>
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
