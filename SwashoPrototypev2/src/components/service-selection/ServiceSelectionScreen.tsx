import { useCallback, useMemo, useState } from 'react';
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type LayoutChangeEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useScreenScale } from '@/components/home/scale';
import { getProviderResultById } from '@/data/providers';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { CreateComboSelectPanel } from './CreateComboSelectPanel';
import {
  SERVICE_SELECTION_CATALOG,
  getCatalogOptionById,
  type ServiceCatalogOption,
} from './service-selection-catalog';
import { ServiceComboDetailCard } from './ServiceComboDetailCard';
import { ServiceGarmentRow } from './ServiceGarmentRow';
import { ServiceInstructionText } from './ServiceInstructionText';
import { ServiceModeTabs, type ServiceMode } from './ServiceModeTabs';
import { ServiceRowDivider } from './ServiceRowDivider';
import { ServiceSelectionButton } from './ServiceSelectionButton';
import { ServiceSelectionCard } from './ServiceSelectionCard';
import { ServiceSelectionStickyBar } from './ServiceSelectionStickyBar';
import { ServiceSheetTitle } from './ServiceSheetTitle';
import {
  countMultiGarmentItems,
  countSingleGarmentItems,
  formatSingleMultiSummary,
} from './service-selection-assignment-counts';
import {
  formatComboLabel,
  getComboGarmentQuantity,
  sumComboUnitAmount,
} from './service-selection-combo';
import { SheetCloseIcon } from './service-selection-icons';

type ComboLineItem = {
  optionId: string;
  title: string;
  amount: number;
  quantity: number;
};

type SavedCombo = {
  id: string;
  title: string;
  items: ComboLineItem[];
};

type ServiceSelectionScreenProps = {
  serviceId: string;
  providerId?: string;
  query?: string;
  onClose: () => void;
};

type MultiFlow = 'create' | 'list';

function resolveRowAddMode(
  flowMode: ServiceMode,
  catalogAddMode: 'add' | 'select' | undefined,
): 'add' | 'select' | 'tertiary' {
  if (flowMode === 'multi') {
    return catalogAddMode === 'select' ? 'select' : 'add';
  }
  if (catalogAddMode === 'select') {
    return 'add';
  }
  return catalogAddMode ?? 'add';
}

function resolveGarmentLabel(serviceId: string, providerId?: string, query?: string) {
  const provider = providerId ? getProviderResultById(providerId, query ?? '') : undefined;
  if (provider?.serviceSections) {
    for (const section of provider.serviceSections) {
      const match = section.items.find((item) => item.id === serviceId);
      if (match) {
        return `Choose services for ${match.name.toLowerCase()}(cotton)`;
      }
    }
  }
  if (serviceId.includes('shirt')) {
    return 'Choose services for shirt(cotton)';
  }
  return 'Choose services for garment';
}

function garmentInstruction(serviceId: string) {
  const noun = serviceId.includes('trouser')
    ? 'trouser'
    : serviceId.includes('jeans')
      ? 'jeans'
      : serviceId.includes('tshirt')
        ? 't-shirt'
        : 'shirt';
  return `Add quantity of ${noun}`;
}

export function ServiceSelectionScreen({
  serviceId,
  providerId,
  query,
  onClose,
}: ServiceSelectionScreenProps) {
  const { scale, contentWidth, contentHeight } = useScreenScale();
  const insets = useSafeAreaInsets();
  const garmentLabel = useMemo(
    () => resolveGarmentLabel(serviceId, providerId, query),
    [providerId, query, serviceId],
  );

  const [mode, setMode] = useState<ServiceMode>('single');
  const [multiFlow, setMultiFlow] = useState<MultiFlow>('list');
  const [sectionExpanded, setSectionExpanded] = useState<Record<string, boolean>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [comboDraftIds, setComboDraftIds] = useState<string[]>([]);
  const [savedCombos, setSavedCombos] = useState<SavedCombo[]>([]);
  const [stickyBarHeight, setStickyBarHeight] = useState(0);

  const isSectionExpanded = useCallback(
    (sectionId: string) => sectionExpanded[sectionId] ?? true,
    [sectionExpanded],
  );

  const toggleSection = useCallback((sectionId: string) => {
    setSectionExpanded((prev) => ({
      ...prev,
      [sectionId]: !(prev[sectionId] ?? true),
    }));
  }, []);

  const incrementQuantity = useCallback((optionId: string) => {
    setQuantities((prev) => ({ ...prev, [optionId]: (prev[optionId] ?? 0) + 1 }));
  }, []);

  const decrementQuantity = useCallback((optionId: string) => {
    setQuantities((prev) => {
      const next = (prev[optionId] ?? 0) - 1;
      if (next <= 0) {
        const { [optionId]: _removed, ...rest } = prev;
        return rest;
      }
      return { ...prev, [optionId]: next };
    });
  }, []);

  const toggleComboDraft = useCallback((optionId: string) => {
    setComboDraftIds((prev) =>
      prev.includes(optionId) ? prev.filter((id) => id !== optionId) : [...prev, optionId],
    );
  }, []);

  const incrementComboGarment = useCallback((comboId: string) => {
    setSavedCombos((prev) =>
      prev.map((combo) => {
        if (combo.id !== comboId) {
          return combo;
        }
        const nextQty = getComboGarmentQuantity(combo.items) + 1;
        return {
          ...combo,
          items: combo.items.map((item) => ({ ...item, quantity: nextQty })),
        };
      }),
    );
  }, []);

  const decrementComboGarment = useCallback((comboId: string) => {
    setSavedCombos((prev) =>
      prev.map((combo) => {
        if (combo.id !== comboId) {
          return combo;
        }
        const nextQty = Math.max(0, getComboGarmentQuantity(combo.items) - 1);
        return {
          ...combo,
          items: combo.items.map((item) => ({ ...item, quantity: nextQty })),
        };
      }),
    );
  }, []);

  const handleAddCombo = useCallback(() => {
    if (comboDraftIds.length < 2) {
      return;
    }
    const items = comboDraftIds
      .map((optionId) => {
        const option = getCatalogOptionById(optionId);
        if (!option) {
          return null;
        }
        const title = option.title;
        const amount = option.amount;
        return {
          optionId,
          title,
          amount,
          quantity: 0,
        };
      })
      .filter((item): item is ComboLineItem => item != null);

    const comboIndex = savedCombos.length + 1;
    setSavedCombos((prev) => [
      ...prev,
      {
        id: `combo-${comboIndex}`,
        title: `Combo ${comboIndex}`,
        items,
      },
    ]);
    setComboDraftIds([]);
    setMultiFlow('list');
  }, [comboDraftIds, savedCombos.length]);

  const singleTotals = useMemo(() => {
    let count = 0;
    let total = 0;
    let serviceCount = 0;
    for (const [optionId, qty] of Object.entries(quantities)) {
      if (qty <= 0) {
        continue;
      }
      const option = getCatalogOptionById(optionId);
      if (!option) {
        continue;
      }
      count += qty;
      serviceCount += 1;
      total += option.amount * qty;
    }
    return { count, total, serviceCount };
  }, [quantities]);

  const hasSingleSelections = singleTotals.serviceCount > 0;

  const garmentAssignmentCounts = useMemo(() => {
    const singleCount = countSingleGarmentItems(quantities);
    const multiCount = countMultiGarmentItems(savedCombos);
    return { singleCount, multiCount };
  }, [quantities, savedCombos]);

  const assignmentSummaryLine = useMemo(
    () =>
      formatSingleMultiSummary(
        garmentAssignmentCounts.singleCount,
        garmentAssignmentCounts.multiCount,
      ),
    [garmentAssignmentCounts.multiCount, garmentAssignmentCounts.singleCount],
  );

  const multiTotals = useMemo(() => {
    let count = 0;
    let total = 0;

    for (const combo of savedCombos) {
      const comboQty = getComboGarmentQuantity(combo.items);
      if (comboQty <= 0) {
        continue;
      }
      count += comboQty;
      total += sumComboUnitAmount(combo.items) * comboQty;
    }

    if (multiFlow === 'create') {
      const draftServiceLines = comboDraftIds.length;
      for (const optionId of comboDraftIds) {
        const option = getCatalogOptionById(optionId);
        if (option) {
          total += option.amount;
        }
      }
      count = Math.max(count, draftServiceLines);
    }

    return { count, total };
  }, [comboDraftIds, multiFlow, savedCombos]);

  const showMultiCreate = mode === 'multi' && multiFlow === 'create';
  const showComboList = mode === 'multi' && multiFlow === 'list';

  const stickyMetrics = useMemo(() => {
    let priceBasis;
    if (mode === 'single') {
      priceBasis = singleTotals;
    } else if (showMultiCreate && hasSingleSelections) {
      priceBasis = singleTotals;
    } else {
      priceBasis = multiTotals;
    }

    const assignmentItemCount =
      garmentAssignmentCounts.singleCount + garmentAssignmentCounts.multiCount;

    return {
      count: assignmentItemCount > 0 ? assignmentItemCount : priceBasis.count,
      total: priceBasis.total,
      summaryLine: assignmentSummaryLine,
    };
  }, [
    assignmentSummaryLine,
    garmentAssignmentCounts.multiCount,
    garmentAssignmentCounts.singleCount,
    hasSingleSelections,
    mode,
    multiTotals,
    showMultiCreate,
    singleTotals,
  ]);

  const instructionText =
    mode === 'single'
      ? garmentInstruction(serviceId)
      : showMultiCreate
        ? 'Select services you want to combine'
        : 'Choose or Create combo';

  const nestedMultiCreateInstruction = showMultiCreate ? instructionText : undefined;
  const showStandaloneInstruction = instructionText != null && nestedMultiCreateInstruction == null;
  const showCreateComboCta = showMultiCreate;
  const showMultiCreateSticky = showMultiCreate && hasSingleSelections;

  const handleModeChange = (nextMode: ServiceMode) => {
    setMode(nextMode);
    if (nextMode === 'multi') {
      setComboDraftIds([]);
      setMultiFlow('create');
    }
  };

  const onStickyLayout = (event: LayoutChangeEvent) => {
    setStickyBarHeight(event.nativeEvent.layout.height);
  };

  const renderSingleRow = (
    optionId: string,
    title: string,
    amount: number,
    titleStyle: 'semibold' | 'medium' = 'semibold',
    addMode: 'add' | 'select' | 'tertiary' = 'add',
    titleFontSize?: 14 | 15 | 16,
  ) => {
    const qty = quantities[optionId] ?? 0;

    return (
      <ServiceGarmentRow
        key={optionId}
        title={title}
        amount={amount}
        unit="pc"
        titleStyle={titleStyle}
        titleFontSize={titleFontSize}
        state={qty > 0 ? 'quantity' : 'idle'}
        quantity={qty}
        addMode={addMode}
        onAddPress={() => incrementQuantity(optionId)}
        onIncrement={() => incrementQuantity(optionId)}
        onDecrement={() => decrementQuantity(optionId)}
        scale={scale}
      />
    );
  };

  const renderMultiCreateRow = (
    optionId: string,
    title: string,
    amount: number,
    titleStyle: 'semibold' | 'medium' = 'semibold',
    titleFontSize?: 14 | 15 | 16,
  ) => {
    const selected = comboDraftIds.includes(optionId);

    return (
      <ServiceGarmentRow
        key={optionId}
        title={title}
        amount={amount}
        unit="pc"
        titleStyle={titleStyle}
        titleFontSize={titleFontSize}
        addMode="select"
        addSelected={selected}
        onAddPress={() => toggleComboDraft(optionId)}
        scale={scale}
      />
    );
  };

  const renderCatalogBody = () => {
    if (showComboList) {
      return (
        <View style={[styles.listBlock, { gap: 20 * scale, paddingHorizontal: 16 * scale }]}>
          {savedCombos.map((combo, comboIndex) => {
            const expanded = isSectionExpanded(combo.id);
            const comboLabel = formatComboLabel(combo.items.map((item) => item.title));
            const comboUnitTotal = sumComboUnitAmount(combo.items);
            const summaryHasQuantity = combo.items.some((item) => item.quantity > 0);
            const summaryQuantity = getComboGarmentQuantity(combo.items);

            return (
              <View key={combo.id} style={{ gap: 16 * scale, width: '100%', alignItems: 'center' }}>
                <ServiceSelectionCard
                  title={combo.title}
                  state="default"
                  headerVariant="category"
                  expanded={expanded}
                  onToggle={() => toggleSection(combo.id)}
                  scale={scale}
                  headerAccessory={
                    expanded && !summaryHasQuantity ? (
                      <ServiceGarmentRow
                        title={comboLabel}
                        amount={comboUnitTotal}
                        unit="pc"
                        titleNumberOfLines={1}
                        onAddPress={() => incrementComboGarment(combo.id)}
                        scale={scale}
                      />
                    ) : null
                  }>
                  {expanded && summaryHasQuantity ? (
                    <ServiceComboDetailCard
                      title={comboLabel}
                      amount={comboUnitTotal}
                      unit="pc"
                      quantity={summaryQuantity}
                      pickupPersonChecked={pickupPersonChecked}
                      onIncrement={() => incrementComboGarment(combo.id)}
                      onDecrement={() => decrementComboGarment(combo.id)}
                      onPickupPersonChange={setPickupPersonChecked}
                      scale={scale}
                    />
                  ) : null}
                </ServiceSelectionCard>
                {comboIndex < savedCombos.length - 1 ? (
                  <ServiceRowDivider variant="solid" width={389} scale={scale} />
                ) : null}
              </View>
            );
          })}
          <ServiceSelectionButton
            label="Create New Combo"
            variant="secondaryDashed"
            onPress={() => {
              setMultiFlow('create');
              setComboDraftIds([]);
            }}
            scale={scale}
            style={{ width: 380 * scale, alignSelf: 'center' }}
          />
        </View>
      );
    }

    const renderOptionRow = (
      optionId: string,
      title: string,
      amount: number,
      titleStyle: 'semibold' | 'medium' = 'semibold',
      catalogAddMode?: 'add' | 'select',
      titleFontSize?: 14 | 15 | 16,
    ) => {
      const rowAddMode = resolveRowAddMode(mode, catalogAddMode);
      if (mode === 'single') {
        return renderSingleRow(optionId, title, amount, titleStyle, rowAddMode, titleFontSize);
      }
      return renderMultiCreateRow(optionId, title, amount, titleStyle, titleFontSize);
    };

    const optionRowGap = mode === 'multi' && multiFlow === 'create' ? 16 : 20;

    const catalogList = (
      <View style={[styles.listBlock, { gap: 20 * scale, paddingHorizontal: multiFlow === 'create' ? 0 : 16 * scale }]}>
        {SERVICE_SELECTION_CATALOG.sections.map((section, sectionIndex) => {
          const expanded = isSectionExpanded(section.id);
          return (
            <View key={section.id} style={{ gap: 16 * scale, width: '100%', alignItems: 'center' }}>
              <ServiceSelectionCard
                title={section.title}
                headerVariant="category"
                expanded={expanded}
                onToggle={() => toggleSection(section.id)}
                scale={scale}>
                {section.options.map((option, optionIndex) => (
                  <View
                    key={option.id}
                    style={{ gap: optionRowGap * scale, width: '100%', alignItems: 'center' }}>
                    {renderOptionRow(
                      option.id,
                      option.title,
                      option.amount,
                      option.titleStyle,
                      option.addMode,
                      option.titleFontSize,
                    )}
                    {optionIndex < section.options.length - 1 ? <ServiceRowDivider scale={scale} /> : null}
                  </View>
                ))}
              </ServiceSelectionCard>
              {sectionIndex < SERVICE_SELECTION_CATALOG.sections.length - 1 ? (
                <ServiceRowDivider variant="solid" width={389} scale={scale} />
              ) : null}
            </View>
          );
        })}
      </View>
    );

    if (showMultiCreate) {
      return <CreateComboSelectPanel scale={scale}>{catalogList}</CreateComboSelectPanel>;
    }

    return catalogList;
  };

  const sheetMaxHeight = Math.min(contentHeight * 0.92, 600 * scale);

  return (
    <View style={styles.root}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Dismiss service selection"
        onPress={onClose}
        style={styles.overlay}
      />
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
              paddingBottom: 20 * scale,
              gap: 20 * scale,
            },
          ]}>
          <ServiceSheetTitle garmentLabel={garmentLabel} scale={scale} />

          <ServiceModeTabs
            mode={mode}
            onModeChange={handleModeChange}
            instructionText={nestedMultiCreateInstruction}
            scale={scale}
          />

          {showStandaloneInstruction ? (
            <View style={{ paddingHorizontal: 16 * scale, width: '100%' }}>
              <ServiceInstructionText scale={scale}>{instructionText}</ServiceInstructionText>
            </View>
          ) : null}

          <ScrollView
            style={[styles.scroll, Platform.OS === 'web' ? styles.scrollWeb : null]}
            contentContainerStyle={{
              gap: 16 * scale,
              paddingBottom: stickyBarHeight + (showCreateComboCta ? 53 * scale : 0) + 16 * scale,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {renderCatalogBody()}
          </ScrollView>

          {showCreateComboCta ? (
            <ServiceSelectionButton
              label="Add as combo"
              variant={comboDraftIds.length >= 2 ? 'primary' : 'secondary'}
              disabled={comboDraftIds.length < 2}
              onPress={handleAddCombo}
              scale={scale}
              style={{
                width: 380 * scale,
                alignSelf: 'center',
                marginBottom: showMultiCreateSticky ? 8 * scale : 0,
              }}
            />
          ) : null}

          {showMultiCreateSticky || mode === 'single' || showComboList ? (
            <View onLayout={onStickyLayout} style={styles.stickyWrap}>
              <ServiceSelectionStickyBar
                itemCount={stickyMetrics.count}
                summaryLine={stickyMetrics.summaryLine}
                totalPrice={stickyMetrics.count > 0 ? stickyMetrics.total : undefined}
                onConfirm={onClose}
                scale={scale}
              />
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  sheetColumn: {
    flex: 1,
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
  },
  scroll: {
    flexGrow: 0,
    flexShrink: 1,
  },
  scrollWeb: {
    overflowY: 'auto',
  },
  listBlock: {
    width: '100%',
    alignItems: 'center',
  },
  stickyWrap: {
    width: '100%',
  },
});
