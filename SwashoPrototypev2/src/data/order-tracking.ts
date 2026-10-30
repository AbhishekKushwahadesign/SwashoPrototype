import type { ImageSourcePropType } from 'react-native';

import { DEMO_PAST_ORDERS, type PastOrderLineItem, type PastOrderSummary } from '@/data/subscription-past-orders';
import { DEMO_UPCOMING_ORDER } from '@/data/subscription-upcoming-order';

/** Home order card `Order Id-9817` — alias for the active delivering mock. */
export const HOME_ACTIVE_ORDER_ID = '9817';

export type OrderTrackingStageState = 'completed' | 'current' | 'pending';

export type OrderTrackingStage = {
  id: string;
  label: string;
  state: OrderTrackingStageState;
  timeLabel?: string;
};

export type OrderTrackingViewModel = {
  id: string;
  reference: string;
  shortOrderId: string;
  deliveryEtaLabel: string;
  deliveryPhaseLabel: string;
  onTimeLabel: string;
  partnerName: string;
  partnerRole: string;
  partnerAvatar: ImageSourcePropType;
  deliveryLocationName: string;
  deliveryAddressLine: string;
  basketPrimaryLine: string;
  basketSecondaryLine: string;
  basketExtraCount: number;
  stages: OrderTrackingStage[];
  minsAwayLabel: string;
  deliveryByLabel: string;
  lineItems: PastOrderLineItem[];
};

const partnerAvatar = require('@/assets/order-tracking/driver-avatar.png');

function shortIdFromReference(reference: string): string {
  const match = reference.match(/#(\d+)/);
  return match?.[1] ?? reference;
}

function basketCopyFromLineItems(lineItems: PastOrderLineItem[]): {
  primary: string;
  secondary: string;
  extraCount: number;
} {
  const named = lineItems.filter((item) => item.kind === 'named');
  const extra = lineItems.find((item) => item.kind === 'extra_garments');
  const primary = named[0] ? `${named[0].quantityLabel} ${named[0].label}`.replace(/\s+/g, ' ').trim() : '';
  const secondary = named[1] ? `${named[1].quantityLabel} ${named[1].label}`.replace(/\s+/g, ' ').trim() : '';
  const extraCount =
    (extra?.kind === 'extra_garments' ? extra.extraCount : 0) +
    Math.max(0, named.length > 2 ? named.length - 2 : 0);
  return { primary, secondary, extraCount };
}

function stagesForLifecycle(status: PastOrderSummary['lifecycleStatus']): OrderTrackingStage[] {
  const base: OrderTrackingStage[] = [
    { id: 'pickup', label: 'Picked up', state: 'pending', timeLabel: '9 Sept, 1:40pm' },
    { id: 'laundry', label: 'In laundry', state: 'pending', timeLabel: '9 Sept, 3:00pm' },
    { id: 'delivery', label: 'Out for delivery', state: 'pending', timeLabel: '9 Sept, 2:05pm' },
    { id: 'delivered', label: 'Delivered', state: 'pending' },
  ];

  if (status === 'pickup_pending') {
    base[0] = { ...base[0], state: 'current' };
    return base;
  }
  if (status === 'in_laundry') {
    base[0] = { ...base[0], state: 'completed' };
    base[1] = { ...base[1], state: 'current' };
    return base;
  }
  if (status === 'delivering') {
    base[0] = { ...base[0], state: 'completed' };
    base[1] = { ...base[1], state: 'completed' };
    base[2] = { ...base[2], state: 'current' };
    return base;
  }
  if (status === 'delivered') {
    return base.map((stage) => ({ ...stage, state: 'completed' as const }));
  }
  return base;
}

function viewModelFromPastOrder(order: PastOrderSummary): OrderTrackingViewModel {
  const basket = basketCopyFromLineItems(order.lineItems);
  const shortOrderId = shortIdFromReference(order.reference);

  return {
    id: order.id,
    reference: order.reference,
    shortOrderId,
    deliveryEtaLabel: order.deliveryEtaLabel ?? 'Arriving soon',
    deliveryPhaseLabel: order.deliveryPhaseLabel ?? order.statusLabel,
    onTimeLabel: 'On Time',
    partnerName: 'Ramesh Yadav',
    partnerRole: 'EV Delivery Partner',
    partnerAvatar,
    deliveryLocationName: 'Home',
    deliveryAddressLine: DEMO_UPCOMING_ORDER.addressLine,
    basketPrimaryLine: basket.primary,
    basketSecondaryLine: basket.secondary,
    basketExtraCount: basket.extraCount,
    stages: stagesForLifecycle(order.lifecycleStatus),
    minsAwayLabel: order.deliveryEtaLabel?.toLowerCase().includes('min') ? '20 mins away' : '20 mins away',
    deliveryByLabel: 'Delivering Today by 6pm',
    lineItems: order.lineItems,
  };
}

const trackingById: Record<string, OrderTrackingViewModel> = {};

for (const order of DEMO_PAST_ORDERS) {
  const model = viewModelFromPastOrder(order);
  trackingById[order.id] = model;
  trackingById[model.shortOrderId] = model;
}

export function orderTrackingForId(orderId: string | undefined): OrderTrackingViewModel | null {
  if (!orderId) {
    return null;
  }
  return trackingById[orderId] ?? null;
}

export function defaultDeliveringOrderTracking(): OrderTrackingViewModel {
  return trackingById['po-9817-001'] ?? viewModelFromPastOrder(DEMO_PAST_ORDERS[0]);
}
