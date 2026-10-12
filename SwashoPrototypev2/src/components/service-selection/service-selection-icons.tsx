import type { StyleProp, ViewStyle } from 'react-native';
import Svg, { Path, SvgXml } from 'react-native-svg';

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

/** Figma Bold / Money / Tag (3458:6194) — Path uses evenodd; SvgXml ignores kebab-case fill-rule on web. */
const MONEY_TAG_PATH =
  'M1.76887 10.68C2.00849 11.5155 2.65246 12.1595 3.9404 13.4474L5.4651 14.9721C7.70592 17.2129 8.82633 18.3333 10.2186 18.3333C11.6109 18.3333 12.7313 17.2129 14.9721 14.9721C17.2129 12.7313 18.3333 11.6109 18.3333 10.2186C18.3333 8.82633 17.2129 7.70592 14.9721 5.4651L13.4474 3.9404C12.1595 2.65246 11.5155 2.00849 10.68 1.76887C9.84447 1.52925 8.95708 1.73403 7.18229 2.14359L6.15881 2.37978C4.66567 2.72435 3.9191 2.89664 3.40787 3.40787C2.89664 3.9191 2.72435 4.66567 2.37978 6.15881L2.14359 7.18229C1.73403 8.95708 1.52925 9.84447 1.76887 10.68ZM8.43616 6.05915C9.09248 6.71547 9.09248 7.77958 8.43616 8.4359C7.77984 9.09222 6.71573 9.09222 6.05941 8.4359C5.40309 7.77958 5.40309 6.71547 6.05941 6.05915C6.71573 5.40282 7.77984 5.40282 8.43616 6.05915ZM15.8759 10.0426L10.0601 15.8586C9.816 16.1027 9.42027 16.1027 9.17619 15.8586C8.93211 15.6145 8.9321 15.2188 9.17617 14.9747L14.992 9.15869C15.2361 8.91461 15.6318 8.9146 15.8759 9.15868C16.12 9.40275 16.12 9.79848 15.8759 10.0426Z';

export function MoneyTagIcon({ width, height, style }: IconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 20" fill="none" style={style}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d={MONEY_TAG_PATH}
        fill={SwashoColors.primary600}
      />
    </Svg>
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

const DoubleAltArrowRightIconXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.5 4.5L8.5 10L4.5 15.5" stroke="#5D30F7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M10.5 4.5L14.5 10L10.5 15.5" stroke="#5D30F7" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export function DoubleAltArrowRightIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={DoubleAltArrowRightIconXml} width={width} height={height} style={style} />;
}
