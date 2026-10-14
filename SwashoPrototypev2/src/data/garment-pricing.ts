export type GarmentCatalogId =
  | 'shirt'
  | 'tshirt'
  | 'trouser'
  | 'jeans'
  | 'shorts'
  | 'kurta'
  | 'saree-cotton'
  | 'saree-silk'
  | 'blouse'
  | 'dress-casual'
  | 'dress-party'
  | 'skirt'
  | 'sweater'
  | 'hoodie'
  | 'blazer'
  | 'suit'
  | 'dupatta';

export type GarmentPriceValue = number | { min: number; max: number };

export type GarmentServiceColumn = 'washFold' | 'washIron' | 'onlyIron' | 'dryClean';

export type GarmentPriceRow = {
  washFold: GarmentPriceValue | null;
  washIron: GarmentPriceValue | null;
  onlyIron: GarmentPriceValue | null;
  dryClean: GarmentPriceValue | null;
};

export type GarmentCatalogEntry = {
  name: string;
  prices: GarmentPriceRow;
};

/** Clothes (Men & Women) rate card — amounts in INR. */
export const GARMENT_CATALOG: Record<GarmentCatalogId, GarmentCatalogEntry> = {
  shirt: {
    name: 'Shirt',
    prices: { washFold: 25, washIron: 50, onlyIron: { min: 15, max: 20 }, dryClean: 100 },
  },
  tshirt: {
    name: 'T-Shirt',
    prices: { washFold: 20, washIron: 40, onlyIron: 15, dryClean: 80 },
  },
  trouser: {
    name: 'Trouser / Pants',
    prices: { washFold: 30, washIron: 60, onlyIron: 20, dryClean: 100 },
  },
  jeans: {
    name: 'Jeans / Denim',
    prices: { washFold: 35, washIron: 70, onlyIron: 25, dryClean: 120 },
  },
  shorts: {
    name: 'Shorts',
    prices: { washFold: 20, washIron: 40, onlyIron: 15, dryClean: 80 },
  },
  kurta: {
    name: 'Kurta / Kurti',
    prices: { washFold: 30, washIron: 60, onlyIron: 20, dryClean: 100 },
  },
  'saree-cotton': {
    name: 'Saree (Cotton)',
    prices: { washFold: null, washIron: 80, onlyIron: 40, dryClean: 150 },
  },
  'saree-silk': {
    name: 'Saree (Silk / Heavy)',
    prices: { washFold: null, washIron: 120, onlyIron: 60, dryClean: { min: 200, max: 250 } },
  },
  blouse: {
    name: 'Blouse',
    prices: { washFold: null, washIron: 40, onlyIron: 20, dryClean: 80 },
  },
  'dress-casual': {
    name: 'Dress (Casual)',
    prices: { washFold: 40, washIron: 70, onlyIron: 25, dryClean: 120 },
  },
  'dress-party': {
    name: 'Dress (Party / Gown)',
    prices: { washFold: null, washIron: 150, onlyIron: null, dryClean: { min: 250, max: 300 } },
  },
  skirt: {
    name: 'Skirt',
    prices: { washFold: 25, washIron: 50, onlyIron: 20, dryClean: 90 },
  },
  sweater: {
    name: 'Sweater / Pullover',
    prices: { washFold: null, washIron: 60, onlyIron: 30, dryClean: 120 },
  },
  hoodie: {
    name: 'Hoodie / Jacket',
    prices: { washFold: null, washIron: 80, onlyIron: null, dryClean: 150 },
  },
  blazer: {
    name: 'Blazer / Coat',
    prices: { washFold: null, washIron: 120, onlyIron: null, dryClean: { min: 200, max: 250 } },
  },
  suit: {
    name: 'Suit (2-piece)',
    prices: { washFold: null, washIron: 150, onlyIron: null, dryClean: { min: 250, max: 300 } },
  },
  dupatta: {
    name: 'Dupatta / Shawl',
    prices: { washFold: 20, washIron: 40, onlyIron: 15, dryClean: 80 },
  },
};

const SERVICE_ID_SUFFIX_TO_GARMENT: Record<string, GarmentCatalogId> = {
  shirt: 'shirt',
  tshirt: 'tshirt',
  trouser: 'trouser',
  jeans: 'jeans',
  shorts: 'shorts',
  kurta: 'kurta',
  'saree-cotton': 'saree-cotton',
  'saree-silk': 'saree-silk',
  blouse: 'blouse',
  'dress-casual': 'dress-casual',
  'dress-party': 'dress-party',
  skirt: 'skirt',
  sweater: 'sweater',
  hoodie: 'hoodie',
  blazer: 'blazer',
  suit: 'suit',
  dupatta: 'dupatta',
};

export function garmentCatalogIdFromServiceId(serviceId: string): GarmentCatalogId | undefined {
  const slug = serviceId.replace(/^(mens|womens)-/, '');
  return SERVICE_ID_SUFFIX_TO_GARMENT[slug];
}

export function normalizeSearchServiceColumn(query: string): GarmentServiceColumn {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, ' ');
  if (normalized.includes('iron') && !normalized.includes('wash')) {
    return 'onlyIron';
  }
  if (normalized.includes('fold')) {
    return 'washFold';
  }
  if (normalized.includes('wash') && normalized.includes('iron')) {
    return 'washIron';
  }
  if (normalized.includes('dry')) {
    return 'dryClean';
  }
  return 'dryClean';
}

export function formatGarmentPriceDisplay(value: GarmentPriceValue): number | string {
  if (typeof value === 'number') {
    return value;
  }
  return `${value.min}–${value.max}`;
}

/** Midpoint for cart totals when a rate is a range. */
export function garmentPriceEstimate(value: GarmentPriceValue): number {
  if (typeof value === 'number') {
    return value;
  }
  return Math.round((value.min + value.max) / 2);
}

/** Lowest rate for provider “starting at” snippets. */
export function garmentPriceStartingAt(value: GarmentPriceValue): number {
  if (typeof value === 'number') {
    return value;
  }
  return value.min;
}

export function getGarmentPriceForColumn(
  garmentId: GarmentCatalogId,
  column: GarmentServiceColumn,
): GarmentPriceValue | null {
  return GARMENT_CATALOG[garmentId].prices[column];
}

export function resolveGarmentListPrice(garmentId: GarmentCatalogId, searchQuery: string): number {
  const column = normalizeSearchServiceColumn(searchQuery);
  const cell = getGarmentPriceForColumn(garmentId, column);
  if (cell == null) {
    const fallback =
      getGarmentPriceForColumn(garmentId, 'dryClean') ??
      getGarmentPriceForColumn(garmentId, 'washIron') ??
      getGarmentPriceForColumn(garmentId, 'washFold') ??
      getGarmentPriceForColumn(garmentId, 'onlyIron');
    if (fallback == null) {
      return 0;
    }
    return garmentPriceStartingAt(fallback);
  }
  return garmentPriceStartingAt(cell);
}

export const CATALOG_OPTION_TO_COLUMN: Record<string, GarmentServiceColumn> = {
  'wash-fold': 'washFold',
  'wash-iron': 'washIron',
  ironing: 'onlyIron',
  'dry-cleaning': 'dryClean',
};
