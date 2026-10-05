import { useLocalSearchParams } from 'expo-router';

import { ProviderResultsScreen } from '@/components/provider-results/ProviderResultsScreen';

export default function ProviderResultsRoute() {
  const { q } = useLocalSearchParams<{ q?: string }>();
  const query = typeof q === 'string' ? q : '';

  return <ProviderResultsScreen query={query} />;
}
