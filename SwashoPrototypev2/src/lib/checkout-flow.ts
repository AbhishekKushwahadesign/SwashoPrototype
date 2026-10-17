import type { Href } from 'expo-router';

export type ProviderOrderFulfillmentMode = 'one-time' | 'subscribe';

export type SubscriptionFrequencyOption = 'twice-weekly' | 'once-weekly';

export type CheckoutWeekdayId = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type CheckoutPickupTimeSlotId =
  | '6-8am'
  | '8-10am'
  | '10-12pm'
  | '12-2pm'
  | '2-4pm'
  | '4-6pm'
  | '6-8pm';

export type ProviderCheckoutState = {
  fulfillmentMode?: ProviderOrderFulfillmentMode;
  subscriptionFrequency?: SubscriptionFrequencyOption;
  pickupWeekday?: CheckoutWeekdayId;
  pickupTimeSlot?: CheckoutPickupTimeSlotId;
  deliverySameAsPickup?: boolean;
  deliveryTimeSlot?: CheckoutPickupTimeSlotId;
};

export const CHECKOUT_WEEKDAY_OPTIONS: { id: CheckoutWeekdayId; label: string }[] = [
  { id: 'mon', label: 'Mon' },
  { id: 'tue', label: 'Tue' },
  { id: 'wed', label: 'Wed' },
  { id: 'thu', label: 'Thur' },
  { id: 'fri', label: 'Fri' },
  { id: 'sat', label: 'Sat' },
  { id: 'sun', label: 'Sun' },
];

const WEEKDAY_ID_BY_JS_DAY: CheckoutWeekdayId[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export type CheckoutDayOption = {
  key: string;
  weekdayId: CheckoutWeekdayId;
  label: string;
  dayOfMonth: number;
};

/** Upcoming calendar days for Figma 58965:2680 scroll row (starts today). */
export function buildUpcomingCheckoutDays(count = 14): CheckoutDayOption[] {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const options: CheckoutDayOption[] = [];

  for (let offset = 0; offset < count; offset += 1) {
    const date = new Date(start);
    date.setDate(start.getDate() + offset);
    const weekdayId = WEEKDAY_ID_BY_JS_DAY[date.getDay()];
    const label = CHECKOUT_WEEKDAY_OPTIONS.find((day) => day.id === weekdayId)?.label ?? weekdayId;
    options.push({
      key: date.toISOString().slice(0, 10),
      weekdayId,
      label,
      dayOfMonth: date.getDate(),
    });
  }

  return options;
}

export const CHECKOUT_PICKUP_TIME_SLOTS: { id: CheckoutPickupTimeSlotId; label: string }[] = [
  { id: '6-8am', label: '6 - 8 AM' },
  { id: '8-10am', label: '8 - 10 AM' },
  { id: '10-12pm', label: '10 - 12 AM' },
  { id: '12-2pm', label: '12 - 2 PM' },
  { id: '2-4pm', label: '2 - 4 PM' },
  { id: '4-6pm', label: '4 - 6 PM' },
  { id: '6-8pm', label: '6 - 8 PM' },
];

function checkoutQueryString(providerId: string, query: string, extra?: Record<string, string>): string {
  const params = new URLSearchParams({ providerId, q: query });
  if (extra) {
    for (const [key, value] of Object.entries(extra)) {
      params.set(key, value);
    }
  }
  return params.toString();
}

/** Provider details; cart selections stay in ProviderCartProvider. */
export function providerPageHref(providerId: string, query: string): Href {
  const params = new URLSearchParams({ q: query });
  return `/provider/${providerId}?${params.toString()}` as Href;
}

/** Stable hrefs for nested checkout stack (object pathname + push often no-ops on web). */
export function oneTimeCheckoutHref(
  providerId: string,
  query: string,
  mode?: ProviderOrderFulfillmentMode,
): Href {
  const extra =
    mode === 'subscribe' ? { mode: 'subscribe' } : mode === 'one-time' ? { mode: 'one-time' } : undefined;
  return `/checkout?${checkoutQueryString(providerId, query, extra)}` as Href;
}

/** Same unified checkout screen as one-time; Subscribe tab selected (Figma segment always visible). */
export function subscriptionFrequencyHref(providerId: string, query: string): Href {
  return oneTimeCheckoutHref(providerId, query, 'subscribe');
}

export function checkoutPlaceholderHref(
  providerId: string,
  query: string,
  options: { subscription?: boolean; scheduleConfirmed?: boolean },
): Href {
  const extra: Record<string, string> = {};
  if (options.subscription) {
    extra.subscription = '1';
  }
  if (options.scheduleConfirmed) {
    extra.scheduleConfirmed = '1';
  }
  return `/checkout?${checkoutQueryString(providerId, query, extra)}` as Href;
}

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
