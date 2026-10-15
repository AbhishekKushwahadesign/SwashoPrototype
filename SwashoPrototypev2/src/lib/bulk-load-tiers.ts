export type BulkLoadTierId = 'small' | 'medium' | 'large';

export type BulkLoadTier = {
  id: BulkLoadTierId;
  title: string;
  weightSummary: string;
  garmentGuidance: string;
  /** Midpoint kg used for prototype price estimates only. */
  estimatedKg: number;
};

/** Fallback per-kg rate when bulk service id is unknown. */
export const BULK_ESTIMATE_RATE_PER_KG = 49;

export const BULK_SERVICE_RATE_PER_KG: Record<string, number> = {
  'bulk-ironing': 70,
  'bulk-wash-iron': 120,
  'bulk-wash-fold': 80,
};

export function getBulkServiceRatePerKg(serviceId: string): number {
  return BULK_SERVICE_RATE_PER_KG[serviceId] ?? BULK_ESTIMATE_RATE_PER_KG;
}

export function formatBulkServicePriceLabel(serviceId: string): string {
  return `₹${getBulkServiceRatePerKg(serviceId)}/Kg`;
}

export const BULK_LOAD_TIERS: BulkLoadTier[] = [
  {
    id: 'small',
    title: 'Small',
    weightSummary: 'Under 3 kg',
    garmentGuidance: '~5–8 everyday garments',
    estimatedKg: 2,
  },
  {
    id: 'medium',
    title: 'Medium',
    weightSummary: '3–5 kg',
    garmentGuidance: '~8–15 everyday garments',
    estimatedKg: 4,
  },
  {
    id: 'large',
    title: 'Large',
    weightSummary: 'Above 5 kg',
    garmentGuidance: '~15+ everyday garments',
    estimatedKg: 6,
  },
];

export function getBulkLoadTierById(id: BulkLoadTierId): BulkLoadTier {
  const tier = BULK_LOAD_TIERS.find((entry) => entry.id === id);
  if (!tier) {
    throw new Error(`Unknown bulk load tier: ${id}`);
  }
  return tier;
}

/** Label on provider bulk card CTA after confirm. */
export function getBulkWeightLabelForTier(tierId: BulkLoadTierId): string {
  switch (tierId) {
    case 'small':
      return '1-3kg';
    case 'medium':
      return '3 - 5KG';
    case 'large':
      return '5+kg';
    default:
      return '3 - 5KG';
  }
}

export function resolveBulkLoadTier(selection: {
  bulkLoadTier?: BulkLoadTierId;
  bulkWeightLabel?: string;
}): BulkLoadTierId | undefined {
  if (selection.bulkLoadTier) {
    return selection.bulkLoadTier;
  }
  const label = selection.bulkWeightLabel?.toUpperCase().replace(/\s/g, '').replace(/[()]/g, '');
  if (!label) {
    return undefined;
  }
  if (label.includes('UNDER') || label.includes('<3') || label.includes('1-3')) {
    return 'small';
  }
  if (label.includes('ABOVE') || label.includes('>5') || label.includes('5+')) {
    return 'large';
  }
  if (label.includes('3') && label.includes('5')) {
    return 'medium';
  }
  return undefined;
}

export function estimateBulkPriceForTier(tierId: BulkLoadTierId, ratePerKg = BULK_ESTIMATE_RATE_PER_KG): number {
  const tier = getBulkLoadTierById(tierId);
  return Math.round(tier.estimatedKg * ratePerKg);
}

export function formatBulkLoadSummaryLine(tierId: BulkLoadTierId): string {
  const tier = getBulkLoadTierById(tierId);
  return `${tier.title} · ${tier.weightSummary} (est.)`;
}

/** Sticky footer subtitle for bulk load sheet (Figma 58921:2640). */
export function formatBulkStickySubtitle(tierId: BulkLoadTierId): string {
  const tier = getBulkLoadTierById(tierId);
  return `${tier.weightSummary} (est.)`;
}
