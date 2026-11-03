import { useCallback, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';

import { ProviderPageModalShell } from '@/components/common/ProviderPageModalShell';
import { useScreenScale } from '@/components/home/scale';
import { searchFont } from '@/components/search/search-fonts';
import { getProviderBulkService } from '@/data/providers';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';
import {
  BULK_LOAD_TIERS,
  estimateBulkPriceForTier,
  getBulkServiceRatePerKg,
  formatBulkStickySubtitle,
  getBulkLoadTierById,
  getBulkWeightLabelForTier,
  resolveBulkLoadTier,
  type BulkLoadTierId,
} from '@/lib/bulk-load-tiers';
import type { ProviderGarmentCartSelection } from '@/lib/provider-cart-selection';

import {
  BULK_LOAD_RADIO_SELECTED_XML,
  BULK_LOAD_RADIO_UNSELECTED_XML,
} from './bulk-load-icons';
import { BulkInfoCardsCarousel } from './BulkInfoCardsCarousel';
import { BulkLoadPileIllustration } from './BulkLoadPileIllustration';
import { ServiceSelectionButton } from './ServiceSelectionButton';
import { ServiceSheetTitle } from './ServiceSheetTitle';
import { ServiceSelectionSheetChrome } from './ServiceSelectionSheetChrome';
import { ServiceSelectionStickyDeleteButton } from './ServiceSelectionStickyDeleteButton';

const BULK_SUBTITLE = 'Choose the pile that looks closest to yours. No weighing needed';

type BulkServiceSelectionScreenProps = {
  serviceId: string;
  providerId?: string;
  query?: string;
  initialSelection?: ProviderGarmentCartSelection;
  onConfirm: (selection: ProviderGarmentCartSelection) => void;
  onClose: () => void;
  onDelete: () => void;
};

function BulkLoadOptionRow({
  tierId,
  selected,
  onSelect,
  scale,
}: {
  tierId: BulkLoadTierId;
  selected: boolean;
  onSelect: () => void;
  scale: number;
}) {
  const tier = BULK_LOAD_TIERS.find((entry) => entry.id === tierId)!;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onSelect}
      style={[
        styles.optionRow,
        selected && styles.optionRowSelected,
        {
          borderRadius: SwashoRadii.md * scale,
          paddingHorizontal: 12 * scale,
          paddingVertical: 12 * scale,
          gap: 12 * scale,
        },
      ]}>
      <BulkLoadPileIllustration tier={tierId} scale={scale} />
      <View style={[styles.optionCopy, { gap: 4 * scale, flex: 1 }]}>
        <Text
          style={[
            searchFont('semibold'),
            styles.optionTitle,
            { fontSize: 15 * scale, lineHeight: 18 * scale, letterSpacing: 0.3 * scale },
          ]}>
          {tier.title}
        </Text>
        <Text
          style={[
            searchFont('semibold'),
            styles.optionWeight,
            { fontSize: 13 * scale, lineHeight: 18 * scale, letterSpacing: 0.3 * scale },
          ]}>
          {tier.weightSummary}
        </Text>
        <Text
          style={[
            searchFont('medium'),
            styles.optionGarments,
            { fontSize: 12 * scale, lineHeight: 16 * scale, letterSpacing: 0.3 * scale },
          ]}>
          {tier.garmentGuidance}
        </Text>
      </View>
      <SvgXml
        xml={selected ? BULK_LOAD_RADIO_SELECTED_XML : BULK_LOAD_RADIO_UNSELECTED_XML}
        width={20 * scale}
        height={20 * scale}
      />
    </Pressable>
  );
}

function BulkLoadStickyFooter({
  tierId,
  totalPrice,
  disabled,
  onConfirm,
  onDelete,
  scale,
}: {
  tierId: BulkLoadTierId | null;
  totalPrice?: number;
  disabled: boolean;
  onConfirm: () => void;
  onDelete: () => void;
  scale: number;
}) {
  const confirmLabel =
    totalPrice != null ? `₹${totalPrice}* | Confirm` : 'Confirm';
  const sizeLine = tierId ? getBulkLoadTierById(tierId).title : 'Size';
  const weightLine = tierId ? formatBulkStickySubtitle(tierId) : 'Est. Weight';

  return (
    <View
      style={[
        styles.stickyFooter,
        {
          paddingHorizontal: 16 * scale,
          paddingVertical: 8 * scale,
          gap: 22 * scale,
        },
      ]}>
      <ServiceSelectionStickyDeleteButton scale={scale} onPress={onDelete} />
      <View style={[styles.stickyFooterMain, { gap: 12 * scale }]}>
      <View style={[styles.stickySummary, { gap: 4 * scale }]}>
        <Text
          style={[
            searchFont('semibold'),
            styles.stickyTitle,
            { fontSize: 15 * scale, lineHeight: 14 * scale, letterSpacing: 0.3 * scale },
          ]}>
          {sizeLine}
        </Text>
        <Text
          style={[
            searchFont('semibold'),
            styles.stickySubtitle,
            { fontSize: 14 * scale, lineHeight: 20 * scale },
          ]}>
          {weightLine}
        </Text>
      </View>
      <ServiceSelectionButton
        label={confirmLabel}
        variant="primary"
        disabled={disabled}
        onPress={onConfirm}
        scale={scale}
        style={{ width: 199 * scale, flexShrink: 0 }}
      />
      </View>
    </View>
  );
}

export function BulkServiceSelectionScreen({
  serviceId,
  providerId,
  query,
  initialSelection,
  onConfirm,
  onClose,
  onDelete,
}: BulkServiceSelectionScreenProps) {
  const { scale, contentWidth, contentHeight } = useScreenScale();
  const insets = useSafeAreaInsets();

  const bulkService = useMemo(
    () => getProviderBulkService(serviceId, providerId, query),
    [providerId, query, serviceId],
  );

  const sheetTitle = bulkService
    ? `Choose load size for ${bulkService.name}`
    : 'Choose load size';

  const [selectedTier, setSelectedTier] = useState<BulkLoadTierId | null>(() => {
    const resolved = initialSelection ? resolveBulkLoadTier(initialSelection) : undefined;
    return resolved ?? null;
  });

  const ratePerKg = getBulkServiceRatePerKg(serviceId);
  const totalPrice = selectedTier ? estimateBulkPriceForTier(selectedTier, ratePerKg) : undefined;

  const handleConfirmPress = useCallback(() => {
    if (!selectedTier) {
      return;
    }
    onConfirm({
      quantities: {},
      savedCombos: [],
      bulkLoadTier: selectedTier,
      bulkWeightLabel: getBulkWeightLabelForTier(selectedTier),
    });
  }, [onConfirm, selectedTier]);

  const sheetMaxHeight = Math.min(contentHeight * 0.92, 640 * scale);

  return (
    <ProviderPageModalShell onDismiss={onClose}>
      <View style={[styles.sheetColumn, { width: contentWidth, paddingBottom: insets.bottom }]}>
        <ServiceSelectionSheetChrome scale={scale} onClose={onClose} />

        <View
          style={[
            styles.sheet,
            {
              width: contentWidth,
              height: sheetMaxHeight,
              maxHeight: sheetMaxHeight,
              borderTopLeftRadius: SwashoRadii.xl * scale,
              borderTopRightRadius: SwashoRadii.xl * scale,
              paddingTop: 24 * scale,
              paddingBottom: 0,
              gap: 16 * scale,
            },
          ]}>
          <ServiceSheetTitle
            garmentLabel={sheetTitle}
            subtitle={BULK_SUBTITLE}
            showOfferBadge={false}
            scale={scale}
          />

          <ScrollView
            style={[styles.scroll, Platform.OS === 'web' ? styles.scrollWeb : null]}
            contentContainerStyle={{
              gap: 16 * scale,
              paddingHorizontal: 16 * scale,
              paddingBottom: 16 * scale,
            }}
            showsVerticalScrollIndicator={false}>
            {BULK_LOAD_TIERS.map((tier) => (
              <BulkLoadOptionRow
                key={tier.id}
                tierId={tier.id}
                selected={selectedTier === tier.id}
                onSelect={() => setSelectedTier(tier.id)}
                scale={scale}
              />
            ))}
          </ScrollView>

          <View style={[styles.sheetFooter, { paddingBottom: 20 * scale }]}>
            <BulkInfoCardsCarousel serviceId={serviceId} scale={scale} contentWidth={contentWidth} />
            <BulkLoadStickyFooter
              tierId={selectedTier}
              totalPrice={totalPrice}
              disabled={!selectedTier}
              onConfirm={handleConfirmPress}
              onDelete={onDelete}
              scale={scale}
            />
          </View>
        </View>
      </View>
    </ProviderPageModalShell>
  );
}

const styles = StyleSheet.create({
  sheetColumn: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  sheet: {
    backgroundColor: SwashoColors.surface,
    overflow: 'hidden',
    flexDirection: 'column',
  },
  scroll: {
    flex: 1,
    minHeight: 0,
  },
  scrollWeb: {
    overflowY: 'auto',
  },
  sheetFooter: {
    width: '100%',
    marginTop: 'auto',
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: SwashoColors.neutral200,
    backgroundColor: SwashoColors.surface,
  },
  optionRowSelected: {
    borderColor: SwashoColors.primary600,
    backgroundColor: SwashoColors.primary50,
  },
  optionCopy: {
    alignItems: 'flex-start',
  },
  optionTitle: {
    color: SwashoColors.neutral800,
  },
  optionWeight: {
    color: SwashoColors.neutral800,
  },
  optionGarments: {
    color: SwashoColors.neutral600,
  },
  stickyFooter: {
    backgroundColor: SwashoColors.surface,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  stickyFooterMain: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'nowrap',
    minWidth: 0,
  },
  stickySummary: {
    flex: 1,
    flexShrink: 1,
    minWidth: 0,
    justifyContent: 'center',
  },
  stickyTitle: {
    color: SwashoColors.darkHeaderText,
  },
  stickySubtitle: {
    color: SwashoColors.neutral600,
  },
});
