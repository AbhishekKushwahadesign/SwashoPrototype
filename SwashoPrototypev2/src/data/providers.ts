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
    },
  ];
}

export function getProviderResultById(id: string, query: string): ProviderResult | undefined {
  return getProviderResultsForQuery(query).find((provider) => provider.id === id);
}
