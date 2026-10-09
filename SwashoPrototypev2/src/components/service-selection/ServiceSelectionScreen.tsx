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

import {
  DEFAULT_COMBOS,
  SERVICE_SELECTION_CATALOG,
  getCatalogOptionById,
  type ServiceCatalogOption,
  type ServiceCatalogStandaloneRow,
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

function catalogSubscriptionAmount(
  option: ServiceCatalogOption | ServiceCatalogStandaloneRow,
): number | undefined {
  return 'subscriptionAmount' in option ? option.subscriptionAmount : undefined;
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
  const [planPriceEnabled, setPlanPriceEnabled] = useState(false);
  const [sectionExpanded, setSectionExpanded] = useState<Record<string, boolean>>({});
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [comboDraftIds, setComboDraftIds] = useState<string[]>([]);
  const [savedCombos, setSavedCombos] = useState<SavedCombo[]>(() =>
    DEFAULT_COMBOS.map((combo) => ({
      id: combo.id,
      title: combo.title,
      items: [
        {
          optionId: `combo-${combo.id}`,
          title: combo.label,
          amount: combo.amount,
          quantity: 0,
        },
      ],
    })),
  );
  const [pickupPersonChecked, setPickupPersonChecked] = useState(false);
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

  const getUnitPrice = useCallback(
    (optionId: string, baseAmount: number, subscriptionAmount?: number) => {
      if (planPriceEnabled && subscriptionAmount != null) {
        return subscriptionAmount;
      }
      return baseAmount;
    },
    [planPriceEnabled],
  );

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

  const incrementComboLine = useCallback((comboId: string, optionId: string) => {
    setSavedCombos((prev) =>
      prev.map((combo) => {
        if (combo.id !== comboId) {
          return combo;
        }
        return {
          ...combo,
          items: combo.items.map((item) =>
            item.optionId === optionId ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        };
      }),
    );
  }, []);

  const decrementComboLine = useCallback((comboId: string, optionId: string) => {
    setSavedCombos((prev) =>
      prev.map((combo) => {
        if (combo.id !== comboId) {
          return combo;
        }
        return {
          ...combo,
          items: combo.items.map((item) => {
            if (item.optionId !== optionId) {
              return item;
            }
            const nextQty = Math.max(0, item.quantity - 1);
            return { ...item, quantity: nextQty };
          }),
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
    for (const [optionId, qty] of Object.entries(quantities)) {
      if (qty <= 0) {
        continue;
      }
      const option = getCatalogOptionById(optionId);
      if (!option) {
        continue;
      }
      const unit = getUnitPrice(optionId, option.amount, catalogSubscriptionAmount(option));
      count += qty;
      total += unit * qty;
    }
    return { count, total };
  }, [getUnitPrice, quantities]);

  const multiTotals = useMemo(() => {
    let count = 0;
    let total = 0;
    let serviceLines = 0;
    let multiLines = 0;

    for (const combo of savedCombos) {
      for (const item of combo.items) {
        if (item.quantity <= 0) {
          continue;
        }
        count += item.quantity;
        total += item.amount * item.quantity;
        multiLines += item.quantity;
      }
    }

    if (multiFlow === 'create') {
      serviceLines = comboDraftIds.length;
      for (const optionId of comboDraftIds) {
        const option = getCatalogOptionById(optionId);
        if (option) {
          total += getUnitPrice(optionId, option.amount, catalogSubscriptionAmount(option));
        }
      }
      count = Math.max(count, serviceLines);
    }

    const summaryLine =
      count > 0
        ? `${serviceLines || count} services + ${multiLines || Math.max(savedCombos.length, 1)} multi`
        : undefined;

    return { count, total, summaryLine };
  }, [comboDraftIds, getUnitPrice, multiFlow, savedCombos]);

  const stickyMetrics =
    mode === 'single' ? { ...singleTotals, summaryLine: undefined as string | undefined } : multiTotals;
  const instructionText =
    mode === 'single'
      ? garmentInstruction(serviceId)
      : multiFlow === 'create'
        ? 'Select services you want to combine'
        : 'Choose or Create combo';

  const showCreateComboCta = mode === 'multi' && multiFlow === 'create';
  const showComboList = mode === 'multi' && multiFlow === 'list';

  const handleModeChange = (nextMode: ServiceMode) => {
    setMode(nextMode);
    if (nextMode === 'multi' && savedCombos.length === 0) {
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
    subscriptionAmount?: number,
    titleStyle: 'semibold' | 'medium' = 'semibold',
    addMode: 'add' | 'select' = 'add',
  ) => {
    const qty = quantities[optionId] ?? 0;
    const unit = getUnitPrice(optionId, amount, subscriptionAmount);

    return (
      <ServiceGarmentRow
        key={optionId}
        title={title}
        amount={unit}
        unit="pc"
        subscriptionAmount={planPriceEnabled ? undefined : subscriptionAmount}
        titleStyle={titleStyle}
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
    subscriptionAmount?: number,
    titleStyle: 'semibold' | 'medium' = 'semibold',
  ) => {
    const selected = comboDraftIds.includes(optionId);
    const unit = getUnitPrice(optionId, amount, subscriptionAmount);

    return (
      <View
        key={optionId}
        style={selected ? [styles.selectedRow, { borderRadius: SwashoRadii.md * scale }] : undefined}>
        <ServiceGarmentRow
          title={title}
          amount={unit}
          unit="pc"
          subscriptionAmount={planPriceEnabled ? undefined : subscriptionAmount}
          titleStyle={titleStyle}
          addMode="select"
          onAddPress={() => toggleComboDraft(optionId)}
          scale={scale}
        />
      </View>
    );
  };

  const renderCatalogBody = () => {
    if (showComboList) {
      return (
        <View style={[styles.listBlock, { gap: 20 * scale, paddingHorizontal: 16 * scale }]}>
          {savedCombos.map((combo, comboIndex) => {
            const expanded = isSectionExpanded(combo.id);
            return (
              <View key={combo.id} style={{ gap: 16 * scale, width: '100%', alignItems: 'center' }}>
                <ServiceSelectionCard
                  title={combo.title}
                  state="expanded"
                  expanded={expanded}
                  onToggle={() => toggleSection(combo.id)}
                  scale={scale}>
                  {combo.items.map((item, itemIndex) => {
                    const qty = item.quantity;
                    const showDetail = qty > 0;
                    return (
                      <View key={item.optionId} style={{ gap: 16 * scale, width: '100%', alignItems: 'center' }}>
                        {showDetail ? (
                          <ServiceComboDetailCard
                            title={item.title}
                            amount={item.amount}
                            unit="pc"
                            quantity={qty}
                            pickupPersonChecked={pickupPersonChecked}
                            onIncrement={() => incrementComboLine(combo.id, item.optionId)}
                            onDecrement={() => decrementComboLine(combo.id, item.optionId)}
                            onPickupPersonChange={setPickupPersonChecked}
                            scale={scale}
                          />
                        ) : (
                          <ServiceGarmentRow
                            title={item.title}
                            amount={item.amount}
                            unit="pc"
                            onAddPress={() => incrementComboLine(combo.id, item.optionId)}
                            scale={scale}
                          />
                        )}
                        {itemIndex < combo.items.length - 1 ? (
                          <ServiceRowDivider scale={scale} />
                        ) : null}
                      </View>
                    );
                  })}
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
      subscriptionAmount?: number,
      titleStyle: 'semibold' | 'medium' = 'semibold',
      addMode: 'add' | 'select' = 'add',
    ) => {
      if (mode === 'single') {
        return renderSingleRow(optionId, title, amount, subscriptionAmount, titleStyle, addMode);
      }
      return renderMultiCreateRow(optionId, title, amount, subscriptionAmount, titleStyle);
    };

    return (
      <View style={[styles.listBlock, { gap: 20 * scale, paddingHorizontal: 16 * scale }]}>
        {SERVICE_SELECTION_CATALOG.sections.map((section, sectionIndex) => {
          const expanded = isSectionExpanded(section.id);
          return (
            <View key={section.id} style={{ gap: 16 * scale, width: '100%', alignItems: 'center' }}>
              <ServiceSelectionCard
                title={section.title}
                state={section.headerVariant === 'emphasis' ? 'expanded' : 'default'}
                expanded={expanded}
                onToggle={() => toggleSection(section.id)}
                scale={scale}>
                {section.options.map((option, optionIndex) => (
                  <View key={option.id} style={{ gap: 20 * scale, width: '100%', alignItems: 'center' }}>
                    {renderOptionRow(
                      option.id,
                      option.title,
                      option.amount,
                      option.subscriptionAmount,
                      option.titleStyle,
                      option.addMode,
                    )}
                    {optionIndex < section.options.length - 1 ? <ServiceRowDivider scale={scale} /> : null}
                  </View>
                ))}
              </ServiceSelectionCard>
              {sectionIndex === 0 ? (
                <>
                  <ServiceRowDivider variant="solid" width={362} scale={scale} />
                  {SERVICE_SELECTION_CATALOG.standaloneRows.map((row) =>
                    renderOptionRow(row.id, row.title, row.amount, undefined, row.titleStyle, 'add'),
                  )}
                </>
              ) : null}
              {sectionIndex < SERVICE_SELECTION_CATALOG.sections.length - 1 ? (
                <ServiceRowDivider variant="solid" width={389} scale={scale} />
              ) : null}
            </View>
          );
        })}
      </View>
    );
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
            showPlanPriceToggle={mode === 'multi' && multiFlow === 'list'}
            planPriceEnabled={planPriceEnabled}
            onPlanPriceChange={setPlanPriceEnabled}
            scale={scale}
          />

          <View style={{ paddingHorizontal: 16 * scale, width: '100%' }}>
            <ServiceInstructionText scale={scale}>{instructionText}</ServiceInstructionText>
          </View>

          <ScrollView
            style={[styles.scroll, Platform.OS === 'web' ? styles.scrollWeb : null]}
            contentContainerStyle={{
              gap: 16 * scale,
              paddingBottom: stickyBarHeight + (showCreateComboCta ? 56 * scale : 0) + 16 * scale,
            }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled">
            {renderCatalogBody()}
            {showCreateComboCta ? (
              <ServiceSelectionButton
                label="Add as combo"
                variant="secondary"
                disabled={comboDraftIds.length < 2}
                onPress={handleAddCombo}
                scale={scale}
                style={{ width: 380 * scale, alignSelf: 'center' }}
              />
            ) : null}
          </ScrollView>

          <View onLayout={onStickyLayout} style={styles.stickyWrap}>
            <ServiceSelectionStickyBar
              itemCount={stickyMetrics.count}
              summaryLine={stickyMetrics.summaryLine}
              totalPrice={stickyMetrics.count > 0 ? stickyMetrics.total : undefined}
              onConfirm={onClose}
              scale={scale}
            />
          </View>
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
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
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
    // @ts-expect-error web-only
    overflowY: 'auto',
  },
  listBlock: {
    width: '100%',
    alignItems: 'center',
  },
  selectedRow: {
    backgroundColor: SwashoColors.primary50,
    width: '100%',
    alignItems: 'center',
  },
  stickyWrap: {
    width: '100%',
  },
});
