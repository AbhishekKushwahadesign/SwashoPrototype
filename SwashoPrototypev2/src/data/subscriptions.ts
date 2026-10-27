/** Prototype subscription list — values from Figma frame 3409:16867. */

export type SubscriptionFilterId = 'all' | 'active' | 'paused' | 'inactive';

export type SubscriptionGarmentLine = {
  id: string;
  label: string;
  quantity: number;
  icon: 'tshirt' | 'trouser';
  services: string[];
};

export type SubscriptionSummary = {
  id: string;
  reference: string;
  title: string;
  providerName: string;
  frequencyLabel: string;
  weeklyPriceInr: number;
  pickupInDays: number;
  status: 'active' | 'paused' | 'inactive';
  garments: SubscriptionGarmentLine[];
  extraGarmentCount: number;
  /** Checkout route seed — existing provider mock. */
  providerId: string;
  searchQuery: string;
};

export const SUBSCRIPTION_FILTERS: { id: SubscriptionFilterId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'paused', label: 'Paused' },
  { id: 'inactive', label: 'Inactive' },
];

export const DEMO_SUBSCRIPTION: SubscriptionSummary = {
  id: 'sub-9632',
  reference: '#9632',
  title: 'Daily wear weekly',
  providerName: 'Laundromat',
  frequencyLabel: '(Weekly)',
  weeklyPriceInr: 200,
  pickupInDays: 2,
  status: 'active',
  providerId: 'provider-1',
  searchQuery: 'Laundromat',
  extraGarmentCount: 1,
  garments: [
    {
      id: 'g1',
      label: 'T-Shirt',
      quantity: 5,
      icon: 'tshirt',
      services: ['wash & fold x2', 'Dry Cleaning x2', 'Dry Cleaning+Iron x1'],
    },
    {
      id: 'g2',
      label: 'Trouser/Pant',
      quantity: 2,
      icon: 'trouser',
      services: ['wash & fold x1', 'Dry Cleaning+Iron x1'],
    },
  ],
};

export function subscriptionsForFilter(
  filter: SubscriptionFilterId,
  items: SubscriptionSummary[] = [DEMO_SUBSCRIPTION],
): SubscriptionSummary[] {
  if (filter === 'all') {
    return items;
  }
  return items.filter((item) => item.status === filter);
}
