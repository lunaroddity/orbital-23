import { Stack } from "expo-router";

export default function LikesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" />
      <Stack.Screen name="viewPost" options={{headerShown: false}} />
    </Stack>
  );
}