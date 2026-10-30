import type { Href } from 'expo-router';

import { HOME_ACTIVE_ORDER_ID } from '@/data/order-tracking';

/** Root-stack route — use query string so navigation works from nested stacks (e.g. past-orders) on web. */
export function orderTrackingHref(orderId: string): Href {
  return `/order-tracking?orderId=${encodeURIComponent(orderId)}`;
}

export function orderTrackingHrefFromHome(): Href {
  return orderTrackingHref(HOME_ACTIVE_ORDER_ID);
}

export function orderTrackingHrefFromPastOrder(pastOrderId: string): Href {
  return orderTrackingHref(pastOrderId);
}
