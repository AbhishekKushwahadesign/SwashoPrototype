import { Modal, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { searchFont } from '@/components/search/search-fonts';
import { ServiceSelectionButton } from '@/components/service-selection/ServiceSelectionButton';
import { SheetCloseIcon } from '@/components/service-selection/service-selection-icons';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import {
  CONTACTLESS_WORKFLOW_ARC_STROKE,
  CONTACTLESS_WORKFLOW_STEPS_SLOT_EXTRA,
  ContactlessWorkflowPanel,
  type ContactlessWorkflowPanelVariant,
} from './contactless-workflow-panel';

const STEPS_BLOCK_HEIGHT = 399.612_060_546_875;
/** Top padding for step 1 arc; extra bottom for step 3 D-arc + 60px corner stroke. */
const STEPS_ARC_PADDING_TOP = 7;
const STEPS_ARC_PADDING_BOTTOM = 28;

/** Figma 59136:3392 — Contactless Modal 59127:5994 (412×686), Sheet 59119:3332 (412×664.612 + arc bleed). */
const CONTACTLESS_MODAL_FIGMA = {
  frameWidth: 412,
  modalFrameHeight: 686 + CONTACTLESS_WORKFLOW_STEPS_SLOT_EXTRA,
  sheetHorizontalInset: 8,
  headerHeight: 72,
  stepsBlockHeight: STEPS_BLOCK_HEIGHT,
  stepsPanelSlotExtra: CONTACTLESS_WORKFLOW_STEPS_SLOT_EXTRA,
  stepsArcPaddingTop: STEPS_ARC_PADDING_TOP,
  stepsArcPaddingBottom: STEPS_ARC_PADDING_BOTTOM,
  /** Setup sheet includes reassurance + hint + Continue (59132:3334 height 137). */
  sheetHeightSetup:
    72 +
    STEPS_BLOCK_HEIGHT +
    CONTACTLESS_WORKFLOW_STEPS_SLOT_EXTRA +
    STEPS_ARC_PADDING_TOP +
    STEPS_ARC_PADDING_BOTTOM +
    36 +
    137 +
    20,
  /** Info sheet: reassurance only in footer. */
  sheetHeightInfo:
    72 +
    STEPS_BLOCK_HEIGHT +
    CONTACTLESS_WORKFLOW_STEPS_SLOT_EXTRA +
    STEPS_ARC_PADDING_TOP +
    STEPS_ARC_PADDING_BOTTOM +
    36 +
    58 +
    20,
  stepsToFooterGap: 36,
  footerSetupHeight: 137,
  footerInfoHeight: 58,
  reassuranceToHintGap: 12,
  hintToContinueGap: 2,
  continueButtonHeight: 45,
  contentPaddingBottom: 20,
  contentPaddingHorizontal: 16,
} as const;

/** Figma 59138:3993 — hint above Continue on setup sheet. */
export const CONTACTLESS_SETUP_CONTINUE_HINT = 'next, confirm clothes location for pickup';

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
  continueHint = CONTACTLESS_SETUP_CONTINUE_HINT,
}: ContactlessHowItWorksModalProps) {
  const insets = useSafeAreaInsets();
  const designScale = contentWidth / CONTACTLESS_MODAL_FIGMA.frameWidth;
  const sheetHeightDesign = showContinue
    ? CONTACTLESS_MODAL_FIGMA.sheetHeightSetup
    : CONTACTLESS_MODAL_FIGMA.sheetHeightInfo;
  const sheetHeight = sheetHeightDesign * designScale;
  const textColWidth = 185 * designScale;
  const webOverflowVisible = Platform.OS === 'web' ? ('visible' as const) : undefined;

  const footerBlock = (
    <View
      style={{
        width: '100%',
        paddingHorizontal: CONTACTLESS_MODAL_FIGMA.contentPaddingHorizontal * designScale,
        paddingBottom: CONTACTLESS_MODAL_FIGMA.contentPaddingBottom * designScale,
        paddingTop: CONTACTLESS_MODAL_FIGMA.stepsToFooterGap * designScale,
        backgroundColor: SwashoColors.surface,
        flexShrink: 0,
        minHeight:
          (showContinue
            ? CONTACTLESS_MODAL_FIGMA.footerSetupHeight
            : CONTACTLESS_MODAL_FIGMA.footerInfoHeight) * designScale,
      }}>
      <View
        style={[
          styles.reassuranceBox,
          {
            borderRadius: SwashoRadii.md * designScale,
            paddingHorizontal: 12 * designScale,
            paddingVertical: 8 * designScale,
          },
        ]}>
        <Text
          style={[
            searchFont('medium'),
            styles.reassuranceText,
            { fontSize: 13 * designScale, lineHeight: 20 * designScale },
          ]}>
          {REASSURANCE}
        </Text>
      </View>

      {showContinue ? (
        <View
          style={{
            marginTop: CONTACTLESS_MODAL_FIGMA.reassuranceToHintGap * designScale,
            gap: CONTACTLESS_MODAL_FIGMA.hintToContinueGap * designScale,
          }}>
          {continueHint ? (
            <Text
              style={[
                searchFont('medium'),
                styles.continueHint,
                {
                  fontSize: 13 * designScale,
                  lineHeight: 20 * designScale,
                  letterSpacing: 0.5 * designScale,
                  textAlign: 'center',
                },
              ]}>
              {continueHint}
            </Text>
          ) : null}
          <ServiceSelectionButton
            label="Continue"
            variant="primary"
            onPress={onContinue ?? onClose}
            scale={scale}
            style={{
              width: '100%',
              minHeight: CONTACTLESS_MODAL_FIGMA.continueButtonHeight * designScale,
            }}
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
            { width: contentWidth, paddingBottom: Math.max(insets.bottom, 12 * designScale) },
          ]}
          pointerEvents="box-none">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={onClose}
            style={[
              styles.closeChip,
              {
                width: 35 * designScale,
                height: 35 * designScale,
                borderRadius: 999,
                marginBottom: 8 * designScale,
              },
            ]}>
            <SheetCloseIcon width={20 * designScale} height={20 * designScale} />
          </Pressable>

          <View
            style={[
              styles.sheet,
              {
                width: contentWidth,
                minHeight: sheetHeight,
                borderTopLeftRadius: SwashoRadii.xl * designScale,
                borderTopRightRadius: SwashoRadii.xl * designScale,
                overflow: webOverflowVisible,
              },
            ]}>
            <View
              style={{
                height: CONTACTLESS_MODAL_FIGMA.headerHeight * designScale,
                paddingTop: 24 * designScale,
                paddingBottom: 16 * designScale,
                paddingHorizontal: CONTACTLESS_MODAL_FIGMA.contentPaddingHorizontal * designScale,
                justifyContent: 'flex-start',
                flexShrink: 0,
              }}>
              <Text
                style={[
                  searchFont('semibold'),
                  styles.title,
                  {
                    fontSize: 18 * designScale,
                    lineHeight: 24 * designScale,
                    letterSpacing: 0.3 * designScale,
                  },
                ]}>
                How Contactless Service Works
              </Text>
            </View>

            <View
              style={{
                paddingHorizontal: CONTACTLESS_MODAL_FIGMA.contentPaddingHorizontal * designScale,
                paddingTop: CONTACTLESS_MODAL_FIGMA.stepsArcPaddingTop * designScale,
                paddingBottom: CONTACTLESS_MODAL_FIGMA.stepsArcPaddingBottom * designScale,
                minHeight:
                  (CONTACTLESS_MODAL_FIGMA.stepsBlockHeight +
                    CONTACTLESS_MODAL_FIGMA.stepsPanelSlotExtra +
                    CONTACTLESS_MODAL_FIGMA.stepsArcPaddingTop +
                    CONTACTLESS_MODAL_FIGMA.stepsArcPaddingBottom) *
                  designScale,
                flexShrink: 0,
                overflow: webOverflowVisible ?? 'visible',
              }}>
              <View
                style={[
                  styles.stepsStage,
                  {
                    minHeight:
                      (CONTACTLESS_MODAL_FIGMA.stepsBlockHeight +
                        CONTACTLESS_MODAL_FIGMA.stepsPanelSlotExtra) *
                      designScale,
                    overflow: webOverflowVisible ?? 'visible',
                  },
                ]}>
                <View
                  style={{
                    gap: 28 * designScale,
                    width: '100%',
                    overflow: webOverflowVisible ?? 'visible',
                  }}>
                  {STEPS.map((step) => (
                    <ContactlessStepRow
                      key={step.key}
                      scale={designScale}
                      textColWidth={textColWidth}
                      variant={step.variant}
                      rowGap={step.rowGap}
                      number={step.number}
                      title={step.title}
                      body={step.body}
                      panel={step.panel}
                      sortArcTailPad={step.panel === 'sort' ? 6 * designScale : 0}
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
  sortArcTailPad = 0,
}: {
  scale: number;
  textColWidth: number;
  variant: 'textLeading' | 'textTrailing';
  rowGap: number;
  number: number;
  title: string;
  body: string;
  panel: ContactlessWorkflowPanelVariant;
  sortArcTailPad?: number;
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
    <View
      style={[
        styles.stepRow,
        { gap: rowGap * scale, paddingBottom: sortArcTailPad, overflow: 'visible' },
      ]}>
      <View style={[styles.copyCluster, { width: 205 * scale }]}>
        {textBlock}
        {badge}
      </View>
      <View style={{ flex: 1, minWidth: rowGap * scale }} />
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
        height: size,
        borderRadius: size / 2,
        borderWidth: 1,
        borderColor: CONTACTLESS_WORKFLOW_ARC_STROKE,
        backgroundColor: SwashoColors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        alignSelf: 'center',
      }}>
      <Text
        style={[
          searchFont('semibold'),
          styles.stepNumber,
          {
            fontSize: 15 * scale,
            lineHeight: 15 * scale,
            letterSpacing: 0.2 * scale,
            textAlign: 'center',
          },
        ]}>
        {number}
      </Text>
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
    ...(Platform.OS === 'web' ? { overflow: 'visible' as const } : null),
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
  },
  title: {
    color: SwashoColors.neutral700,
    textAlign: 'left',
  },
  stepRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'visible',
  },
  copyCluster: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
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
