import { Stack } from 'expo-router';

export default function createRecipeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="ingredients" options={{ headerShown: false }} />
      <Stack.Screen name="newProcedure" options={{ headerShown: false }} />
      <Stack.Screen name="released" options={{ headerShown: false }} />
    </Stack>
  );
}