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
  subscriptionPickupWeekdays?: CheckoutWeekdayId[];
  subscriptionPickupTimeSlot?: CheckoutPickupTimeSlotId;
  subscriptionDeliverySameAsPickup?: boolean;
  subscriptionDeliveryTimeSlot?: CheckoutPickupTimeSlotId;
  subscriptionStartDateKey?: string;
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

const CHECKOUT_MONTH_ABBREV = new Intl.DateTimeFormat('en-US', { month: 'short' });

/** Top line on horizontal date chips, e.g. `17 Oct`. */
export function formatCheckoutDateLine(date: Date): string {
  return `${date.getDate()} ${CHECKOUT_MONTH_ABBREV.format(date)}`;
}

export type CheckoutDayOption = {
  key: string;
  weekdayId: CheckoutWeekdayId;
  /** Weekday short label (Mon, Sat, …) — bottom line on scroll chips. */
  label: string;
  /** Calendar day number (modal grid). */
  dayOfMonth: number;
  /** Day + short month for scroll chips, e.g. `17 Oct`. */
  dateLine: string;
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
      dateLine: formatCheckoutDateLine(date),
    });
  }

  return options;
}

export function checkoutDayOptionFromKey(key: string): CheckoutDayOption {
  const [year, month, day] = key.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const weekdayId = WEEKDAY_ID_BY_JS_DAY[date.getDay()];
  const label = CHECKOUT_WEEKDAY_OPTIONS.find((option) => option.id === weekdayId)?.label ?? weekdayId;
  return {
    key,
    weekdayId,
    label,
    dayOfMonth: date.getDate(),
    dateLine: formatCheckoutDateLine(date),
  };
}

/** Puts the chosen day first in the scroll row (calendar pick); drops duplicates by key. */
export function moveCheckoutDayToFront(
  days: CheckoutDayOption[],
  day: CheckoutDayOption,
): CheckoutDayOption[] {
  const rest = days.filter((option) => option.key !== day.key);
  return [day, ...rest];
}

/** Calendar pick: one leading chip from baseline — drops prior calendar prepends. */
export function checkoutDaysForCalendarPick(
  baselineDays: CheckoutDayOption[],
  picked: CheckoutDayOption,
): CheckoutDayOption[] {
  return moveCheckoutDayToFront(baselineDays, picked);
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

/** Subscribe step 2 — day/time/start date (Figma 3346:13243). */
export function subscriptionSubscribe2Href(providerId: string, query: string): Href {
  return `/checkout/subscribe-2?${checkoutQueryString(providerId, query)}` as Href;
}

export const SUBSCRIPTION_FREQUENCY_PICKUP_HINT: Record<SubscriptionFrequencyOption, string> = {
  'once-weekly': 'Pickup once every week',
  'twice-weekly': 'Pickup twice every week',
};

export function subscriptionPickupWeekdayLimit(
  frequency: SubscriptionFrequencyOption | undefined,
): number {
  return frequency === 'twice-weekly' ? 2 : 1;
}

/** Post-scheduling checkout review (Figma 3353:13604) — same `/checkout` route with query flags. */
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
