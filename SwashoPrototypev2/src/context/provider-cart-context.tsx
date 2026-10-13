import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

import {
  computeSelectionStickyMetrics,
  garmentAssignmentItemCount,
  providerCartKey,
  type ProviderGarmentCartSelection,
} from '@/lib/provider-cart-selection';

type ProviderCartStore = Record<string, ProviderGarmentCartSelection>;

type ProviderCartContextValue = {
  getSelection: (providerId: string, serviceId: string) => ProviderGarmentCartSelection | undefined;
  setSelection: (providerId: string, serviceId: string, selection: ProviderGarmentCartSelection) => void;
  clearSelection: (providerId: string, serviceId: string) => void;
  getProviderCartTotals: (providerId: string) => { itemCount: number; totalPrice: number };
};

const ProviderCartContext = createContext<ProviderCartContextValue | null>(null);

export function ProviderCartProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<ProviderCartStore>({});

  const getSelection = useCallback(
    (providerId: string, serviceId: string) => store[providerCartKey(providerId, serviceId)],
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
        totalPrice += computeSelectionStickyMetrics(selection).totalPrice;
      }

      return { itemCount, totalPrice };
    },
    [store],
  );

  const value = useMemo(
    () => ({
      getSelection,
      setSelection,
      clearSelection,
      getProviderCartTotals,
    }),
    [clearSelection, getProviderCartTotals, getSelection, setSelection],
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
