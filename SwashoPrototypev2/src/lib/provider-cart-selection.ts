import {
  countMultiGarmentItems,
  countSingleGarmentItems,
} from '@/components/service-selection/service-selection-assignment-counts';
import {
  formatComboLabel,
  getComboGarmentQuantity,
  sumComboUnitAmount,
} from '@/components/service-selection/service-selection-combo';
import { getCatalogOptionById } from '@/components/service-selection/service-selection-catalog';
import {
  estimateBulkPriceForTier,
  formatBulkLoadSummaryLine,
  resolveBulkLoadTier,
  type BulkLoadTierId,
} from '@/lib/bulk-load-tiers';

export type ProviderCartComboLineItem = {
  optionId: string;
  title: string;
  amount: number;
  quantity: number;
};

export type ProviderCartCombo = {
  id: string;
  title: string;
  items: ProviderCartComboLineItem[];
};

export type ProviderGarmentCartSelection = {
  quantities: Record<string, number>;
  savedCombos: ProviderCartCombo[];
  /** Bulk services: mutually exclusive load tier. */
  bulkLoadTier?: BulkLoadTierId;
  /** Bulk services: weight tier label shown on the provider card after confirm. */
  bulkWeightLabel?: string;
};

export function providerCartKey(providerId: string, serviceId: string): string {
  return `${providerId}::${serviceId}`;
}

export function isBulkServiceId(serviceId: string): boolean {
  return serviceId.startsWith('bulk-');
}

export function garmentAssignmentItemCount(
  selection: ProviderGarmentCartSelection,
  serviceId?: string,
): number {
  const single = countSingleGarmentItems(selection.quantities);
  const multi = countMultiGarmentItems(selection.savedCombos);
  if (single + multi > 0) {
    return single + multi;
  }
  if (selection.bulkWeightLabel && serviceId && isBulkServiceId(serviceId)) {
    return 1;
  }
  return 0;
}

export function hasProviderCartSelection(
  selection: ProviderGarmentCartSelection | undefined,
  serviceId?: string,
): boolean {
  if (!selection) {
    return false;
  }
  return garmentAssignmentItemCount(selection, serviceId) > 0 || Boolean(selection.bulkWeightLabel);
}

export function computeSelectionStickyMetrics(selection: ProviderGarmentCartSelection) {
  let singleTotal = 0;
  for (const [optionId, qty] of Object.entries(selection.quantities)) {
    if (qty <= 0) {
      continue;
    }
    const option = getCatalogOptionById(optionId);
    if (option) {
      singleTotal += option.amount * qty;
    }
  }

  let multiTotal = 0;
  for (const combo of selection.savedCombos) {
    const comboQty = getComboGarmentQuantity(combo.items);
    if (comboQty <= 0) {
      continue;
    }
    multiTotal += sumComboUnitAmount(combo.items) * comboQty;
  }

  let totalPrice = singleTotal + multiTotal;
  const bulkTier = resolveBulkLoadTier(selection);
  if (bulkTier) {
    totalPrice += estimateBulkPriceForTier(bulkTier);
  }

  const itemCount = garmentAssignmentItemCount(selection);
  return {
    itemCount,
    totalPrice,
  };
}

export function formatProviderServiceSummaryParts(selection: ProviderGarmentCartSelection): string[] {
  const parts: string[] = [];

  for (const [optionId, qty] of Object.entries(selection.quantities)) {
    if (qty <= 0) {
      continue;
    }
    const option = getCatalogOptionById(optionId);
    if (!option) {
      continue;
    }
    parts.push(`${option.title} x ${qty}`);
  }

  for (const combo of selection.savedCombos) {
    const comboQty = getComboGarmentQuantity(combo.items);
    if (comboQty <= 0) {
      continue;
    }
    const label = formatComboLabel(combo.items.map((item) => item.title));
    parts.push(`${label} x ${comboQty}`);
  }

  const bulkTier = resolveBulkLoadTier(selection);
  if (bulkTier && parts.length === 0) {
    parts.push(formatBulkLoadSummaryLine(bulkTier));
  }

  return parts;
}

export function formatProviderServiceSummaryLine(selection: ProviderGarmentCartSelection): string | undefined {
  const parts = formatProviderServiceSummaryParts(selection);
  if (parts.length === 0) {
    return undefined;
  }
  return parts.join(' | ');
}

export function emptyProviderGarmentCartSelection(): ProviderGarmentCartSelection {
  return { quantities: {}, savedCombos: [] };
}
