import { useLocalSearchParams, useRouter } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';

import { ServiceSelectionScreen } from '@/components/service-selection/ServiceSelectionScreen';
import { useProviderCart } from '@/context/provider-cart-context';
import { emptyProviderGarmentCartSelection, hasProviderCartSelection } from '@/lib/provider-cart-selection';

export default function ServiceSelectionRoute() {
  const router = useRouter();
  const { getSelection, setSelection, clearSelection } = useProviderCart();
  const { serviceId, providerId, q } = useLocalSearchParams<{
    serviceId?: string;
    providerId?: string;
    q?: string;
  }>();

  const resolvedServiceId = serviceId ?? 'mens-shirt';
  const resolvedProviderId = providerId ?? '';
  const initialSelection = resolvedProviderId
    ? getSelection(resolvedProviderId, resolvedServiceId)
    : undefined;

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace({
      pathname: '/provider/[id]',
      params: { id: resolvedProviderId, q: q ?? '' },
    });
  };

  const handleConfirm = (selection: ReturnType<typeof emptyProviderGarmentCartSelection>) => {
    if (resolvedProviderId) {
      if (hasProviderCartSelection(selection, resolvedServiceId)) {
        setSelection(resolvedProviderId, resolvedServiceId, selection);
      } else {
        clearSelection(resolvedProviderId, resolvedServiceId);
      }
    }
    handleClose();
  };

  return (
    <View style={styles.root}>
      <ServiceSelectionScreen
        serviceId={resolvedServiceId}
        providerId={providerId}
        query={q}
        initialSelection={initialSelection ?? emptyProviderGarmentCartSelection()}
        onConfirm={handleConfirm}
        onClose={handleClose}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: 'transparent',
    ...Platform.select({
      web: {
        position: 'absolute',
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
        width: '100%',
        minHeight: '100%',
      },
      default: {},
    }),
  },
});
