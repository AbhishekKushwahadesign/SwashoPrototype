import type { StyleProp, ViewStyle } from 'react-native';
import { SvgXml } from 'react-native-svg';

import DeliveredCheckSvg from '@/assets/subscription/past-orders/delivered-check.svg';
import ExperienceStarsSvg from '@/assets/subscription/past-orders/experience-stars.svg';
import ExtraGarmentASvg from '@/assets/subscription/past-orders/extra-garment-a.svg';
import ExtraGarmentBSvg from '@/assets/subscription/past-orders/extra-garment-b.svg';
import InvoiceDownloadSvg from '@/assets/subscription/past-orders/invoice-download.svg';
import RiderScribbleBgSvg from '@/assets/subscription/past-orders/rider-scribble-bg.svg';
import RiderScribbleLineSvg from '@/assets/subscription/past-orders/rider-scribble-line.svg';
import ScooterDeliveringSvg from '@/assets/subscription/past-orders/scooter-delivering.svg';
import TrackRiderMapSvg from '@/assets/subscription/past-orders/track-rider-map.svg';
import TrouserIconSvg from '@/assets/subscription/past-orders/trouser-icon.svg';
import UpcomingDotSvg from '@/assets/subscription/past-orders/upcoming-dot.svg';
import WashIronStackBottomSvg from '@/assets/subscription/past-orders/wash-iron-stack-bottom.svg';
import WashIronStackTopSvg from '@/assets/subscription/past-orders/wash-iron-stack-top.svg';

type IconProps = {
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
};

export function PastOrderScooterIcon({ width, height, style }: IconProps) {
  return <ScooterDeliveringSvg width={width} height={height} style={style} />;
}

export function PastOrderDeliveredCheckIcon({ width, height, style }: IconProps) {
  return <DeliveredCheckSvg width={width} height={height} style={style} />;
}

export function PastOrderInvoiceDownloadIcon({ width, height, style }: IconProps) {
  return <InvoiceDownloadSvg width={width} height={height} style={style} />;
}

export function PastOrderTrackRiderIcon({ width, height, style }: IconProps) {
  return <TrackRiderMapSvg width={width} height={height} style={style} />;
}

export function PastOrderExperienceStarsIcon({ width, height, style }: IconProps) {
  return <ExperienceStarsSvg width={width} height={height} style={style} />;
}

export function PastOrderUpcomingDotIcon({ width, height, style }: IconProps) {
  return <UpcomingDotSvg width={width} height={height} style={style} />;
}

export function PastOrderRiderScribbleBgIcon({ width, height, style }: IconProps) {
  return <RiderScribbleBgSvg width={width} height={height} style={style} />;
}

export function PastOrderRiderScribbleLineIcon({ width, height, style }: IconProps) {
  return <RiderScribbleLineSvg width={width} height={height} style={style} />;
}

/** Figma 59367:3996 — road under delivering rider (3429:18167). Filter-free for RN web. */
const PAST_ORDER_ROAD_SVG = `<svg viewBox="0 0 160.965 54.4865" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4.88947 27.2779L149.582 19.9561L160.165 26.3225L1.65227 37.2804L4.88947 27.2779Z" fill="url(#pastOrderRoadGrad)"/>
<path d="M16.339 31.7379L23.49 31.3056M159.358 23.0919L152.207 23.5242M37.7919 30.441L52.0939 29.5764M66.3958 28.7118L80.6977 27.8472M94.9997 26.9826L109.302 26.118M123.604 25.2534L137.906 24.3888" stroke="white" stroke-width="0.4"/>
<defs>
<linearGradient id="pastOrderRoadGrad" x1="0.626008" y1="32.8383" x2="122.356" y2="24.1822" gradientUnits="userSpaceOnUse">
<stop offset="0.274344" stop-color="#2A2A2A"/>
<stop offset="0.903889" stop-color="#2A2A2A" stop-opacity="0"/>
</linearGradient>
</defs>
</svg>`;

export function PastOrderRoadIcon({ width, height, style }: IconProps) {
  return <SvgXml xml={PAST_ORDER_ROAD_SVG} width={width} height={height} style={style} />;
}

export function PastOrderWashIronTileIcon({ width, height, style }: IconProps) {
  const tile = width;
  return (
    <SvgXml
      xml={`<svg width="${tile}" height="${tile}" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.219" y="0.219" width="34.562" height="34.562" rx="3.281" stroke="#DBDBDB" stroke-width="0.438"/></svg>`}
      width={width}
      height={height}
      style={style}
    />
  );
}

export function PastOrderWashIronStackTopIcon({ width, height, style }: IconProps) {
  return <WashIronStackTopSvg width={width} height={height} style={style} />;
}

export function PastOrderWashIronStackBottomIcon({ width, height, style }: IconProps) {
  return <WashIronStackBottomSvg width={width} height={height} style={style} />;
}

export function PastOrderTrouserTileIcon({ width, height, style }: IconProps) {
  return <TrouserIconSvg width={width} height={height} style={style} />;
}

export function PastOrderExtraGarmentAIcon({ width, height, style }: IconProps) {
  return <ExtraGarmentASvg width={width} height={height} style={style} />;
}

export function PastOrderExtraGarmentBIcon({ width, height, style }: IconProps) {
  return <ExtraGarmentBSvg width={width} height={height} style={style} />;
}
