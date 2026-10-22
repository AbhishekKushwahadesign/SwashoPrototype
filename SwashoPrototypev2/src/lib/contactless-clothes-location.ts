import type { ContactlessClothesLocationId, ProviderCheckoutState } from '@/lib/checkout-flow';

export type { ContactlessClothesLocationId };

export type ContactlessClothesLocationOption = {
  id: ContactlessClothesLocationId;
  title: string;
  description: string;
};

export const CONTACTLESS_CLOTHES_LOCATION_OPTIONS: ContactlessClothesLocationOption[] = [
  {
    id: 'flat-door',
    title: 'Flat Door',
    description: 'We will collect directly from your flat door',
  },
  {
    id: 'society-gate',
    title: 'Society Gate / Watchman',
    description: 'Hand over to society security or watchman',
  },
  {
    id: 'society-lobby',
    title: 'Society Lobby',
    description: 'Leave at building lobby or reception area',
  },
  {
    id: 'maid',
    title: 'Maid / Domestic Help',
    description: 'Hand over to your maid or domestic help',
  },
  {
    id: 'other',
    title: 'Other Location',
    description: '',
  },
];

export function contactlessClothesLocationLabel(
  locationId: ContactlessClothesLocationId | undefined,
  otherText: string | undefined,
): string | null {
  if (!locationId) {
    return null;
  }
  if (locationId === 'other') {
    const trimmed = otherText?.trim();
    return trimmed && trimmed.length > 0 ? trimmed : null;
  }
  return CONTACTLESS_CLOTHES_LOCATION_OPTIONS.find((option) => option.id === locationId)?.title ?? null;
}

export function isContactlessClothesLocationValid(state: ProviderCheckoutState): boolean {
  return contactlessClothesLocationLabel(state.contactlessClothesLocationId, state.contactlessClothesLocationOther) != null;
}
