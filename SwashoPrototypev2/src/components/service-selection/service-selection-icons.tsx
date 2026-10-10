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

const MoneyTagIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M3.33301 10.8333C3.33301 7.65143 5.98444 5 9.16634 5H14.1663C15.0878 5 15.833 5.74519 15.833 6.66667V8.33333C15.833 9.25481 15.0878 10 14.1663 10H11.6663C10.7449 10 9.99967 10.7452 9.99967 11.6667V13.3333C9.99967 14.2548 10.7449 15 11.6663 15H14.1663C15.0878 15 15.833 15.7452 15.833 16.6667V18.3333C15.833 19.2548 15.0878 20 14.1663 20H9.16634C5.98444 20 3.33301 17.3486 3.33301 14.1667V10.8333Z" fill="#5D30F7"/>
<circle cx="14.1663" cy="6.66667" r="1.66667" fill="white"/>
</svg>`;

export function MoneyTagIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={MoneyTagIconXml} width={width} height={height} style={style} />;
}

const InfoCircleIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="9" cy="9" r="7.5" stroke="#3D3D3D" stroke-width="1.2"/>
<path d="M9 8.25V12.75" stroke="#3D3D3D" stroke-width="1.2" stroke-linecap="round"/>
<circle cx="9" cy="5.625" r="0.75" fill="#3D3D3D"/>
</svg>`;

export function InfoCircleIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={InfoCircleIconXml} width={width} height={height} style={style} />;
}

const PenEditIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.3333 2.00004C11.7015 1.63182 12.2985 1.63182 12.6667 2.00004C13.0349 2.36825 13.0349 2.9653 12.6667 3.33352L5.33333 10.6669L2.66667 11.3335L3.33333 8.66686L10.6667 1.33352L11.3333 2.00004Z" stroke="#292929" stroke-width="1.2" stroke-linejoin="round"/>
</svg>`;

export function PenEditIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={PenEditIconXml} width={width} height={height} style={style} />;
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
