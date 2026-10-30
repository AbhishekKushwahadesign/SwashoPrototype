import type { Href } from 'expo-router';

import { HOME_ACTIVE_ORDER_ID } from '@/data/order-tracking';

export function orderTrackingHref(orderId: string): Href {
  return {
    pathname: '/order-tracking',
    params: { orderId },
  };
}

export function orderTrackingHrefFromHome(): Href {
  return orderTrackingHref(HOME_ACTIVE_ORDER_ID);
}

export function orderTrackingHrefFromPastOrder(pastOrderId: string): Href {
  return orderTrackingHref(pastOrderId);
}
