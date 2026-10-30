import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { searchFont } from '@/components/search/search-fonts';
import { CrownIcon, StarsBoldIcon } from '@/components/provider-results/provider-results-icons';
import type { ProviderSpecialistTag as ProviderSpecialistTagModel } from '@/data/providers';

type ProviderSpecialistTagProps = {
  tag: ProviderSpecialistTagModel;
  scale: number;
  /** Full-width banner on provider result cards; compact chip in provider page header. */
  layout?: 'card' | 'inline';
};

export function ProviderSpecialistTag({
  tag,
  scale,
  layout = 'inline',
}: ProviderSpecialistTagProps) {
  const isWedding = tag.type === 'wedding';

  return (
    <LinearGradient
      colors={
        isWedding
          ? ['rgba(255, 215, 0, 0)', 'rgba(255, 215, 0, 0.25)', 'rgba(255, 215, 0, 0)']
          : ['rgba(253, 2, 248, 0)', 'rgba(253, 2, 248, 0.15)', 'rgba(253, 2, 248, 0)']
      }
      start={{ x: 0, y: 0.5 }}
      end={{ x: 1, y: 0.5 }}
      style={[
        styles.root,
        {
          paddingHorizontal: 6 * scale,
          paddingVertical: 4 * scale,
          ...(layout === 'card'
            ? { width: 372 * scale, alignSelf: 'center' as const }
            : { alignSelf: 'flex-start' as const }),
        },
      ]}>
      <View style={[styles.row, { gap: 4 * scale }]}>
        <View style={{ width: 18 * scale, height: 18 * scale }}>
          {isWedding ? (
            <StarsBoldIcon width={18 * scale} height={18 * scale} />
          ) : (
            <CrownIcon width={18 * scale} height={18 * scale} />
          )}
        </View>
        <Text
          style={[
            searchFont('semibold'),
            {
              fontSize: 10 * scale,
              lineHeight: 16 * scale,
              letterSpacing: 1 * scale,
              color: isWedding ? '#92610e' : '#c102be',
            },
          ]}>
          {tag.label}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: {
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
