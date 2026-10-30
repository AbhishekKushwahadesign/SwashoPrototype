import '../../global.css';

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  useFonts,
} from '@expo-google-fonts/poppins';
import { PublicSans_700Bold } from '@expo-google-fonts/public-sans';
import { Quando_400Regular } from '@expo-google-fonts/quando';
import { Roboto_500Medium } from '@expo-google-fonts/roboto';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';

import { ProviderCartProvider } from '@/context/provider-cart-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    PublicSans_700Bold,
    Quando_400Regular,
    Roboto_500Medium,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return <View />;
  }

  return (
    <ProviderCartProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          // Unmount Home/Subscription when pushing Swasho AI so bottom nav cannot bleed through.
          detachInactiveScreens: true,
        }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="subscription" />
        <Stack.Screen name="swasho-ai" />
        <Stack.Screen name="search" />
        <Stack.Screen name="provider-results" />
        <Stack.Screen name="provider/[id]" />
        <Stack.Screen
          name="service-selection"
          options={{
            presentation: 'transparentModal',
            animation: 'fade',
            contentStyle: { backgroundColor: 'transparent' },
            cardStyle: { backgroundColor: 'transparent' },
          }}
        />
        <Stack.Screen name="checkout" />
      </Stack>
    </ProviderCartProvider>
  );
}
