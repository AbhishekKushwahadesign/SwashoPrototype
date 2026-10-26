import {
  GARMENT_CATALOG,
  garmentPriceStartingAt,
  normalizeSearchServiceColumn,
  resolveGarmentListPrice,
  type GarmentCatalogId,
} from '@/data/garment-pricing';
import { formatBulkServicePriceLabel } from '@/lib/bulk-load-tiers';

export type ProviderOffer = {
  id: string;
  name: string;
  rating: number;
  offer: string;
  topPicks?: boolean;
};

export type ProviderPricingItem = {
  label: string;
  price: number;
};

export type ProviderSpecialistTag =
  | { type: 'wedding'; label: string }
  | { type: 'luxury'; label: string };

export type ProviderBulkService = {
  id: string;
  name: string;
  priceLabel: string;
  icon: 'ironing' | 'wash-iron' | 'wash-fold';
};

export type ProviderListService = {
  id: string;
  name: string;
  garmentId: GarmentCatalogId;
  icon: 'shirt' | 'tshirt' | 'trouser' | 'jeans';
};

export type ProviderServiceSection = {
  id: string;
  title: string;
  items: ProviderListService[];
};

export type ProviderResult = {
  id: string;
  serviceName: string;
  category: string;
  rating: number;
  pricing: ProviderPricingItem[];
  deliveryInfo: string;
  deliveryIcon: 'bold' | 'linear';
  offerText: {
    boldSegments: string[];
    regularText: string;
  };
  specialistTag?: ProviderSpecialistTag;
  topPicks?: boolean;
  trustedCustomerCount?: number;
  bulkServices?: ProviderBulkService[];
  serviceSections?: ProviderServiceSection[];
};

export const SEARCH_OFFERS: ProviderOffer[] = [
  { id: '1', name: 'Laundromat', rating: 4.5, offer: '20% upto 100' },
  { id: '2', name: 'Laundromat', rating: 4.5, offer: '20% upto 100', topPicks: true },
  { id: '3', name: 'Laundromat', rating: 4.5, offer: '20% upto 100', topPicks: true },
  { id: '4', name: 'Laundromat', rating: 4.5, offer: '20% upto 100', topPicks: true },
  { id: '5', name: 'Laundromat', rating: 4.5, offer: '20% upto 100', topPicks: true },
  { id: '6', name: 'Laundromat', rating: 4.5, offer: '20% upto 100', topPicks: true },
];

export const RECENT_SEARCHES = ['Recent search', 'Recent search', 'Recent search'];

export const PROVIDER_RESULT_FILTERS = [
  { id: 'delivery-time', label: 'Delivery time', hasDropdown: true },
  { id: 'rating', label: '4+ Rating' },
  { id: 'bank-offer-1', label: 'Bank offer' },
  { id: 'bank-offer-2', label: 'Bank offer' },
];

const DEFAULT_BULK_SERVICES: ProviderBulkService[] = [
  {
    id: 'bulk-ironing',
    name: 'Ironing Only',
    priceLabel: formatBulkServicePriceLabel('bulk-ironing'),
    icon: 'ironing',
  },
  {
    id: 'bulk-wash-iron',
    name: 'Wash & Iron',
    priceLabel: formatBulkServicePriceLabel('bulk-wash-iron'),
    icon: 'wash-iron',
  },
  {
    id: 'bulk-wash-fold',
    name: 'Wash & Fold',
    priceLabel: formatBulkServicePriceLabel('bulk-wash-fold'),
    icon: 'wash-fold',
  },
];

type ListItemDef = {
  idPrefix: 'mens' | 'womens';
  garmentId: GarmentCatalogId;
  icon: ProviderListService['icon'];
};

const MENS_CATALOG: ListItemDef[] = [
  { idPrefix: 'mens', garmentId: 'shirt', icon: 'shirt' },
  { idPrefix: 'mens', garmentId: 'tshirt', icon: 'tshirt' },
  { idPrefix: 'mens', garmentId: 'trouser', icon: 'trouser' },
  { idPrefix: 'mens', garmentId: 'jeans', icon: 'jeans' },
  { idPrefix: 'mens', garmentId: 'shorts', icon: 'trouser' },
  { idPrefix: 'mens', garmentId: 'kurta', icon: 'shirt' },
  { idPrefix: 'mens', garmentId: 'hoodie', icon: 'shirt' },
  { idPrefix: 'mens', garmentId: 'blazer', icon: 'shirt' },
  { idPrefix: 'mens', garmentId: 'suit', icon: 'shirt' },
];

const WOMENS_CATALOG: ListItemDef[] = [
  { idPrefix: 'womens', garmentId: 'shirt', icon: 'shirt' },
  { idPrefix: 'womens', garmentId: 'tshirt', icon: 'tshirt' },
  { idPrefix: 'womens', garmentId: 'trouser', icon: 'trouser' },
  { idPrefix: 'womens', garmentId: 'jeans', icon: 'jeans' },
  { idPrefix: 'womens', garmentId: 'shorts', icon: 'trouser' },
  { idPrefix: 'womens', garmentId: 'kurta', icon: 'shirt' },
  { idPrefix: 'womens', garmentId: 'saree-cotton', icon: 'shirt' },
  { idPrefix: 'womens', garmentId: 'saree-silk', icon: 'shirt' },
  { idPrefix: 'womens', garmentId: 'blouse', icon: 'shirt' },
  { idPrefix: 'womens', garmentId: 'dress-casual', icon: 'shirt' },
  { idPrefix: 'womens', garmentId: 'dress-party', icon: 'shirt' },
  { idPrefix: 'womens', garmentId: 'skirt', icon: 'trouser' },
  { idPrefix: 'womens', garmentId: 'sweater', icon: 'shirt' },
  { idPrefix: 'womens', garmentId: 'hoodie', icon: 'shirt' },
  { idPrefix: 'womens', garmentId: 'blazer', icon: 'shirt' },
  { idPrefix: 'womens', garmentId: 'dupatta', icon: 'shirt' },
];

function toListService(def: ListItemDef): ProviderListService {
  const entry = GARMENT_CATALOG[def.garmentId];
  return {
    id: `${def.idPrefix}-${def.garmentId}`,
    name: entry.name,
    garmentId: def.garmentId,
    icon: def.icon,
  };
}

const DEFAULT_MENS_SERVICES = MENS_CATALOG.map(toListService);
const DEFAULT_WOMENS_SERVICES = WOMENS_CATALOG.map(toListService);

function buildProviderCardPricing(serviceName: string): ProviderPricingItem[] {
  const column = normalizeSearchServiceColumn(serviceName);
  const shirtCell = GARMENT_CATALOG.shirt.prices[column] ?? GARMENT_CATALOG.shirt.prices.dryClean!;
  const blazerCell = GARMENT_CATALOG.blazer.prices[column] ?? GARMENT_CATALOG.blazer.prices.dryClean!;
  return [
    { label: 'Shirt', price: garmentPriceStartingAt(shirtCell) },
    { label: 'Blazer', price: garmentPriceStartingAt(blazerCell) },
  ];
}

function buildProviderServices() {
  return {
    bulkServices: DEFAULT_BULK_SERVICES,
    serviceSections: [
      { id: 'mens', title: "Men's", items: DEFAULT_MENS_SERVICES },
      { id: 'womens', title: "Women's", items: DEFAULT_WOMENS_SERVICES },
    ],
    trustedCustomerCount: 2031,
    topPicks: true,
  };
}

export function getProviderResultsForQuery(query: string): ProviderResult[] {
  const serviceName = query.trim() || 'Dry Cleaning';
  const pricing = buildProviderCardPricing(serviceName);

  return [
    {
      id: 'provider-1',
      serviceName,
      category: 'Laundromat',
      rating: 4.5,
      pricing,
      deliveryInfo: 'Next Day Delivery Available',
      deliveryIcon: 'bold',
      offerText: {
        boldSegments: ['Free', 'pickup', 'delivery'],
        regularText: ' and  on order above ₹199',
      },
      specialistTag: { type: 'wedding', label: 'Wedding Dress Specialist' },
      ...buildProviderServices(),
    },
    {
      id: 'provider-2',
      serviceName,
      category: 'Laundromat',
      rating: 4.5,
      pricing,
      deliveryInfo: 'Next Day Delivery Available',
      deliveryIcon: 'bold',
      offerText: {
        boldSegments: ['Free', 'pickup', 'delivery'],
        regularText: ' and  on order above ₹199',
      },
      specialistTag: { type: 'luxury', label: 'Luxury Fabric Specialist' },
      ...buildProviderServices(),
    },
    {
      id: 'provider-3',
      serviceName,
      category: 'Laundromat',
      rating: 4.5,
      pricing,
      deliveryInfo: 'Next Day Delivery Available',
      deliveryIcon: 'linear',
      offerText: {
        boldSegments: ['Free pickup', 'delivery'],
        regularText: ' and  on order above 199',
      },
      ...buildProviderServices(),
    },
  ];
}

export function getProviderResultById(id: string, query: string): ProviderResult | undefined {
  const resolvedId = id === 'laundry-pro' ? 'provider-1' : id;
  return getProviderResultsForQuery(query).find((provider) => provider.id === resolvedId);
}

/** Display name for a garment row in the provider catalogue (e.g. Shirt, T-Shirt). */
export function getProviderGarmentName(
  serviceId: string,
  providerId?: string,
  query?: string,
): string | undefined {
  const provider = providerId ? getProviderResultById(providerId, query ?? '') : undefined;
  if (!provider?.serviceSections) {
    return undefined;
  }
  for (const section of provider.serviceSections) {
    const match = section.items.find((item) => item.id === serviceId);
    if (match) {
      return match.name;
    }
  }
  return undefined;
}

export function getProviderListServicePrice(service: ProviderListService, searchQuery: string): number {
  return resolveGarmentListPrice(service.garmentId, searchQuery);
}

export function getProviderBulkService(
  serviceId: string,
  providerId?: string,
  query?: string,
): ProviderBulkService | undefined {
  const provider = providerId ? getProviderResultById(providerId, query ?? '') : undefined;
  return provider?.bulkServices?.find((service) => service.id === serviceId);
}
