import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { searchFont } from '@/components/search/search-fonts';
import { ServiceSelectionButton } from '@/components/service-selection/ServiceSelectionButton';
import { SheetCloseIcon } from '@/components/service-selection/service-selection-icons';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { ContactlessStepIllustrationCluster } from './contactless-workflow-panel';

const STEPS = [
  {
    key: 'upload',
    layout: 'textLeft' as const,
    number: 1,
    title: 'Upload Photos',
    body: 'Upload your laundry bag photo and garment photos under their respective services.',
    panel: 'upload' as const,
    arcSide: 'right' as const,
    badgeSide: 'left' as const,
  },
  {
    key: 'pickup',
    layout: 'textRight' as const,
    number: 2,
    title: 'Hassle-Free Pickup',
    body: 'Our pickup partner collects your laundry from your selected location—no in-person handover needed.',
    panel: 'pickup' as const,
    arcSide: 'left' as const,
    badgeSide: 'right' as const,
  },
  {
    key: 'sort',
    layout: 'textLeft' as const,
    number: 3,
    title: 'We Sort & Process',
    body: 'Our laundry team uses your photos to sort garments by service and process them accordingly.',
    panel: 'sort' as const,
    arcSide: 'right' as const,
    badgeSide: 'left' as const,
  },
] as const;

const REASSURANCE = 'Your convenience, your schedule - no waiting for a pickup handover.';

type ContactlessHowItWorksModalProps = {
  visible: boolean;
  onClose: () => void;
  scale: number;
  contentWidth: number;
  /** Figma 59127:5994 setup flow — primary Continue CTA. */
  showContinue?: boolean;
  onContinue?: () => void;
  continueHint?: string;
};

export function ContactlessHowItWorksModal({
  visible,
  onClose,
  scale,
  contentWidth,
  showContinue = false,
  onContinue,
  continueHint = 'Next, choose where your laundry bag will be collected from.',
}: ContactlessHowItWorksModalProps) {
  const insets = useSafeAreaInsets();
  const sheetMaxHeight = Math.min(720 * scale, 640 * scale);
  const textColWidth = 185 * scale;

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
                gap: 16 * scale,
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
                  paddingBottom: 8 * scale,
                },
              ]}>
              How Contactless Service Works
            </Text>

            <ScrollView
              style={[styles.scroll, Platform.OS === 'web' ? styles.scrollWeb : null]}
              contentContainerStyle={{
                paddingHorizontal: 16 * scale,
                paddingBottom: 20 * scale,
                gap: 36 * scale,
              }}
              showsVerticalScrollIndicator={false}>
              <View style={{ gap: 28 * scale, width: '100%' }}>
                {STEPS.map((step) => (
                  <ContactlessStepRow
                    key={step.key}
                    scale={scale}
                    textColWidth={textColWidth}
                    layout={step.layout}
                    number={step.number}
                    title={step.title}
                    body={step.body}
                    panel={step.panel}
                    arcSide={step.arcSide}
                    badgeSide={step.badgeSide}
                  />
                ))}
              </View>

              <View style={{ width: '100%', gap: 4 * scale }}>
                <View
                  style={[
                    styles.reassuranceBox,
                    {
                      borderRadius: SwashoRadii.md * scale,
                      paddingHorizontal: 12 * scale,
                      paddingVertical: 8 * scale,
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

                {showContinue ? (
                  <View style={{ width: '100%', paddingTop: 8 * scale, gap: 4 * scale }}>
                    {continueHint ? (
                      <Text
                        style={[
                          searchFont('regular'),
                          styles.continueHint,
                          { fontSize: 12 * scale, lineHeight: 18 * scale },
                        ]}>
                        {continueHint}
                      </Text>
                    ) : null}
                    <ServiceSelectionButton
                      label="Continue"
                      variant="primary"
                      onPress={onContinue ?? onClose}
                      scale={scale}
                      style={{ width: '100%', minHeight: 45 * scale }}
                    />
                  </View>
                ) : null}
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function ContactlessStepRow({
  scale,
  textColWidth,
  layout,
  number,
  title,
  body,
  panel,
  arcSide,
  badgeSide,
}: {
  scale: number;
  textColWidth: number;
  layout: 'textLeft' | 'textRight';
  number: number;
  title: string;
  body: string;
  panel: 'upload' | 'pickup' | 'sort';
  arcSide: 'left' | 'right';
  badgeSide: 'left' | 'right';
}) {
  const textBlock = (
    <View style={{ width: textColWidth, gap: 8 * scale, flexShrink: 1 }}>
      <Text
        style={[
          searchFont('semibold'),
          styles.stepTitle,
          { fontSize: 15 * scale, lineHeight: 14 * scale, letterSpacing: 0.3 * scale },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          searchFont('regular'),
          styles.stepBody,
          { fontSize: 12 * scale, lineHeight: 16 * scale, letterSpacing: 0.5 * scale },
        ]}>
        {body}
      </Text>
    </View>
  );

  const illustration = (
    <ContactlessStepIllustrationCluster
      variant={panel}
      number={number}
      scale={scale}
      arcSide={arcSide}
      badgeSide={badgeSide}
    />
  );

  return (
    <View style={[styles.stepRow, { gap: 8 * scale }]}>
      {layout === 'textLeft' ? (
        <>
          {textBlock}
          <View style={styles.stepRowSpacer} />
          {illustration}
        </>
      ) : (
        <>
          {illustration}
          <View style={styles.stepRowSpacer} />
          {textBlock}
        </>
      )}
    </View>
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
    color: SwashoColors.neutral700,
    textAlign: 'left',
  },
  stepRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepRowSpacer: {
    flex: 1,
    minWidth: 4,
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
  continueHint: {
    color: SwashoColors.neutral600,
    textAlign: 'center',
  },
});
