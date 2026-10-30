import type { StyleProp, ViewStyle } from 'react-native';

import BasketIconSvg from '@/assets/order-tracking/icon-basket.svg';
import BatteryChargeIconSvg from '@/assets/order-tracking/icon-battery-charge.svg';
import BoldArrowDownIconSvg from '@/assets/order-tracking/icon-bold-arrow-down.svg';
import ChatDotsIconSvg from '@/assets/order-tracking/icon-chat-dots.svg';
import Co2LeafIconSvg from '@/assets/order-tracking/icon-co2-leaf.svg';
import DoubleAltArrowDownIconSvg from '@/assets/order-tracking/icon-double-alt-arrow-down.svg';
import HeadsetIconSvg from '@/assets/order-tracking/icon-headset.svg';
import PhoneBoldIconSvg from '@/assets/order-tracking/icon-phone-bold.svg';
import ScooterBoldTrackingIconSvg from '@/assets/order-tracking/icon-scooter-bold.svg';
import VerifiedCheckIconSvg from '@/assets/order-tracking/icon-verified-check.svg';
import RoutePathSvg from '@/assets/order-tracking/route-path.svg';
import DividerDetailsSvg from '@/assets/order-tracking/divider-details.svg';
import DividerLineSvg from '@/assets/order-tracking/divider-line.svg';
import DividerShortSvg from '@/assets/order-tracking/divider-short.svg';

type IconProps = {
  width: number;
  height: number;
  style?: StyleProp<ViewStyle>;
};

export function OrderTrackingRoutePathIcon(props: IconProps) {
  return <RoutePathSvg {...props} />;
}

export function OrderTrackingBatteryChargeIcon(props: IconProps) {
  return <BatteryChargeIconSvg {...props} />;
}

export function OrderTrackingPhoneIcon(props: IconProps) {
  return <PhoneBoldIconSvg {...props} />;
}

export function OrderTrackingChatIcon(props: IconProps) {
  return <ChatDotsIconSvg {...props} />;
}

export function OrderTrackingCo2LeafIcon(props: IconProps) {
  return <Co2LeafIconSvg {...props} />;
}

export function OrderTrackingBasketIcon(props: IconProps) {
  return <BasketIconSvg {...props} />;
}

export function OrderTrackingScooterIcon(props: IconProps) {
  return <ScooterBoldTrackingIconSvg {...props} />;
}

export function OrderTrackingHeadsetIcon(props: IconProps) {
  return <HeadsetIconSvg {...props} />;
}

export function OrderTrackingVerifiedCheckIcon(props: IconProps) {
  return <VerifiedCheckIconSvg {...props} />;
}

export function OrderTrackingDoubleAltArrowDownIcon(props: IconProps) {
  return <DoubleAltArrowDownIconSvg {...props} />;
}

export function OrderTrackingBoldArrowDownIcon(props: IconProps) {
  return <BoldArrowDownIconSvg {...props} />;
}

export function OrderTrackingCardDividerIcon(props: IconProps) {
  return <DividerLineSvg {...props} />;
}

export function OrderTrackingDetailsDividerIcon(props: IconProps) {
  return <DividerDetailsSvg {...props} />;
}

export function OrderTrackingSectionRuleIcon(props: IconProps) {
  return <DividerShortSvg {...props} />;
}
