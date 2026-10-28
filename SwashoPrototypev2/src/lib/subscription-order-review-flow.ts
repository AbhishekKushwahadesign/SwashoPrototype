import type { Href } from 'expo-router';

import type { SubscriptionSummary } from '@/data/subscriptions';

export function subscriptionOrderReviewHref(subscriptionId: string): Href {
  return {
    pathname: '/subscription/order-review',
    params: { subscriptionId },
  };
}

export function subscriptionOrderReviewHrefFromSummary(subscription: SubscriptionSummary): Href {
  return subscriptionOrderReviewHref(subscription.id);
}
