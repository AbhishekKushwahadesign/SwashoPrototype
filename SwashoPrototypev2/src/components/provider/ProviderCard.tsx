import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, Text, View } from 'react-native';

import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { StarRatingIcon } from '@/components/home/figma-icons';
import { TopPicksBadgeIcon } from '@/components/provider-page/provider-page-icons';
import { FigmaShadows, figmaShadow } from '@/components/home/figma-shadows';
import { searchFont } from '@/components/search/search-fonts';

import type { ProviderOffer } from '@/data/providers';

const CARD_WIDTH = 140;
const TAGGED_CARD_HEIGHT = 193.869;
const IMAGE_ASPECT = 121.27197265625 / 99;

type ProviderCardProps = {
  provider: ProviderOffer;
  scale: number;
};

export function ProviderCard({ provider, scale }: ProviderCardProps) {
  const showTag = provider.topPicks === true;

  return (
    <View
      style={[
        styles.card,
        {
          width: CARD_WIDTH * scale,
          borderRadius: SwashoRadii.md * scale,
          ...(showTag ? { height: TAGGED_CARD_HEIGHT * scale } : {}),
          ...figmaShadow(FigmaShadows.providerCard, scale),
        },
      ]}>
      {showTag ? (
        <LinearGradient
          colors={[SwashoColors.primary50, SwashoColors.primary200]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[
            styles.topTag,
            {
              borderTopLeftRadius: SwashoRadii.md * scale,
              borderTopRightRadius: SwashoRadii.md * scale,
              paddingLeft: 3 * scale,
              paddingRight: 3.26 * scale,
              gap: 2.173 * scale,
            },
          ]}>
          <TopPicksBadgeIcon width={19 * scale} height={21 * scale} />
          <Text
            style={[
              styles.topTagLabel,
              searchFont('semibold'),
              {
                fontSize: 10 * scale,
                lineHeight: 4.347 * scale,
              },
            ]}>
            Top Picks
          </Text>
        </LinearGradient>
      ) : null}
      <View
        style={[
          styles.body,
          {
            borderBottomLeftRadius: SwashoRadii.md * scale,
            borderBottomRightRadius: SwashoRadii.md * scale,
            ...(showTag
              ? {}
              : {
                  borderTopLeftRadius: SwashoRadii.md * scale,
                  borderTopRightRadius: SwashoRadii.md * scale,
                }),
            gap: 12 * scale,
            paddingBottom: 14 * scale,
            ...figmaShadow(FigmaShadows.providerCardBody, scale),
          },
        ]}>
        <View style={[styles.imageWrap, { aspectRatio: IMAGE_ASPECT }]}>
          <Image
            source={require('@/assets/images/search/laundromat.png')}
            style={styles.laundromatImage}
            contentFit="cover"
          />
        </View>
        <View style={[styles.info, { gap: 8 * scale, paddingHorizontal: 8 * scale }]}>
          <View style={[styles.titleRow, { gap: 4 * scale }]}>
            <Text
              style={[
                styles.name,
                searchFont('medium'),
                {
                  fontSize: 12 * scale,
                  lineHeight: 14 * scale,
                },
              ]}>
              {provider.name}
            </Text>
            <View
              style={[
                styles.rating,
                {
                  height: 12.58 * scale,
                  paddingHorizontal: 2.99 * scale,
                  paddingVertical: 1.495 * scale,
                  borderRadius: SwashoRadii.md * scale,
                  gap: 1.48 * scale,
                },
              ]}>
              <StarRatingIcon width={9.59 * scale} height={9.59 * scale} />
              <Text
                style={[
                  styles.ratingText,
                  searchFont('semibold'),
                  {
                    fontSize: 8.97 * scale,
                    lineHeight: 7.104 * scale,
                    letterSpacing: 0.296 * scale,
                  },
                ]}>
                {provider.rating.toFixed(1)}
              </Text>
            </View>
          </View>
          <Text
            style={[
              styles.offer,
              searchFont('semibold'),
              {
                fontSize: 12 * scale,
                lineHeight: 10 * scale,
                letterSpacing: 0.2717 * scale,
              },
            ]}>
            {provider.offer}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  topTag: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  topTagLabel: {
    color: '#6940e0',
    textAlign: 'center',
    letterSpacing: 0.2717,
  },
  body: {
    backgroundColor: '#ffffff',
    width: '100%',
    overflow: 'hidden',
  },
  imageWrap: {
    width: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  laundromatImage: {
    position: 'absolute',
    width: '100.05%',
    height: '110.64%',
    left: '-0.03%',
    top: '-5.32%',
  },
  info: {
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    color: '#000000',
    letterSpacing: 0.5,
  },
  rating: {
    backgroundColor: '#86efad',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingText: {
    color: '#292929',
    textAlign: 'center',
  },
  offer: {
    color: SwashoColors.darkText,
  },
});
