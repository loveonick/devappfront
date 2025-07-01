import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useState, useCallback, useEffect } from 'react'; // Agregamos useEffect
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useRecipeContext } from '../../context/RecipeContext'; // Asumo que aquí manejarás la lógica de guardado
import { useFocusEffect } from 'expo-router';
import NetInfo from '@react-native-community/netinfo'; // Importamos NetInfo
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importamos AsyncStorage

const OFFLINE_RECIPES_KEY = '@offline_recipes';

export default function CreateRecipeIndex() { // Renombre el componente para mayor claridad
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [tags] = useState<string[]>(['Nueva']);
  const { addRecipe, addOfflineRecipe } = useRecipeContext(); // Asumo que estos métodos existen en tu contexto

  // Limpiar campos al enfocar la pantalla
  useFocusEffect(
    useCallback(() => {
      setTitle('');
      setDescription('');
      setImageUri(null);
    }, [])
  );

  // Función para seleccionar imagen
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso Requerido', 'Necesitamos permiso para acceder a tu galería de imágenes.');
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

  // Función para guardar una receta localmente
  const saveRecipeOffline = async (recipeData) => {
    try {
      const storedRecipes = await AsyncStorage.getItem(OFFLINE_RECIPES_KEY);
      const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
      recipes.push(recipeData);
      await AsyncStorage.setItem(OFFLINE_RECIPES_KEY, JSON.stringify(recipes));
      addOfflineRecipe(recipeData); // Si tienes un estado global para offline recipes
      Alert.alert('Receta Guardada', 'La receta se ha guardado localmente y se subirá automáticamente cuando tengas conexión Wi-Fi.');
      router.back(); // O navegar a la pantalla principal
    } catch (error) {
      console.error('Error guardando receta offline:', error);
      Alert.alert('Error', 'No se pudo guardar la receta localmente.');
    }
  };

  // Función para subir la receta al servidor
  const uploadRecipe = async (recipeData) => {
    try {
      await addRecipe(recipeData); // Esto debería ser tu función para enviar al backend
      Alert.alert('Éxito', 'Receta subida correctamente.');
      router.back(); // O navegar a la pantalla principal
    } catch (error) {
      console.error('Error al subir receta:', error);
      Alert.alert('Error', 'Hubo un problema al subir la receta. Inténtalo de nuevo.');
    }
  };

  const handleNext = async () => {
    if (!title || !description || !imageUri) { // Aseguramos que la imagen también esté seleccionada
      Alert.alert('Campos Incompletos', 'Por favor, completa todos los campos y selecciona una imagen.');
      return;
    }

    const newRecipe = {
      title,
      description,
      imageUri,
      tags,
      // Aquí puedes añadir otros campos si los necesitas para la receta
    };

    const netInfoState = await NetInfo.fetch();

    if (netInfoState.isConnected) {
      // Si hay conexión, verificamos el tipo
      if (netInfoState.type === 'wifi') {
        // Si es Wi-Fi, subimos automáticamente
        uploadRecipe(newRecipe);
      } else if (netInfoState.type === 'cellular') {
        // Si es celular, preguntamos al usuario
        Alert.alert(
          'Conexión Celular Detectada',
          'Estás usando una red celular, lo que podría incurrir en cargos de datos. ¿Deseas subir la receta ahora o esperar a una conexión Wi-Fi?',
          [
            {
              text: 'Esperar Wi-Fi',
              onPress: () => saveRecipeOffline(newRecipe),
              style: 'cancel',
            },
            {
              text: 'Subir Ahora',
              onPress: () => uploadRecipe(newRecipe),
            },
          ],
          { cancelable: false }
        );
      } else {
        // Otros tipos de conexión que no son Wi-Fi ni celular (ej. ethernet en emulador, desconocido)
        Alert.alert(
          'Tipo de Conexión Desconocido',
          'Tienes conexión a internet, pero no es Wi-Fi. ¿Deseas intentar subir la receta o esperar a una conexión Wi-Fi?',
          [
            {
              text: 'Esperar Wi-Fi',
              onPress: () => saveRecipeOffline(newRecipe),
              style: 'cancel',
            },
            {
              text: 'Subir Ahora',
              onPress: () => uploadRecipe(newRecipe),
            },
          ],
          { cancelable: false }
        );
      }
    } else {
      // No hay conexión en absoluto, solo guardar offline
      Alert.alert(
        'Sin Conexión a Internet',
        'No tienes conexión a internet. La receta se guardará localmente y se subirá automáticamente cuando te conectes.',
        [
          {
            text: 'Guardar Offline',
            onPress: () => saveRecipeOffline(newRecipe),
          },
        ],
        { cancelable: false }
      );
    }
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