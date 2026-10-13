import { StyleSheet, View } from 'react-native';

import { SwashoColors } from '@/constants/swasho-tokens';

import type { BulkLoadTierId } from '@/lib/bulk-load-tiers';

type BulkLoadPileIllustrationProps = {
  tier: BulkLoadTierId;
  scale: number;
};

/** Folded-laundry pile hint — not a tote; scale varies by load tier. */
export function BulkLoadPileIllustration({ tier, scale }: BulkLoadPileIllustrationProps) {
  const layers =
    tier === 'small'
      ? [{ w: 44, h: 10, offset: 0 }, { w: 38, h: 9, offset: 6 }]
      : tier === 'medium'
        ? [
            { w: 52, h: 11, offset: 0 },
            { w: 46, h: 10, offset: 7 },
            { w: 40, h: 9, offset: 14 },
          ]
        : [
            { w: 56, h: 11, offset: 0 },
            { w: 50, h: 10, offset: 6 },
            { w: 44, h: 10, offset: 12 },
            { w: 38, h: 9, offset: 19 },
          ];

  const height = (layers[layers.length - 1].offset + layers[layers.length - 1].h + 4) * scale;

  return (
    <View style={[styles.wrap, { width: 64 * scale, height }]}>
      {layers.map((layer, index) => (
        <View
          key={index}
          style={[
            styles.fold,
            {
              width: layer.w * scale,
              height: layer.h * scale,
              borderRadius: 3 * scale,
              bottom: layer.offset * scale,
              backgroundColor: index === 0 ? SwashoColors.primary100 : SwashoColors.neutral100,
              borderColor: index === 0 ? SwashoColors.primary200 : SwashoColors.neutral200,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  fold: {
    position: 'absolute',
    borderWidth: 1,
  },
});
