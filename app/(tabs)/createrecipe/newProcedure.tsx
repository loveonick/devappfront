import { View, Text, TextInput, Pressable, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';

export default function NewProcedureScreen() {
  const params = useLocalSearchParams();
  const currentStep = parseInt(Array.isArray(params.step) ? params.step[0] : params.step || '1', 10);

  const [stepDescription, setStepDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);

  useEffect(() => {
    setStepDescription('');
    setImageUri(null);
  }, [currentStep]);

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

  const handleNextStep = () => {
    console.log(`Step ${currentStep} description: ${stepDescription}`);
    console.log(`Image URI: ${imageUri}`);
    router.push({
      pathname: '../createrecipe/newProcedure',
      params: { step: currentStep + 1 },
    });
  };

  const handleFinish = () => {
    console.log(`Final Step ${currentStep} description: ${stepDescription}`);
    console.log(`Image URI: ${imageUri}`);
    router.push('../createrecipe/released');
  };

  return (
    <View className="flex-1 bg-white px-6 py-10">
      <Text className="text-xl font-bold mb-4 text-center">¿Cuál es el procedimiento?</Text>
      <Text className="text-base font-bold mb-2">Paso {currentStep}</Text>

      <TextInput
        className="bg-gray-100 rounded-md h-32 px-4 py-2 text-[#1C1B1F] mb-4"
        multiline
        placeholder="¿Cómo se prepara la receta?"
        placeholderTextColor="#9CA3AF"
        value={stepDescription}
        onChangeText={setStepDescription}
      />

      <Text className="font-bold text-[#1C1B1F] mb-2">¡Agrega imagen del paso!</Text>
      <Pressable
        onPress={pickImage}
        className="bg-gray-200 rounded-md h-32 justify-center items-center mb-6"
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} className="w-full h-32 rounded-md" resizeMode="cover" />
        ) : (
          <>
            <Text className="text-gray-500 text-2xl">⬆️</Text>
            <Text className="text-black">Agregar imagen</Text>
          </>
        )}
      </Pressable>

      <View className="flex-row justify-around">
        <Pressable
          onPress={handleNextStep}
          className="bg-[#9D5C63] rounded-full px-6 py-2"
        >
          <Text className="text-white font-bold text-base">Siguiente Paso</Text>
        </Pressable>

        <Pressable
          onPress={handleFinish}
          className="bg-black rounded-full px-6 py-2"
        >
          <Text className="text-white font-bold text-base">Finalizar</Text>
        </Pressable>
      </View>
    </View>
  );
}
