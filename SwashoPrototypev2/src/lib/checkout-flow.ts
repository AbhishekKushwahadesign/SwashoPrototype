export type ProviderOrderFulfillmentMode = 'one-time' | 'subscribe';

export type SubscriptionFrequencyOption = 'twice-weekly' | 'once-weekly';

export type ProviderCheckoutState = {
  fulfillmentMode?: ProviderOrderFulfillmentMode;
  subscriptionFrequency?: SubscriptionFrequencyOption;
};

export const ORDER_TYPE_OPTIONS: {
  id: ProviderOrderFulfillmentMode;
  title: string;
  description: string;
}[] = [
  {
    id: 'one-time',
    title: 'One-time order',
    description: 'Pay standard pricing',
  },
  {
    id: 'subscribe',
    title: 'Subscribe & save',
    description: 'Unlock exclusive pricing',
  },
];

export const SUBSCRIPTION_FREQUENCY_OPTIONS: {
  id: SubscriptionFrequencyOption;
  title: string;
  description: string;
  popular?: boolean;
}[] = [
  {
    id: 'twice-weekly',
    title: 'Twice a Week',
    description: 'Exclusive pricing on orders above ₹299',
  },
  {
    id: 'once-weekly',
    title: 'Once a week',
    description: 'Exclusive pricing on orders above ₹399',
    popular: true,
  },
];
