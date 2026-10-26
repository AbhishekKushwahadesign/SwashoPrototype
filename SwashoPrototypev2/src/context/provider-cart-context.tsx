import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import type {
  ProviderCheckoutState,
  ProviderOrderFulfillmentMode,
  SubscriptionFrequencyOption,
} from '@/lib/checkout-flow';
import type { ContactlessGarmentPhotoStore } from '@/lib/contactless-garment-photos';
import {
  computeSelectionStickyMetrics,
  garmentAssignmentItemCount,
  providerCartKey,
  type ProviderGarmentCartSelection,
} from '@/lib/provider-cart-selection';

type ProviderCartStore = Record<string, ProviderGarmentCartSelection>;
type ProviderCheckoutStore = Record<string, ProviderCheckoutState>;
type ContactlessPhotoStoreByProvider = Record<string, ContactlessGarmentPhotoStore>;

type ProviderCartEntry = { serviceId: string; selection: ProviderGarmentCartSelection };

type ProviderCartContextValue = {
  getSelection: (providerId: string, serviceId: string) => ProviderGarmentCartSelection | undefined;
  getProviderCartEntries: (providerId: string) => ProviderCartEntry[];
  setSelection: (providerId: string, serviceId: string, selection: ProviderGarmentCartSelection) => void;
  clearSelection: (providerId: string, serviceId: string) => void;
  getProviderCartTotals: (providerId: string) => { itemCount: number; totalPrice: number };
  getCheckoutState: (providerId: string) => ProviderCheckoutState;
  setFulfillmentMode: (providerId: string, mode: ProviderOrderFulfillmentMode) => void;
  setSubscriptionFrequency: (providerId: string, frequency: SubscriptionFrequencyOption) => void;
  setOneTimeSchedule: (
    providerId: string,
    patch: Partial<
      Pick<
        ProviderCheckoutState,
        'pickupWeekday' | 'pickupDayKey' | 'pickupTimeSlot' | 'deliverySameAsPickup' | 'deliveryTimeSlot'
      >
    >,
  ) => void;
  setSubscriptionSchedule: (
    providerId: string,
    patch: Partial<
      Pick<
        ProviderCheckoutState,
        | 'subscriptionPickupWeekdays'
        | 'subscriptionPickupTimeSlot'
        | 'subscriptionDeliverySameAsPickup'
        | 'subscriptionDeliveryTimeSlot'
        | 'subscriptionStartDateKey'
      >
    >,
  ) => void;
  setContactlessCheckout: (
    providerId: string,
    patch: Partial<
      Pick<
        ProviderCheckoutState,
        | 'contactlessService'
        | 'contactlessFirstEntryCompleted'
        | 'contactlessClothesLocationId'
        | 'contactlessClothesLocationOther'
      >
    >,
  ) => void;
  getContactlessGarmentPhotos: (providerId: string) => ContactlessGarmentPhotoStore;
  addContactlessGarmentPhoto: (
    providerId: string,
    garmentId: string,
    serviceId: string,
    uri: string,
  ) => void;
  removeContactlessGarmentPhoto: (
    providerId: string,
    garmentId: string,
    serviceId: string,
    uri: string,
  ) => void;
};

const ProviderCartContext = createContext<ProviderCartContextValue | null>(null);

export function ProviderCartProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<ProviderCartStore>({});
  const [checkoutStore, setCheckoutStore] = useState<ProviderCheckoutStore>({});
  const [contactlessPhotoStore, setContactlessPhotoStore] = useState<ContactlessPhotoStoreByProvider>({});

  const getSelection = useCallback(
    (providerId: string, serviceId: string) => store[providerCartKey(providerId, serviceId)],
    [store],
  );

  const getProviderCartEntries = useCallback(
    (providerId: string): ProviderCartEntry[] => {
      const prefix = `${providerId}::`;
      const entries: ProviderCartEntry[] = [];
      for (const [key, selection] of Object.entries(store)) {
        if (!key.startsWith(prefix)) {
          continue;
        }
        entries.push({ serviceId: key.slice(prefix.length), selection });
      }
      return entries;
    },
    [store],
  );

  const setSelection = useCallback((providerId: string, serviceId: string, selection: ProviderGarmentCartSelection) => {
    setStore((prev) => ({
      ...prev,
      [providerCartKey(providerId, serviceId)]: selection,
    }));
  }, []);

  const clearSelection = useCallback((providerId: string, serviceId: string) => {
    const key = providerCartKey(providerId, serviceId);
    setStore((prev) => {
      if (!(key in prev)) {
        return prev;
      }
      const { [key]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const getCheckoutState = useCallback(
    (providerId: string) => checkoutStore[providerId] ?? {},
    [checkoutStore],
  );

  const setFulfillmentMode = useCallback((providerId: string, mode: ProviderOrderFulfillmentMode) => {
    setCheckoutStore((prev) => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        fulfillmentMode: mode,
      },
    }));
  }, []);

  const setSubscriptionFrequency = useCallback((providerId: string, frequency: SubscriptionFrequencyOption) => {
    setCheckoutStore((prev) => ({
      ...prev,
      [providerId]: {
        ...prev[providerId],
        subscriptionFrequency: frequency,
      },
    }));
  }, []);

  const setOneTimeSchedule = useCallback(
    (
      providerId: string,
      patch: Partial<
        Pick<
        ProviderCheckoutState,
        'pickupWeekday' | 'pickupDayKey' | 'pickupTimeSlot' | 'deliverySameAsPickup' | 'deliveryTimeSlot'
      >
      >,
    ) => {
      setCheckoutStore((prev) => ({
        ...prev,
        [providerId]: {
          ...prev[providerId],
          ...patch,
        },
      }));
    },
    [],
  );

  const setSubscriptionSchedule = useCallback(
    (
      providerId: string,
      patch: Partial<
        Pick<
          ProviderCheckoutState,
          | 'subscriptionPickupWeekdays'
          | 'subscriptionPickupTimeSlot'
          | 'subscriptionDeliverySameAsPickup'
          | 'subscriptionDeliveryTimeSlot'
          | 'subscriptionStartDateKey'
        >
      >,
    ) => {
      setCheckoutStore((prev) => ({
        ...prev,
        [providerId]: {
          ...prev[providerId],
          ...patch,
        },
      }));
    },
    [],
  );

  const setContactlessCheckout = useCallback(
    (
      providerId: string,
      patch: Partial<
        Pick<
          ProviderCheckoutState,
          | 'contactlessService'
          | 'contactlessFirstEntryCompleted'
          | 'contactlessClothesLocationId'
          | 'contactlessClothesLocationOther'
        >
      >,
    ) => {
      setCheckoutStore((prev) => ({
        ...prev,
        [providerId]: {
          ...prev[providerId],
          ...patch,
        },
      }));
    },
    [],
  );

  const getContactlessGarmentPhotos = useCallback(
    (providerId: string) => contactlessPhotoStore[providerId] ?? {},
    [contactlessPhotoStore],
  );

  const addContactlessGarmentPhoto = useCallback(
    (providerId: string, garmentId: string, serviceId: string, uri: string) => {
      setContactlessPhotoStore((prev) => {
        const providerStore = prev[providerId] ?? {};
        const garmentStore = providerStore[garmentId] ?? {};
        const existing = garmentStore[serviceId] ?? [];
        if (existing.includes(uri)) {
          return prev;
        }
        return {
          ...prev,
          [providerId]: {
            ...providerStore,
            [garmentId]: {
              ...garmentStore,
              [serviceId]: [...existing, uri],
            },
          },
        };
      });
    },
    [],
  );

  const removeContactlessGarmentPhoto = useCallback(
    (providerId: string, garmentId: string, serviceId: string, uri: string) => {
      setContactlessPhotoStore((prev) => {
        const providerStore = prev[providerId];
        if (!providerStore) {
          return prev;
        }
        const garmentStore = providerStore[garmentId];
        if (!garmentStore) {
          return prev;
        }
        const nextUris = (garmentStore[serviceId] ?? []).filter((item) => item !== uri);
        return {
          ...prev,
          [providerId]: {
            ...providerStore,
            [garmentId]: {
              ...garmentStore,
              [serviceId]: nextUris,
            },
          },
        };
      });
    },
    [],
  );

  const getProviderCartTotals = useCallback(
    (providerId: string) => {
      let itemCount = 0;
      let totalPrice = 0;
      const prefix = `${providerId}::`;

      for (const [key, selection] of Object.entries(store)) {
        if (!key.startsWith(prefix)) {
          continue;
        }
        const serviceId = key.slice(prefix.length);
        const count = garmentAssignmentItemCount(selection, serviceId);
        if (count <= 0) {
          continue;
        }
        itemCount += count;
        totalPrice += computeSelectionStickyMetrics(selection, serviceId).totalPrice;
      }

      return { itemCount, totalPrice };
    },
    [store],
  );

  const value = useMemo(
    () => ({
      getSelection,
      getProviderCartEntries,
      setSelection,
      clearSelection,
      getProviderCartTotals,
      getCheckoutState,
      setFulfillmentMode,
      setOneTimeSchedule,
      setSubscriptionFrequency,
      setSubscriptionSchedule,
      setContactlessCheckout,
      getContactlessGarmentPhotos,
      addContactlessGarmentPhoto,
      removeContactlessGarmentPhoto,
    }),
    [
      addContactlessGarmentPhoto,
      clearSelection,
      getContactlessGarmentPhotos,
      getCheckoutState,
      getProviderCartTotals,
      getProviderCartEntries,
      getSelection,
      removeContactlessGarmentPhoto,
      setContactlessCheckout,
      setFulfillmentMode,
      setOneTimeSchedule,
      setSelection,
      setSubscriptionFrequency,
      setSubscriptionSchedule,
    ],
  );

  return <ProviderCartContext.Provider value={value}>{children}</ProviderCartContext.Provider>;
}

export function useProviderCart(): ProviderCartContextValue {
  const ctx = useContext(ProviderCartContext);
  if (!ctx) {
    throw new Error('useProviderCart must be used within ProviderCartProvider');
  }
  return ctx;
}
