import { useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { ServiceSelectionScreen } from '@/components/service-selection/ServiceSelectionScreen';

export default function ServiceSelectionRoute() {
  const router = useRouter();
  const { serviceId, providerId, q } = useLocalSearchParams<{
    serviceId?: string;
    providerId?: string;
    q?: string;
  }>();

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace({
      pathname: '/provider/[id]',
      params: { id: providerId ?? '', q: q ?? '' },
    });
  };

  return (
    <View style={styles.root}>
      <ServiceSelectionScreen
        serviceId={serviceId ?? 'mens-shirt'}
        providerId={providerId}
        query={q}
        onClose={handleClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
  },
});
