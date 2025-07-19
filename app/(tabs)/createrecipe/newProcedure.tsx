import { View, Text, TextInput, Pressable, Image, TouchableOpacity, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRecipeContext } from '../../context/RecipeContext';
import { createRecipe, deleteRecipe } from '../../api/recipe_api';
import { addIngredient } from '../../api/ingredient_api';
import { useAuth } from '../../context/AuthContext';
import { addProcedure } from '../../api/procedure_api';

interface RecipeStep {
  description: string;
  imageUri?: string;
  imageFile?: any;
}

export default function NewProcedureScreen() {
  const router = useRouter();
  const { draft, addRecipe, updateDraft } = useRecipeContext();
  const { user } = useAuth();

  const [steps, setSteps] = useState<RecipeStep[]>(draft.steps ?? [{ description: '' }]);
  const [currentStep, setCurrentStep] = useState(1);

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
      alert('Agrega una descripción para este paso');
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handleFinish = async () => {
    if (!steps[currentStep - 1]?.description) {
      alert('Completa el paso actual antes de finalizar');
      return;
    }

    try {
      // 1. Primero crear la nueva receta
      const formData = new FormData();
      const ingredientIds: string[] = [];
      const procedureIds: string[] = [];

      for (const step of steps) {
        const procedureFormData = new FormData();
        procedureFormData.append("content", step.description);

        if (step.imageFile) {
          if (Platform.OS === 'web') {
            procedureFormData.append('media', step.imageFile);
          } else {
            procedureFormData.append('media', step.imageFile, step.imageFile.name);
          }
        }

        const savedProcedure = await addProcedure(procedureFormData);
        procedureIds.push(savedProcedure._id);
      }
      formData.append('procedures', JSON.stringify(procedureIds));

      for (const ingredient of draft.ingredients ?? []) {
        const savedIngredient = await addIngredient(ingredient);
        ingredientIds.push(savedIngredient._id);
      }
      formData.append('ingredients', JSON.stringify(ingredientIds));

      formData.append('name', draft.title ?? '');
      formData.append('description', draft.description ?? '');
      formData.append('tags', JSON.stringify(draft.tags ?? []));
      formData.append('author', user._id);
      formData.append('type', draft.type ?? '');
      formData.append('isApproved', user.role === 'admin' ? 'true' : 'false');

      if (Platform.OS === 'web') {
        if (draft.imageFile) {
          formData.append('media', draft.imageFile);
        }
      } else {
        if (draft.imageUri) {
          const filename = draft.imageUri.split('/').pop();
          const match = /\.(\w+)$/.exec(filename ?? '');
          const type = match ? `image/${match[1]}` : 'image/jpeg';

          formData.append('media', {
            uri: draft.imageUri,
            name: filename ?? 'photo.jpg',
            type,
          } as any);
        }
      }

      const data = await createRecipe(formData);

      // 2. Solo después de crear la nueva receta, eliminar la anterior si existe
      if (draft.duplicateId) {
        try {
          await deleteRecipe(draft.duplicateId);
          console.log('Receta duplicada eliminada');
        } catch (err) {
          console.error('Error al eliminar receta previa:', err);
          // No impedimos el flujo aunque falle la eliminación
        }
      }

      const newRecipe = {
        id: data.recipe._id,
        title: data.recipe.name as string,
        description: data.recipe.description as string,
        imageUri: data.recipe.image as string,
        ingredients: data.recipe.ingredients.map((i: any) => ({
          name: i.name,
          quantity: i.amount.toString(),
          unit: i.unit,
        })),
        steps: data.recipe.procedures.map((p: any) => ({
          description: p.content,
          imageUri: p.media ?? '',
        })),
        tags: data.recipe.tags || [],
        date: data.recipe.date || new Date().toISOString(),
        author: data.recipe.author.name || 'Desconocido',
      };

      await addRecipe(newRecipe);

      // Limpiar el campo de duplicado en el draft
      updateDraft({ ...draft, duplicateId: null });

      // Navegar a la pantalla de released
      router.push({
        pathname: '/createrecipe/released',
        params: {
          id: data.recipe._id,
          replaced: draft.duplicateId ? 'true' : 'false'
        }
      });

    } catch (error) {
      console.error('Error en handleFinish:', error);
      alert('Error al guardar la receta. Por favor intenta nuevamente.');
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
      </View>
    </View>
  );
}
