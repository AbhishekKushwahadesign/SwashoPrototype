import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { searchFont } from '@/components/search/search-fonts';
import { SheetCloseIcon } from '@/components/service-selection/service-selection-icons';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import {
  ContactlessDoorstepPickupIllustration,
  ContactlessSortProcessIllustration,
  ContactlessUploadPhotosIllustration,
} from './contactless-how-it-works-illustrations';

const STEPS = [
  {
    key: 'upload',
    stepLabel: 'Step 1 — Upload Photos',
    body: 'Upload your laundry bag photo and garment photos under their respective services.',
    Illustration: ContactlessUploadPhotosIllustration,
  },
  {
    key: 'pickup',
    stepLabel: 'Step 2 — Hassle-Free Pickup',
    body: 'Our pickup partner collects your laundry from your selected location—no in-person handover needed.',
    Illustration: ContactlessDoorstepPickupIllustration,
  },
  {
    key: 'sort',
    stepLabel: 'Step 3 — We Sort & Process',
    body: 'Our laundry team uses your photos to sort garments by service and process them accordingly.',
    Illustration: ContactlessSortProcessIllustration,
  },
] as const;

const REASSURANCE =
  'Your convenience, your schedule—no waiting for a pickup handover.';

type ContactlessHowItWorksModalProps = {
  visible: boolean;
  onClose: () => void;
  scale: number;
  contentWidth: number;
};

export function ContactlessHowItWorksModal({
  visible,
  onClose,
  scale,
  contentWidth,
}: ContactlessHowItWorksModalProps) {
  const insets = useSafeAreaInsets();
  const sheetMaxHeight = Math.min(640 * scale, 560 * scale);
  const illustrationSize = { width: 120 * scale, height: 96 * scale };

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
                maxHeight: sheetMaxHeight,
                borderTopLeftRadius: SwashoRadii.xl * scale,
                borderTopRightRadius: SwashoRadii.xl * scale,
                paddingTop: 24 * scale,
              },
            ]}>
            <Text
              style={[
                searchFont('semibold'),
                styles.title,
                {
                  fontSize: 18 * scale,
                  lineHeight: 24 * scale,
                  letterSpacing: 0.3 * scale,
                  paddingHorizontal: 16 * scale,
                  marginBottom: 8 * scale,
                },
              ]}>
              How Contactless Service Works
            </Text>

            <ScrollView
              style={[styles.scroll, Platform.OS === 'web' ? styles.scrollWeb : null]}
              contentContainerStyle={{
                paddingHorizontal: 16 * scale,
                paddingBottom: 20 * scale,
                gap: 20 * scale,
              }}
              showsVerticalScrollIndicator={false}>
              {STEPS.map(({ key, stepLabel, body, Illustration }) => (
                <View key={key} style={[styles.stepBlock, { gap: 12 * scale }]}>
                  <View style={styles.illustrationWrap}>
                    <Illustration width={illustrationSize.width} height={illustrationSize.height} />
                  </View>
                  <Text
                    style={[
                      searchFont('semibold'),
                      styles.stepTitle,
                      { fontSize: 15 * scale, lineHeight: 20 * scale, letterSpacing: 0.2 * scale },
                    ]}>
                    {stepLabel}
                  </Text>
                  <Text
                    style={[
                      searchFont('regular'),
                      styles.stepBody,
                      { fontSize: 14 * scale, lineHeight: 21 * scale },
                    ]}>
                    {body}
                  </Text>
                </View>
              ))}

              <View
                style={[
                  styles.reassuranceBox,
                  {
                    borderRadius: SwashoRadii.md * scale,
                    paddingHorizontal: 12 * scale,
                    paddingVertical: 12 * scale,
                    marginTop: 4 * scale,
                  },
                ]}>
                <Text
                  style={[
                    searchFont('medium'),
                    styles.reassuranceText,
                    { fontSize: 13 * scale, lineHeight: 20 * scale },
                  ]}>
                  {REASSURANCE}
                </Text>
              </View>
            </ScrollView>
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
  scroll: {
    flexGrow: 0,
  },
  scrollWeb: {
    overflow: 'auto',
  } as object,
  title: {
    color: SwashoColors.neutral800,
    textAlign: 'left',
  },
  stepBlock: {
    width: '100%',
    alignItems: 'flex-start',
  },
  illustrationWrap: {
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
  },
  stepTitle: {
    color: SwashoColors.neutral800,
  },
  stepBody: {
    color: SwashoColors.neutral600,
  },
  reassuranceBox: {
    width: '100%',
    backgroundColor: SwashoColors.primary50,
    borderWidth: 1,
    borderColor: SwashoColors.primary100,
  },
  reassuranceText: {
    color: SwashoColors.primary800,
    textAlign: 'center',
  },
});
