import { useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GarmentPhotoUploadScreen } from '@/components/checkout/GarmentPhotoUploadScreen';
import { useSafeTopInset } from '@/components/home/scale';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoFonts } from '@/constants/swasho-tokens';

export default function GarmentPhotoUploadRoute() {
  const router = useRouter();
  const { providerId, q, garmentId, serviceId } = useLocalSearchParams<{
    providerId?: string;
    q?: string;
    garmentId?: string;
    serviceId?: string;
  }>();
  const insets = useSafeAreaInsets();
  const safeTop = useSafeTopInset(insets.top);
  const id = typeof providerId === 'string' ? providerId : '';
  const query = typeof q === 'string' ? q : '';
  const garment = typeof garmentId === 'string' ? garmentId : '';
  const service = typeof serviceId === 'string' ? serviceId : '';

  if (!id || !garment || !service) {
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
        <Text style={[searchFont('semibold'), styles.notFoundTitle]}>Missing photo upload context</Text>
      </View>
    );
  }

  return (
    <GarmentPhotoUploadScreen
      providerId={id}
      query={query}
      initialGarmentId={garment}
      initialServiceId={service}
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
    color: SwashoColors.primary600,
  },
  notFoundTitle: {
    fontSize: 20,
    color: SwashoColors.neutral800,
  },
});
