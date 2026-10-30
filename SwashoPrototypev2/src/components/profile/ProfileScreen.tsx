import { router } from 'expo-router';
import { useCallback, type ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArrowLeftIcon } from '@/components/home/figma-icons';
import { figmaDropShadow, figmaShadow, FigmaShadows } from '@/components/home/figma-shadows';
import { HomeIndicator } from '@/components/home/HomeIndicator';
import { useSafeTopInset, useScreenScale } from '@/components/home/scale';
import { StatusBar } from '@/components/home/StatusBar';
import { UserAvatar } from '@/components/home/UserAvatar';
import {
  ProfileBookmarkBoldIcon,
  ProfileBookmarkLinearIcon,
  ProfileChevronIcon,
  ProfileMoneyBillBoldIcon,
  ProfileMoneyCardIcon,
  ProfileRowDivider,
  ProfileScooterIcon,
  ProfileSupportHelpIcon,
  ProfileUserCircleIcon,
} from '@/components/profile/profile-icons';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';
import { DEMO_USER } from '@/data/mock-user';
import { subscriptionPastOrdersHref } from '@/lib/subscription-past-orders-flow';

const STATUS_BAR_HEIGHT = 32;
const BACK_TOP = 54.42;
const BACK_LEFT = 16.75;
const CONTENT_LEFT = 18.75;
const CONTENT_TOP = 102.42;
const CONTENT_GAP = 24;
const QUICK_CARD_HEIGHT = 68;
const QUICK_CARD_WIDTH = 176.5;
const SETTINGS_CARD_WIDTH = 401;
const ROW_WIDTH = 372;
const HOME_INDICATOR_HEIGHT = 24;

type MenuRowProps = {
  scale: number;
  label: string;
  icon: ReactNode;
  onPress?: () => void;
  disabled?: boolean;
};

function ProfileMenuRow({ scale, label, icon, onPress, disabled }: MenuRowProps) {
  const inactive = disabled || !onPress;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive }}
      disabled={inactive}
      onPress={onPress}
      style={[styles.menuRow, { width: ROW_WIDTH * scale, paddingVertical: 10 * scale }]}>
      <View style={[styles.menuRowLeft, { gap: 8 * scale }]}>
        {icon}
        <Text
          style={[
            searchFont('medium'),
            {
              fontSize: 15 * scale,
              lineHeight: 14 * scale,
              letterSpacing: 0.5 * scale,
              color: SwashoColors.neutral950,
            },
          ]}>
          {label}
        </Text>
      </View>
      <ProfileChevronIcon width={20 * scale} height={20 * scale} />
    </Pressable>
  );
}

type QuickActionCardProps = {
  scale: number;
  icon: ReactNode;
  lineOne: string;
  lineTwo: string;
  onPress?: () => void;
  disabled?: boolean;
  trailingGap?: number;
};

function QuickActionCard({
  scale,
  icon,
  lineOne,
  lineTwo,
  onPress,
  disabled,
  trailingGap = 28,
}: QuickActionCardProps) {
  const inactive = disabled || !onPress;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: inactive }}
      disabled={inactive}
      onPress={onPress}
      style={[
        styles.quickCard,
        {
          width: QUICK_CARD_WIDTH * scale,
          height: QUICK_CARD_HEIGHT * scale,
          borderRadius: SwashoRadii.lg * scale,
          paddingHorizontal: 12 * scale,
          paddingVertical: 16 * scale,
          borderWidth: 1 * scale,
          ...figmaDropShadow({ offsetX: 0, offsetY: 2, blur: 2, color: '#000000', opacity: 0.25 }, scale),
        },
      ]}>
      <View style={[styles.quickCardInner, { gap: trailingGap * scale, width: 152 * scale }]}>
        <View style={[styles.quickCardCopy, { gap: 12 * scale }]}>
          {icon}
          <View style={{ gap: 8 * scale }}>
            <Text
              style={[
                searchFont('medium'),
                {
                  fontSize: 16 * scale,
                  lineHeight: 14 * scale,
                  letterSpacing: 0.5 * scale,
                  color: SwashoColors.neutral800,
                },
              ]}>
              {lineOne}
            </Text>
            <Text
              style={[
                searchFont('medium'),
                {
                  fontSize: 16 * scale,
                  lineHeight: 14 * scale,
                  letterSpacing: 0.5 * scale,
                  color: SwashoColors.neutral800,
                },
              ]}>
              {lineTwo}
            </Text>
          </View>
        </View>
        <ProfileChevronIcon width={20 * scale} height={20 * scale} />
      </View>
    </Pressable>
  );
}

function FooterLink({ scale, label }: { scale: number; label: string }) {
  return (
    <Text
      style={[
        searchFont('regular'),
        styles.footerLink,
        {
          fontSize: 12 * scale,
          lineHeight: 16 * scale,
          letterSpacing: 0.5 * scale,
          color: SwashoColors.neutral800,
        },
      ]}>
      {label}
    </Text>
  );
}

export function ProfileScreen() {
  const { scale, contentWidth } = useScreenScale();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/');
  }, []);

  const contentWidthScaled = contentWidth - CONTENT_LEFT * 2 * scale;
  const settingsCardWidth = Math.min(SETTINGS_CARD_WIDTH * scale, contentWidth - 11 * scale);
  const bottomInset = HOME_INDICATOR_HEIGHT * scale + insets.bottom + 24 * scale;

  return (
    <View
      style={[
        styles.root,
        {
          paddingTop: safeTop,
          ...figmaShadow(FigmaShadows.screen, scale),
        },
      ]}>
      <View style={[styles.frame, { width: contentWidth }]}>
        <View style={[styles.statusBar, { height: STATUS_BAR_HEIGHT * scale }]}>
          <StatusBar scale={scale} tone="transparent" />
        </View>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Go back"
          onPress={handleBack}
          style={{
            position: 'absolute',
            left: BACK_LEFT * scale,
            top: BACK_TOP * scale,
            width: 26 * scale,
            height: 26 * scale,
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}>
          <ArrowLeftIcon width={20 * scale} height={20 * scale} />
        </Pressable>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={{
            paddingTop: CONTENT_TOP * scale,
            paddingHorizontal: CONTENT_LEFT * scale,
            paddingBottom: bottomInset,
            gap: CONTENT_GAP * scale,
          }}
          showsVerticalScrollIndicator={false}>
          <View style={[styles.profileRow, { gap: 12 * scale }]}>
            <UserAvatar scale={scale} size={64} />
            <View style={{ gap: 8 * scale, flexShrink: 1 }}>
              <Text
                style={[
                  searchFont('medium'),
                  {
                    fontSize: 18 * scale,
                    lineHeight: 16 * scale,
                    letterSpacing: 0.5 * scale,
                    color: SwashoColors.darkHeaderText,
                  },
                ]}>
                {DEMO_USER.displayName}
              </Text>
              <Text
                style={[
                  searchFont('medium'),
                  {
                    fontSize: 16 * scale,
                    lineHeight: 14 * scale,
                    letterSpacing: 0.5 * scale,
                    color: SwashoColors.neutral600,
                  },
                ]}>
                {DEMO_USER.phone}
              </Text>
            </View>
          </View>

          <View style={[styles.quickRow, { gap: 12 * scale, width: contentWidthScaled }]}>
            <QuickActionCard
              scale={scale}
              icon={<ProfileMoneyBillBoldIcon width={32 * scale} height={32 * scale} />}
              lineOne="My"
              lineTwo="Orders"
              onPress={() => router.push(subscriptionPastOrdersHref())}
            />
            <QuickActionCard
              scale={scale}
              icon={<ProfileBookmarkBoldIcon width={32 * scale} height={32 * scale} />}
              lineOne="Saved"
              lineTwo="Address"
              disabled
              trailingGap={21}
            />
          </View>

          <View style={{ gap: 20 * scale, width: '100%', alignItems: 'center' }}>
            <Text
              style={[
                searchFont('semibold'),
                {
                  alignSelf: 'flex-start',
                  fontSize: 20 * scale,
                  lineHeight: 18 * scale,
                  letterSpacing: 0,
                  color: SwashoColors.neutral950,
                },
              ]}>
              Settings
            </Text>

            <View
              style={[
                styles.settingsCard,
                {
                  width: settingsCardWidth,
                  borderRadius: SwashoRadii.lg * scale,
                  paddingHorizontal: 24 * scale,
                  paddingVertical: 8 * scale,
                },
              ]}>
              <View style={{ gap: 8 * scale, width: ROW_WIDTH * scale }}>
                <ProfileMenuRow
                  scale={scale}
                  label="Account"
                  disabled
                  icon={<ProfileUserCircleIcon width={24 * scale} height={24 * scale} />}
                />
                <ProfileRowDivider width={ROW_WIDTH * scale} height={1} />
                <ProfileMenuRow
                  scale={scale}
                  label="Saved Address"
                  disabled
                  icon={<ProfileBookmarkLinearIcon width={24 * scale} height={24 * scale} />}
                />
                <ProfileRowDivider width={ROW_WIDTH * scale} height={1} />
                <ProfileMenuRow
                  scale={scale}
                  label="Payment Method"
                  disabled
                  icon={<ProfileMoneyCardIcon width={24 * scale} height={24 * scale} />}
                />
                <ProfileRowDivider width={ROW_WIDTH * scale} height={1} />
                <ProfileMenuRow
                  scale={scale}
                  label="Default Preferences"
                  disabled
                  icon={<ProfileScooterIcon width={24 * scale} height={24 * scale} />}
                />
                <ProfileRowDivider width={ROW_WIDTH * scale} height={1} />
                <ProfileMenuRow
                  scale={scale}
                  label="Support & Help"
                  disabled
                  icon={<ProfileSupportHelpIcon width={24 * scale} height={24 * scale} />}
                />
              </View>
            </View>
          </View>

          <View style={[styles.footer, { gap: 8 * scale, paddingHorizontal: 30 * scale }]}>
            <View style={[styles.footerRow, { gap: 12 * scale }]}>
              <FooterLink scale={scale} label="Privacy Policy" />
              <FooterLink scale={scale} label="Terms & Conditions" />
            </View>
            <FooterLink scale={scale} label="About Swasho" />
          </View>
        </ScrollView>

        <View style={styles.homeIndicatorWrap}>
          <HomeIndicator scale={scale} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: SwashoColors.surface,
    alignItems: 'center',
  },
  frame: {
    flex: 1,
    backgroundColor: SwashoColors.surface,
  },
  statusBar: {
    width: '100%',
  },
  scroll: {
    flex: 1,
  },
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  quickCard: {
    backgroundColor: SwashoColors.surface,
    borderColor: SwashoColors.neutral300,
  },
  quickCardInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickCardCopy: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingsCard: {
    backgroundColor: SwashoColors.surface,
    alignItems: 'center',
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    marginTop: 8,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerLink: {
    textDecorationLine: 'underline',
    textDecorationStyle: 'dotted',
  },
  homeIndicatorWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
