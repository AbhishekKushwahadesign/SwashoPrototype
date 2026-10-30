/** Prototype past / completed orders — Figma frame 3429:18165. */

export type PastOrderFilterId = 'all' | 'pickup_pending' | 'in_laundry' | 'delivered';

export type PastOrderLifecycleStatus = 'pickup_pending' | 'in_laundry' | 'delivering' | 'delivered';

export type PastOrderLineItem =
  | {
      id: string;
      kind: 'named';
      label: string;
      quantityLabel: string;
    }
  | {
      id: string;
      kind: 'extra_garments';
      extraCount: number;
    };

export type PastOrderSummary = {
  id: string;
  reference: string;
  lifecycleStatus: PastOrderLifecycleStatus;
  /** Short status label shown beside the icon (e.g. Delivering). */
  statusLabel: string;
  dateLabel: string;
  timeLabel: string;
  paymentNote: string;
  totalBillInr: number;
  lineItems: PastOrderLineItem[];
  /** Delivering card footer copy. */
  deliveryEtaLabel?: string;
  deliveryPhaseLabel?: string;
  /** Link to subscription upcoming review when user taps Upcoming from this list. */
  linkedSubscriptionId?: string;
};

export const PAST_ORDER_FILTERS: { id: PastOrderFilterId; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'pickup_pending', label: 'Pickup Pending' },
  { id: 'in_laundry', label: 'In laundry' },
  { id: 'delivered', label: 'Delivered' },
];

/** Figma card 1 — Order #9817 001 (delivering). */
const ORDER_DELIVERING: PastOrderSummary = {
  id: 'po-9817-001',
  reference: 'Order #9817 001',
  lifecycleStatus: 'delivering',
  statusLabel: 'Delivering',
  dateLabel: '9 sept',
  timeLabel: '2:15pm',
  paymentNote: '(Paid via UPI)',
  totalBillInr: 313,
  deliveryEtaLabel: 'Arriving in 10 Mins',
  deliveryPhaseLabel: 'Out for Delivery',
  linkedSubscriptionId: 'sub-9632',
  lineItems: [
    { id: 'li-1', kind: 'named', label: 'Wash & Iron', quantityLabel: '3-5 kg' },
    { id: 'li-2', kind: 'named', label: 'Trouser/Pant', quantityLabel: 'x 2' },
    { id: 'li-3', kind: 'extra_garments', extraCount: 1 },
  ],
};

/** Figma card 2 — Order #1129 001 (delivered). */
const ORDER_DELIVERED: PastOrderSummary = {
  id: 'po-1129-001',
  reference: 'Order #1129 001',
  lifecycleStatus: 'delivered',
  statusLabel: 'Delivered',
  dateLabel: '1 sept',
  timeLabel: '4:16pm',
  paymentNote: '(Paid via UPI)',
  totalBillInr: 313,
  lineItems: [
    { id: 'li-4', kind: 'named', label: 'Wash & Iron', quantityLabel: '3-5 kg' },
    { id: 'li-5', kind: 'named', label: 'Trouser/Pant', quantityLabel: 'x 2' },
    { id: 'li-6', kind: 'extra_garments', extraCount: 1 },
  ],
};

export const DEMO_PAST_ORDERS: PastOrderSummary[] = [ORDER_DELIVERING, ORDER_DELIVERED];

function matchesFilter(order: PastOrderSummary, filter: PastOrderFilterId): boolean {
  if (filter === 'all') {
    return true;
  }
  if (filter === 'delivered') {
    return order.lifecycleStatus === 'delivered';
  }
  if (filter === 'pickup_pending') {
    return order.lifecycleStatus === 'pickup_pending';
  }
  if (filter === 'in_laundry') {
    return order.lifecycleStatus === 'in_laundry' || order.lifecycleStatus === 'delivering';
  }
  return true;
}

export function pastOrdersForFilter(
  filter: PastOrderFilterId,
  items: PastOrderSummary[] = DEMO_PAST_ORDERS,
): PastOrderSummary[] {
  return items.filter((order) => matchesFilter(order, filter));
}
