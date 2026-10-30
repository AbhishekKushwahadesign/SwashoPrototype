import type { Href } from 'expo-router';

import { DEMO_SUBSCRIPTION } from '@/data/subscriptions';

export function subscriptionPastOrdersHref(): Href {
  return '/subscription/past-orders';
}

export function subscriptionUpcomingFromPastOrdersHref(
  subscriptionId: string = DEMO_SUBSCRIPTION.id,
): Href {
  return {
    pathname: '/subscription/order-review',
    params: { subscriptionId },
  };
}
