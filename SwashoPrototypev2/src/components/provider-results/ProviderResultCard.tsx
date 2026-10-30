import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { StarRatingIcon } from '@/components/home/figma-icons';
import { FigmaShadows, figmaShadow } from '@/components/home/figma-shadows';
import { SwashoColors, SwashoFonts, SwashoRadii } from '@/constants/swasho-tokens';
import { searchFont } from '@/components/search/search-fonts';
import type { ProviderResult } from '@/data/providers';

import { ProviderSpecialistTag } from '@/components/provider/ProviderSpecialistTag';

import { DocumentIcon, SaleIcon, ScooterBoldIcon, ScooterLinearIcon } from './provider-results-icons';

const CARD_WIDTH = 390;
const IMAGE_WIDTH = 71;
const IMAGE_HEIGHT = 69;

type ProviderResultCardProps = {
  provider: ProviderResult;
  scale: number;
  onPress?: () => void;
};

function OfferText({ provider, scale }: { provider: ProviderResult; scale: number }) {
  const { boldSegments, regularText } = provider.offerText;

  if (boldSegments.length === 3) {
    return (
      <Text style={[styles.offerText, { fontSize: 14 * scale, lineHeight: 20 * scale, letterSpacing: 0.5 * scale, width: 258 * scale }]}>
        <Text style={[styles.offerBold, searchFont('medium')]}>{boldSegments[0]}</Text>
        <Text style={searchFont('medium')}> </Text>
        <Text style={[styles.offerBold, searchFont('medium')]}>{boldSegments[1]}</Text>
        <Text style={{ fontFamily: SwashoFonts.poppinsRegular }}> and </Text>
        <Text style={[styles.offerBold, searchFont('medium')]}>{boldSegments[2]}</Text>
        <Text style={{ fontFamily: SwashoFonts.poppinsRegular }}>{regularText.replace(' and ', '')}</Text>
      </Text>
    );
  }

  return (
    <Text style={[styles.offerText, { fontSize: 14 * scale, lineHeight: 20 * scale, letterSpacing: 0.5 * scale, width: 258 * scale }]}>
      <Text style={[styles.offerBold, searchFont('medium')]}>{boldSegments[0]}</Text>
      <Text style={{ fontFamily: SwashoFonts.poppinsRegular }}> and </Text>
      <Text style={[styles.offerBold, searchFont('medium')]}>{boldSegments[1]}</Text>
      <Text style={{ fontFamily: SwashoFonts.poppinsRegular }}>{regularText.replace(' and ', '')}</Text>
    </Text>
  );
}

export function ProviderResultCard({ provider, scale, onPress }: ProviderResultCardProps) {
  const ScooterIcon = provider.deliveryIcon === 'linear' ? ScooterLinearIcon : ScooterBoldIcon;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        {
          width: CARD_WIDTH * scale,
          borderRadius: SwashoRadii.lg * scale,
          padding: 8 * scale,
          gap: 8 * scale,
          ...figmaShadow(FigmaShadows.providerResultCard, scale),
        },
      ]}>
      {provider.specialistTag ? (
        <ProviderSpecialistTag tag={provider.specialistTag} scale={scale} layout="card" />
      ) : null}

      <View
        style={[
          styles.mainContent,
          {
            paddingHorizontal: 6 * scale,
            paddingVertical: 8 * scale,
            gap: 12 * scale,
          },
        ]}>
        <View style={[styles.topRow, { gap: 16 * scale }]}>
          <View
            style={[
              styles.imageWrap,
              {
                width: IMAGE_WIDTH * scale,
                height: IMAGE_HEIGHT * scale,
                borderRadius: SwashoRadii.md * scale,
              },
            ]}>
            <Image
              source={require('@/assets/images/search/laundromat.png')}
              style={styles.laundromatImage}
              contentFit="cover"
            />
          </View>
          <View style={[styles.info, { gap: 8 * scale, width: 273 * scale }]}>
            <View style={[styles.titleRow, { gap: 8 * scale }]}>
              <Text
                style={[
                  styles.serviceName,
                  searchFont('medium'),
                  {
                    fontSize: 16 * scale,
                    lineHeight: 14 * scale,
                  },
                ]}>
                {provider.serviceName}
              </Text>
              <View
                style={[
                  styles.rating,
                  {
                    paddingHorizontal: 4.844 * scale,
                    paddingVertical: 4 * scale,
                    borderRadius: SwashoRadii.md * scale,
                    gap: 2.398 * scale,
                  },
                ]}>
                <StarRatingIcon width={15.537 * scale} height={15.537 * scale} />
                <Text
                  style={[
                    styles.ratingText,
                    searchFont('semibold'),
                    {
                      fontSize: 14.531 * scale,
                      lineHeight: 11.509 * scale,
                      letterSpacing: 0.4795 * scale,
                    },
                  ]}>
                  {provider.rating.toFixed(1)}
                </Text>
              </View>
            </View>
            <Text
              style={[
                styles.category,
                searchFont('medium'),
                {
                  fontSize: 14 * scale,
                  lineHeight: 12 * scale,
                },
              ]}>
              {provider.category}
            </Text>
          </View>
        </View>

        <View style={[styles.pricingRow, { gap: 8 * scale }]}>
          <View style={[styles.pricingBlock, { gap: 6 * scale }]}>
            <Text
              style={[
                styles.startingAt,
                {
                  fontFamily: SwashoFonts.poppinsRegular,
                  fontSize: 14 * scale,
                  lineHeight: 12 * scale,
                },
              ]}>
              Starting at
            </Text>
            <View style={[styles.priceList, { gap: 6 * scale }]}>
              {provider.pricing.map((item, index) => (
                <View key={`${item.label}-${index}`} style={[styles.priceItem, { gap: 6 * scale }]}>
                  {index > 0 ? (
                    <View style={[styles.priceDivider, { height: 18 * scale }]}>
                      <View style={[styles.priceDividerLine, { width: 18 * scale }]} />
                    </View>
                  ) : null}
                  <Text
                    style={[
                      styles.priceText,
                      searchFont('medium'),
                      {
                        fontSize: 14 * scale,
                        lineHeight: 12 * scale,
                      },
                    ]}>
                    {item.label} ₹{item.price}
                  </Text>
                </View>
              ))}
            </View>
          </View>
          <View style={[styles.rateCardButton, { gap: 6 * scale, minWidth: 60 * scale, height: 18 * scale }]}>
            <DocumentIcon width={20 * scale} height={20 * scale} />
            <Text
              style={[
                styles.rateCardLabel,
                searchFont('medium'),
                {
                  fontSize: 12 * scale,
                  lineHeight: 10 * scale,
                },
              ]}>
              Rate Card
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.bottomSection, { gap: 8 * scale }]}>
        <View style={[styles.deliveryRow, { gap: 6 * scale, paddingHorizontal: 6 * scale }]}>
          <ScooterIcon width={18 * scale} height={18 * scale} />
          <Text
            style={[
              styles.deliveryText,
              {
                fontFamily: SwashoFonts.poppinsRegular,
                fontSize: 14 * scale,
                lineHeight: 18 * scale,
              },
            ]}>
            {provider.deliveryInfo}
          </Text>
        </View>

        <View style={[styles.offerSection, { gap: 4 * scale, width: 372 * scale }]}>
          <View style={[styles.offerDivider, { width: 372 * scale }]} />
          <View
            style={[
              styles.offerRow,
              {
                paddingHorizontal: 15 * scale,
                paddingVertical: 8 * scale,
                borderRadius: SwashoRadii.md * scale,
                width: 372 * scale,
              },
            ]}>
            <View style={[styles.offerContent, { gap: 12 * scale }]}>
              <View style={{ paddingVertical: 2.4 * scale }}>
                <SaleIcon width={24 * scale} height={24 * scale} />
              </View>
              <OfferText provider={provider} scale={scale} />
            </View>
            <View style={[styles.pagination, { gap: 4 * scale, width: 30 * scale, height: 4 * scale }]}>
              <View style={[styles.paginationTrack, { width: 30 * scale, height: 4 * scale, borderRadius: SwashoRadii.sm * scale }]} />
              <View
                style={[
                  styles.paginationActive,
                  {
                    width: 15.472 * scale,
                    height: 4 * scale,
                    borderRadius: SwashoRadii.sm * scale,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: SwashoColors.surface,
    overflow: 'hidden',
  },
  mainContent: {
    width: '100%',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  imageWrap: {
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
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceName: {
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
  category: {
    color: '#464646',
    letterSpacing: 0.5,
  },
  pricingRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    width: '100%',
  },
  pricingBlock: {
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  startingAt: {
    color: '#464646',
    letterSpacing: 0.5,
  },
  priceList: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceDivider: {
    width: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceDividerLine: {
    height: 1,
    backgroundColor: SwashoColors.neutral300,
    transform: [{ rotate: '90deg' }],
  },
  priceText: {
    color: '#000000',
    letterSpacing: 0.5,
  },
  rateCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rateCardLabel: {
    color: SwashoColors.primary,
    letterSpacing: 0.5,
    textAlign: 'center',
    flex: 1,
  },
  bottomSection: {
    width: '100%',
  },
  deliveryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryText: {
    color: '#464646',
    letterSpacing: 0.5,
  },
  offerSection: {
    alignSelf: 'center',
  },
  offerDivider: {
    height: 1,
    backgroundColor: SwashoColors.neutral200,
  },
  offerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  offerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  offerText: {
    color: '#000000',
  },
  offerBold: {
    color: '#000000',
  },
  pagination: {
    position: 'relative',
    justifyContent: 'center',
  },
  paginationTrack: {
    backgroundColor: '#f2f2f2',
  },
  paginationActive: {
    position: 'absolute',
    left: 0,
    top: 0,
    backgroundColor: SwashoColors.primary,
  },
});
