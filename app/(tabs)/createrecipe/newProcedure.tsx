// ... imports
import { View, Text, TextInput, Pressable, Image, TouchableOpacity, Platform, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRecipeContext } from '../../context/RecipeContext';
import { useAuth } from '../../context/AuthContext';
import { handleUpload } from '../../../utils/handleUpload';
import * as Network from 'expo-network';
import { addIngredient } from '../../api/ingredient_api';
import { addProcedure } from '../../api/procedure_api';

interface RecipeStep {
  description: string;
  imageUri?: string;
  imageFile?: any;
}

export default function NewProcedureScreen() {
  const router = useRouter();
  const { draft, updateDraft, addPendingRecipe } = useRecipeContext();
  const { user } = useAuth();

  const [steps, setSteps] = useState<RecipeStep[]>(draft.steps ?? [{ description: '' }]);
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmUpload, setShowConfirmUpload] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');


  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      const uri = asset.uri;
      const fileName = uri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(fileName);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      const imageFile = Platform.OS === 'web'
        ? asset.file ?? asset
        : { uri, name: fileName, type };

      const newSteps = [...steps];
      newSteps[currentStep - 1] = {
        ...newSteps[currentStep - 1],
        imageUri: uri,
        imageFile: imageFile,
      };
      setSteps(newSteps);
    }
  };

  const handleNextStep = () => {
    if (!steps[currentStep - 1]?.description) {
      setErrorMessage('Agrega una descripción para este paso');
      return;
    }
    setErrorMessage('');
    setCurrentStep(prev => prev + 1);
    };

  const handleFinish = async () => {
    if (!steps[currentStep - 1]?.description) {
      setErrorMessage('Completa el paso actual antes de finalizar');
      return;
    }

    try {
      const networkState = await Network.getNetworkStateAsync();

      if (!networkState.isConnected) {
        setErrorMessage('No hay conexión. La receta se guardará localmente.');
        await addPendingRecipe(draft, steps);
        router.push('/');
        return;
      }

      if (networkState.type !== Network.NetworkStateType.WIFI) {
        setShowConfirmUpload(true);
        return;
      }

      await proceedToUpload();

    } catch (error) {
      console.error('Error al verificar red:', error);
      setErrorMessage('Error al verificar el estado de red.');
    }
  };

  const proceedToUpload = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await handleUpload(draft, steps, user);

      updateDraft({ ...draft, duplicateId: null });

      router.push({
        pathname: '/createrecipe/released',
        params: {
          id: data._id,
          replaced: draft.duplicateId ? 'true' : 'false',
          pending: 'true',
        },
      });
    } catch (error: any) {
      console.error('Error al subir la receta:', error);
      const message = error?.message ?? '';
      const esErrorCritico = message.includes('crear') || message.includes('subir la imagen');

      if (esErrorCritico) {
        setErrorMessage(message || 'No se pudo subir la receta.');
      } else {
        console.warn('Error menor durante subida, pero se completó en el back.');
      }
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    if (steps.length < currentStep) {
      setSteps(prev => [...prev, { description: '' }]);
    }
  }, [currentStep]);

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <TouchableOpacity 
        onPress={() => router.back()}
        className="absolute top-12 left-6 z-10"
      >
        <Ionicons name="arrow-back" size={24} color="#9D5C63" />
      </TouchableOpacity>

      <Text className="text-xl font-bold mb-4 text-center">Paso {currentStep}</Text>

      <TextInput
        className="bg-gray-100 rounded-md h-32 px-4 py-2 mb-4"
        multiline
        placeholder="Describe este paso..."
        placeholderTextColor={'#9CA3AF'}
        value={steps[currentStep - 1]?.description || ''}
        onChangeText={(text) => {
          const newSteps = [...steps];
          newSteps[currentStep - 1] = {
            ...newSteps[currentStep - 1],
            description: text,
          };
          setSteps(newSteps);
        }}
      />

      <Pressable
        onPress={pickImage}
        className="bg-gray-200 rounded-md h-32 justify-center items-center mb-6"
      >
        {steps[currentStep - 1]?.imageUri ? (
          <Image 
            source={{ uri: steps[currentStep - 1].imageUri }} 
            className="w-full h-32 rounded-md" 
          />
        ) : (
          <>
            <Ionicons name="image" size={32} color="#9D5C63" />
            <Text className="text-[#9D5C63]">Agregar imagen</Text>
          </>
        )}
      </Pressable>

      <View className="flex-row justify-around">
        <Pressable
          onPress={handleNextStep}
          className="bg-[#9D5C63] rounded-full px-6 py-2"
        >
          <Text className="text-white font-bold">Siguiente Paso</Text>
        </Pressable>

        <Pressable
          onPress={handleFinish}
          className="bg-black rounded-full px-6 py-2"
        >
          <Text className="text-white font-bold">Finalizar</Text>
        </Pressable>
        {errorMessage !== '' && (
          <Text className="text-red-500 text-center mt-4">{errorMessage}</Text>
        )}
      </View>

      {showConfirmUpload && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center z-20 px-8">
          <View className="bg-white rounded-xl p-6 w-full">
            <Text className="text-lg font-semibold mb-4 text-center text-gray-800">
              Estás usando una red móvil
            </Text>
            <Text className="text-center text-gray-600 mb-6">
              ¿Querés subir la receta usando esta conexión o esperar hasta tener WiFi?
            </Text>

            <View className="flex-row justify-around">
              <TouchableOpacity
                onPress={async () => {
                  await addPendingRecipe(draft, steps);
                  setShowConfirmUpload(false);
                  router.push('/');
                }}
                className="bg-gray-300 rounded-full px-4 py-2"
              >
                <Text className="text-gray-800 font-medium">Esperar WiFi</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  setShowConfirmUpload(false);
                  await proceedToUpload();
                  router.push('/createrecipe/released');
                }}
                className="bg-[#9D5C63] rounded-full px-4 py-2"
              >
                <Text className="text-white font-medium">Subir ahora</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
      {isLoading && (
        <View className="absolute inset-0 bg-black/50 justify-center items-center z-30">
          <View className="bg-white px-6 py-4 rounded-xl shadow">
            <Text className="text-center font-semibold mb-2 text-gray-700">Subiendo receta...</Text>
            <Ionicons name="cloud-upload" size={32} color="#9D5C63" />
          </View>
        </View>
      )}
    </View>
  );
}