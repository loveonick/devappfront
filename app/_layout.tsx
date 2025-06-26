import { Stack } from 'expo-router';
import './global.css';
import { RecipeProvider } from '../app/context/RecipeContext';

export default function RootLayout() {
  return (
    <RecipeProvider>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="recipes/[id]"
          options={{
            title: 'Receta',
            headerTitleAlign: 'center',
            headerTitleStyle: {
              fontSize: 20,
              fontWeight: 'bold',
            },
          }}
        />
        <Stack.Screen
          name="createrecipe"
          options={{ headerShown: false }}
        />
      </Stack>
    </RecipeProvider>
  );
}