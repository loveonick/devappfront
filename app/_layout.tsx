import { Stack } from 'expo-router';
import { AuthProvider } from './context/AuthContext';
import './global.css';
import { RecipeProvider } from './context/RecipeContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <RecipeProvider>      
        <Stack>
          <Stack.Screen
            name="test-navigator"
            options={{ title: 'Pantalla de prueba' }}
          />
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(auth)"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="(splash)"
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
        </Stack>
      </RecipeProvider>
    </AuthProvider>
  );
}