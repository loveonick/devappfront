import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { useState, useCallback, useEffect } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useRecipeContext } from '../../context/RecipeContext';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [tags] = useState<string[]>(['Nueva']);
  const { addRecipe, recipes } = useRecipeContext(); // Asegúrate de que addRecipe esté disponible en tu contexto

  useFocusEffect(
    useCallback(() => {
      // Limpia los campos cuando la pantalla está en foco
      setTitle('');
      setDescription('');
      setImageUri(null);
    }, [])
  );

  // --- Lógica de Red y Almacenamiento Local ---
  const RECIPE_STORAGE_KEY = 'pendingRecipes'; // Clave para AsyncStorage

  // Guarda la receta localmente en AsyncStorage
  const saveRecipeLocally = async (recipeData) => {
    try {
      const storedRecipes = await AsyncStorage.getItem(RECIPE_STORAGE_KEY);
      const recipes = storedRecipes ? JSON.parse(storedRecipes) : [];
      recipes.push(recipeData);
      await AsyncStorage.setItem(RECIPE_STORAGE_KEY, JSON.stringify(recipes));
      Alert.alert(
        'Receta Guardada',
        'La receta se ha guardado localmente y se subirá cuando haya una conexión gratuita disponible.'
      );
    } catch (error) {
      console.error('Error al guardar la receta localmente:', error);
      Alert.alert('Error', 'No se pudo guardar la receta localmente.');
    }
  };

  // Procesa y "sube" las recetas almacenadas localmente cuando hay una conexión gratuita
  const processStoredRecipes = async () => {
    try {
      const storedRecipes = await AsyncStorage.getItem(RECIPE_STORAGE_KEY);
      if (storedRecipes) {
        const recipesToUpload = JSON.parse(storedRecipes);
        if (recipesToUpload.length > 0) {
          // Simula la subida de cada receta almacenada
          for (const recipe of recipesToUpload) {
            // Aquí deberías integrar tu lógica de subida a una API o base de datos
            addRecipe(recipe); // Agrega al contexto, en una app real sería una llamada API
          }
          await AsyncStorage.removeItem(RECIPE_STORAGE_KEY); // Limpia después de "subir"
          Alert.alert(
            'Recetas Sincronizadas',
            `Se han subido ${recipesToUpload.length} receta(s) que estaban pendientes.`
          );
        }
      }
    } catch (error) {
      console.error('Error al procesar las recetas almacenadas:', error);
    }
  };

  // Monitorea la conexión de red y procesa recetas almacenadas al conectarse a Wi-Fi
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      // Si está conectado y es Wi-Fi, intenta procesar las recetas pendientes
      if (state.isConnected && state.type === 'wifi') {
        processStoredRecipes();
      }
    });

    // Verificación inicial al montar el componente
    NetInfo.fetch().then((state) => {
      if (state.isConnected && state.type === 'wifi') {
        processStoredRecipes();
      }
    });

    return () => unsubscribe(); // Limpia el listener al desmontar el componente
  }, []);
  // --- Fin Lógica de Red y Almacenamiento Local ---

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

  const handleNext = async () => {
    if (!title || !description) {
      Alert.alert('Campos Incompletos', 'Por favor, completa todos los campos para continuar.');
      return;
    }

    const recipeData = {
      title,
      description,
      imageUri: imageUri || '',
      tags: JSON.stringify(tags),
    };

    const state = await NetInfo.fetch(); // Obtiene el estado actual de la red

    if (state.isConnected && state.type === 'wifi') {
      // Conectado vía Wi-Fi (asumido como gratuito) - procede automáticamente
      router.push({
        pathname: '/createrecipe/ingredients.tsx',
        params: recipeData,
      });
    } else if (state.isConnected && state.type !== 'wifi') {
      // Conectado, pero no por Wi-Fi (ej. datos móviles) - pregunta al usuario
      Alert.alert(
        'Conexión de Datos',
        'Estás usando una red con cargo (por ejemplo, datos móviles). ¿Deseas continuar con la carga de la receta o prefieres esperar a una conexión gratuita?',
        [
          {
            text: 'Esperar conexión gratuita',
            onPress: () => saveRecipeLocally(recipeData), // Guarda localmente
            style: 'cancel',
          },
          {
            text: 'Continuar ahora',
            onPress: () =>
              router.push({
                pathname: '/createrecipe/ingredients.tsx',
                params: recipeData,
              }),
          },
        ],
        { cancelable: false }
      );
    } else {
      // Sin conexión a internet
      Alert.alert(
        'Sin Conexión a Internet',
        'Actualmente no tienes conexión a internet. La receta se guardará localmente y se subirá cuando tengas una conexión disponible.',
        [{ text: 'Ok', onPress: () => saveRecipeLocally(recipeData) }] // Guarda localmente
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