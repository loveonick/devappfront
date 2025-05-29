import { View, Text, Button, ScrollView } from 'react-native';
import { router } from 'expo-router';

export default function TestNavigator() {
  return (
    <ScrollView className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold mb-4">Pantalla de pruebas</Text>

      <Button title="Intro Screen 1" onPress={() => router.push('/intro/screen1')} />
      <Button title="Intro Screen 2" onPress={() => router.push('/intro/screen2')} />

      <View className="my-2" />

      <Button title="Perfil" onPress={() => router.push('/profile')} />
      <Button title="Configuración" onPress={() => router.push('/settings')} />
    </ScrollView>
  );
}
