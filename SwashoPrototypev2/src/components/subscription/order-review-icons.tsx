import type { StyleProp, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

type IconProps = {
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
};

function svgIcon(xml: string, { width, height, style }: IconProps) {
  return <SvgXml xml={xml} width={width} height={height} style={style} />;
}

/** Figma 3409:16986 — Linear / Map & Location / Map Point. */
const mapPointXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Linear / Map & Location / Map Point">
<path id="Vector" d="M10 18.3333C13.3333 14.1667 16.6667 11.0152 16.6667 7.91667C16.6667 4.81815 13.6819 1.83333 10.5833 1.83333C7.48481 1.83333 4.5 4.81815 4.5 7.91667C4.5 11.0152 7.83333 14.1667 10 18.3333Z" stroke="#464646" stroke-width="1.25"/>
<path id="Vector_2" d="M12.0833 7.91667C12.0833 9.06726 11.1506 10 10 10C8.84941 10 7.91667 9.06726 7.91667 7.91667C7.91667 6.76607 8.84941 5.83333 10 5.83333C11.1506 5.83333 12.0833 6.76607 12.0833 7.91667Z" stroke="#464646" stroke-width="1.25"/>
</g>
</svg>`;

export function OrderReviewMapPointIcon({ width, height, style }: IconProps) {
  return svgIcon(mapPointXml, { width, height, style });
}

/** Figma 3409:17169 — Linear / Time / History 2 (dashed arc + counter-clockwise hand). */
const historyXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Linear / Time / History 2">
<path id="Vector" d="M1.66667 10C1.66667 14.6024 5.39763 18.3333 10 18.3333C14.6024 18.3333 18.3333 14.6024 18.3333 10C18.3333 5.39763 14.6024 1.66667 10 1.66667" stroke-width="1.25" stroke-linecap="round" stroke="#656565"/>
<path id="Vector_2" d="M10 7.5V10.8333H13.3333" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round" stroke="#656565"/>
<circle id="Vector_3" cx="10" cy="10" r="8.33333" stroke="#656565" stroke-width="1.25" stroke-linecap="round" stroke-dasharray="0.42 2.92"/>
</g>
</svg>`;

export function OrderReviewHistoryIcon({ width, height, style }: IconProps) {
  return svgIcon(historyXml, { width, height, style });
}

/** Small check for contactless “Enabled” row (Figma 3409:17014). */
const enabledCheckXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="13.1018" height="9.54534" viewBox="0 0 13.1018 9.54534" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 5.81719L3.4351 8.25243C3.82563 8.64297 4.45881 8.64298 4.84934 8.25245L12.1018 1" stroke="#16a34a" stroke-width="2" stroke-linecap="round"/>
</svg>`;

export function OrderReviewEnabledCheckIcon({ width, height, style }: IconProps) {
  return svgIcon(enabledCheckXml, { width, height, style });
}
