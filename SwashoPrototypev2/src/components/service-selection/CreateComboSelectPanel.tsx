import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { figmaShadow, FigmaShadows } from '@/components/home/figma-shadows';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { ServiceInstructionText } from './ServiceInstructionText';

type CreateComboSelectPanelProps = {
  scale: number;
  children: ReactNode;
  footer?: ReactNode;
};

/** Select-services step for new multi-service users (create reusable combo). */
export function CreateComboSelectPanel({ scale, children, footer }: CreateComboSelectPanelProps) {
  return (
    <View
      style={[
        styles.panel,
        {
          width: 380 * scale,
          borderRadius: SwashoRadii.lg * scale,
          paddingHorizontal: 12 * scale,
          paddingTop: 16 * scale,
          paddingBottom: 16 * scale,
          gap: 16 * scale,
          ...figmaShadow(FigmaShadows.sheet, scale),
        },
      ]}>
      <View style={{ gap: 8 * scale, width: '100%', paddingHorizontal: 4 * scale }}>
        <Text
          style={[
            searchFont('semibold'),
            styles.title,
            { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
          ]}>
          Select services
        </Text>
        <ServiceInstructionText scale={scale}>
          Choose at least two services to combine into a reusable combo.
        </ServiceInstructionText>
      </View>
      <View style={{ width: '100%', gap: 16 * scale }}>{children}</View>
      {footer ? <View style={{ width: '100%', alignItems: 'center' }}>{footer}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    alignSelf: 'center',
    backgroundColor: SwashoColors.surface,
    borderWidth: 1,
    borderColor: SwashoColors.neutral200,
  },
  title: {
    color: SwashoColors.neutral950,
  },
});
