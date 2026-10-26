import { Stack } from 'expo-router';

export default function SwashoAiLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="demo-select" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="demo-analysis" options={{ animation: 'slide_from_right' }} />
      <Stack.Screen name="scan" options={{ animation: 'slide_from_right' }} />
    </Stack>
  );
}
