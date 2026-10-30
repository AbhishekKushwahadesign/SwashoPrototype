import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';

import BookmarkBoldSvg from '@/assets/images/profile/bookmark-bold.svg';
import BookmarkLinearSvg from '@/assets/images/profile/bookmark-linear.svg';
import HeadphonesBoldSvg from '@/assets/images/profile/headphones-bold.svg';
import MoneyBillBoldSvg from '@/assets/images/profile/money-bill-bold.svg';
import MoneyCardLinearSvg from '@/assets/images/profile/money-card-linear.svg';
import ProfileRowDividerSvg from '@/assets/images/profile/row-divider.svg';
import ScooterLinearSvg from '@/assets/images/profile/scooter-linear.svg';
import SupportBadgeSvg from '@/assets/images/profile/support-badge.svg';
import UserCircleLinearSvg from '@/assets/images/profile/user-circle-linear.svg';

type IconProps = {
  width: number;
  height: number;
};

export function ProfileMoneyBillBoldIcon({ width, height }: IconProps) {
  return <MoneyBillBoldSvg width={width} height={height} />;
}

export function ProfileBookmarkBoldIcon({ width, height }: IconProps) {
  return <BookmarkBoldSvg width={width} height={height} />;
}

export function ProfileUserCircleIcon({ width, height }: IconProps) {
  return <UserCircleLinearSvg width={width} height={height} />;
}

export function ProfileBookmarkLinearIcon({ width, height }: IconProps) {
  return <BookmarkLinearSvg width={width} height={height} />;
}

export function ProfileMoneyCardIcon({ width, height }: IconProps) {
  return <MoneyCardLinearSvg width={width} height={height} />;
}

export function ProfileScooterIcon({ width, height }: IconProps) {
  return <ScooterLinearSvg width={width} height={height} />;
}

export function ProfileRowDivider({ width, height }: IconProps) {
  return <ProfileRowDividerSvg width={width} height={height} />;
}

/** Figma 3415:17445 — headphones + support badge composite. */
export function ProfileSupportHelpIcon({ width, height }: IconProps) {
  const scale = width / 24;
  return (
    <View style={{ width, height }}>
      <View style={{ position: 'absolute', left: 2.64 * scale, top: -0.16 * scale, width: 18.462 * scale, height: 18.462 * scale }}>
        <HeadphonesBoldSvg width={18.462 * scale} height={18.462 * scale} />
      </View>
      <View style={{ position: 'absolute', left: 9.51 * scale, top: 16.76 * scale, width: 9.004 * scale, height: 6.686 * scale }}>
        <SupportBadgeSvg width={9.004 * scale} height={6.686 * scale} />
      </View>
    </View>
  );
}

const chevronXml = `<svg preserveAspectRatio="none" overflow="visible" style="display: block;" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<g id="Linear / Arrows / Alt Arrow Down">
<path id="Vector" d="M15.8333 7.5L10 12.5L4.16667 7.5" stroke="#292929" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</g>
</svg>`;

export function ProfileChevronIcon({ width, height }: IconProps) {
  return (
    <View style={{ transform: [{ rotate: '-90deg' }] }}>
      <SvgXml xml={chevronXml} width={width} height={height} />
    </View>
  );
}
