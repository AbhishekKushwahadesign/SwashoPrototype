import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSafeTopInset } from '@/components/home/scale';
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

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace({ pathname: '/provider-results', params: { q: query } });
  };

  return (
    <View style={[styles.root, { paddingTop: safeTop + 24 }]}>
      <Pressable onPress={handleBackPress} style={styles.backButton}>
        <Text style={styles.backLabel}>Back</Text>
      </Pressable>
      <Text style={styles.title}>Provider Details</Text>
      <Text style={styles.subtitle}>Coming soon</Text>
      {provider ? (
        <Text style={styles.query}>{provider.serviceName} — {provider.category}</Text>
      ) : (
        <Text style={styles.query}>Provider not found</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
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
  title: {
    fontFamily: SwashoFonts.poppinsSemiBold,
    fontSize: 24,
    color: '#3d3d3d',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: SwashoFonts.poppinsRegular,
    fontSize: 14,
    color: '#6b6b6b',
    marginBottom: 4,
  },
  query: {
    fontFamily: SwashoFonts.poppinsMedium,
    fontSize: 18,
    color: '#3d3d3d',
    textAlign: 'center',
  },
});
