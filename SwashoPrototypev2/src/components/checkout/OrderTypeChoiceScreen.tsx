import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { useScreenScale } from '@/components/home/scale';
import { ServiceSelectionButton } from '@/components/service-selection/ServiceSelectionButton';
import { useProviderCart } from '@/context/provider-cart-context';
import {
  oneTimeCheckoutHref,
  ORDER_TYPE_OPTIONS,
  subscriptionFrequencyHref,
  type ProviderOrderFulfillmentMode,
} from '@/lib/checkout-flow';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors } from '@/constants/swasho-tokens';

import { CheckoutProgressStepper } from './CheckoutProgressStepper';
import { CheckoutScreenShell } from './CheckoutScreenShell';
import { OrderTypeChoiceCard } from './OrderTypeChoiceCard';

type OrderTypeChoiceScreenProps = {
  providerId: string;
  query: string;
};

export function OrderTypeChoiceScreen({ providerId, query }: OrderTypeChoiceScreenProps) {
  const router = useRouter();
  const { scale, contentWidth } = useScreenScale();
  const { setFulfillmentMode, getCheckoutState } = useProviderCart();
  const persistedMode = getCheckoutState(providerId).fulfillmentMode;
  const [selectedMode, setSelectedMode] = useState<ProviderOrderFulfillmentMode | null>(
    persistedMode ?? null,
  );
  const continueLockRef = useRef(false);

  const handleBackPress = useCallback(() => {
    router.back();
  }, [router]);

  const handleContinue = useCallback(() => {
    if (!selectedMode || continueLockRef.current) {
      return;
    }
    continueLockRef.current = true;
    setFulfillmentMode(providerId, selectedMode);

    if (selectedMode === 'one-time') {
      router.replace(oneTimeCheckoutHref(providerId, query));
    } else {
      router.replace(subscriptionFrequencyHref(providerId, query));
    }

    setTimeout(() => {
      continueLockRef.current = false;
    }, 600);
  }, [providerId, query, router, selectedMode, setFulfillmentMode]);

  const footer = (
    <ServiceSelectionButton
      label="Continue"
      variant="primary"
      disabled={selectedMode == null}
      onPress={handleContinue}
      scale={scale}
      style={{ width: '100%' }}
    />
  );

  return (
    <CheckoutScreenShell title="Choose Subscription Type" onBackPress={handleBackPress} footer={footer}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingHorizontal: 16 * scale,
            paddingTop: 12 * scale,
            paddingBottom: 24 * scale,
            width: contentWidth,
            gap: 20 * scale,
          },
        ]}
        showsVerticalScrollIndicator={false}>
        <CheckoutProgressStepper scale={scale} activeStep={1} />

        <Text
          style={[
            styles.heading,
            searchFont('medium'),
            {
              fontSize: 16 * scale,
              lineHeight: 20 * scale,
              letterSpacing: 0.5 * scale,
            },
          ]}>
          How often do you need laundry care?
        </Text>

        <View style={{ gap: 12 * scale, width: '100%' }}>
          {ORDER_TYPE_OPTIONS.map((option) => (
            <OrderTypeChoiceCard
              key={option.id}
              mode={option.id}
              title={option.title}
              description={option.description}
              selected={selectedMode === option.id}
              onSelect={() => setSelectedMode(option.id)}
              scale={scale}
            />
          ))}
        </View>
      </ScrollView>
    </CheckoutScreenShell>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
  },
  heading: {
    color: SwashoColors.darkHeaderText,
    textAlign: 'center',
    width: '100%',
  },
});
