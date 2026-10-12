import { useCallback, useState } from 'react';
import {
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { PlanPriceToggle } from './PlanPriceToggle';
import { ServiceInstructionText } from './ServiceInstructionText';
import { TabDividerIcon } from './service-selection-icons';

export type ServiceMode = 'single' | 'multi';

type ServiceModeTabsProps = {
  mode: ServiceMode;
  onModeChange?: (mode: ServiceMode) => void;
  showPlanPriceToggle?: boolean;
  planPriceEnabled?: boolean;
  onPlanPriceChange?: (enabled: boolean) => void;
  instructionText?: string;
  scale: number;
};

/** Figma `3458:6203` / `58836:3083` indicator bar widths (px at scale 1). */
const INDICATOR_WIDTH: Record<ServiceMode, number> = {
  single: 126.292,
  multi: 123,
};

type TabLayout = { x: number; width: number };

export function ServiceModeTabs({
  mode,
  onModeChange,
  showPlanPriceToggle = false,
  planPriceEnabled = false,
  onPlanPriceChange,
  instructionText,
  scale,
}: ServiceModeTabsProps) {
  const [tabLayouts, setTabLayouts] = useState<Partial<Record<ServiceMode, TabLayout>>>({});

  const onTabLayout = useCallback((tab: ServiceMode) => (event: LayoutChangeEvent) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts((prev) => (prev[tab]?.x === x && prev[tab]?.width === width ? prev : { ...prev, [tab]: { x, width } }));
  }, []);

  const activeLayout = tabLayouts[mode];
  const indicatorWidth = INDICATOR_WIDTH[mode] * scale;
  const indicatorLeft =
    activeLayout != null
      ? activeLayout.x + (activeLayout.width - indicatorWidth) / 2
      : undefined;

  const wrapGap = instructionText != null ? 12 * scale : 6 * scale;

  return (
    <View style={[styles.wrap, { paddingHorizontal: 16 * scale, gap: wrapGap }]}>
      <View style={[styles.tabBlock, { gap: 6 * scale }]}>
        <View style={[styles.tabRow, { gap: 10 * scale, paddingLeft: 6 * scale, paddingRight: 4 * scale }]}>
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: mode === 'single' }}
            onLayout={onTabLayout('single')}
            onPress={() => onModeChange?.('single')}
            style={[styles.tab, { width: 119 * scale, height: 20 * scale }]}>
            <Text
              style={[
                searchFont('medium'),
                styles.tabLabel,
                { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
              ]}>
              Single Service
            </Text>
          </Pressable>
          <TabDividerIcon width={1 * scale} height={16 * scale} />
          <Pressable
            accessibilityRole="tab"
            accessibilityState={{ selected: mode === 'multi' }}
            onLayout={onTabLayout('multi')}
            onPress={() => onModeChange?.('multi')}
            style={[styles.tab, { width: 118 * scale, height: 20 * scale }]}>
            <Text
              style={[
                searchFont('medium'),
                styles.tabLabel,
                { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
              ]}>
              Multi Service
            </Text>
          </Pressable>
          {showPlanPriceToggle ? (
            <PlanPriceToggle enabled={planPriceEnabled} onChange={onPlanPriceChange} scale={scale} />
          ) : null}
        </View>
        <View style={[styles.indicatorRow, { height: 4 * scale }]}>
          {indicatorLeft != null ? (
            <View
              style={[
                styles.indicator,
                {
                  position: 'absolute',
                  left: indicatorLeft,
                  width: indicatorWidth,
                  height: 4 * scale,
                  borderTopLeftRadius: SwashoRadii.sm * scale,
                  borderTopRightRadius: SwashoRadii.sm * scale,
                },
              ]}
            />
          ) : null}
        </View>
      </View>
      {instructionText ? (
        <View style={styles.instructionWrap}>
          <ServiceInstructionText scale={scale}>{instructionText}</ServiceInstructionText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  tabBlock: {
    width: '100%',
  },
  tabRow: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '100%',
    flexWrap: 'wrap',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    color: SwashoColors.darkHeaderText,
    textAlign: 'center',
  },
  indicatorRow: {
    width: '100%',
    position: 'relative',
  },
  indicator: {
    backgroundColor: SwashoColors.primary600,
  },
  instructionWrap: {
    width: '100%',
    alignItems: 'center',
  },
});
