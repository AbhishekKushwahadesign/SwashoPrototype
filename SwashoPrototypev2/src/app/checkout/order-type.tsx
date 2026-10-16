import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSafeTopInset } from '@/components/home/scale';
import { oneTimeCheckoutHref } from '@/lib/checkout-flow';
import { SwashoFonts } from '@/constants/swasho-tokens';

/** Legacy route: `/checkout/order-type` always forwards to one-time schedule UI. */
export default function CheckoutOrderTypeRoute() {
  const router = useRouter();
  const { providerId, q } = useLocalSearchParams<{ providerId?: string; q?: string }>();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const id = typeof providerId === 'string' ? providerId : '';
  const query = typeof q === 'string' ? q : '';

  useEffect(() => {
    if (!id) {
      return;
    }
    router.replace(oneTimeCheckoutHref(id, query));
  }, [id, query, router]);

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

  return <View style={styles.redirecting} />;
}

const styles = StyleSheet.create({
  redirecting: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
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
