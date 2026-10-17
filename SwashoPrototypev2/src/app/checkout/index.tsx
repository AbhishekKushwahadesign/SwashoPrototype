import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CheckoutReviewScreen } from '@/components/checkout/CheckoutReviewScreen';
import { OneTimeCheckoutScreen } from '@/components/checkout/OneTimeCheckoutScreen';
import { useSafeTopInset } from '@/components/home/scale';
import { useProviderCart } from '@/context/provider-cart-context';
import type { ProviderOrderFulfillmentMode } from '@/lib/checkout-flow';
import { SwashoFonts } from '@/constants/swasho-tokens';

export default function CheckoutRoute() {
  const router = useRouter();
  const { providerId, q, subscription, scheduleConfirmed, mode } = useLocalSearchParams<{
    providerId?: string;
    q?: string;
    subscription?: string;
    scheduleConfirmed?: string;
    mode?: string;
  }>();
  const { getCheckoutState } = useProviderCart();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const id = typeof providerId === 'string' ? providerId : '';
  const query = typeof q === 'string' ? q : '';
  const isSubscription = subscription === '1';
  const isScheduleConfirmed = scheduleConfirmed === '1';

  if (!id) {
    const handleBackPress = () => {
      if (router.canGoBack()) {
        router.back();
        return;
      }
      router.replace('/');
    };

    return (
      <View style={[styles.notFoundRoot, { paddingTop: safeTop + 24 }]}>
        <Pressable onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
        <Text style={styles.notFoundTitle}>Missing provider</Text>
      </View>
    );
  }

  if (isSubscription || isScheduleConfirmed) {
    return <CheckoutReviewScreen providerId={id} query={query} isSubscription={isSubscription} />;
  }

  const modeFromUrl: ProviderOrderFulfillmentMode | undefined =
    mode === 'subscribe' ? 'subscribe' : mode === 'one-time' ? 'one-time' : undefined;
  const modeFromCart = getCheckoutState(id).fulfillmentMode;
  const initialFulfillmentMode = modeFromUrl ?? modeFromCart;

  return (
    <OneTimeCheckoutScreen
      providerId={id}
      query={query}
      initialFulfillmentMode={initialFulfillmentMode}
    />
  );
}

const styles = StyleSheet.create({
  notFoundRoot: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    paddingHorizontal: 24,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 24,
  },
  backLabel: {
    fontFamily: SwashoFonts.poppinsMedium,
    fontSize: 16,
    color: '#5d30f7',
  },
  notFoundTitle: {
    fontFamily: SwashoFonts.poppinsSemiBold,
    fontSize: 24,
    color: '#3d3d3d',
  },
});
