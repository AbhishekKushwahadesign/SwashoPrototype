import { formatComboLabel, getComboGarmentQuantity } from '@/components/service-selection/service-selection-combo';
import { getCatalogOptionById } from '@/components/service-selection/service-selection-catalog';
import {
  computeSelectionStickyMetrics,
  garmentAssignmentItemCount,
  hasProviderCartSelection,
  isBulkServiceId,
  type ProviderGarmentCartSelection,
} from '@/lib/provider-cart-selection';
import { getBulkServiceRatePerKg, getBulkWeightLabelForTier, resolveBulkLoadTier } from '@/lib/bulk-load-tiers';
import { getProviderBulkService, getProviderGarmentName, getProviderResultById } from '@/data/providers';

export type CheckoutBasketGroup = {
  sectionId: string;
  sectionTitle: string;
  lines: CheckoutBasketLine[];
};

export type CheckoutBasketLine = {
  serviceId: string;
  title: string;
  quantityLabel?: string;
  /** Bulk load weight range (e.g. 3 - 5KG), shown nested under the primary row. */
  weightSubline?: string;
  detailLines: string[];
  price: number;
  priceSuffix?: string;
  estimated?: boolean;
};

function buildGarmentDetailLines(
  selection: ProviderGarmentCartSelection,
  garmentServiceId: string,
): string[] {
  const detailCounts = new Map<string, number>();

  for (const [optionId, qty] of Object.entries(selection.quantities)) {
    if (qty <= 0) {
      continue;
    }
    const option = getCatalogOptionById(optionId, garmentServiceId);
    if (!option) {
      continue;
    }
    detailCounts.set(option.title, (detailCounts.get(option.title) ?? 0) + qty);
  }

  for (const combo of selection.savedCombos) {
    const comboQty = getComboGarmentQuantity(combo.items);
    if (comboQty <= 0) {
      continue;
    }
    const label = formatComboLabel(combo.items.map((item) => item.title));
    detailCounts.set(label, (detailCounts.get(label) ?? 0) + comboQty);
  }

  return [...detailCounts.entries()].map(([title, count]) => `${count}x ${title}`);
}

function buildGarmentBasketLine(
  providerId: string,
  query: string,
  garmentServiceId: string,
  garmentName: string,
  selection: ProviderGarmentCartSelection,
): CheckoutBasketLine | null {
  const itemCount = garmentAssignmentItemCount(selection, garmentServiceId);
  if (itemCount <= 0) {
    return null;
  }

  const detailLines = buildGarmentDetailLines(selection, garmentServiceId);
  const price = computeSelectionStickyMetrics(selection, garmentServiceId).totalPrice;

  return {
    serviceId: garmentServiceId,
    title: garmentName,
    quantityLabel: `x ${itemCount}`,
    detailLines,
    price,
  };
}

export function buildCheckoutBasketGroups(
  providerId: string,
  query: string,
  entries: { serviceId: string; selection: ProviderGarmentCartSelection }[],
): CheckoutBasketGroup[] {
  const provider = getProviderResultById(providerId, query);
  const groups: CheckoutBasketGroup[] = [];

  const bulkLines: CheckoutBasketLine[] = [];
  for (const { serviceId, selection } of entries) {
    if (!isBulkServiceId(serviceId) || !hasProviderCartSelection(selection, serviceId)) {
      continue;
    }
    const bulkService = getProviderBulkService(serviceId, providerId, query);
    const tier = resolveBulkLoadTier(selection);
    const weightSubline = tier
      ? getBulkWeightLabelForTier(tier)
      : selection.bulkWeightLabel;
    const detailLines = buildGarmentDetailLines(selection, serviceId);
    const ratePerKg = getBulkServiceRatePerKg(serviceId);

    bulkLines.push({
      serviceId,
      title: bulkService?.name ?? 'Bulk service',
      weightSubline,
      detailLines,
      price: ratePerKg,
      priceSuffix: '/kg',
      estimated: true,
    });
  }
  if (bulkLines.length > 0) {
    groups.push({ sectionId: 'bulk', sectionTitle: 'Bulk', lines: bulkLines });
  }

  const renderedServiceIds = new Set<string>();

  if (provider?.serviceSections) {
    for (const section of provider.serviceSections) {
      const lines: CheckoutBasketLine[] = [];
      for (const item of section.items) {
        const entry = entries.find((e) => e.serviceId === item.id);
        if (!entry || !hasProviderCartSelection(entry.selection, item.id)) {
          continue;
        }
        const garmentName = getProviderGarmentName(item.id, providerId, query) ?? item.name;
        const line = buildGarmentBasketLine(providerId, query, item.id, garmentName, entry.selection);
        if (line) {
          lines.push(line);
          renderedServiceIds.add(item.id);
        }
      }
      if (lines.length > 0) {
        groups.push({ sectionId: section.id, sectionTitle: section.title, lines });
      }
    }
  }

  const fallbackLines: CheckoutBasketLine[] = [];
  for (const { serviceId, selection } of entries) {
    if (isBulkServiceId(serviceId) || renderedServiceIds.has(serviceId)) {
      continue;
    }
    if (!hasProviderCartSelection(selection, serviceId)) {
      continue;
    }
    const title = getProviderGarmentName(serviceId, providerId, query) ?? serviceId;
    const line = buildGarmentBasketLine(providerId, query, serviceId, title, selection);
    if (line) {
      fallbackLines.push(line);
    }
  }
  if (fallbackLines.length > 0) {
    groups.unshift({ sectionId: 'your-items', sectionTitle: 'Your items', lines: fallbackLines });
  }

  return groups;
}

export function checkoutBasketItemCount(entries: { serviceId: string; selection: ProviderGarmentCartSelection }[]): number {
  let count = 0;
  for (const { serviceId, selection } of entries) {
    count += garmentAssignmentItemCount(selection, serviceId);
  }
  return count;
}

export function formatCheckoutInr(amount: number): string {
  const rounded = Math.round(amount * 100) / 100;
  return `₹${rounded % 1 === 0 ? rounded.toFixed(0) : rounded.toFixed(1)}`;
}
