import {Stack} from 'expo-router';
import "./global.css"

export default function RootLayout() {
  return <Stack>
    <Stack.Screen
      name="test-navigator"
      options={{ title: 'Pantalla de prueba' }}
    />
    <Stack.Screen
      name="login"
      options={{
        headerShown: false,
      }}
    />
    <Stack.Screen
      name="(tabs)"
      options={{
        headerShown: false,
      }}
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
}