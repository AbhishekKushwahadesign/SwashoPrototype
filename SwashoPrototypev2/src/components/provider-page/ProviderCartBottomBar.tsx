import { Pressable, StyleSheet, Text, View } from 'react-native';

import { ArrowRightIcon } from '@/components/home/figma-icons';
import { figmaShadow, FigmaShadows } from '@/components/home/figma-shadows';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

type ProviderCartBottomBarProps = {
  itemCount: number;
  scale: number;
  contentWidth: number;
  onProceed?: () => void;
  onItemCountPress?: () => void;
};

export function ProviderCartBottomBar({
  itemCount,
  scale,
  contentWidth,
  onProceed,
  onItemCountPress,
}: ProviderCartBottomBarProps) {
  const itemLabel = itemCount === 1 ? 'Item' : 'Items';

  return (
    <View
      style={[
        styles.bar,
        {
          width: contentWidth,
          paddingLeft: 20 * scale,
          paddingRight: 11 * scale,
          paddingVertical: 12 * scale,
          gap: 20 * scale,
          ...figmaShadow(FigmaShadows.sheet, scale),
        },
      ]}>
      <View style={[styles.summaryCol, { gap: 4 * scale }]}>
        <Text
          style={[
            styles.selectedLabel,
            searchFont('medium'),
            { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
          ]}>
          Selected
        </Text>
        <Pressable onPress={onItemCountPress} accessibilityRole="button">
          <Text
            style={[
              styles.itemCount,
              searchFont('medium'),
              {
                fontSize: 16 * scale,
                lineHeight: 14 * scale,
                letterSpacing: 0.5 * scale,
                textDecorationLine: 'underline',
                textDecorationStyle: 'dotted',
              },
            ]}>
            {`${itemCount} ${itemLabel}`}
          </Text>
        </Pressable>
      </View>
      <Pressable
        accessibilityRole="button"
        onPress={onProceed}
        style={[
          styles.proceedButton,
          {
            width: 199 * scale,
            height: 45 * scale,
            borderRadius: SwashoRadii.md * scale,
            padding: 10 * scale,
            gap: 6 * scale,
          },
        ]}>
        <Text
          style={[
            styles.proceedLabel,
            searchFont('medium'),
            { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
          ]}>
          Proceed
        </Text>
        <ArrowRightIcon width={24 * scale} height={24 * scale} color={SwashoColors.neutral50} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 25,
    backgroundColor: SwashoColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
  },
  summaryCol: {
    flex: 1,
    minWidth: 0,
    justifyContent: 'center',
    maxWidth: 156,
  },
  selectedLabel: {
    color: SwashoColors.neutral600,
  },
  itemCount: {
    color: '#292929',
  },
  proceedButton: {
    backgroundColor: SwashoColors.primary,
    borderWidth: 1,
    borderColor: SwashoColors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  proceedLabel: {
    color: SwashoColors.neutral50,
    textAlign: 'center',
  },
});
