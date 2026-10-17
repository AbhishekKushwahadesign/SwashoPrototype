import { SvgXml } from 'react-native-svg';
import type { StyleProp, ViewStyle } from 'react-native';

const transferHorizontalXml = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M10.25 4.00003C10.25 3.69074 10.0602 3.41317 9.77191 3.30105C9.48366 3.18892 9.15614 3.26524 8.94715 3.49324L3.44715 9.49324C3.24617 9.71248 3.19374 10.0298 3.3135 10.302C3.43327 10.5743 3.70259 10.75 4.00002 10.75H20C20.4142 10.75 20.75 10.4142 20.75 10C20.75 9.58582 20.4142 9.25003 20 9.25003L10.25 9.25003V4.00003Z" fill="#5D30F7"/>
<path d="M13.75 20L13.75 14.75H4.00002C3.5858 14.75 3.25002 14.4142 3.25002 14C3.25002 13.5858 3.5858 13.25 4.00002 13.25L20 13.25C20.2974 13.25 20.5668 13.4258 20.6865 13.698C20.8063 13.9703 20.7539 14.2876 20.5529 14.5068L15.0529 20.5068C14.8439 20.7348 14.5164 20.8111 14.2281 20.699C13.9399 20.5869 13.75 20.3093 13.75 20Z" fill="#5D30F7"/>
</svg>`;

type IconProps = {
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
};

/** Figma 3346:13493 — Bold / Arrows / Transfer Horizontal */
export function TransferHorizontalIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={transferHorizontalXml} width={width} height={height} style={style} />;
}

const frequencySummaryCheckXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="14.1211" height="10.5598" viewBox="0 0 14.1211 10.5598" fill="none" xmlns="http://www.w3.org/2000/svg">
<path id="Vector 30" d="M1.50205 6.32583L3.94049 8.7644C4.33154 9.15547 4.96559 9.15548 5.35665 8.76442L12.619 1.50205" strokeWidth="3.0041" strokeLinecap="round" stroke="#5D30F7"/>
</svg>`;

/** Figma 3346:13280 — Vector 30 (Subscribe 2 frequency summary hint checkmark) */
export function FrequencySummaryCheckIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={frequencySummaryCheckXml} width={width} height={height} style={style} />;
}
