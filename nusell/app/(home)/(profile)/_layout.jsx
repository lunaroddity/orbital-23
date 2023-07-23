import { Stack } from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="profile" />
      <Stack.Screen 
        name="editProfile"
        options={{
          headerTitle: "Edit Profile",
          headerStyle: {backgroundColor: "#003D7C"},
          headerTintColor: "#fff"
        }} />
        <Stack.Screen 
        name="viewPost"
        options={{
          headerShown: false
        }} />
    </Stack>
  );
}