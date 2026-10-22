import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import {
  Dimensions,
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
  CheckoutInstructionDoorstepIcon,
  CheckoutInstructionPenIcon,
  CheckoutInstructionPhoneIcon,
  CheckoutInstructionShieldIcon,
} from './checkout-review-icons';

/** Figma 59153:4639 — clothes location sheet 600px at 412 frame. */
const CLOTHES_LOCATION_SHEET_FIGMA = {
  frameWidth: 412,
  sheetHeightAt412: 600,
} as const;

const LOCATION_ICONS: Record<
  ContactlessClothesLocationId,
  typeof CheckoutInstructionDoorstepIcon
> = {
  'flat-door': CheckoutInstructionDoorstepIcon,
  'society-gate': CheckoutInstructionShieldIcon,
  'society-lobby': CheckoutInstructionPhoneIcon,
  maid: CheckoutInstructionPhoneIcon,
  other: CheckoutInstructionPenIcon,
};

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
  const windowHeight = Dimensions.get('window').height;
  const closeStackHeight = (35 + 8) * designScale;
  const availableForSheet =
    windowHeight -
    insets.top -
    closeStackHeight -
    Math.max(insets.bottom, 12 * designScale);
  const sheetHeight = Math.min(sheetHeightTarget, Math.max(availableForSheet, 0));

  const canConfirm = contactlessClothesLocationLabel(draftId, draftOther) != null;

  const handleConfirm = useCallback(() => {
    if (!draftId || !canConfirm) {
      return;
    }
    onConfirm(draftId, draftOther);
    onClose();
  }, [canConfirm, draftId, draftOther, onClose, onConfirm]);

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
            { width: contentWidth, paddingBottom: Math.max(insets.bottom, 12 * scale) },
          ]}
          pointerEvents="box-none">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={onClose}
            style={[
              styles.closeChip,
              {
                width: 35 * scale,
                height: 35 * scale,
                borderRadius: 999,
                marginBottom: 8 * scale,
              },
            ]}>
            <SheetCloseIcon width={20 * scale} height={20 * scale} />
          </Pressable>

          <View
            style={[
              styles.sheet,
              {
                width: contentWidth,
                height: sheetHeight,
                maxHeight: sheetHeight,
                borderTopLeftRadius: 24 * scale,
                borderTopRightRadius: 24 * scale,
                paddingTop: 24 * scale,
                ...figmaSheetShadow(scale),
              },
            ]}>
            <LinearGradient
              colors={['#ffffff', '#e8ddfc']}
              start={{ x: 0.2, y: 0 }}
              end={{ x: 0.8, y: 1 }}
              style={[
                styles.headerGradient,
                {
                  height: 80 * scale,
                  borderTopLeftRadius: 24 * scale,
                  borderTopRightRadius: 24 * scale,
                },
              ]}
              pointerEvents="none"
            />

            <View style={[styles.sheetBody, { paddingHorizontal: 16 * scale }]}>
              <View style={{ gap: 6 * scale, marginTop: -56 * scale, flexShrink: 0 }}>
                <Text
                  style={[
                    searchFont('semibold'),
                    styles.title,
                    { fontSize: 18 * scale, lineHeight: 22 * scale },
                  ]}>
                  Where should we collect from?
                </Text>
                <Text
                  style={[
                    searchFont('regular'),
                    styles.subtitle,
                    { fontSize: 12 * scale, lineHeight: 16 * scale, letterSpacing: 0.5 * scale },
                  ]}>
                  Select a contactless drop/pickup spot at your location.
                </Text>
              </View>

              <ScrollView
                style={[
                  styles.scroll,
                  { marginTop: 16 * scale, flex: 1, minHeight: 0 },
                  Platform.OS === 'web' ? styles.scrollWeb : null,
                ]}
                contentContainerStyle={{ gap: 8 * scale, paddingBottom: 8 * scale }}
                showsVerticalScrollIndicator={false}>
                {CONTACTLESS_CLOTHES_LOCATION_OPTIONS.map((option) => {
                  if (option.id === 'other') {
                    return (
                      <LocationOtherRow
                        key={option.id}
                        scale={scale}
                        selected={draftId === 'other'}
                        value={draftOther}
                        onSelect={() => setDraftId('other')}
                        onChangeText={setDraftOther}
                      />
                    );
                  }
                  const Icon = LOCATION_ICONS[option.id];
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
                          padding: 16 * scale,
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
                            backgroundColor: selected ? SwashoColors.primary100 : SwashoColors.neutral100,
                          },
                        ]}>
                        <Icon width={24 * scale} height={24 * scale} />
                      </View>
                      <View style={{ flex: 1, gap: 4 * scale }}>
                        <Text
                          style={[
                            searchFont('semibold'),
                            styles.optionTitle,
                            { fontSize: 14 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
                          ]}>
                          {option.title}
                        </Text>
                        <Text
                          style={[
                            searchFont('regular'),
                            styles.optionBody,
                            { fontSize: 12 * scale, lineHeight: 16 * scale },
                          ]}>
                          {option.description}
                        </Text>
                      </View>
                      <RadioMark selected={selected} scale={scale} />
                    </Pressable>
                  );
                })}
              </ScrollView>

              <View style={{ gap: 12 * scale, flexShrink: 0, paddingTop: 12 * scale }}>
                <Text
                  style={[
                    searchFont('medium'),
                    styles.footerNote,
                    { fontSize: 13 * scale, lineHeight: 20 * scale },
                  ]}>
                  Clothes Location can be updated up to 2 hrs before scheduled Pickup/Delivery
                </Text>

                <ServiceSelectionButton
                  label="Confirm Location"
                  variant="primary"
                  disabled={!canConfirm}
                  onPress={handleConfirm}
                  scale={scale}
                  style={{ width: '100%', minHeight: 45 * scale }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function RadioMark({ selected, scale }: { selected: boolean; scale: number }) {
  const size = 20 * scale;
  if (selected) {
    return (
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 2 * scale,
          borderColor: SwashoColors.primary600,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View
          style={{
            width: 10 * scale,
            height: 10 * scale,
            borderRadius: 5 * scale,
            backgroundColor: SwashoColors.primary600,
          }}
        />
      </View>
    );
  }
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
        styles.optionRowDefault,
        {
          padding: 16 * scale,
          borderRadius: SwashoRadii.lg * scale,
          gap: 16 * scale,
          borderWidth: selected ? 1 : 0,
        },
        selected ? styles.optionRowSelected : null,
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
        <CheckoutInstructionPenIcon width={22 * scale} height={22 * scale} />
      </View>
      <View style={{ flex: 1, gap: 8 * scale }}>
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
  },
  scrim: {
    ...StyleSheet.absoluteFill,
    backgroundColor: SwashoColors.modalScrim,
  },
  sheetColumn: {
    width: '100%',
    alignSelf: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  closeChip: {
    backgroundColor: 'rgba(236, 236, 236, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sheet: {
    width: '100%',
    backgroundColor: SwashoColors.surface,
    overflow: 'hidden',
  },
  sheetBody: {
    flex: 1,
    minHeight: 0,
    flexDirection: 'column',
  },
  headerGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  scroll: {
    flexGrow: 1,
    flexShrink: 1,
  },
  scrollWeb: {
    overflow: 'auto',
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
    borderColor: 'transparent',
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
