import { Stack } from "expo-router";

export default function GroupIdLayout() {
  return (
    <Stack>
      <Stack.Screen name="addMembers" options={{ headerShown: false }} />
      <Stack.Screen name="details" options={{ headerShown: false }} />
      <Stack.Screen name="transaction" options={{ headerShown: false }} />
      <Stack.Screen name="settlement" options={{ headerShown: false }} />
    </Stack>
  );
}
