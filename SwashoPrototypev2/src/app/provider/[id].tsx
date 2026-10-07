import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSafeTopInset } from '@/components/home/scale';
import { ProviderPageScreen } from '@/components/provider-page/ProviderPageScreen';
import { SwashoFonts } from '@/constants/swasho-tokens';
import { getProviderResultById } from '@/data/providers';

export default function ProviderDetailsRoute() {
  const router = useRouter();
  const { id, q } = useLocalSearchParams<{ id?: string; q?: string }>();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const query = typeof q === 'string' ? q : '';
  const providerId = typeof id === 'string' ? id : '';
  const provider = getProviderResultById(providerId, query);

  if (!provider) {
    const handleBackPress = () => {
      if (router.canGoBack()) {
        router.back();
        return;
      }
      router.replace({ pathname: '/provider-results', params: { q: query } });
    };

    return (
      <View style={[styles.notFoundRoot, { paddingTop: safeTop + 24 }]}>
        <Pressable onPress={handleBackPress} style={styles.backButton}>
          <Text style={styles.backLabel}>Back</Text>
        </Pressable>
        <Text style={styles.notFoundTitle}>Provider not found</Text>
      </View>
    );
  }

  return <ProviderPageScreen provider={provider} query={query} />;
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
