import type { Href } from 'expo-router';

export type ContactlessClothesLocationId =
  | 'flat-door'
  | 'society-gate'
  | 'society-lobby'
  | 'maid'
  | 'other';

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
  /** ISO date key (YYYY-MM-DD) for the selected pickup day chip. */
  pickupDayKey?: string;
  pickupTimeSlot?: CheckoutPickupTimeSlotId;
  deliverySameAsPickup?: boolean;
  deliveryTimeSlot?: CheckoutPickupTimeSlotId;
  contactlessService?: boolean;
  /** User has seen the contactless setup explainer (Standard → Contactless first entry). */
  contactlessFirstEntryCompleted?: boolean;
  contactlessClothesLocationId?: ContactlessClothesLocationId;
  contactlessClothesLocationOther?: string;
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

function localDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

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
      key: localDateKey(date),
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

const PICKUP_SLOT_START_HOUR: Record<CheckoutPickupTimeSlotId, number> = {
  '6-8am': 6,
  '8-10am': 8,
  '10-12pm': 10,
  '12-2pm': 12,
  '2-4pm': 14,
  '4-6pm': 16,
  '6-8pm': 18,
};

/** First pickup slot whose start is strictly after `now` (local); wraps to 6–8 AM if none left today. */
export function getNextPickupTimeSlot(now: Date = new Date()): CheckoutPickupTimeSlotId {
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  for (const slot of CHECKOUT_PICKUP_TIME_SLOTS) {
    const startMinutes = PICKUP_SLOT_START_HOUR[slot.id] * 60;
    if (startMinutes > currentMinutes) {
      return slot.id;
    }
  }
  return CHECKOUT_PICKUP_TIME_SLOTS[0].id;
}

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
/** Shared garment photo upload (Figma 3399:16790). */
export function garmentPhotoUploadHref(
  providerId: string,
  query: string,
  params: { garmentId: string; serviceId: string; subscription?: boolean },
): Href {
  const extra: Record<string, string> = {
    garmentId: params.garmentId,
    serviceId: params.serviceId,
  };
  if (params.subscription) {
    extra.subscription = '1';
  }
  return `/checkout/garment-photo-upload?${checkoutQueryString(providerId, query, extra)}` as Href;
}

export function checkoutPlaceholderHref(
  providerId: string,
  query: string,
  options: { subscription?: boolean; scheduleConfirmed?: boolean; fromAiDemo?: boolean },
): Href {
  const extra: Record<string, string> = {};
  if (options.subscription) {
    extra.subscription = '1';
  }
  if (options.scheduleConfirmed) {
    extra.scheduleConfirmed = '1';
  }
  if (options.fromAiDemo) {
    extra.fromAiDemo = '1';
  }
  return `/checkout/review?${checkoutQueryString(providerId, query, extra)}` as Href;
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

/** Minimum order total (INR) for subscriber exclusive pricing, by pickup frequency. */
export const SUBSCRIPTION_EXCLUSIVE_PRICING_MIN_ORDER_INR: Record<SubscriptionFrequencyOption, number> = {
  'twice-weekly': 299,
  'once-weekly': 399,
};

export function subscriptionExclusivePricingThresholdInr(
  frequency: SubscriptionFrequencyOption | undefined,
): number | null {
  if (!frequency) {
    return null;
  }
  return SUBSCRIPTION_EXCLUSIVE_PRICING_MIN_ORDER_INR[frequency];
}

export function isSubscriptionExclusivePricingQualified(
  orderTotalInr: number,
  frequency: SubscriptionFrequencyOption | undefined,
): boolean {
  const threshold = subscriptionExclusivePricingThresholdInr(frequency);
  if (threshold == null) {
    return false;
  }
  return orderTotalInr >= threshold;
}

export function subscriptionExclusivePricingShortfallInr(
  orderTotalInr: number,
  frequency: SubscriptionFrequencyOption | undefined,
): number {
  const threshold = subscriptionExclusivePricingThresholdInr(frequency);
  if (threshold == null) {
    return 0;
  }
  return Math.max(0, Math.ceil(threshold - orderTotalInr));
}
