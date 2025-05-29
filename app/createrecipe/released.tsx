import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';

export default function PublicadoScreen() {
  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      <Text className="text-2xl font-bold text-center mb-4">¡Se ha publicado correctamente!</Text>
      <Text className="text-base text-center mb-8">Espera notificaciones de tu receta</Text>

      <Pressable
        onPress={() => router.push('/(tabs)')} 
        className="bg-[#9D5C63] rounded-full px-6 py-2"
      >
        <Text className="text-white font-bold text-base">Regresar</Text>
      </Pressable>
    </View>
  );
}
