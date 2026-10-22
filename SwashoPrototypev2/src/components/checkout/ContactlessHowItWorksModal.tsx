import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { searchFont } from '@/components/search/search-fonts';
import { ServiceSelectionButton } from '@/components/service-selection/ServiceSelectionButton';
import { SheetCloseIcon } from '@/components/service-selection/service-selection-icons';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { ContactlessWorkflowPanel } from './contactless-workflow-panel';

const STEPS = [
  {
    key: 'upload',
    layout: 'textFirst' as const,
    rowGap: 8,
    number: 1,
    title: 'Upload Photos',
    body: 'Upload your laundry bag photo and garment photos under their respective services.',
    panel: 'upload' as const,
  },
  {
    key: 'pickup',
    layout: 'imageFirstEnd' as const,
    rowGap: 17,
    number: 2,
    title: 'Hassle-Free Pickup',
    body: 'Our pickup partner collects your laundry from your selected location—no in-person handover needed.',
    panel: 'pickup' as const,
  },
  {
    key: 'sort',
    layout: 'textFirst' as const,
    rowGap: 12,
    number: 3,
    title: 'We Sort & Process',
    body: 'Our laundry team uses your photos to sort garments by service and process them accordingly.',
    panel: 'sort' as const,
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
            <ContactlessModalBackgroundArcs scale={scale} />

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
                    rowGap={step.rowGap}
                    number={step.number}
                    title={step.title}
                    body={step.body}
                    panel={step.panel}
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
  rowGap,
  number,
  title,
  body,
  panel,
}: {
  scale: number;
  textColWidth: number;
  layout: 'textFirst' | 'imageFirstEnd';
  rowGap: number;
  number: number;
  title: string;
  body: string;
  panel: 'upload' | 'pickup' | 'sort';
}) {
  const textBlock = (
    <View style={{ width: textColWidth, gap: 8 * scale }}>
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

  const numberBadge = <StepNumberBadge number={number} scale={scale} />;
  const illustration = <ContactlessWorkflowPanel variant={panel} scale={scale} />;

  if (layout === 'imageFirstEnd') {
    return (
      <View
        style={[
          styles.stepRow,
          {
            gap: rowGap * scale,
            justifyContent: 'flex-end',
          },
        ]}>
        {illustration}
        <View style={[styles.stepTextCluster, { gap: 16 * scale }]}>
          {numberBadge}
          {textBlock}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.stepRow, { gap: rowGap * scale }]}>
      <View style={[styles.stepTextCluster, { gap: 0, flexShrink: 1 }]}>
        {textBlock}
        {numberBadge}
      </View>
      {illustration}
    </View>
  );
}

function StepNumberBadge({ number, scale }: { number: number; scale: number }) {
  const size = 20 * scale;
  return (
    <View
      style={{
        width: size,
        minHeight: size,
        borderRadius: 16 * scale,
        borderWidth: 1,
        borderColor: SwashoColors.primary600,
        backgroundColor: SwashoColors.surface,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text
        style={[
          searchFont('semibold'),
          styles.stepNumber,
          { fontSize: 15 * scale, lineHeight: 20 * scale, letterSpacing: 0.2 * scale },
        ]}>
        {number}
      </Text>
    </View>
  );
}

/** Decorative capsule arcs behind steps (Figma 59121:3490–3493, 59121:3491). */
function ContactlessModalBackgroundArcs({ scale }: { scale: number }) {
  const arcHeight = 122 * scale;
  const arcStyle = {
    height: arcHeight,
    borderWidth: 1,
    borderColor: SwashoColors.primary600,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 60 * scale,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 60 * scale,
    overflow: 'hidden' as const,
  };

  return (
    <View
      style={{
        ...StyleSheet.absoluteFill,
        overflow: 'hidden',
      }}
      pointerEvents="none">
      <LinearGradient
        colors={['rgba(233, 232, 255, 0.11)', 'rgba(213, 212, 255, 0.11)']}
        start={{ x: 0.425, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[
          arcStyle,
          {
            position: 'absolute',
            width: 225.32 * scale,
            left: 210.68 * scale,
            top: 71 * scale,
            transform: [{ scaleY: -1 }, { rotate: '180deg' }],
          },
        ]}
      />
      <LinearGradient
        colors={['rgba(233, 232, 255, 0.11)', 'rgba(213, 212, 255, 0.11)']}
        start={{ x: 0.425, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[
          arcStyle,
          {
            position: 'absolute',
            width: 225.32 * scale,
            left: 210.68 * scale,
            top: 355.14 * scale,
            transform: [{ scaleY: -1 }, { rotate: '180deg' }],
          },
        ]}
      />
      <LinearGradient
        colors={['rgba(233, 232, 255, 0.11)', 'rgba(213, 212, 255, 0.11)']}
        start={{ x: 0.425, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[
          arcStyle,
          {
            position: 'absolute',
            width: 237.169 * scale,
            left: -69.17 * scale,
            top: 211.81 * scale,
          },
        ]}
      />
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
  },
  stepTextCluster: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepTitle: {
    color: SwashoColors.neutral800,
  },
  stepBody: {
    color: SwashoColors.neutral600,
  },
  stepNumber: {
    color: SwashoColors.primary600,
    textAlign: 'center',
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
