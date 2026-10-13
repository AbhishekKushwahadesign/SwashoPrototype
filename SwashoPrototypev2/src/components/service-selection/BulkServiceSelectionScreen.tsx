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
  formatBulkLoadSummaryLine,
  getBulkWeightLabelForTier,
  resolveBulkLoadTier,
  type BulkLoadTierId,
} from '@/lib/bulk-load-tiers';
import type { ProviderGarmentCartSelection } from '@/lib/provider-cart-selection';

import { BulkLoadPileIllustration } from './BulkLoadPileIllustration';
import { ServiceRadio } from './ServiceRadio';
import { ServiceSelectionStickyBar } from './ServiceSelectionStickyBar';
import { ServiceSheetTitle } from './ServiceSheetTitle';
import { SheetCloseIcon } from './service-selection-icons';

const SCALE_ICON_XML = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M4 16H16V17H4V16Z" fill="${SwashoColors.neutral600}"/>
<path d="M6 14L10 4L14 14H6Z" stroke="${SwashoColors.primary600}" stroke-width="1.5" stroke-linejoin="round"/>
<path d="M3 16H17" stroke="${SwashoColors.neutral600}" stroke-width="1.5" stroke-linecap="round"/>
<circle cx="10" cy="15" r="1.5" fill="${SwashoColors.primary600}"/>
</svg>`;

type BulkServiceSelectionScreenProps = {
  serviceId: string;
  providerId?: string;
  query?: string;
  initialSelection?: ProviderGarmentCartSelection;
  onConfirm: (selection: ProviderGarmentCartSelection) => void;
  onClose: () => void;
};

function BulkWeightAssurancePanel({ scale }: { scale: number }) {
  return (
    <View
      style={[
        styles.infoPanel,
        {
          borderRadius: SwashoRadii.md * scale,
          padding: 12 * scale,
          gap: 8 * scale,
        },
      ]}>
      <View style={[styles.infoHeader, { gap: 8 * scale }]}>
        <SvgXml xml={SCALE_ICON_XML} width={20 * scale} height={20 * scale} />
        <Text
          style={[
            searchFont('semibold'),
            styles.infoTitle,
            { fontSize: 13 * scale, lineHeight: 18 * scale, letterSpacing: 0.3 * scale, flex: 1 },
          ]}>
          Your final weight is confirmed at pickup
        </Text>
      </View>
      <Text
        style={[
          searchFont('medium'),
          styles.infoBody,
          { fontSize: 12 * scale, lineHeight: 18 * scale, letterSpacing: 0.3 * scale },
        ]}>
        These are estimates only. Our pickup partner will weigh your laundry and confirm the actual weight
        for accurate billing before processing.
      </Text>
    </View>
  );
}

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
        <Text
          style={[
            searchFont('medium'),
            styles.optionHint,
            { fontSize: 11 * scale, lineHeight: 14 * scale, letterSpacing: 0.3 * scale },
          ]}>
          Rough guidance — not an exact weight
        </Text>
      </View>
      <ServiceRadio selected={selected} onSelect={onSelect} scale={scale} />
    </Pressable>
  );
}

export function BulkServiceSelectionScreen({
  serviceId,
  providerId,
  query,
  initialSelection,
  onConfirm,
  onClose,
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

  const stickyMetrics = useMemo(() => {
    if (!selectedTier) {
      return { count: 0, total: undefined as number | undefined, summaryLine: undefined };
    }
    return {
      count: 1,
      total: estimateBulkPriceForTier(selectedTier),
      summaryLine: formatBulkLoadSummaryLine(selectedTier),
    };
  }, [selectedTier]);

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
              height: sheetMaxHeight,
              maxHeight: sheetMaxHeight,
              borderTopLeftRadius: SwashoRadii.xl * scale,
              borderTopRightRadius: SwashoRadii.xl * scale,
              paddingTop: 24 * scale,
              paddingBottom: 0,
              gap: 16 * scale,
            },
          ]}>
          <ServiceSheetTitle garmentLabel={sheetTitle} showOfferBadge={false} scale={scale} />

          <ScrollView
            style={[styles.scroll, Platform.OS === 'web' ? styles.scrollWeb : null]}
            contentContainerStyle={{
              gap: 12 * scale,
              paddingHorizontal: 16 * scale,
              paddingBottom: 16 * scale,
            }}
            showsVerticalScrollIndicator={false}>
            <Text
              style={[
                searchFont('medium'),
                styles.lead,
                { fontSize: 13 * scale, lineHeight: 20 * scale, letterSpacing: 0.5 * scale },
              ]}>
              Pick the pile that best matches your laundry — no scale needed.
            </Text>

            {BULK_LOAD_TIERS.map((tier) => (
              <BulkLoadOptionRow
                key={tier.id}
                tierId={tier.id}
                selected={selectedTier === tier.id}
                onSelect={() => setSelectedTier(tier.id)}
                scale={scale}
              />
            ))}

            <BulkWeightAssurancePanel scale={scale} />
          </ScrollView>

          <View style={[styles.sheetFooter, { paddingBottom: 20 * scale }]}>
            <ServiceSelectionStickyBar
              itemCount={stickyMetrics.count}
              itemLabel="load"
              summaryLine={stickyMetrics.summaryLine}
              totalPrice={stickyMetrics.total}
              confirmLabel="Confirm"
              onConfirm={handleConfirmPress}
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
  closeChip: {
    backgroundColor: 'rgba(236, 236, 236, 0.92)',
    alignItems: 'center',
    justifyContent: 'center',
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
  lead: {
    color: SwashoColors.neutral600,
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
    color: SwashoColors.neutral950,
  },
  optionWeight: {
    color: SwashoColors.neutral800,
  },
  optionGarments: {
    color: SwashoColors.neutral600,
  },
  optionHint: {
    color: SwashoColors.neutral500,
  },
  infoPanel: {
    backgroundColor: SwashoColors.neutral50,
    borderWidth: 1,
    borderColor: SwashoColors.neutral200,
    width: '100%',
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoTitle: {
    color: SwashoColors.neutral800,
  },
  infoBody: {
    color: SwashoColors.neutral600,
  },
});
