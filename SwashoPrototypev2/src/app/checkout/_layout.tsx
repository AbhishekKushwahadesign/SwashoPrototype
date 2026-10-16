import { Stack } from 'expo-router';

export default function CheckoutLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="order-type" />
      <Stack.Screen name="subscription-frequency" />
      <Stack.Screen name="index" />
    </Stack>
  );
}
