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
  price: number;
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
  { id: 'bulk-ironing', name: 'Ironing Only', priceLabel: '₹₹₹/Kg', icon: 'ironing' },
  { id: 'bulk-wash-iron', name: 'Wash & Iron', priceLabel: '₹₹₹/Kg', icon: 'wash-iron' },
  { id: 'bulk-wash-fold', name: 'Wash & Fold', priceLabel: '₹₹₹/Kg', icon: 'wash-fold' },
];

const DEFAULT_MENS_SERVICES: ProviderListService[] = [
  { id: 'mens-shirt', name: 'Shirt', price: 15, icon: 'shirt' },
  { id: 'mens-tshirt', name: 'T-Shirt', price: 15, icon: 'tshirt' },
  { id: 'mens-trouser', name: 'Trouser/Pant', price: 20, icon: 'trouser' },
  { id: 'mens-jeans', name: 'Jeans', price: 25, icon: 'jeans' },
];

const DEFAULT_WOMENS_SERVICES: ProviderListService[] = [
  { id: 'womens-shirt', name: 'Shirt', price: 15, icon: 'shirt' },
  { id: 'womens-trouser', name: 'Trouser/Pant', price: 20, icon: 'trouser' },
];

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

  return [
    {
      id: 'provider-1',
      serviceName,
      category: 'Laundromat',
      rating: 4.5,
      pricing: [
        { label: 'Shirt', price: 45 },
        { label: 'Blazer', price: 120 },
      ],
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
      pricing: [
        { label: 'Shirt', price: 45 },
        { label: 'Blazer', price: 120 },
      ],
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
      pricing: [
        { label: 'Shirt', price: 45 },
        { label: 'Blazer', price: 120 },
      ],
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
  return getProviderResultsForQuery(query).find((provider) => provider.id === id);
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

export function getProviderBulkService(
  serviceId: string,
  providerId?: string,
  query?: string,
): ProviderBulkService | undefined {
  const provider = providerId ? getProviderResultById(providerId, query ?? '') : undefined;
  return provider?.bulkServices?.find((service) => service.id === serviceId);
}
