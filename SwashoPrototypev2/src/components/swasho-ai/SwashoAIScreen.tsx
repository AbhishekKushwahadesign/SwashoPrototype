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
import { ScreenHeight, SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { HistoryIcon, ScannerIcon, SparkleBulletIcon } from './swasho-ai-icons';

const STATUS_BAR_HEIGHT = 32;
const HOME_INDICATOR_HEIGHT = 24;
const COMPOSER_HEIGHT = 45;
const COMPOSER_BOTTOM_GAP = 12;

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
  const { scale, contentWidth, contentHeight } = useScreenScale();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const [draft, setDraft] = useState('');

  const frameHeight = contentHeight + safeTop;
  const bottomChromeHeight = HOME_INDICATOR_HEIGHT * scale;
  const composerBottom = bottomChromeHeight + COMPOSER_BOTTOM_GAP * scale + Math.max(insets.bottom, 8 * scale);

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
            height: frameHeight,
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
          <StatusBar scale={scale} tone="light" />
        </View>

        <View
          style={[
            styles.headerRow,
            {
              top: 21.4 * scale,
              paddingHorizontal: 20 * scale,
            },
          ]}>
          <CircleIconButton
            scale={scale}
            accessibilityLabel="Go back"
            onPress={() => router.back()}
            style={{ position: 'absolute', left: 20 * scale, top: 36.7 * scale }}>
            <ArrowLeftIcon width={24 * scale} height={24 * scale} />
          </CircleIconButton>

          <CircleIconButton
            scale={scale}
            accessibilityLabel="Conversation history"
            style={{ position: 'absolute', right: 20 * scale, top: 36.7 * scale }}>
            <HistoryIcon width={24 * scale} height={24 * scale} />
          </CircleIconButton>

          <View style={[styles.headerBrand, { gap: 7 * scale, top: 0 }]}>
            <Text
              style={[
                searchFont('regular'),
                styles.swashoWordmark,
                {
                  fontSize: 16 * scale,
                  letterSpacing: 0.08 * scale,
                },
              ]}>
              Swasho
            </Text>
            <View style={{ height: 23 * scale, transform: [{ scale: 1.2 }] }}>
              <SwashoAiIcon scale={scale} offsetX={0} />
            </View>
          </View>
        </View>

        <ScrollView
          style={[
            styles.scroll,
            {
              marginTop: (STATUS_BAR_HEIGHT + 174) * scale,
              marginBottom: composerBottom + COMPOSER_HEIGHT * scale + 8 * scale,
            },
          ]}
          contentContainerStyle={{
            paddingHorizontal: 20 * scale,
            paddingBottom: 24 * scale,
            gap: 32 * scale,
          }}
          showsVerticalScrollIndicator={false}>
          <View style={{ width: 372 * scale, alignSelf: 'center', gap: 32 * scale }}>
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

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Scan and recommend"
              style={[
                styles.scanCard,
                {
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
              contentContainerStyle={[
                styles.chipScrollContent,
                {
                  gap: 10 * scale,
                  paddingHorizontal: 10 * scale,
                  paddingVertical: 10 * scale,
                },
              ]}>
              {SUGGESTION_CHIPS.map((chip) => (
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
            </ScrollView>
          </View>
        </ScrollView>

        <View
          style={[
            styles.composerRow,
            {
              bottom: composerBottom,
              width: 372 * scale,
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

        <View style={[styles.homeIndicatorWrap, { bottom: Math.max(insets.bottom, 4 * scale) }]}>
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
        maxHeight: ScreenHeight,
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
    zIndex: 5,
    alignItems: 'center',
  },
  headerBrand: {
    alignItems: 'center',
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
  scanLabel: {
    color: SwashoColors.primary600,
    textAlign: 'center',
  },
  chipScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
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
  },
  composerRow: {
    position: 'absolute',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 6,
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
