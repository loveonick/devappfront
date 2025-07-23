import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../context/AuthContext';
import { getRecipeById, updateRecipe } from '../api/recipe_api';
import { addIngredient } from '../api/ingredient_api';
import { addProcedure } from '../api/procedure_api';

const DISH_TYPES = [
  "Entrada", "Plato principal", "Guarnición", "Postre",
  "Bebida", "Ensalada", "Sopa", "Snack", "Desayuno"
];

export default function EditRecipe() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null); 
  const [fileName, setFileName] = useState('photo.jpg');
  const [type, setType] = useState('');
  const [ingredients, setIngredients] = useState<{ name: string; amount: string; unit: string }[]>([]);
  const [steps, setSteps] = useState<{ description: string; imageUri?: string; imageFile?: File }[]>([]); //esto
  const [tags, setTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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

        setTitle(recipe.title);
        setDescription(recipe.description);
        setImageUri(recipe.imageUri);
        setIngredients(
          (recipe.ingredients || []).map((ing: any) => ({
            name: ing.name,
            amount: ing.quantity || '', 
            unit: ing.unit || ''
          }))
        );
        setSteps(recipe.steps || []);
        setTags(recipe.tags || []);
        setType(recipe.tags[0] || '');
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
      const asset = result.assets[0];
      const uri = asset.uri;
      const fileName = uri.split('/').pop() || 'photo.jpg';
      setFileName(fileName);
      const match = /\.(\w+)$/.exec(fileName);
      setImageUri(uri);
      if (Platform.OS === 'web') {
        setImageFile(asset.file ?? null);
      }
    }
  };


  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      setErrorMessage('');
      setUpdating(true);

      if (!title.trim()) {
        setErrorMessage('El nombre de la receta es obligatorio');
        return;
      }

      if (!type.trim()) {
        setErrorMessage('Debe seleccionar el tipo de plato');
        return;
      }

      if (ingredients.length === 0 || ingredients.some(ing => !ing.name.trim())) {
        setErrorMessage('Debe agregar al menos un ingrediente con nombre');
        return;
      }

      if (steps.length === 0 || steps.some(step => !step.description.trim())) {
        setErrorMessage('Debe agregar al menos un paso con descripción');
        return;
      }

      const formData = new FormData();

      if (Platform.OS === 'web') {
        if (imageFile) {
          formData.append('media', imageFile);
        }
      } else {
        if (imageUri) {
          formData.append('media', {
            uri: imageUri,
            name: fileName,
            type: 'image/jpeg',
          } as any);
        }
      }

      const ingredientIds = await Promise.all(
        ingredients.map(async (ing) => {
          try {
            const created = await addIngredient({
              name: ing.name,
              quantity: ing.amount,
              unit: ing.unit,
            });
            return created._id;
          } catch (err) {
            console.error('Error al crear ingrediente:', ing, err);
            throw new Error("No se pudo crear el ingrediente: " + ing.name);
          }
        })
      );

      const stepsIds = await Promise.all(
        steps.map(async (step, idx) => {
          try {
            const stepForm = new FormData();
            stepForm.append('content', step.description);

            if (step.imageUri && Platform.OS === 'web') {
              const response = await fetch(step.imageUri);
              const blob = await response.blob();
              const file = new File([blob], `step-${idx}.jpg`, { type: 'image/jpeg' });
              stepForm.append('media', file);
            }

            if (step.imageUri && Platform.OS !== 'web') {
              stepForm.append('media', {
                uri: step.imageUri,
                name: `step-${idx}.jpg`,
                type: 'image/jpeg',
              } as any);
            }

            const created = await addProcedure(stepForm);
            return created._id;
          } catch (err) {
            console.error('Error al crear paso:', step, err);
            throw new Error("No se pudo crear el paso: " + step.description);
          }
        })
      );

      const autoTags = [
        type,
        ...ingredients.map((ing) => ing.name),
      ];
      formData.append('tags', JSON.stringify(autoTags));
      formData.append('name', title);
      formData.append('description', description);
      formData.append('type', type || '');
      formData.append('ingredients', JSON.stringify(ingredientIds));
      formData.append('procedures', JSON.stringify(stepsIds));
      formData.append('isApproved', 'false'); 

      await updateRecipe(id as string, formData);

      Alert.alert('Éxito', 'Receta actualizada correctamente');
      router.push({
        pathname: '/createrecipe/released',
        params: {
          replaced: 'false',
          pending: 'true',
        },
      });

    } catch (err: any) {
      console.error('Error al actualizar:', err);
      Alert.alert('Error', err.message || 'No se pudo actualizar la receta');
    } finally {
      setIsLoading(false);
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const pickStepImage = async (stepIndex: number) => {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') return;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 1,
  });

  if (!result.canceled) {
    const asset = result.assets[0];
    const uri = asset.uri;
    const file = Platform.OS === 'web' ? asset.file ?? null : null;

    const updatedSteps = [...steps];
    updatedSteps[stepIndex].imageUri = uri;
    if (file) updatedSteps[stepIndex].imageFile = file;

    setSteps(updatedSteps);
  }
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
            className="w-20 border border-gray-300 rounded-md px-3 py-2 mr-1"
          />
          <TouchableOpacity
            onPress={() => {
              const filtered = ingredients.filter((_, i) => i !== idx);
              setIngredients(filtered);
            }}
            className="p-2 bg-red-200 rounded-md"
          >
            <Text className="text-red-800 font-bold">X</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity
        onPress={() => setIngredients([...ingredients, { name: '', amount: '', unit: '' }])}
        className="mb-4"
      >
        <Text className="text-[#9D5C63]">+ Agregar ingrediente</Text>
      </TouchableOpacity>

      <Text className="font-semibold mb-2">Pasos de preparación</Text>
      {steps.map((step, idx) => (
        <View key={idx} className="mb-4">
          <View className="flex-row justify-between items-center mb-1">
            <Text className="font-medium">Paso {idx + 1}</Text>
            <TouchableOpacity
              onPress={() => {
                const filtered = steps.filter((_, i) => i !== idx);
                setSteps(filtered);
              }}
              className="px-2 py-1 bg-red-200 rounded-md"
            >
              <Text className="text-red-800 font-bold">Eliminar</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            placeholder="Descripción del paso"
            value={step.description}
            onChangeText={(text) => {
              const newSteps = [...steps];
              newSteps[idx].description = text;
              setSteps(newSteps);
            }}
            multiline
            className="border border-gray-300 rounded-md px-3 py-2 h-20 mb-2"
          />

          <TouchableOpacity
            onPress={() => pickStepImage(idx)}
            className="bg-gray-100 border border-gray-300 rounded-md h-40 justify-center items-center mb-2"
          >
            {step.imageUri ? (
              <Image source={{ uri: step.imageUri }} className="w-full h-full rounded-md" />
            ) : (
              <Text className="text-gray-500">Agregar imagen al paso</Text>
            )}
          </TouchableOpacity>
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
          disabled={updating}
          className={`rounded-md px-6 py-3 ${updating ? 'bg-gray-400' : 'bg-[#9D5C63]'}`}
        >
          <Text className="text-white font-bold">
            {updating ? 'Actualizando...' : 'Aceptar cambios'}
          </Text>
        </TouchableOpacity>
        {errorMessage ? (
          <Text className="text-red-600 text-center mt-2">{errorMessage}</Text>
        ) : null}
      </View>
    </ScrollView>
  );
}
