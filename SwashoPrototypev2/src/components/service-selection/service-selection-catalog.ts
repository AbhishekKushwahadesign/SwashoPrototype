import {
  CATALOG_OPTION_TO_COLUMN,
  GARMENT_CATALOG,
  garmentCatalogIdFromServiceId,
  garmentPriceEstimate,
  formatGarmentPriceDisplay,
  type GarmentCatalogId,
  type GarmentPriceValue,
} from '@/data/garment-pricing';

export type ServiceCatalogOption = {
  id: string;
  title: string;
  /** Billing estimate (midpoint when the rate card shows a range). */
  amount: number;
  /** Shown in the UI; defaults to `amount` when omitted. */
  displayAmount?: number | string;
  titleStyle?: 'semibold' | 'medium';
  titleFontSize?: 14 | 15 | 16;
  addMode?: 'add' | 'select';
};

export type ServiceCatalogSection = {
  id: string;
  title: string;
  options: ServiceCatalogOption[];
};

const STAIN_REMOVAL_AMOUNT = 49;
const PRESSING_IRONING_AMOUNT = 49;

function optionFromPrice(
  id: string,
  title: string,
  price: GarmentPriceValue,
  extra?: Partial<ServiceCatalogOption>,
): ServiceCatalogOption {
  const amount = garmentPriceEstimate(price);
  const displayAmount = formatGarmentPriceDisplay(price);
  return {
    id,
    title,
    amount,
    displayAmount: displayAmount === amount ? undefined : displayAmount,
    titleStyle: 'semibold',
    ...extra,
  };
}

function buildBasicCareOptions(garmentId: GarmentCatalogId): ServiceCatalogOption[] {
  const { prices } = GARMENT_CATALOG[garmentId];
  const options: ServiceCatalogOption[] = [];

  if (prices.onlyIron != null) {
    options.push(optionFromPrice('ironing', 'Ironing', prices.onlyIron));
  }
  if (prices.washIron != null) {
    options.push(optionFromPrice('wash-iron', 'Wash & Iron', prices.washIron));
  }
  if (prices.washFold != null) {
    options.push(optionFromPrice('wash-fold', 'Wash & fold', prices.washFold));
  }

  return options;
}

function buildSpecialCareOptions(garmentId: GarmentCatalogId): ServiceCatalogOption[] {
  const { prices } = GARMENT_CATALOG[garmentId];
  const options: ServiceCatalogOption[] = [];

  if (prices.dryClean != null) {
    options.push(
      optionFromPrice('dry-cleaning', 'Dry Cleaning', prices.dryClean, { addMode: 'select' }),
    );
  }

  options.push({
    id: 'stain-removal',
    title: 'Stain removal',
    amount: STAIN_REMOVAL_AMOUNT,
    titleStyle: 'semibold',
    addMode: 'select',
  });

  return options;
}

function buildPressingOptions(): ServiceCatalogOption[] {
  return [
    {
      id: 'pressing-ironing',
      title: 'Ironing',
      amount: PRESSING_IRONING_AMOUNT,
      titleStyle: 'semibold',
      addMode: 'select',
    },
  ];
}

export function buildServiceSelectionCatalog(serviceId: string): { sections: ServiceCatalogSection[] } {
  const garmentId = garmentCatalogIdFromServiceId(serviceId);
  if (!garmentId) {
    return { sections: [] };
  }

  const sections: ServiceCatalogSection[] = [];
  const basicCare = buildBasicCareOptions(garmentId);
  if (basicCare.length > 0) {
    sections.push({ id: 'basic-care', title: 'Basic Care', options: basicCare });
  }

  const specialCare = buildSpecialCareOptions(garmentId);
  if (specialCare.length > 0) {
    sections.push({ id: 'special-care', title: 'Special Care', options: specialCare });
  }

  sections.push({ id: 'pressing', title: 'Pressing', options: buildPressingOptions() });

  return { sections };
}

/** @deprecated Use buildServiceSelectionCatalog(serviceId) for garment-specific rates. */
export const SERVICE_SELECTION_CATALOG = buildServiceSelectionCatalog('mens-shirt');

export const DEFAULT_COMBOS = [
  {
    id: 'combo-1',
    title: 'Combo 1',
    label: 'Dry Cleaning + Iron',
    amount: garmentPriceEstimate(GARMENT_CATALOG.shirt.prices.dryClean!) + garmentPriceEstimate(GARMENT_CATALOG.shirt.prices.onlyIron!),
  },
] as const;

export function getCatalogOptionById(
  optionId: string,
  serviceId?: string,
): ServiceCatalogOption | undefined {
  const catalog = serviceId ? buildServiceSelectionCatalog(serviceId) : SERVICE_SELECTION_CATALOG;
  for (const section of catalog.sections) {
    const match = section.options.find((option) => option.id === optionId);
    if (match) {
      return match;
    }
  }
  return undefined;
}

export function getCatalogOptionAmount(optionId: string, serviceId?: string): number {
  const option = getCatalogOptionById(optionId, serviceId);
  return option?.amount ?? 0;
}

export function getCatalogOptionDisplayAmount(
  option: ServiceCatalogOption,
): number | string {
  return option.displayAmount ?? option.amount;
}

/** Resolve list/card price for a catalog option id on a given garment. */
export function resolveCatalogPriceForGarment(
  garmentId: GarmentCatalogId,
  optionId: string,
): GarmentPriceValue | null {
  const column = CATALOG_OPTION_TO_COLUMN[optionId];
  if (!column) {
    return null;
  }
  return GARMENT_CATALOG[garmentId].prices[column];
}
