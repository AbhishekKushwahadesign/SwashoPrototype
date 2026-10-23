import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState, type ReactNode } from 'react';
import {
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { searchFont } from '@/components/search/search-fonts';
import { ServiceSelectionButton } from '@/components/service-selection/ServiceSelectionButton';
import { SheetCloseIcon } from '@/components/service-selection/service-selection-icons';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';
import type { ContactlessClothesLocationId } from '@/lib/checkout-flow';
import {
  CONTACTLESS_CLOTHES_LOCATION_OPTIONS,
  contactlessClothesLocationLabel,
} from '@/lib/contactless-clothes-location';

import {
  ClothesLocationHeaderIllustration,
  ClothesLocationOptionSpriteIcon,
  ClothesLocationPencilIcon,
  ClothesLocationRadioSelected,
  ClothesLocationSheetGrabber,
} from './clothes-location-sheet-icons';

/** Figma 59153:4468 / 59153:4639 — clothes location sheet @ 412×600. */
const CLOTHES_LOCATION_SHEET_FIGMA = {
  frameWidth: 412,
  sheetHeightAt412: 600,
  closeChipHeight: 35,
  /** Parent frame: sheet top 43px, close bottom at 22px → 21px gap. */
  closeToSheetGap: 21,
  sheetPaddingTop: 24,
  contentPaddingHorizontal: 16,
  sectionGap: 16,
  headerBlockHeight: 56,
  headerTextGap: 8,
  optionsToFooterGap: 12,
  optionRowGap: 8,
  headerGradientHeight: 80,
} as const;

/** Figma 59153:4640 — linear-gradient(12.1deg, #fff 46.591%, #e8ddfc 86.091%). */
const HEADER_BACKDROP_GRADIENT = {
  colors: ['#FFFFFF', '#E8DDFC'] as const,
  locations: [0.465_91, 0.860_91] as const,
  start: { x: 0.08, y: 0.02 },
  end: { x: 0.92, y: 0.98 },
};

/** Figma 59153:4644 — exact CSS gradient (expo-linear-gradient mis-renders as a flat wash on web). */
const HEADER_TEXT_STRIPE_CSS =
  'linear-gradient(34.02632356705384deg, rgba(255, 255, 255, 0) 43.16%, rgb(242, 236, 253) 79.478%, rgba(242, 236, 253, 0) 84.379%)';

const clothesLocationHeaderTextStripeImage = require('@/assets/checkout/clothes-location-header-text-stripe.png');

type ContactlessClothesLocationModalProps = {
  visible: boolean;
  onClose: () => void;
  scale: number;
  contentWidth: number;
  selectedId: ContactlessClothesLocationId | undefined;
  otherText: string | undefined;
  onConfirm: (locationId: ContactlessClothesLocationId, otherText: string) => void;
};

export function ContactlessClothesLocationModal({
  visible,
  onClose,
  scale,
  contentWidth,
  selectedId,
  otherText,
  onConfirm,
}: ContactlessClothesLocationModalProps) {
  const insets = useSafeAreaInsets();
  const [draftId, setDraftId] = useState<ContactlessClothesLocationId | undefined>(selectedId);
  const [draftOther, setDraftOther] = useState(otherText ?? '');

  const designScale = contentWidth / CLOTHES_LOCATION_SHEET_FIGMA.frameWidth;
  const sheetHeightTarget = CLOTHES_LOCATION_SHEET_FIGMA.sheetHeightAt412 * designScale;
  const webOverflowVisible = Platform.OS === 'web' ? ('visible' as const) : undefined;
  const windowHeight = Dimensions.get('window').height;
  const closeStackHeight =
    (CLOTHES_LOCATION_SHEET_FIGMA.closeChipHeight + CLOTHES_LOCATION_SHEET_FIGMA.closeToSheetGap) *
    designScale;
  const availableForSheet =
    windowHeight -
    insets.top -
    closeStackHeight -
    Math.max(insets.bottom, 12 * designScale);
  const maxSheetHeight = Math.min(sheetHeightTarget, Math.max(availableForSheet, 0));

  const canConfirm = contactlessClothesLocationLabel(draftId, draftOther) != null;

  const handleConfirm = useCallback(() => {
    if (!draftId || !canConfirm) {
      return;
    }
    onConfirm(draftId, draftOther);
    onClose();
  }, [canConfirm, draftId, draftOther, onClose, onConfirm]);

  const horizontalPad = CLOTHES_LOCATION_SHEET_FIGMA.contentPaddingHorizontal * designScale;

  const footer = (
    <View
      style={{
        width: '100%',
        paddingHorizontal: horizontalPad,
        paddingBottom: 16 * designScale,
        backgroundColor: SwashoColors.surface,
        flexShrink: 0,
        gap: 12 * designScale,
      }}>
      <Text
        style={[
          searchFont('medium'),
          styles.footerNote,
          { fontSize: 13 * designScale, lineHeight: 20 * designScale },
        ]}>
        Clothes Location can be updated up to 2 hrs before scheduled Pickup/Delivery
      </Text>
      <ServiceSelectionButton
        label="Confirm Location"
        variant="primary"
        disabled={!canConfirm}
        onPress={handleConfirm}
        scale={scale}
        style={{ width: '100%', minHeight: 45 * designScale }}
      />
    </View>
  );

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.root}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Dismiss"
          onPress={onClose}
          style={styles.scrim}
        />
        <View
          style={[
            styles.sheetColumn,
            {
              width: contentWidth,
              maxHeight: windowHeight - insets.top,
              paddingTop: closeStackHeight,
              paddingBottom: Math.max(insets.bottom, 12 * designScale),
            },
          ]}
          pointerEvents="box-none">
          <View
            style={[
              styles.sheet,
              {
                width: contentWidth,
                height: maxSheetHeight,
                maxHeight: maxSheetHeight,
                borderTopLeftRadius: SwashoRadii.xl * designScale,
                borderTopRightRadius: SwashoRadii.xl * designScale,
                overflow: webOverflowVisible,
                ...figmaSheetShadow(designScale),
              },
            ]}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={onClose}
              style={[
                styles.closeChip,
                styles.closeOnSheet,
                {
                  width: CLOTHES_LOCATION_SHEET_FIGMA.closeChipHeight * designScale,
                  height: CLOTHES_LOCATION_SHEET_FIGMA.closeChipHeight * designScale,
                  borderRadius: 999,
                  top:
                    -(
                      CLOTHES_LOCATION_SHEET_FIGMA.closeChipHeight +
                      CLOTHES_LOCATION_SHEET_FIGMA.closeToSheetGap
                    ) * designScale,
                  marginLeft: (-CLOTHES_LOCATION_SHEET_FIGMA.closeChipHeight / 2) * designScale,
                },
              ]}>
              <SheetCloseIcon width={20 * designScale} height={20 * designScale} />
            </Pressable>

            <View
              style={[
                styles.headerBackdrop,
                {
                  height: CLOTHES_LOCATION_SHEET_FIGMA.headerGradientHeight * designScale,
                  borderTopLeftRadius: SwashoRadii.xl * designScale,
                  borderTopRightRadius: SwashoRadii.xl * designScale,
                },
              ]}
              pointerEvents="none">
              <LinearGradient
                colors={[...HEADER_BACKDROP_GRADIENT.colors]}
                locations={[...HEADER_BACKDROP_GRADIENT.locations]}
                start={HEADER_BACKDROP_GRADIENT.start}
                end={HEADER_BACKDROP_GRADIENT.end}
                style={[
                  StyleSheet.absoluteFillObject,
                  {
                    borderTopLeftRadius: SwashoRadii.xl * designScale,
                    borderTopRightRadius: SwashoRadii.xl * designScale,
                  },
                ]}
              />
              <View
                style={{
                  paddingTop: 8 * designScale,
                  alignItems: 'center',
                  width: '100%',
                }}>
                <ClothesLocationSheetGrabber scale={designScale} />
              </View>
              <ClothesLocationHeaderIllustration scale={designScale} />
            </View>

            <View
              style={[
                styles.sheetMain,
                {
                  paddingTop: CLOTHES_LOCATION_SHEET_FIGMA.sheetPaddingTop * designScale,
                  paddingHorizontal: horizontalPad,
                  gap: CLOTHES_LOCATION_SHEET_FIGMA.sectionGap * designScale,
                },
              ]}>
              <ModalHeaderTextStripe designScale={designScale}>
                <Text
                  style={[
                    searchFont('semibold'),
                    styles.title,
                    {
                      fontSize: 18 * designScale,
                      lineHeight: 20.426 * designScale,
                    },
                  ]}>
                  Where should we collect from?
                </Text>
                <Text
                  style={[
                    searchFont('regular'),
                    styles.subtitle,
                    {
                      flex: 1,
                      fontSize: 12 * designScale,
                      lineHeight: 16 * designScale,
                      letterSpacing: 0.5 * designScale,
                    },
                  ]}>
                  Select a contactless drop/pickup spot at your location.
                </Text>
              </ModalHeaderTextStripe>

              <ScrollView
                style={[
                  styles.scroll,
                  styles.scrollFlex,
                  Platform.OS === 'web' ? styles.scrollWeb : null,
                ]}
                contentContainerStyle={{
                  gap: CLOTHES_LOCATION_SHEET_FIGMA.optionRowGap * designScale,
                  paddingBottom: CLOTHES_LOCATION_SHEET_FIGMA.optionsToFooterGap * designScale,
                }}
              showsVerticalScrollIndicator={Platform.OS === 'web'}
              bounces={false}
              nestedScrollEnabled>
                {CONTACTLESS_CLOTHES_LOCATION_OPTIONS.map((option) => {
                  if (option.id === 'other') {
                    return (
                      <LocationOtherRow
                        key={option.id}
                        scale={designScale}
                        selected={draftId === 'other'}
                        value={draftOther}
                        onSelect={() => setDraftId('other')}
                        onChangeText={setDraftOther}
                      />
                    );
                  }
                  const selected = draftId === option.id;
                  return (
                    <Pressable
                      key={option.id}
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                      onPress={() => setDraftId(option.id)}
                      style={[
                        styles.optionRow,
                        {
                          paddingHorizontal: 16 * designScale,
                          paddingVertical: 12 * designScale,
                          borderRadius: SwashoRadii.lg * designScale,
                          gap: 16 * designScale,
                          borderWidth: 1,
                        },
                        selected ? styles.optionRowSelected : styles.optionRowDefault,
                      ]}>
                      <View
                        style={[
                          styles.iconTile,
                          {
                            width: 40 * designScale,
                            height: 40 * designScale,
                            borderRadius: SwashoRadii.md * designScale,
                            backgroundColor: selected ? SwashoColors.primary100 : SwashoColors.neutral100,
                          },
                        ]}>
                        <ClothesLocationOptionSpriteIcon optionId={option.id} scale={designScale} />
                      </View>
                      <View style={{ flex: 1, gap: 4 * designScale, minWidth: 0 }}>
                        <Text
                          style={[
                            searchFont('semibold'),
                            styles.optionTitle,
                            {
                              fontSize: 14 * designScale,
                              lineHeight: 14 * designScale,
                              letterSpacing: 0.5 * designScale,
                            },
                          ]}>
                          {option.title}
                        </Text>
                        <Text
                          style={[
                            searchFont('regular'),
                            styles.optionBody,
                            { fontSize: 12 * designScale, lineHeight: 16 * designScale },
                          ]}>
                          {option.description}
                        </Text>
                      </View>
                      <RadioMark selected={selected} scale={designScale} />
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {footer}
          </View>
        </View>
      </View>
    </Modal>
  );
}

/** Figma 59153:4644 — soft diagonal lavender band (left stays clear; peak upper-right). */
function ModalHeaderTextStripe({
  designScale,
  children,
}: {
  designScale: number;
  children: ReactNode;
}) {
  const stripeHeight = CLOTHES_LOCATION_SHEET_FIGMA.headerBlockHeight * designScale;
  const textGap = CLOTHES_LOCATION_SHEET_FIGMA.headerTextGap * designScale;

  const shell: ViewStyle = {
    width: '100%',
    height: stripeHeight,
    flexShrink: 0,
    zIndex: 1,
    alignSelf: 'stretch',
    position: 'relative',
    overflow: 'hidden',
  };

  const textStack: ViewStyle = {
    width: '100%',
    height: stripeHeight,
    gap: textGap,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    zIndex: 1,
  };

  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          shell,
          textStack,
          {
            backgroundColor: 'transparent',
            backgroundImage: HEADER_TEXT_STRIPE_CSS,
            backgroundRepeat: 'no-repeat',
            backgroundSize: '100% 100%',
          } as ViewStyle,
        ]}>
        {children}
      </View>
    );
  }

  return (
    <View style={shell}>
      <Image
        source={clothesLocationHeaderTextStripeImage}
        style={StyleSheet.absoluteFillObject}
        resizeMode="stretch"
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <View style={textStack}>{children}</View>
    </View>
  );
}

function RadioMark({ selected, scale }: { selected: boolean; scale: number }) {
  if (selected) {
    return <ClothesLocationRadioSelected scale={scale} />;
  }
  const size = 20 * scale;
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 2 * scale,
        borderColor: SwashoColors.neutral300,
      }}
    />
  );
}

function LocationOtherRow({
  scale,
  selected,
  value,
  onSelect,
  onChangeText,
}: {
  scale: number;
  selected: boolean;
  value: string;
  onSelect: () => void;
  onChangeText: (text: string) => void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onSelect}
      style={[
        styles.optionRow,
        {
          paddingHorizontal: 16 * scale,
          paddingVertical: 12 * scale,
          borderRadius: SwashoRadii.lg * scale,
          gap: 16 * scale,
          borderWidth: 1,
        },
        selected ? styles.optionRowSelected : styles.optionRowDefault,
      ]}>
      <View
        style={[
          styles.iconTile,
          {
            width: 40 * scale,
            height: 40 * scale,
            borderRadius: SwashoRadii.md * scale,
            backgroundColor: SwashoColors.neutral100,
          },
        ]}>
        <ClothesLocationPencilIcon scale={scale} />
      </View>
      <View style={{ flex: 1, gap: 4 * scale, minWidth: 0 }}>
        <Text
          style={[
            searchFont('semibold'),
            styles.optionTitle,
            { fontSize: 14 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
          ]}>
          Other Location
        </Text>
        <TextInput
          value={value}
          onChangeText={(text) => {
            onSelect();
            onChangeText(text);
          }}
          onFocus={onSelect}
          placeholder="Enter your pickup location..."
          placeholderTextColor={SwashoColors.neutral600}
          style={[
            searchFont('regular'),
            styles.otherInput,
            {
              fontSize: 13 * scale,
              paddingHorizontal: 12 * scale,
              paddingVertical: 10 * scale,
              borderRadius: SwashoRadii.md * scale,
              borderWidth: 1,
            },
          ]}
        />
      </View>
    </Pressable>
  );
}

function figmaSheetShadow(scale: number): StyleProp<ViewStyle> {
  if (Platform.OS === 'web') {
    return { boxShadow: `0px ${-4 * scale}px ${8 * scale}px rgba(0, 0, 0, 0.2)` } as StyleProp<ViewStyle>;
  }
  return {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 * scale },
    shadowOpacity: 0.2,
    shadowRadius: 8 * scale,
    elevation: 8,
  };
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: 1000,
    elevation: 1000,
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: SwashoColors.modalScrim,
    zIndex: 0,
  },
  sheetColumn: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 2,
    ...(Platform.OS === 'web' ? { overflow: 'visible' as const } : null),
  },
  closeChip: {
    backgroundColor: 'rgba(236, 236, 236, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 4,
    elevation: 4,
  },
  closeOnSheet: {
    position: 'absolute',
    left: '50%',
    zIndex: 4,
  },
  sheet: {
    width: '100%',
    backgroundColor: SwashoColors.surface,
    overflow: 'hidden',
    flexDirection: 'column',
    flexShrink: 1,
    position: 'relative',
  },
  headerBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
    zIndex: 0,
  },
  sheetMain: {
    flex: 1,
    minHeight: 0,
    flexDirection: 'column',
    zIndex: 1,
  },
  scroll: {
    flexGrow: 1,
    flexShrink: 1,
  },
  scrollFlex: {
    flex: 1,
    minHeight: 0,
  },
  scrollWeb: {
    overflowY: 'auto',
    overflowX: 'clip',
  } as object,
  title: {
    color: SwashoColors.neutral700,
  },
  subtitle: {
    color: SwashoColors.neutral600,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionRowSelected: {
    backgroundColor: SwashoColors.primary50,
    borderColor: SwashoColors.primary300,
  },
  optionRowDefault: {
    backgroundColor: SwashoColors.surface,
    borderColor: 'rgba(0,0,0,0)',
  },
  iconTile: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    color: SwashoColors.neutral950,
  },
  optionBody: {
    color: SwashoColors.neutral600,
  },
  otherInput: {
    color: SwashoColors.neutral800,
    borderColor: SwashoColors.neutral300,
    backgroundColor: SwashoColors.surface,
    width: '100%',
  },
  footerNote: {
    color: SwashoColors.neutral600,
    textAlign: 'center',
  },
});
