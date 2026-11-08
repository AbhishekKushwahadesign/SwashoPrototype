import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';

import { useProviderCart } from '@/context/provider-cart-context';
import { ensurePrototypeSampleProviderCart } from '@/lib/prototype-sample-provider-cart';

type UseEnsurePrototypeSampleCartOptions = {
  /** When true, skip seeding (e.g. missing provider id). */
  skip?: boolean;
  /** When false, seed cart items only (subscription cold entry; no default one-time mode). */
  includeOneTimeFulfillmentDefault?: boolean;
};

/**
 * Seeds the prototype sample provider cart on direct/cold entry to checkout routes.
 * Does not run when navigation history exists, when `fromAiDemo=1`, or when the cart is non-empty.
 */
export function useEnsurePrototypeSampleCartOnDirectEntry(
  providerId: string,
  options?: UseEnsurePrototypeSampleCartOptions,
): void {
  const router = useRouter();
  const { fromAiDemo } = useLocalSearchParams<{ fromAiDemo?: string }>();
  const cart = useProviderCart();
  const attemptedRef = useRef(false);

  useEffect(() => {
    if (options?.skip || !providerId) {
      return;
    }
    if (fromAiDemo === '1') {
      return;
    }
    if (router.canGoBack()) {
      return;
    }
    if (attemptedRef.current) {
      return;
    }
    attemptedRef.current = true;

    ensurePrototypeSampleProviderCart(
      providerId,
      {
        getProviderCartTotals: cart.getProviderCartTotals,
        setSelection: cart.setSelection,
        setFulfillmentMode: cart.setFulfillmentMode,
      },
      { includeOneTimeFulfillmentDefault: options?.includeOneTimeFulfillmentDefault },
    );
  }, [
    cart.getProviderCartTotals,
    cart.setFulfillmentMode,
    cart.setSelection,
    fromAiDemo,
    options?.includeOneTimeFulfillmentDefault,
    options?.skip,
    providerId,
    router,
  ]);
}
