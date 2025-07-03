import { View, Text, Pressable } from 'react-native';
import { router } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

export default function PublicadoScreen() {
  const { id } = useLocalSearchParams();
  
  return (
    <View className="flex-1 bg-white justify-center items-center px-6">
      <Text className="text-2xl font-bold text-center mb-4">¡Receta creada correctamente!</Text>
      <Text className="text-base text-center mb-8">Ahora puedes verla en tu lista de recetas</Text>

      <View className="flex-row space-x-4">
        <Pressable
          onPress={() => router.push('/createrecipe')} 
          className="bg-[#9D5C63] rounded-full px-6 py-2"
        >
          <Text className="text-white font-bold text-base">Crear otra receta</Text>
        </Pressable>
        <Pressable
          onPress={() => router.push('/')}
          className="bg-gray-400 rounded-full px-6 py-2"
        >
          <Text className="text-white font-bold text-base">Ir al inicio</Text>
        </Pressable>
      </View>
    </View>
  );
}