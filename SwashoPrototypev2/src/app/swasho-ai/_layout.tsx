import { Stack } from 'expo-router';

export default function SwashoAiLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="scan" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}
