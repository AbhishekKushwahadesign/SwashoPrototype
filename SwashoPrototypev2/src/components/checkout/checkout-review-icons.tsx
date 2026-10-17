import type { StyleProp, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

import AddSquareArt from '@/assets/checkout/add-square.svg';
import CheckSquareArt from '@/assets/checkout/check-square.svg';
import ContactlessArt from '@/assets/checkout/contactless.svg';
import InfoBoldArt from '@/assets/checkout/info-bold.svg';
import InstructionDoorstepArt from '@/assets/checkout/instruction-doorstep.svg';
import MoneyTagArt from '@/assets/checkout/money-tag.svg';
import PenArt from '@/assets/checkout/pen.svg';
import PhoneArt from '@/assets/checkout/phone.svg';
import ShieldArt from '@/assets/checkout/shield.svg';

type IconProps = {
  width: number;
  height: number;
  color?: string;
  style?: StyleProp<ViewStyle>;
};

const cartXml = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z" stroke="#292929" stroke-width="1.5"/>
<path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z" stroke="#292929" stroke-width="1.5"/>
<path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6" stroke="#292929" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

export function CheckoutCartIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={cartXml} width={width} height={height} style={style} />;
}

const billXml = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M6 3H18C19.1046 3 20 3.89543 20 5V19C20 20.1046 19.1046 21 18 21H6C4.89543 21 4 20.1046 4 19V5C4 3.89543 4.89543 3 6 3Z" stroke="#292929" stroke-width="1.5"/>
<path d="M8 7H16M8 11H16M8 15H12" stroke="#292929" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

export function CheckoutBillIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={billXml} width={width} height={height} style={style} />;
}

const infoXml = (stroke: string) => `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<circle cx="8" cy="8" r="6.5" stroke="${stroke}" stroke-width="1.2"/>
<path d="M8 7.2V11" stroke="${stroke}" stroke-width="1.2" stroke-linecap="round"/>
<circle cx="8" cy="5.2" r="0.8" fill="${stroke}"/>
</svg>`;

export function CheckoutInfoIcon({ width, height, color = '#656565', style }: IconProps) {
  return <SvgXml xml={infoXml(color)} width={width} height={height} style={style} />;
}

const confettiXml = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10 2L11.2 6.8L16 8L11.2 9.2L10 14L8.8 9.2L4 8L8.8 6.8L10 2Z" fill="#5D30F7"/>
<path d="M4 3L4.6 5.2L6.8 5.8L4.6 6.4L4 8.6L3.4 6.4L1.2 5.8L3.4 5.2L4 3Z" fill="#8781FF"/>
<path d="M16 12L16.6 14.2L18.8 14.8L16.6 15.4L16 17.6L15.4 15.4L13.2 14.8L15.4 14.2L16 12Z" fill="#8781FF"/>
</svg>`;

export function CheckoutConfettiIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={confettiXml} width={width} height={height} style={style} />;
}

export function CheckoutContactlessIcon({ width, height, style }: IconProps) {
  return <ContactlessArt width={width} height={height} style={style} />;
}

export function CheckoutInstructionsHeaderIcon({ width, height, style }: IconProps) {
  return <InfoBoldArt width={width} height={height} style={style} />;
}

export function CheckoutAddSquareIcon({ width, height, style }: IconProps) {
  return <AddSquareArt width={width} height={height} style={style} />;
}

export function CheckoutInstructionPhoneIcon({ width, height, style }: IconProps) {
  return <PhoneArt width={width} height={height} style={style} />;
}

export function CheckoutInstructionShieldIcon({ width, height, style }: IconProps) {
  return <ShieldArt width={width} height={height} style={style} />;
}

export function CheckoutInstructionDoorstepIcon({ width, height, style }: IconProps) {
  return <InstructionDoorstepArt width={width} height={height} style={style} />;
}

export function CheckoutInstructionPenIcon({ width, height, style }: IconProps) {
  return <PenArt width={width} height={height} style={style} />;
}

export function CheckoutMoneyTagIcon({ width, height, style }: IconProps) {
  return <MoneyTagArt width={width} height={height} style={style} />;
}

export function CheckoutCheckSquareIcon({ width, height, style }: IconProps) {
  return <CheckSquareArt width={width} height={height} style={style} />;
}
