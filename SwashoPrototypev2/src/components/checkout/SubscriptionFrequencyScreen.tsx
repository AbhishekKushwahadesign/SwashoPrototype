import { useRouter } from 'expo-router';
import { useEffect } from 'react';

import { useProviderCart } from '@/context/provider-cart-context';
import { oneTimeCheckoutHref } from '@/lib/checkout-flow';

import { OneTimeCheckoutScreen } from './OneTimeCheckoutScreen';

type SubscriptionFrequencyScreenProps = {
  providerId: string;
  query: string;
};

/** Legacy route — forwards to unified checkout with Subscribe tab active. */
export function SubscriptionFrequencyScreen({ providerId, query }: SubscriptionFrequencyScreenProps) {
  const router = useRouter();
  const { setFulfillmentMode } = useProviderCart();

  useEffect(() => {
    setFulfillmentMode(providerId, 'subscribe');
    router.replace(oneTimeCheckoutHref(providerId, query));
  }, [providerId, query, router, setFulfillmentMode]);

  return <OneTimeCheckoutScreen providerId={providerId} query={query} initialFulfillmentMode="subscribe" />;
}
