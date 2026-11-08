import { getCatalogOptionById } from '@/components/service-selection/service-selection-catalog';
import {
  buildUpcomingCheckoutDays,
  getNextPickupTimeSlot,
  type ProviderOrderFulfillmentMode,
  type ProviderCheckoutState,
} from '@/lib/checkout-flow';
import { getBulkWeightLabelForTier, type BulkLoadTierId } from '@/lib/bulk-load-tiers';
import type {
  ProviderCartCombo,
  ProviderCartComboLineItem,
  ProviderGarmentCartSelection,
} from '@/lib/provider-cart-selection';

export type EnsurePrototypeSampleProviderCartDeps = {
  getProviderCartTotals: (providerId: string) => { itemCount: number; totalPrice: number };
  setSelection: (providerId: string, serviceId: string, selection: ProviderGarmentCartSelection) => void;
  setFulfillmentMode: (providerId: string, mode: ProviderOrderFulfillmentMode) => void;
  setOneTimeSchedule: (
    providerId: string,
    patch: Partial<
      Pick<
        ProviderCheckoutState,
        'pickupWeekday' | 'pickupDayKey' | 'pickupTimeSlot' | 'deliverySameAsPickup' | 'deliveryTimeSlot'
      >
    >,
  ) => void;
};

const PROTOTYPE_BULK_SERVICE_ID = 'bulk-wash-fold';
const PROTOTYPE_BULK_TIER: BulkLoadTierId = 'small';
const PROTOTYPE_MENS_SHIRT_SERVICE_ID = 'mens-shirt';
const PROTOTYPE_COMBO_OPTION_IDS = ['stain-removal', 'pressing-ironing'] as const;

function buildPrototypeMensShirtCombo(): ProviderCartCombo {
  const items: ProviderCartComboLineItem[] = [];

  for (const optionId of PROTOTYPE_COMBO_OPTION_IDS) {
    const option = getCatalogOptionById(optionId, PROTOTYPE_MENS_SHIRT_SERVICE_ID);
    if (!option) {
      continue;
    }
    items.push({
      optionId,
      title: option.title,
      amount: option.amount,
      quantity: 1,
    });
  }

  return {
    id: 'combo-1',
    title: 'Combo 1',
    items,
  };
}

export function buildPrototypeSampleBulkWashFoldSelection(): ProviderGarmentCartSelection {
  return {
    quantities: {},
    savedCombos: [],
    bulkLoadTier: PROTOTYPE_BULK_TIER,
    bulkWeightLabel: getBulkWeightLabelForTier(PROTOTYPE_BULK_TIER),
  };
}

export function buildPrototypeSampleMensShirtSelection(): ProviderGarmentCartSelection {
  return {
    quantities: { 'wash-fold': 2 },
    savedCombos: [buildPrototypeMensShirtCombo()],
  };
}

export type EnsurePrototypeSampleProviderCartOptions = {
  /** When false, only garment selections are seeded (subscription cold entry). */
  includeOneTimeSchedule?: boolean;
};

/** Prototype-only cart seed for cold deep links into provider checkout (empty cart). */
export function ensurePrototypeSampleProviderCart(
  providerId: string,
  deps: EnsurePrototypeSampleProviderCartDeps,
  options?: EnsurePrototypeSampleProviderCartOptions,
): boolean {
  if (!providerId) {
    return false;
  }

  const { itemCount } = deps.getProviderCartTotals(providerId);
  if (itemCount > 0) {
    return false;
  }

  deps.setSelection(providerId, PROTOTYPE_BULK_SERVICE_ID, buildPrototypeSampleBulkWashFoldSelection());
  deps.setSelection(providerId, PROTOTYPE_MENS_SHIRT_SERVICE_ID, buildPrototypeSampleMensShirtSelection());

  if (options?.includeOneTimeSchedule !== false) {
    const today = buildUpcomingCheckoutDays(14)[0];
    deps.setFulfillmentMode(providerId, 'one-time');
    deps.setOneTimeSchedule(providerId, {
      pickupWeekday: today.weekdayId,
      pickupDayKey: today.key,
      pickupTimeSlot: getNextPickupTimeSlot(),
      deliverySameAsPickup: true,
    });
  }

  return true;
}
