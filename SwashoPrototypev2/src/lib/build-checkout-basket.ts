import { getComboGarmentQuantity } from '@/components/service-selection/service-selection-combo';
import { getCatalogOptionById } from '@/components/service-selection/service-selection-catalog';
import {
  computeSelectionStickyMetrics,
  garmentAssignmentItemCount,
  hasProviderCartSelection,
  isBulkServiceId,
  type ProviderGarmentCartSelection,
} from '@/lib/provider-cart-selection';
import { formatBulkLoadSummaryLine, resolveBulkLoadTier } from '@/lib/bulk-load-tiers';
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
  detailLines: string[];
  price: number;
  priceSuffix?: string;
  estimated?: boolean;
};

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
    const price = computeSelectionStickyMetrics(selection, serviceId).totalPrice;
    bulkLines.push({
      serviceId,
      title: bulkService?.name ?? 'Bulk service',
      quantityLabel: tier ? formatBulkLoadSummaryLine(tier) : selection.bulkWeightLabel,
      detailLines: [],
      price,
      priceSuffix: `/kg`,
      estimated: true,
    });
  }
  if (bulkLines.length > 0) {
    groups.push({ sectionId: 'bulk', sectionTitle: 'Bulk', lines: bulkLines });
  }

  if (provider?.serviceSections) {
    for (const section of provider.serviceSections) {
      const lines: CheckoutBasketLine[] = [];
      for (const item of section.items) {
        const entry = entries.find((e) => e.serviceId === item.id);
        if (!entry || !hasProviderCartSelection(entry.selection, item.id)) {
          continue;
        }
        const selection = entry.selection;
        const garmentName = getProviderGarmentName(item.id, providerId, query) ?? item.name;

        for (const [optionId, qty] of Object.entries(selection.quantities)) {
          if (qty <= 0) {
            continue;
          }
          const option = getCatalogOptionById(optionId, item.id);
          if (!option) {
            continue;
          }
          lines.push({
            serviceId: item.id,
            title: garmentName,
            quantityLabel: `x ${qty}`,
            detailLines: [`${qty}x ${option.title}`],
            price: option.amount * qty,
          });
        }

        for (const combo of selection.savedCombos) {
          const comboQty = getComboGarmentQuantity(combo.items);
          if (comboQty <= 0) {
            continue;
          }
          const counts = new Map<string, number>();
          for (const line of combo.items) {
            counts.set(line.title, (counts.get(line.title) ?? 0) + line.quantity);
          }
          const detailLines = [...counts.entries()].map(([title, count]) => `${count}x ${title}`);
          lines.push({
            serviceId: item.id,
            title: garmentName,
            quantityLabel: `x ${comboQty}`,
            detailLines,
            price: combo.items.reduce((sum, line) => sum + line.amount * line.quantity, 0) * comboQty,
          });
        }
      }
      if (lines.length > 0) {
        groups.push({ sectionId: section.id, sectionTitle: section.title, lines });
      }
    }
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
