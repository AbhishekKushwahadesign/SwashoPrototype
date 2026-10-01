import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSafeTopInset } from '@/components/home/scale';

export default function Search2Route() {
  const router = useRouter();
  const { q } = useLocalSearchParams<{ q?: string }>();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const query = typeof q === 'string' ? q : '';

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/search');
  };

  return (
    <View style={[styles.root, { paddingTop: safeTop + 24 }]}>
      <Pressable onPress={handleBackPress} style={styles.backButton}>
        <Text style={styles.backLabel}>Back</Text>
      </Pressable>
      <Text style={styles.title}>Search 2</Text>
      <Text style={styles.subtitle}>Results for</Text>
      <Text style={styles.query}>{query || 'No query provided'}</Text>
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
    fontFamily: 'Poppins_500Medium',
    fontSize: 16,
    color: '#5d30f7',
  },
  title: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
    color: '#3d3d3d',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Poppins_400Regular',
    fontSize: 14,
    color: '#6b6b6b',
    marginBottom: 4,
  },
  query: {
    fontFamily: 'Poppins_500Medium',
    fontSize: 18,
    color: '#3d3d3d',
    textAlign: 'center',
  },
});
