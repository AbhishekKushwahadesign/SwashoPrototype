import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useScreenScale } from '@/components/home/scale';
import { figmaShadow, FigmaShadows } from '@/components/home/figma-shadows';
import { ServiceSelectionButton } from '@/components/service-selection/ServiceSelectionButton';
import { useProviderCart } from '@/context/provider-cart-context';
import {
  checkoutPlaceholderHref,
  SUBSCRIPTION_FREQUENCY_OPTIONS,
  type SubscriptionFrequencyOption,
} from '@/lib/checkout-flow';
import { searchFont } from '@/components/search/search-fonts';
import { SwashoColors, SwashoRadii } from '@/constants/swasho-tokens';

import { CheckoutProgressStepper } from './CheckoutProgressStepper';
import { CheckoutScreenShell } from './CheckoutScreenShell';

type SubscriptionFrequencyScreenProps = {
  providerId: string;
  query: string;
};

function FrequencyOptionRow({
  option,
  selected,
  onSelect,
  scale,
}: {
  option: (typeof SUBSCRIPTION_FREQUENCY_OPTIONS)[number];
  selected: boolean;
  onSelect: () => void;
  scale: number;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onSelect}
      style={({ pressed }) => [
        styles.frequencyRow,
        selected && styles.frequencyRowSelected,
        {
          borderRadius: SwashoRadii.md * scale,
          paddingHorizontal: 16 * scale,
          paddingVertical: 12 * scale,
          opacity: pressed ? 0.9 : 1,
        },
      ]}>
      {option.popular ? (
        <View
          style={[
            styles.popularBadge,
            {
              top: -10 * scale,
              right: 12 * scale,
              paddingHorizontal: 12 * scale,
              paddingVertical: 4 * scale,
              borderRadius: SwashoRadii.md * scale,
            },
          ]}>
          <Text
            style={[
              searchFont('medium'),
              styles.popularLabel,
              { fontSize: 12 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
            ]}>
            Popular
          </Text>
        </View>
      ) : null}
      <View style={{ gap: 8 * scale }}>
        <Text
          style={[
            searchFont('semibold'),
            styles.frequencyTitle,
            { fontSize: 15 * scale, lineHeight: 14 * scale, letterSpacing: 0.3 * scale },
          ]}>
          {option.title}
        </Text>
        <Text
          style={[
            searchFont('medium'),
            styles.frequencyDescription,
            { fontSize: 13 * scale, lineHeight: 20 * scale, letterSpacing: 0.5 * scale },
          ]}>
          {option.description}
        </Text>
      </View>
    </Pressable>
  );
}

export function SubscriptionFrequencyScreen({ providerId, query }: SubscriptionFrequencyScreenProps) {
  const router = useRouter();
  const { scale, contentWidth } = useScreenScale();
  const { getCheckoutState, setSubscriptionFrequency } = useProviderCart();
  const persisted = getCheckoutState(providerId).subscriptionFrequency;
  const [selectedFrequency, setSelectedFrequency] = useState<SubscriptionFrequencyOption | null>(
    persisted ?? null,
  );
  const confirmLockRef = useRef(false);

  const handleBackPress = useCallback(() => {
    router.back();
  }, [router]);

  const handleConfirm = useCallback(() => {
    if (!selectedFrequency || confirmLockRef.current) {
      return;
    }
    confirmLockRef.current = true;
    setSubscriptionFrequency(providerId, selectedFrequency);
    router.replace(
      checkoutPlaceholderHref(providerId, query, { subscription: true }),
    );
    setTimeout(() => {
      confirmLockRef.current = false;
    }, 600);
  }, [providerId, query, router, selectedFrequency, setSubscriptionFrequency]);

  const footer = (
    <ServiceSelectionButton
      label="Confirm"
      variant="primary"
      disabled={selectedFrequency == null}
      onPress={handleConfirm}
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
        <CheckoutProgressStepper
          scale={scale}
          activeStep={1}
          stepOneProgress={selectedFrequency ? 0.85 : 0.35}
        />

        <View
          style={[
            styles.panel,
            {
              borderRadius: SwashoRadii.lg * scale,
              padding: 16 * scale,
              gap: 16 * scale,
              ...figmaShadow(FigmaShadows.providerCard, scale),
            },
          ]}>
          <Text
            style={[
              searchFont('medium'),
              styles.panelTitle,
              { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
            ]}>
            Choose your laundry frequency
          </Text>
          <View style={{ gap: 16 * scale }}>
            {SUBSCRIPTION_FREQUENCY_OPTIONS.map((option) => (
              <FrequencyOptionRow
                key={option.id}
                option={option}
                selected={selectedFrequency === option.id}
                onSelect={() => setSelectedFrequency(option.id)}
                scale={scale}
              />
            ))}
          </View>
        </View>

        <View
          style={[
            styles.collapsedRow,
            {
              borderRadius: SwashoRadii.lg * scale,
              padding: 16 * scale,
              ...figmaShadow(FigmaShadows.providerCard, scale),
            },
          ]}>
          <Text
            style={[
              searchFont('medium'),
              styles.collapsedLabel,
              { fontSize: 16 * scale, lineHeight: 14 * scale, letterSpacing: 0.5 * scale },
            ]}>
            Choose Day & Time
          </Text>
          <Text style={[searchFont('medium'), styles.collapsedHint, { fontSize: 12 * scale }]}>Coming next</Text>
        </View>
      </ScrollView>
    </CheckoutScreenShell>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    alignItems: 'center',
  },
  panel: {
    backgroundColor: SwashoColors.surface,
    width: '100%',
  },
  panelTitle: {
    color: SwashoColors.darkHeaderText,
    textAlign: 'center',
  },
  frequencyRow: {
    borderWidth: 1,
    borderColor: SwashoColors.neutral200,
    backgroundColor: SwashoColors.surface,
    position: 'relative',
  },
  frequencyRowSelected: {
    borderWidth: 1.5,
    borderColor: SwashoColors.primary600,
  },
  frequencyTitle: {
    color: SwashoColors.neutral950,
  },
  frequencyDescription: {
    color: SwashoColors.neutral600,
  },
  popularBadge: {
    position: 'absolute',
    backgroundColor: '#16a34a',
    zIndex: 1,
  },
  popularLabel: {
    color: '#f0fdf5',
  },
  collapsedRow: {
    backgroundColor: SwashoColors.surface,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  collapsedLabel: {
    color: SwashoColors.darkHeaderText,
  },
  collapsedHint: {
    color: SwashoColors.neutral500,
  },
});
