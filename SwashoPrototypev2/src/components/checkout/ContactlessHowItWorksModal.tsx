import { LinearGradient } from 'expo-linear-gradient';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { searchFont } from '@/components/search/search-fonts';
import { ServiceSelectionButton } from '@/components/service-selection/ServiceSelectionButton';
import { SheetCloseIcon } from '@/components/service-selection/service-selection-icons';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { ContactlessWorkflowPanel, type ContactlessWorkflowPanelVariant } from './contactless-workflow-panel';

/** Figma 59136:3392 — Contactless Modal 59127:5994 (412×686), Sheet 59119:3332 (412×642.612). */
const CONTACTLESS_MODAL_FIGMA = {
  frameWidth: 412,
  frameHeight: 686,
  sheetHeight: 642.612_060_546_875,
  sheetHorizontalInset: 8,
  headerHeight: 72,
  stepsBlockHeight: 399.612_060_546_875,
  stepsToFooterGap: 36,
  footerBlockHeight: 115,
  contentPaddingBottom: 20,
  contentPaddingHorizontal: 16,
  /** Sheet-absolute arc anchors (412px-wide sheet). */
  arcs: {
    right: { left: 444.5, width: 225.320_312_5, tops: [71, 355.140_625] as const },
    left: { left: -60.668_945_312_5, width: 237.168_945_312_5, top: 211.805_908_203_125 },
    height: 122,
  },
} as const;

const SHEET_CONTENT_TOP = CONTACTLESS_MODAL_FIGMA.headerHeight;

const STEPS: {
  key: string;
  variant: 'textLeading' | 'textTrailing';
  rowGap: number;
  number: number;
  title: string;
  body: string;
  panel: ContactlessWorkflowPanelVariant;
}[] = [
  {
    key: 'upload',
    variant: 'textLeading',
    rowGap: 8,
    number: 1,
    title: 'Upload Photos',
    body: 'Upload your laundry bag photo and garment photos under their respective services.',
    panel: 'upload',
  },
  {
    key: 'pickup',
    variant: 'textTrailing',
    rowGap: 17,
    number: 2,
    title: 'Hassle-Free Pickup',
    body: 'Our pickup partner collects your laundry from your selected location—no in-person handover needed.',
    panel: 'pickup',
  },
  {
    key: 'sort',
    variant: 'textLeading',
    rowGap: 12,
    number: 3,
    title: 'We Sort & Process',
    body: 'Our laundry team uses your photos to sort garments by service and process them accordingly.',
    panel: 'sort',
  },
];

const REASSURANCE = 'Your convenience, your schedule - no waiting for a pickup handover.';

type ContactlessHowItWorksModalProps = {
  visible: boolean;
  onClose: () => void;
  scale: number;
  contentWidth: number;
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
  const setupHintHeight = showContinue && continueHint ? 22 * scale : 0;
  const sheetMinHeight = CONTACTLESS_MODAL_FIGMA.sheetHeight * scale + setupHintHeight;
  const textColWidth = 185 * scale;

  const footerBlock = (
    <View
      style={{
        width: '100%',
        paddingHorizontal: 16 * scale,
        paddingBottom: CONTACTLESS_MODAL_FIGMA.contentPaddingBottom * scale,
        paddingTop: CONTACTLESS_MODAL_FIGMA.stepsToFooterGap * scale,
        gap: 4 * scale,
        backgroundColor: SwashoColors.surface,
      }}>
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

      {showContinue && continueHint ? (
        <Text
          style={[
            searchFont('regular'),
            styles.continueHint,
            { fontSize: 12 * scale, lineHeight: 18 * scale },
          ]}>
          {continueHint}
        </Text>
      ) : null}

      {showContinue ? (
        <View style={{ width: '100%', paddingTop: 8 * scale }}>
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
                minHeight: sheetMinHeight,
                borderTopLeftRadius: SwashoRadii.xl * scale,
                borderTopRightRadius: SwashoRadii.xl * scale,
              },
            ]}>
            <View
              style={{
                height: CONTACTLESS_MODAL_FIGMA.headerHeight * scale,
                paddingTop: 24 * scale,
                paddingBottom: 16 * scale,
                paddingHorizontal: CONTACTLESS_MODAL_FIGMA.contentPaddingHorizontal * scale,
                justifyContent: 'flex-start',
              }}>
              <Text
                style={[
                  searchFont('semibold'),
                  styles.title,
                  {
                    fontSize: 18 * scale,
                    lineHeight: 24 * scale,
                    letterSpacing: 0.3 * scale,
                  },
                ]}>
                How Contactless Service Works
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: CONTACTLESS_MODAL_FIGMA.contentPaddingHorizontal * scale,
                flexShrink: 0,
              }}>
              <View
                style={[
                  styles.stepsStage,
                  { minHeight: CONTACTLESS_MODAL_FIGMA.stepsBlockHeight * scale },
                ]}>
                <ContactlessModalBackgroundArcs scale={scale} contentWidth={contentWidth} />
                <View style={{ gap: 28 * scale, width: '100%' }}>
                  {STEPS.map((step) => (
                    <ContactlessStepRow
                      key={step.key}
                      scale={scale}
                      textColWidth={textColWidth}
                      variant={step.variant}
                      rowGap={step.rowGap}
                      number={step.number}
                      title={step.title}
                      body={step.body}
                      panel={step.panel}
                    />
                  ))}
                </View>
              </View>
            </View>

            {footerBlock}
          </View>
        </View>
      </View>
    </Modal>
  );
}

function ContactlessStepRow({
  scale,
  textColWidth,
  variant,
  rowGap,
  number,
  title,
  body,
  panel,
}: {
  scale: number;
  textColWidth: number;
  variant: 'textLeading' | 'textTrailing';
  rowGap: number;
  number: number;
  title: string;
  body: string;
  panel: ContactlessWorkflowPanelVariant;
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

  const badge = <StepNumberBadge number={number} scale={scale} />;
  const illustration = <ContactlessWorkflowPanel variant={panel} scale={scale} />;

  if (variant === 'textTrailing') {
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
        <View style={[styles.copyCluster, { gap: 16 * scale }]}>
          {badge}
          {textBlock}
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.stepRow, { gap: rowGap * scale }]}>
      <View style={styles.copyCluster}>
        {textBlock}
        {badge}
      </View>
      <View style={styles.stepRowSpacer} />
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
        flexShrink: 0,
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

/** Figma 59121:3490, 59121:3493, 59121:3491 — sheet-absolute coords (412px checkout frame). */
function ContactlessModalBackgroundArcs({ scale, contentWidth }: { scale: number; contentWidth: number }) {
  const { arcs } = CONTACTLESS_MODAL_FIGMA;
  const designScale = contentWidth / CONTACTLESS_MODAL_FIGMA.frameWidth;
  const arcHeight = arcs.height * designScale;
  const arcShell = {
    height: arcHeight,
    borderWidth: 1,
    borderColor: SwashoColors.primary600,
    overflow: 'hidden' as const,
  };

  const arcTop = (sheetTop: number) => (sheetTop - SHEET_CONTENT_TOP) * designScale;
  const arcLeftFromStage = (sheetX: number) =>
    (sheetX - CONTACTLESS_MODAL_FIGMA.sheetHorizontalInset - CONTACTLESS_MODAL_FIGMA.contentPaddingHorizontal) *
    designScale;

  return (
    <View
      style={[StyleSheet.absoluteFill, { overflow: 'visible' }]}
      pointerEvents="none">
      {arcs.right.tops.map((top) => (
        <LinearGradient
          key={`right-${top}`}
          colors={['rgba(233, 232, 255, 0.11)', 'rgba(213, 212, 255, 0.11)']}
          start={{ x: 0.425, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[
            arcShell,
            {
              position: 'absolute',
              width: arcs.right.width * designScale,
              left: arcLeftFromStage(arcs.right.left),
              top: arcTop(top),
              borderTopRightRadius: 60 * designScale,
              borderBottomRightRadius: 60 * designScale,
              transform: [{ scaleY: -1 }, { rotate: '180deg' }],
            },
          ]}
        />
      ))}
      <LinearGradient
        colors={['rgba(233, 232, 255, 0.11)', 'rgba(213, 212, 255, 0.11)']}
        start={{ x: 0.425, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        style={[
          arcShell,
          {
            position: 'absolute',
            width: arcs.left.width * designScale,
            left: arcLeftFromStage(arcs.left.left),
            top: arcTop(arcs.left.top),
            borderTopRightRadius: 60 * designScale,
            borderBottomRightRadius: 60 * designScale,
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
    overflow: 'visible',
    flexDirection: 'column',
  },
  stepsStage: {
    position: 'relative',
    width: '100%',
    overflow: 'visible',
  },
  title: {
    color: SwashoColors.neutral700,
    textAlign: 'left',
  },
  stepRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  copyCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  stepRowSpacer: {
    flex: 1,
    minWidth: 0,
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
