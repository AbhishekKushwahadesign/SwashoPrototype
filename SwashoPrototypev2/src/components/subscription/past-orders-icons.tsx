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
