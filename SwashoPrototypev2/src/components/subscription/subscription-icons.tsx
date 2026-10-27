import { SvgXml } from 'react-native-svg';

import BillListSvg from '@/assets/images/subscription/bill-list.svg';

type IconProps = {
  width: number;
  height: number;
};

export function BillListIcon({ width, height }: IconProps) {
  return <BillListSvg width={width} height={height} />;
}

const verticalRuleXml = `<svg width="1" height="18" viewBox="0 0 1 18" fill="none" xmlns="http://www.w3.org/2000/svg">
<line x1="0.5" y1="0" x2="0.5" y2="18" stroke="#DBDBDB"/>
</svg>`;

export function VerticalRuleIcon({ width, height }: IconProps) {
  return <SvgXml xml={verticalRuleXml} width={width} height={height} />;
}
