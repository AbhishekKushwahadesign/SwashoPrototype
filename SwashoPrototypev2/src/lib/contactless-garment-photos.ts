import {
  formatComboLabel,
  getComboGarmentQuantity,
} from '@/components/service-selection/service-selection-combo';
import { getCatalogOptionById } from '@/components/service-selection/service-selection-catalog';
import type { CheckoutBasketLine } from '@/lib/build-checkout-basket';
import { garmentCatalogIdFromServiceId } from '@/data/garment-pricing';
import {
  isBulkServiceId,
  type ProviderGarmentCartSelection,
} from '@/lib/provider-cart-selection';

/** garmentId → laundry serviceId → uploaded image URIs */
export type ContactlessGarmentPhotoStore = Record<string, Record<string, string[]>>;

export type GarmentPhotoServiceSlot = {
  serviceId: string;
  title: string;
  quantity: number;
  optional: boolean;
};

export type ContactlessGarmentPhotoContext = {
  garmentId: string;
  title: string;
  isBulk: boolean;
  slots: GarmentPhotoServiceSlot[];
};

export const CONTACTLESS_BAG_SERVICE_ID = 'bag';

export function buildGarmentPhotoServiceSlots(
  selection: ProviderGarmentCartSelection,
  garmentServiceId: string,
  isBulk: boolean,
  bagTitle?: string,
): GarmentPhotoServiceSlot[] {
  if (isBulk) {
    return [
      {
        serviceId: CONTACTLESS_BAG_SERVICE_ID,
        title: bagTitle ?? 'Bag',
        quantity: 1,
        optional: false,
      },
    ];
  }

  const slots: GarmentPhotoServiceSlot[] = [];

  for (const [optionId, qty] of Object.entries(selection.quantities)) {
    if (qty <= 0) {
      continue;
    }
    const option = getCatalogOptionById(optionId, garmentServiceId);
    if (!option) {
      continue;
    }
    slots.push({
      serviceId: optionId,
      title: option.title,
      quantity: qty,
      optional: false,
    });
  }

  for (const combo of selection.savedCombos) {
    const comboQty = getComboGarmentQuantity(combo.items);
    if (comboQty <= 0) {
      continue;
    }
    const title = formatComboLabel(combo.items.map((item) => item.title));
    slots.push({
      serviceId: `combo:${combo.id}`,
      title,
      quantity: comboQty,
      optional: false,
    });
  }

  if (slots.length === 1) {
    slots[0] = { ...slots[0], optional: true };
  }

  return slots;
}

export function garmentPhotoSlotsFromBasketLine(
  line: CheckoutBasketLine,
  selection: ProviderGarmentCartSelection | undefined,
): GarmentPhotoServiceSlot[] {
  const isBulk = isBulkServiceId(line.serviceId);
  if (!selection && !isBulk) {
    return line.detailLines.map((detail, index) => ({
      serviceId: `legacy-svc-${index}`,
      title: detail.replace(/^\d+x\s*/, ''),
      quantity: 1,
      optional: line.detailLines.length === 1,
    }));
  }
  return buildGarmentPhotoServiceSlots(
    selection ?? { quantities: {}, savedCombos: [] },
    line.serviceId,
    isBulk,
    line.weightSubline,
  );
}

export function contactlessGarmentPhotoSlotKey(garmentId: string, serviceId: string) {
  return `${garmentId}::${serviceId}`;
}

export function garmentHasPhoto(
  store: ContactlessGarmentPhotoStore,
  garmentId: string,
  serviceId: string,
): boolean {
  const uris = store[garmentId]?.[serviceId];
  return Boolean(uris && uris.length > 0);
}

export function requiredGarmentPhotoSlots(slots: GarmentPhotoServiceSlot[]): GarmentPhotoServiceSlot[] {
  return slots.filter((slot) => !slot.optional);
}

/** Distinct linked service slots that must have photos (any n−1 of n when n > 1). */
export function garmentLinkedPhotoTargetCount(linkedServiceCount: number): number {
  if (linkedServiceCount <= 1) {
    return 0;
  }
  return Math.max(1, linkedServiceCount - 1);
}

function garmentSlotsWithPhotoCount(
  store: ContactlessGarmentPhotoStore,
  garmentId: string,
  slots: GarmentPhotoServiceSlot[],
): number {
  return slots.filter((slot) => garmentHasPhoto(store, garmentId, slot.serviceId)).length;
}

/** Basket-level rule: photos on any (n−1) of n linked services, or none when only one optional slot. */
export function garmentBasketPhotoSatisfied(
  store: ContactlessGarmentPhotoStore,
  garmentId: string,
  slots: GarmentPhotoServiceSlot[],
): boolean {
  const linkedCount = slots.length;
  if (linkedCount === 0) {
    return true;
  }
  if (linkedCount === 1) {
    const required = requiredGarmentPhotoSlots(slots);
    if (required.length === 0) {
      return true;
    }
    return garmentHasPhoto(store, garmentId, required[0].serviceId);
  }
  const target = garmentLinkedPhotoTargetCount(linkedCount);
  return garmentSlotsWithPhotoCount(store, garmentId, slots) >= target;
}

export function garmentPhotoProgressFraction(
  store: ContactlessGarmentPhotoStore,
  garmentId: string,
  slots: GarmentPhotoServiceSlot[],
): number {
  const linkedCount = slots.length;
  if (linkedCount === 0) {
    return 1;
  }
  if (linkedCount === 1) {
    const required = requiredGarmentPhotoSlots(slots);
    if (required.length === 0) {
      return 1;
    }
    return garmentHasPhoto(store, garmentId, required[0].serviceId) ? 1 : 0;
  }
  const target = garmentLinkedPhotoTargetCount(linkedCount);
  const withPhoto = garmentSlotsWithPhotoCount(store, garmentId, slots);
  return Math.min(1, withPhoto / target);
}

/** Instruction above the service carousel for the active garment's linked services. */
export function garmentPhotoUploadHint(slots: GarmentPhotoServiceSlot[]): string | null {
  const linkedCount = slots.length;
  if (linkedCount === 0) {
    return null;
  }
  if (linkedCount === 1) {
    return 'No mandatory uploads required';
  }
  const photoTargetCount = garmentLinkedPhotoTargetCount(linkedCount);
  return `Upload photos for any ${photoTargetCount} services`;
}

export function basketGarmentThumbVariant(serviceId: string): 'bulk' | 'tshirt' | 'top' {
  if (isBulkServiceId(serviceId)) {
    return 'bulk';
  }
  const catalogId = garmentCatalogIdFromServiceId(serviceId);
  if (catalogId === 'tshirt' || catalogId === 'shirt') {
    return 'tshirt';
  }
  return 'top';
}
