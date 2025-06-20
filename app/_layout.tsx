import { Stack } from 'expo-router';
import { AuthProvider } from './context/AuthContext'; // Asegurate de que esté bien la ruta
import './global.css';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="test-navigator"
          options={{ title: 'Pantalla de prueba' }}
        />
        <Stack.Screen
          name="auth/login"
          options={{ headerShown: false }}
        />
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
      </Stack>
    </AuthProvider>
  );
}