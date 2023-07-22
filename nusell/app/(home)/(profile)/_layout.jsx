import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="profile" />
      <Stack.Screen name="editProfile" />
    </Stack>
  );
}