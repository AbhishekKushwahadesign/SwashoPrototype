import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArrowLeftIcon, MicrophoneIcon } from '@/components/home/figma-icons';
import { FigmaShadows, figmaShadow } from '@/components/home/figma-shadows';
import { HomeIndicator } from '@/components/home/HomeIndicator';
import { SwashoAiIcon } from '@/components/home/NavBar';
import { StatusBar } from '@/components/home/StatusBar';
import { useSafeTopInset, useScreenScale } from '@/components/home/scale';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { HistoryIcon, ScannerIcon, SparkleBulletIcon } from './swasho-ai-icons';

const STATUS_BAR_HEIGHT = 32;
const HOME_INDICATOR_HEIGHT = 24;
const COMPOSER_HEIGHT = 45;
/** Figma frame 3415:17972 vertical layout (896px artboard height). */
const FIGMA_FRAME_HEIGHT = 896;
const FIGMA_BRAND_TOP = 56;
const FIGMA_HEADER_BUTTON_TOP = 58.1;
const FIGMA_CONTENT_TOP = 206;
const FIGMA_SCAN_TOP = 567;
const FIGMA_SCAN_LEFT = 30;
const FIGMA_CHIPS_TOP = 706;
const FIGMA_COMPOSER_TOP = 812;
const FIGMA_HOME_INDICATOR_TOP = 896;
const FIGMA_CONTENT_WIDTH = 372;
const FIGMA_CHIPS_WIDTH = 451;
const FIGMA_HORIZONTAL_INSET = 20;

const FEATURE_BULLETS = [
  'Recommend the best service for your garment',
  'Reschedule, skip, or cancel orders and subscriptions',
  'Modify your order using voice or chat',
] as const;

const SUGGESTION_CHIPS = [
  "Reschedule tomorrow's pickup",
  'Skip next pickup',
  'Recommend a service',
  'Cancel my subscription',
] as const;

function CircleIconButton({
  scale,
  onPress,
  accessibilityLabel,
  children,
  style,
}: {
  scale: number;
  onPress?: () => void;
  accessibilityLabel: string;
  children: ReactNode;
  style?: object;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      style={[
        styles.circleButton,
        {
          padding: 6 * scale,
          borderRadius: 9999 * scale,
        },
        style,
      ]}>
      {children}
    </Pressable>
  );
}

export function SwashoAIScreen() {
  const { scale, contentWidth } = useScreenScale();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const [draft, setDraft] = useState('');

  const layoutHeight = FIGMA_FRAME_HEIGHT * scale;
  const figmaY = (y: number) => y * scale;
  const contentColumnWidth = FIGMA_CONTENT_WIDTH * scale;
  const contentColumnLeft = (contentWidth - contentColumnWidth) / 2;

  const composerTop = figmaY(FIGMA_COMPOSER_TOP);
  const scanTop = figmaY(FIGMA_SCAN_TOP);
  const chipsTop = figmaY(FIGMA_CHIPS_TOP);
  const scrollTop = figmaY(FIGMA_CONTENT_TOP);
  const scrollBottom = layoutHeight - scanTop;

  const applySuggestion = (label: string) => {
    setDraft(label);
  };

  return (
    <View style={[styles.root, { backgroundColor: SwashoColors.surface }]}>
      <View
        style={[
          styles.frame,
          {
            width: contentWidth,
            height: layoutHeight,
            marginTop: safeTop,
            ...figmaShadow(FigmaShadows.screen, scale),
          },
        ]}>
        <LinearGradient
          colors={[SwashoColors.surface, SwashoColors.surface, SwashoColors.primary200]}
          locations={[0, 0.78058, 1]}
          style={StyleSheet.absoluteFill}
        />

        <View style={[styles.statusBar, { height: STATUS_BAR_HEIGHT * scale }]}>
          <StatusBar scale={scale} tone="transparent" />
        </View>

        <View style={styles.headerRow}>
          <CircleIconButton
            scale={scale}
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={{
              position: 'absolute',
              left: FIGMA_HORIZONTAL_INSET * scale,
              top: figmaY(FIGMA_HEADER_BUTTON_TOP),
            }}>
            <ArrowLeftIcon width={24 * scale} height={24 * scale} />
          </CircleIconButton>

          <CircleIconButton
            scale={scale}
            accessibilityLabel="Conversation history"
            style={{
              position: 'absolute',
              left: contentWidth * 0.75 + 47 * scale,
              top: figmaY(FIGMA_HEADER_BUTTON_TOP),
            }}>
            <HistoryIcon width={24 * scale} height={24 * scale} />
          </CircleIconButton>

          <View
            style={[
              styles.headerBrand,
              {
                top: figmaY(FIGMA_BRAND_TOP),
                gap: 7 * scale,
              },
            ]}>
            <Text
              style={[
                searchFont('regular'),
                styles.swashoWordmark,
                {
                  fontSize: 16 * scale,
                  lineHeight: 19 * scale,
                  letterSpacing: 0.08 * scale,
                },
              ]}>
              Swasho
            </Text>
            <View style={{ width: 28 * scale, height: 23 * scale, alignItems: 'center', justifyContent: 'center' }}>
              <SwashoAiIcon scale={scale} offsetX={0} />
            </View>
          </View>
        </View>

        <ScrollView
          style={[
            styles.scroll,
            {
              marginTop: scrollTop,
              marginBottom: scrollBottom,
            },
          ]}
          contentContainerStyle={{
            paddingBottom: 16 * scale,
            alignItems: 'center',
          }}
          showsVerticalScrollIndicator={false}>
          <View style={{ width: contentColumnWidth, gap: 32 * scale }}>
            <Text
              style={[
                searchFont('medium'),
                styles.sectionHeading,
                {
                  fontSize: 18 * scale,
                  lineHeight: 16 * scale,
                  letterSpacing: 0.5 * scale,
                },
              ]}>
              How can Swasho AI help today?
            </Text>

            <View style={{ gap: 20 * scale }}>
              {FEATURE_BULLETS.map((line) => (
                <View key={line} style={[styles.bulletRow, { gap: 12 * scale }]}>
                  <View style={{ width: 24 * scale, height: 24 * scale, alignItems: 'center', justifyContent: 'center' }}>
                    <SparkleBulletIcon width={20.347 * scale} height={20.231 * scale} />
                  </View>
                  <Text
                    style={[
                      searchFont('medium'),
                      styles.bulletText,
                      {
                        fontSize: 15 * scale,
                        lineHeight: 20 * scale,
                        letterSpacing: 0.5 * scale,
                        flex: 1,
                      },
                    ]}>
                    {line}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Scan and recommend"
          style={[
            styles.scanCard,
            styles.scanCardPositioned,
            {
              top: scanTop,
              left: FIGMA_SCAN_LEFT * scale,
              width: 120 * scale,
              height: 120 * scale,
              borderRadius: SwashoRadii.xl * scale,
              padding: 10 * scale,
              gap: 12 * scale,
              borderWidth: 1,
              ...figmaShadow({ offsetX: 0, offsetY: 2, blur: 4, color: '#000000', opacity: 0.15 }, scale),
            },
          ]}>
          <ScannerIcon width={32 * scale} height={32 * scale} />
          <Text
            style={[
              searchFont('semibold'),
              styles.scanLabel,
              {
                fontSize: 14 * scale,
                lineHeight: 16 * scale,
                letterSpacing: 0.28 * scale,
                maxWidth: 101 * scale,
              },
            ]}>
            Scan & Recommend
          </Text>
        </Pressable>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[
            styles.chipScroll,
            {
              top: chipsTop,
              left: FIGMA_HORIZONTAL_INSET * scale,
              width: contentWidth - FIGMA_HORIZONTAL_INSET * scale,
            },
          ]}
          contentContainerStyle={styles.chipScrollContent}>
          <View style={{ width: FIGMA_CHIPS_WIDTH * scale, gap: 10 * scale }}>
            <View style={[styles.chipRow, { gap: 10 * scale, paddingTop: 10 * scale, paddingHorizontal: 10 * scale }]}>
              {SUGGESTION_CHIPS.slice(0, 2).map((chip) => (
                <Pressable
                  key={chip}
                  accessibilityRole="button"
                  onPress={() => applySuggestion(chip)}
                  style={[
                    styles.chip,
                    {
                      padding: 12 * scale,
                      borderRadius: SwashoRadii.md * scale,
                    },
                  ]}>
                  <Text
                    style={[
                      searchFont('regular'),
                      styles.chipText,
                      {
                        fontSize: 15 * scale,
                        lineHeight: 14 * scale,
                        letterSpacing: 0.3 * scale,
                      },
                    ]}>
                    {chip}
                  </Text>
                </Pressable>
              ))}
            </View>
            <View style={[styles.chipRow, { gap: 10 * scale, paddingHorizontal: 10 * scale, paddingBottom: 10 * scale }]}>
              {SUGGESTION_CHIPS.slice(2).map((chip) => (
                <Pressable
                  key={chip}
                  accessibilityRole="button"
                  onPress={() => applySuggestion(chip)}
                  style={[
                    styles.chip,
                    {
                      padding: 12 * scale,
                      borderRadius: SwashoRadii.md * scale,
                    },
                  ]}>
                  <Text
                    style={[
                      searchFont('regular'),
                      styles.chipText,
                      {
                        fontSize: 15 * scale,
                        lineHeight: 14 * scale,
                        letterSpacing: 0.3 * scale,
                      },
                    ]}>
                    {chip}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </ScrollView>

        <View
          style={[
            styles.composerRow,
            {
              top: composerTop,
              left: contentColumnLeft,
              width: contentColumnWidth,
              gap: 4 * scale,
            },
          ]}>
          <View
            style={[
              styles.composerField,
              {
                height: COMPOSER_HEIGHT * scale,
                borderRadius: SwashoRadii.md * scale,
                paddingHorizontal: 12 * scale,
                gap: 10 * scale,
              },
            ]}>
            <Text
              style={[
                searchFont('medium'),
                styles.plusGlyph,
                {
                  fontSize: 24 * scale,
                  lineHeight: 14 * scale,
                  letterSpacing: 0.5 * scale,
                },
              ]}>
              +
            </Text>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Ask, do & manage your laundry"
              placeholderTextColor={SwashoColors.neutral300}
              style={[
                searchFont('medium'),
                styles.composerInput,
                {
                  fontSize: 15 * scale,
                  lineHeight: 20 * scale,
                  letterSpacing: 0.5 * scale,
                },
              ]}
            />
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voice input"
            style={[
              styles.micButton,
              {
                width: COMPOSER_HEIGHT * scale,
                height: COMPOSER_HEIGHT * scale,
                borderRadius: SwashoRadii.md * scale,
                padding: 10 * scale,
              },
            ]}>
            <MicrophoneIcon width={20 * scale} height={20 * scale} />
          </Pressable>
        </View>

        <View
          style={[
            styles.homeIndicatorWrap,
            {
              top: figmaY(FIGMA_HOME_INDICATOR_TOP),
              height: HOME_INDICATOR_HEIGHT * scale,
            },
          ]}>
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
    backgroundColor: '#f0f0f0',
  },
  frame: {
    backgroundColor: SwashoColors.surface,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        maxHeight: FIGMA_FRAME_HEIGHT,
      },
    }),
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  headerRow: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    zIndex: 5,
    overflow: 'visible',
  },
  headerBrand: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
    overflow: 'visible',
  },
  swashoWordmark: {
    color: SwashoColors.neutral800,
    textAlign: 'center',
  },
  circleButton: {
    backgroundColor: 'rgba(250, 250, 250, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  sectionHeading: {
    color: SwashoColors.neutral700,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bulletText: {
    color: '#000000',
  },
  scanCard: {
    backgroundColor: 'rgba(243, 242, 255, 0.24)',
    borderColor: SwashoColors.primary300,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanCardPositioned: {
    position: 'absolute',
    zIndex: 4,
  },
  chipScroll: {
    position: 'absolute',
    left: 0,
    zIndex: 4,
  },
  chipRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scanLabel: {
    color: SwashoColors.primary600,
    textAlign: 'center',
  },
  chipScrollContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  chip: {
    backgroundColor: 'rgba(255, 255, 255, 0.35)',
    borderWidth: 1,
    borderColor: SwashoColors.neutral300,
    borderStyle: 'dashed',
  },
  chipText: {
    color: SwashoColors.neutral800,
    textAlign: 'center',
    flexShrink: 0,
  },
  composerRow: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 8,
  },
  composerField: {
    flex: 1,
    backgroundColor: SwashoColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
  },
  plusGlyph: {
    color: SwashoColors.neutral800,
    textAlign: 'center',
  },
  composerInput: {
    flex: 1,
    color: SwashoColors.neutral800,
    padding: 0,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      } as object,
    }),
  },
  micButton: {
    backgroundColor: SwashoColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicatorWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: 'transparent',
    zIndex: 6,
  },
});
