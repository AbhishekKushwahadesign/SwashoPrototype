import { Pressable, StyleSheet, Text, View } from 'react-native';

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

const TAB_SINGLE_WIDTH = 126.292;
const TAB_MULTI_WIDTH = 123;

export function ServiceModeTabs({
  mode,
  onModeChange,
  showPlanPriceToggle = false,
  planPriceEnabled = false,
  onPlanPriceChange,
  instructionText,
  scale,
}: ServiceModeTabsProps) {
  const indicatorWidth = (mode === 'single' ? TAB_SINGLE_WIDTH : TAB_MULTI_WIDTH) * scale;
  const indicatorOffset = mode === 'single' ? 4 * scale : 144 * scale;

  const wrapGap = instructionText != null ? 12 * scale : 6 * scale;

  return (
    <View style={[styles.wrap, { paddingHorizontal: 16 * scale, gap: wrapGap }]}>
      <View style={[styles.tabRow, { gap: 10 * scale, paddingLeft: 6 * scale, paddingRight: 4 * scale }]}>
        <Pressable
          accessibilityRole="tab"
          accessibilityState={{ selected: mode === 'single' }}
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
      <View style={[styles.indicatorTrack, { paddingHorizontal: 4 * scale, width: 393 * scale }]}>
        <View
          style={[
            styles.indicator,
            {
              width: indicatorWidth,
              height: 4 * scale,
              marginLeft: indicatorOffset,
              borderTopLeftRadius: SwashoRadii.sm * scale,
              borderTopRightRadius: SwashoRadii.sm * scale,
            },
          ]}
        />
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
  indicatorTrack: {
    alignItems: 'flex-start',
  },
  indicator: {
    backgroundColor: SwashoColors.primary600,
  },
  instructionWrap: {
    width: '100%',
    alignItems: 'center',
  },
});
