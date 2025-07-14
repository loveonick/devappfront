import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useRecipeContext } from '../context/RecipeContext';
import { useAuth } from '../context/AuthContext';
import { getRecipeById, updateRecipe, createIngredient } from '../api/recipe_api';
import type { RecipeUpdateData } from '../api/recipe_api';


const DISH_TYPES = [
  "Entrada", "Plato principal", "Guarnición", "Postre",
  "Bebida", "Ensalada", "Sopa", "Snack", "Desayuno"
];

export default function EditRecipe() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { updateRecipe: RecipeUpdateData } = useRecipeContext();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [type, setType] = useState('');
  const [ingredients, setIngredients] = useState<{ name: string; amount: string; unit: string }[]>([]);
  const [steps, setSteps] = useState<{ description: string; imageUri?: string }[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        setIsLoading(true);
        const recipe = await getRecipeById(id as string);
        if (!recipe) {
          Alert.alert('Error', 'No se encontró la receta');
          router.back();
          return;
        }

        setTitle(recipe.title );
        setDescription(recipe.description );
        setImageUri(recipe.imageUri );
        setIngredients(recipe.ingredients || []);
        setSteps(recipe.steps || []);
        setTags(recipe.tags || []);
      } catch (err) {
        console.error(err);
        Alert.alert('Error', 'No se pudo cargar la receta');
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    loadRecipe();
  }, [id]);

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

  const handleUpdate = async () => {
    try {
      setIsLoading(true);

      if (!title.trim()) {
        Alert.alert('Error', 'El nombre de la receta es requerido');
        return;
      }

      // 1. Crear cada ingrediente y obtener su _id
      const ingredientIds = await Promise.all(
        ingredients.map(async (ing) => {
          try {
            const created = await createIngredient({
              name: ing.name,
              amount: ing.amount,
              unit: ing.unit,
            });
            return created._id;
          } catch (err) {
            console.error('Error al crear ingrediente:', ing, err);
            throw new Error(`No se pudo crear el ingrediente "${ing.name}"`);
          }
        })
      );

      // 2. Preparar los datos para la actualización
      const recipeData: RecipeUpdateData = {
        name : title,
        description,
        imageUri: imageUri || undefined,
        type,
        ingredients, 
        steps,
        tags,
      };

      // 3. Enviar al backend
      await updateRecipe(id as string, recipeData);

      Alert.alert('Éxito', 'Receta actualizada correctamente');
      router.back();
    } catch (err: any) {
      console.error('Error al actualizar:', err);
      Alert.alert('Error', err.message || 'No se pudo actualizar la receta');
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleCancel = () => {
    router.back();
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-6">
      <Text className="text-2xl font-bold text-center mb-4">Editar Receta</Text>

      <Text className="font-semibold mb-1">Nombre del plato</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        className="border border-gray-300 rounded-md px-4 py-2 mb-4"
      />

      <Text className="font-semibold mb-1">Descripción</Text>
      <TextInput
        value={description}
        onChangeText={setDescription}
        multiline
        className="border border-gray-300 rounded-md px-4 py-2 mb-4 h-24"
      />

      <Text className="font-semibold mb-1">Tipo de plato</Text>
      <View className="flex-row flex-wrap mb-4">
        {DISH_TYPES.map((item) => (
          <TouchableOpacity
            key={item}
            onPress={() => setType(item)}
            className={`px-4 py-2 mr-2 mb-2 rounded-full border ${
              type === item ? 'bg-[#9D5C63] border-[#9D5C63]' : 'border-gray-400'
            }`}
          >
            <Text className={type === item ? 'text-white' : 'text-black'}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text className="font-semibold mb-1">Imagen del plato</Text>
      <TouchableOpacity
        onPress={pickImage}
        className="bg-gray-200 rounded-md h-40 justify-center items-center mb-4"
      >
        {imageUri ? (
          <Image source={{ uri: imageUri }} className="w-full h-full rounded-md" />
        ) : (
          <Text className="text-gray-500">Agregar imagen</Text>
        )}
      </TouchableOpacity>

      <Text className="font-semibold mb-2">Ingredientes</Text>
      {ingredients.map((ing, idx) => (
        <View key={idx} className="flex-row items-center mb-2">
          <TextInput
            placeholder="Ingrediente"
            value={ing.name}
            onChangeText={(text) => {
              const newIngs = [...ingredients];
              newIngs[idx].name = text;
              setIngredients(newIngs);
            }}
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 mr-1"
          />
          <TextInput
            placeholder="Cantidad"
            value={ing.amount}
            onChangeText={(text) => {
              const newIngs = [...ingredients];
              newIngs[idx].amount = text;
              setIngredients(newIngs);
            }}
            className="w-20 border border-gray-300 rounded-md px-3 py-2 mr-1"
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Unidad"
            value={ing.unit}
            onChangeText={(text) => {
              const newIngs = [...ingredients];
              newIngs[idx].unit = text;
              setIngredients(newIngs);
            }}
            className="w-20 border border-gray-300 rounded-md px-3 py-2"
          />
        </View>
      ))}
      <TouchableOpacity
        onPress={() =>
          setIngredients([...ingredients, { name: '', amount: '', unit: '' }])
        }
        className="mb-4"
      >
        <Text className="text-[#9D5C63]">+ Agregar ingrediente</Text>
      </TouchableOpacity>

      <Text className="font-semibold mb-2">Pasos de preparación</Text>
      {steps.map((step, idx) => (
        <View key={idx} className="mb-4">
          <Text className="font-medium">Paso {idx + 1}</Text>
          <TextInput
            placeholder="Descripción del paso"
            value={step.description}
            onChangeText={(text) => {
              const newSteps = [...steps];
              newSteps[idx].description = text;
              setSteps(newSteps);
            }}
            multiline
            className="border border-gray-300 rounded-md px-3 py-2 h-20"
          />
        </View>
      ))}
      <TouchableOpacity
        onPress={() => setSteps([...steps, { description: '' }])}
        className="mb-6"
      >
        <Text className="text-[#9D5C63]">+ Agregar paso</Text>
      </TouchableOpacity>

      <View className="flex-row justify-around mb-12">
        <TouchableOpacity
          onPress={handleCancel}
          className="border border-gray-400 rounded-md px-6 py-3"
        >
          <Text className="text-gray-700 font-bold">Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleUpdate}
          className="bg-[#9D5C63] rounded-md px-6 py-3"
        >
          <Text className="text-white font-bold">Aceptar cambios</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
