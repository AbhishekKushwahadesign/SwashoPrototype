import { Stack } from 'expo-router';

export default function CheckoutLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="order-type" />
      <Stack.Screen name="subscription-frequency" />
      <Stack.Screen name="subscribe-2" />
      <Stack.Screen name="index" />
      <Stack.Screen name="review" />
      <Stack.Screen name="garment-photo-upload" />
    </Stack>
  );
}
