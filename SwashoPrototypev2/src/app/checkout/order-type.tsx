import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { OrderTypeChoiceScreen } from '@/components/checkout/OrderTypeChoiceScreen';
import { useSafeTopInset } from '@/components/home/scale';
import { SwashoFonts } from '@/constants/swasho-tokens';

export default function CheckoutOrderTypeRoute() {
  const router = useRouter();
  const { providerId, q } = useLocalSearchParams<{ providerId?: string; q?: string }>();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const id = typeof providerId === 'string' ? providerId : '';
  const query = typeof q === 'string' ? q : '';

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

  return <OrderTypeChoiceScreen providerId={id} query={query} />;
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
