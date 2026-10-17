import { OneTimeCheckoutScreen } from './OneTimeCheckoutScreen';

type SubscriptionFrequencyScreenProps = {
  providerId: string;
  query: string;
};

/** Legacy `/checkout/subscription-frequency` — same screen with Subscribe tab active (segment visible). */
export function SubscriptionFrequencyScreen({ providerId, query }: SubscriptionFrequencyScreenProps) {
  return (
    <OneTimeCheckoutScreen providerId={providerId} query={query} initialFulfillmentMode="subscribe" />
  );
}
