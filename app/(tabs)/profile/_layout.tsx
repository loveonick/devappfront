import { Stack } from 'expo-router';

export default function editProfileLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="EditProfileScreen" options={{ headerShown: false }} />
    </Stack>
  );
}