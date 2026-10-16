import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArrowLeftIcon } from '@/components/home/figma-icons';
import { HomeIndicator } from '@/components/home/HomeIndicator';
import { figmaShadow, FigmaShadows } from '@/components/home/figma-shadows';
import { useSafeTopInset, useScreenScale } from '@/components/home/scale';
import { SearchStatusBar } from '@/components/search/SearchStatusBar';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';

const STATUS_BAR_HEIGHT = 32;
const HEADER_HEIGHT = 58;
const HOME_INDICATOR_HEIGHT = 24;

type CheckoutScreenShellProps = {
  title: string;
  onBackPress: () => void;
  children: ReactNode;
  footer?: ReactNode;
};

export function CheckoutScreenShell({ title, onBackPress, children, footer }: CheckoutScreenShellProps) {
  const { scale, contentWidth } = useScreenScale();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const headerTop = safeTop + STATUS_BAR_HEIGHT * scale;

  return (
    <View style={[styles.root, { paddingTop: safeTop }]}>
      <View style={[styles.frame, { width: contentWidth }]}>
        <View style={[styles.statusBar, { top: safeTop, height: STATUS_BAR_HEIGHT * scale }]}>
          <SearchStatusBar scale={scale} />
        </View>

        <View
          style={[
            styles.header,
            {
              top: headerTop,
              paddingHorizontal: 17 * scale,
              paddingBottom: 8 * scale,
              ...figmaShadow(FigmaShadows.providerCard, scale),
            },
          ]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={8}
            onPress={onBackPress}
            style={[styles.backHit, { width: 26 * scale, height: 26 * scale }]}>
            <ArrowLeftIcon width={20 * scale} height={20 * scale} />
          </Pressable>
          <Text
            numberOfLines={1}
            style={[
              styles.headerTitle,
              searchFont('medium'),
              {
                fontSize: 18 * scale,
                lineHeight: 16 * scale,
                letterSpacing: 0.5 * scale,
                marginLeft: 12 * scale,
              },
            ]}>
            {title}
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            marginTop: headerTop + HEADER_HEIGHT * scale,
            paddingBottom: footer ? 72 * scale + HOME_INDICATOR_HEIGHT * scale : HOME_INDICATOR_HEIGHT * scale,
          }}>
          {children}
        </View>

        {footer ? (
          <View
            style={[
              styles.footer,
              {
                paddingHorizontal: 20 * scale,
                paddingTop: 8 * scale,
                paddingBottom: HOME_INDICATOR_HEIGHT * scale,
              },
            ]}>
            {footer}
          </View>
        ) : null}

        <View style={styles.homeIndicatorWrap} pointerEvents="none">
          <HomeIndicator scale={scale} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
  },
  frame: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    overflow: 'hidden',
  },
  statusBar: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 30,
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 20,
    backgroundColor: SwashoColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backHit: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: SwashoColors.darkHeaderText,
    flex: 1,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: SwashoColors.surface,
    zIndex: 25,
  },
  homeIndicatorWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
  },
});
