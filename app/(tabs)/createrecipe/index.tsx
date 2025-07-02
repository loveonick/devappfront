import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useRecipeContext } from '../../context/RecipeContext';
import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [tags] = useState<string[]>(['Nueva']);
  const { recipes } = useRecipeContext();

    useFocusEffect(
    useCallback(() => {
      setTitle('');
      setDescription('');
      setImageUri(null);
    }, [])
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleNext = () => {
  if (!title || !description) {
    alert('Completa todos los campos');
    return;
  }

  router.push({
    pathname: '/createrecipe/ingredients',
    params: { 
      title, 
      description, 
      imageUri: imageUri || '',
      tags: JSON.stringify(tags) 
    },
  });
};

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <Text className="text-xl font-bold mb-6 text-center">¡Agrega una receta!</Text>

      <Text className="font-semibold mb-1">Nombre del plato</Text>
      <TextInput
        className="border border-[#9D5C63] rounded-md px-4 py-2 mb-4"
        placeholder="Ej: Tacos al pastor"
        value={title}
        onChangeText={setTitle}
      />

      <Text className="font-semibold mb-1">Descripción</Text>
      <TextInput
        className="border border-[#9D5C63] rounded-md px-4 py-2 mb-4"
        placeholder="Describe tu plato"
        value={description}
        onChangeText={setDescription}
      />

      <Text className="font-bold mb-2">Imagen del Plato</Text>
      <TouchableOpacity
        onPress={pickImage}
        className="bg-gray-200 rounded-md h-32 justify-center items-center mb-4"
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} className="w-full h-32 rounded-md" />
        ) : (
          <>
            <Text className="text-gray-500 text-lg">⬆️</Text>
            <Text className="text-black">Agregar imagen</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleNext}
        className="bg-[#9D5C63] rounded-xl w-40 mx-auto py-2"
      >
        <Text className="text-white font-bold text-center">Siguiente</Text>
      </TouchableOpacity>
    </View>
  );
}