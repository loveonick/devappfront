import { View, Text, TextInput, Switch, Image, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router'; // CORREGIDO
import * as ImagePicker from 'expo-image-picker';

export default function Index() {
  const router = useRouter(); // OK
  const [commentsEnabled, setCommentsEnabled] = useState(false);
  const [wifiOnly, setWifiOnly] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Permiso requerido para acceder a la galería');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 py-10">
      <Text className="text-xl font-bold mb-6 text-center">¡Agrega una receta!</Text>

      <Text className="font-semibold text-[#1C1B1F] mb-1">Nombre del plato</Text>
      <TextInput
        className="border border-[#9D5C63] rounded-md px-4 py-2 mb-4"
        placeholder="Ej: Tacos al pastor"
      />

      <Text className="font-semibold text-[#1C1B1F] mb-1">Descripción del plato</Text>
      <TextInput
        className="border border-[#9D5C63] rounded-md px-4 py-2 mb-4"
        placeholder="Describe tu plato"
      />

      <Text className="text-[#1C1B1F] font-bold mb-2">Imagen del Plato</Text>
      <TouchableOpacity
        onPress={pickImage}
        className="bg-gray-200 rounded-md h-32 justify-center items-center mb-4"
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} className="w-full h-32 rounded-md" resizeMode="cover" />
        ) : (
          <>
            <Text className="text-gray-500 text-lg">⬆️</Text>
            <Text className="text-black">Agregar imagen</Text>
          </>
        )}
      </TouchableOpacity>

      <View className="flex-row items-center mb-3">
        <Switch
          value={commentsEnabled}
          onValueChange={setCommentsEnabled}
          thumbColor="#4C2C2F"
          trackColor={{ false: '#B3777D', true: '#9D5C63' }}
          style={{ width: 52, height: 32 }}
        />
        <Text className="ml-2 font-bold text-[#1C1B1F]">Autorizar comentarios</Text>
      </View>

      <View className="flex-row items-center mb-6">
        <Switch
          value={wifiOnly}
          onValueChange={setWifiOnly}
          thumbColor="#4C2C2F"
          trackColor={{ false: '#B3777D', true: '#9D5C63' }}
          style={{ width: 52, height: 32 }}
        />
        <Text className="ml-2 font-bold text-[#1C1B1F]">Publicar Solo WIFI</Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push('../createrecipe/ingredients')}
        className="bg-[#9D5C63] rounded-xl w-40 mx-auto py-2"
      >
        <Text className="text-white font-bold text-center">Siguiente</Text>
      </TouchableOpacity>
    </View>
  );
}
