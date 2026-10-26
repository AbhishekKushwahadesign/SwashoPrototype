import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { StarRatingIcon } from '@/components/home/figma-icons';
import { figmaShadow, FigmaShadows } from '@/components/home/figma-shadows';
import { searchFont } from '@/components/search/search-fonts';
import { AddSquareIcon } from '@/components/service-selection/service-selection-icons';
import { ServiceSelectionButton } from '@/components/service-selection/ServiceSelectionButton';
import {
  SWASHO_AI_DEMO_PROVIDER_IMAGE,
  type SwashoAiDemoScenario,
} from '@/constants/swasho-ai-demo-scenarios';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { DangerTriangleScan } from './garment-scan-icons';
import { AiDetectedMarkIcon, RecommendationScannerIcon } from './swasho-ai-icons';

/** Figma 3415:17896 — AI Service Recommended sheet (412×607 body @ top 313). */
const FIGMA_MODAL = {
  frameWidth: 412,
  sheetTop: 313,
  sheetHeight: 607,
  sheetRadius: 16,
  handleWidth: 27.663,
  handleHeight: 3,
  handleTop: 9.5,
  contentWidth: 372,
  contentTop: 28,
  contentGap: 24,
  footerButtonWidth: 178,
  footerButtonHeight: 45,
  footerGap: 16,
} as const;

type AiServiceRecommendedModalProps = {
  visible: boolean;
  scenario: SwashoAiDemoScenario;
  scale: number;
  contentWidth: number;
  onClose: () => void;
  onScanAnother: () => void;
  onGoToCart: () => void;
};

function ProviderRecommendAddButton({ scale, onPress }: { scale: number; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Add to cart"
      onPress={onPress}
      style={[
        styles.addButton,
        {
          height: 32 * scale,
          width: 86 * scale,
          borderRadius: SwashoRadii.md * scale,
          paddingHorizontal: 16 * scale,
          paddingVertical: 8 * scale,
          gap: 6 * scale,
          ...figmaShadow(FigmaShadows.search, scale),
        },
      ]}>
      <Text
        style={[
          styles.addButtonLabel,
          searchFont('medium'),
          { fontSize: 14 * scale, lineHeight: 12 * scale, letterSpacing: 0.5 * scale },
        ]}>
        ADD
      </Text>
      <AddSquareIcon width={18 * scale} height={18 * scale} />
    </Pressable>
  );
}

function CheckRow({ scale, label }: { scale: number; label: string }) {
  return (
    <View style={[styles.checkRow, { gap: 5 * scale }]}>
      <View
        style={[
          styles.checkIcon,
          {
            width: 20 * scale,
            height: 20 * scale,
            borderRadius: 10 * scale,
          },
        ]}>
        <Text style={[searchFont('semibold'), { fontSize: 11 * scale, color: SwashoColors.primary600 }]}>
          ✓
        </Text>
      </View>
      <Text
        style={[
          searchFont('medium'),
          styles.checkLabel,
          { fontSize: 14 * scale, lineHeight: 16 * scale, letterSpacing: 0.28 * scale },
        ]}>
        {label}
      </Text>
    </View>
  );
}

export function AiServiceRecommendedModal({
  visible,
  scenario,
  scale,
  contentWidth,
  onClose,
  onScanAnother,
  onGoToCart,
}: AiServiceRecommendedModalProps) {
  const insets = useSafeAreaInsets();
  const designScale = contentWidth / FIGMA_MODAL.frameWidth;
  const { recommendation } = scenario;
  const windowHeight = Dimensions.get('window').height;
  const sheetMaxHeight = Math.min(
    FIGMA_MODAL.sheetHeight * designScale,
    windowHeight - insets.top - (FIGMA_MODAL.sheetTop * designScale) * 0.35,
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root} pointerEvents="box-none">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss recommendation"
          onPress={onClose}
          style={styles.scrim}
        />

        <View
          style={[
            styles.sheetColumn,
            {
              width: contentWidth,
            },
          ]}
          pointerEvents="box-none">
          <View
            style={[
              styles.sheet,
              {
                width: contentWidth,
                maxHeight: sheetMaxHeight,
                borderTopLeftRadius: FIGMA_MODAL.sheetRadius * designScale,
                borderTopRightRadius: FIGMA_MODAL.sheetRadius * designScale,
                paddingTop: (FIGMA_MODAL.handleTop + FIGMA_MODAL.handleHeight + 16) * designScale,
              },
            ]}>
            <View
              style={[
                styles.handle,
                {
                  width: FIGMA_MODAL.handleWidth * designScale,
                  height: FIGMA_MODAL.handleHeight * designScale,
                  top: FIGMA_MODAL.handleTop * designScale,
                  borderRadius: 9999 * designScale,
                },
              ]}
            />

            <ScrollView
              style={styles.scroll}
              contentContainerStyle={{
                paddingHorizontal: ((contentWidth - FIGMA_MODAL.contentWidth * designScale) / 2),
                paddingBottom: 16 * designScale,
                gap: FIGMA_MODAL.contentGap * designScale,
              }}
              showsVerticalScrollIndicator={false}>
              <View
                style={[
                  styles.detectCard,
                  {
                    borderRadius: SwashoRadii.lg * designScale,
                    padding: 8 * designScale,
                    gap: 12 * designScale,
                    borderWidth: 1,
                  },
                ]}>
                <View style={styles.detectHeader}>
                  <View
                    style={[
                      styles.aiDetectedPill,
                      {
                        height: 30 * designScale,
                        paddingHorizontal: 12 * designScale,
                        borderRadius: 9999 * designScale,
                        borderWidth: 1,
                        gap: 6 * designScale,
                      },
                    ]}>
                    <AiDetectedMarkIcon width={11 * designScale} height={11 * designScale} />
                    <Text
                      style={[
                        searchFont('medium'),
                        styles.aiDetectedText,
                        { fontSize: 14 * scale, lineHeight: 16 * scale, letterSpacing: 0.28 * scale },
                      ]}>
                      Detected
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.issueIconWrap,
                      { width: 30 * scale, height: 30 * scale, borderRadius: 15 * scale },
                    ]}>
                    <DangerTriangleScan width={20 * scale} height={20 * scale} />
                  </View>
                </View>
                <View style={[styles.detectTags, { gap: 12 * scale }]}>
                  <CheckRow scale={scale} label={recommendation.detectedStainLabel} />
                  <CheckRow scale={scale} label={recommendation.detectedGarmentLabel} />
                </View>
              </View>

              <View style={{ gap: 16 * designScale }}>
                <Text
                  style={[
                    searchFont('medium'),
                    styles.sectionLabel,
                    { fontSize: 16 * designScale, lineHeight: 14 * designScale, letterSpacing: 1 * designScale },
                  ]}>
                  AI Recommended Service
                </Text>
                <View style={[styles.serviceTitleRow, { gap: 4 * designScale }]}>
                  <Text
                    style={[
                      searchFont('semibold'),
                      styles.serviceTitle,
                      {
                        fontSize: 14 * designScale,
                        lineHeight: 14 * designScale,
                        letterSpacing: 0.5 * designScale,
                      },
                    ]}>
                    {recommendation.modalServiceTitle}
                  </Text>
                  <View
                    style={[
                      styles.infoDot,
                      {
                        width: 20 * designScale,
                        height: 20 * designScale,
                        borderRadius: 10 * designScale,
                      },
                    ]}>
                    <Text style={[searchFont('semibold'), { fontSize: 12 * designScale, color: SwashoColors.neutral600 }]}>
                      i
                    </Text>
                  </View>
                </View>
                <View style={[styles.divider, { height: StyleSheet.hairlineWidth }]} />

                <Text
                  style={[
                    searchFont('medium'),
                    styles.sectionLabel,
                    { fontSize: 16 * designScale, lineHeight: 14 * designScale, letterSpacing: 1 * designScale },
                  ]}>
                  Recommended provider
                </Text>

                <LinearGradient
                  colors={['rgba(229, 243, 255, 0)', 'rgb(229, 243, 255)', 'rgba(229, 243, 255, 0)']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={[styles.expertBadge, { paddingVertical: 4 * designScale, paddingRight: 6 * designScale }]}>
                  <Text
                    style={[
                      searchFont('medium'),
                      styles.expertBadgeText,
                      { fontSize: 12 * designScale, lineHeight: 16 * designScale, letterSpacing: 1 * designScale },
                    ]}>
                    {recommendation.expertBadgeLabel}
                  </Text>
                </LinearGradient>

                <View
                  style={[
                    styles.providerCard,
                    {
                      borderRadius: SwashoRadii.md * designScale,
                      borderWidth: 1,
                      padding: 12 * designScale,
                      gap: 12 * designScale,
                    },
                  ]}>
                  <View style={{ flexDirection: 'row', gap: 20 * designScale, alignItems: 'flex-start' }}>
                    <View style={{ width: 78 * designScale, alignItems: 'center' }}>
                      <View
                        style={{
                          width: 78 * designScale,
                          height: 78 * designScale,
                          borderRadius: SwashoRadii.md * designScale,
                          overflow: 'hidden',
                        }}>
                        <Image
                          source={SWASHO_AI_DEMO_PROVIDER_IMAGE}
                          style={{
                            width: 78 * designScale,
                            height: 78 * designScale,
                          }}
                          contentFit="cover"
                        />
                        <View
                          style={[
                            styles.ratingBadge,
                            {
                              borderTopLeftRadius: SwashoRadii.md * designScale,
                              borderBottomRightRadius: SwashoRadii.md * designScale,
                              paddingHorizontal: 5 * designScale,
                              paddingVertical: 4 * designScale,
                              gap: 2 * designScale,
                            },
                          ]}>
                          <StarRatingIcon width={9.59 * designScale} height={9.59 * designScale} />
                          <Text
                            style={[
                              searchFont('semibold'),
                              { fontSize: 12 * designScale, lineHeight: 12 * designScale, color: SwashoColors.neutral950 },
                            ]}>
                            {recommendation.providerRating}
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={[
                          searchFont('medium'),
                          styles.deliveryText,
                          {
                            fontSize: 13 * designScale,
                            lineHeight: 16 * designScale,
                            marginTop: 6 * designScale,
                            width: 78 * designScale,
                            textAlign: 'center',
                          },
                        ]}>
                        {recommendation.deliveryDays} day delivery
                      </Text>
                    </View>

                    <View style={{ flex: 1, gap: 14 * designScale, paddingTop: 4 * designScale }}>
                      <Text
                        style={[
                          searchFont('medium'),
                          styles.providerName,
                          { fontSize: 14 * designScale, lineHeight: 16 * designScale, letterSpacing: 0.5 * designScale },
                        ]}>
                        {recommendation.providerName}
                      </Text>
                      <Text
                        style={[
                          searchFont('semibold'),
                          styles.providerService,
                          { fontSize: 14 * designScale, lineHeight: 16 * designScale, letterSpacing: 0.5 * designScale },
                        ]}>
                        {recommendation.modalServiceTitle}
                      </Text>
                      <Text
                        style={[
                          searchFont('semibold'),
                          styles.providerPrice,
                          { fontSize: 14 * designScale, lineHeight: 16 * designScale, letterSpacing: 0.5 * designScale },
                        ]}>
                        ₹ {recommendation.providerPriceInr}
                      </Text>
                      <ProviderRecommendAddButton scale={designScale} onPress={onGoToCart} />
                    </View>
                  </View>
                </View>

                <ServiceSelectionButton
                  label="Show all providers"
                  variant="tertiary"
                  size="compact"
                  scale={scale}
                  onPress={onClose}
                  style={{ width: '100%', minHeight: 40 * designScale }}
                />

                <Text
                  style={[
                    searchFont('regular'),
                    styles.disclaimer,
                    {
                      fontSize: 12 * designScale,
                      lineHeight: 16 * designScale,
                      letterSpacing: 0.5 * designScale,
                      textAlign: 'center',
                    },
                  ]}>
                  Every AI recommendation is verified by our laundry experts before processing.
                </Text>
              </View>
            </ScrollView>
          </View>

          <View
            style={[
              styles.footerRow,
              {
                width: contentWidth,
                gap: FIGMA_MODAL.footerGap * designScale,
                paddingHorizontal: ((contentWidth - FIGMA_MODAL.footerButtonWidth * 2 * designScale - FIGMA_MODAL.footerGap * designScale) / 2),
                paddingTop: 12 * designScale,
                paddingBottom: Math.max(insets.bottom, 12 * designScale),
              },
            ]}>
            <ServiceSelectionButton
              label="Scan another"
              variant="secondary"
              scale={scale}
              onPress={onScanAnother}
              leadingIcon={
                <RecommendationScannerIcon width={20 * scale} height={20 * scale} />
              }
              style={{ width: FIGMA_MODAL.footerButtonWidth * designScale, flex: 1 }}
            />
            <ServiceSelectionButton
              label="Go to Cart"
              variant="primary"
              scale={scale}
              onPress={onGoToCart}
              style={{ width: FIGMA_MODAL.footerButtonWidth * designScale, flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: SwashoColors.modalScrim,
  },
  sheetColumn: {
    alignSelf: 'center',
    maxWidth: '100%',
  },
  sheet: {
    backgroundColor: SwashoColors.surface,
    overflow: 'hidden',
  },
  handle: {
    position: 'absolute',
    alignSelf: 'center',
    left: '50%',
    marginLeft: -13.8315,
    backgroundColor: '#D9D9D9',
  },
  scroll: {
    flexGrow: 0,
  },
  detectCard: {
    backgroundColor: SwashoColors.surface,
    borderColor: SwashoColors.neutral100,
  },
  detectHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  aiDetectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: SwashoColors.neutral200,
    backgroundColor: SwashoColors.surface,
  },
  aiDetectedText: {
    color: SwashoColors.neutral800,
  },
  issueIconWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SwashoColors.surface,
  },
  detectTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SwashoColors.primary50,
  },
  checkLabel: {
    color: SwashoColors.neutral900,
  },
  sectionLabel: {
    color: SwashoColors.neutral600,
  },
  serviceTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  serviceTitle: {
    color: SwashoColors.neutral800,
  },
  infoDot: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: SwashoColors.neutral300,
  },
  divider: {
    backgroundColor: SwashoColors.neutral200,
    width: '100%',
  },
  expertBadge: {
    alignSelf: 'flex-start',
  },
  expertBadgeText: {
    color: '#0070CC',
  },
  providerCard: {
    backgroundColor: '#E5F3FF',
    borderColor: '#0070CC',
  },
  ratingBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#86EFAD',
  },
  addButton: {
    alignSelf: 'flex-start',
    backgroundColor: SwashoColors.surface,
    borderWidth: 0.5,
    borderColor: SwashoColors.primary300,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonLabel: {
    color: SwashoColors.primary,
    textAlign: 'center',
  },
  deliveryText: {
    color: '#000000',
  },
  providerName: {
    color: SwashoColors.neutral800,
  },
  providerService: {
    color: SwashoColors.neutral800,
  },
  providerPrice: {
    color: SwashoColors.neutral800,
  },
  disclaimer: {
    color: SwashoColors.neutral500,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: SwashoColors.surface,
  },
});
