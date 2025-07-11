import { View, Text, Image, ScrollView, ActivityIndicator, TextInput, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

import { getRecipeById } from '../api/recipe_api';
import { getQualificationsByRecipeId, addQualification } from '../api/qualification_api';
import { saveNotification } from '../(tabs)/notificationsUser';

import { useAuth } from '../context/AuthContext';

interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUri: string;
  ingredients: { name: string; quantity: string; unit: string }[];
  steps: { description: string; imageUri?: string }[];
  tags: string[];
}

interface Comment {
  name: string;
  text: string;
  stars: number;
}

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth(); 
  console.log('User in RecipeDetail:', user);

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratingUser, setRatingUser] = useState(0);
  const [comment, setComment] = useState('');
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [portions, setPortions] = useState(2);

  const loadFromStorage = async (recipeId: string) => {
    try {
      const stored = await AsyncStorage.getItem('RECIPES_STORAGE');
      if (stored) {
        const recipes = JSON.parse(stored);
        return recipes.find((r: Recipe) => r.id === recipeId);
      }
    } catch (error) {
      console.error('Error loading from storage:', error);
    }
    return null;
  };
  console.log(recipe);
  const calculateIngredients = () => {
    if (!recipe?.ingredients) return [];
    return recipe.ingredients.map((ing) => ({
      ...ing,
      quantity: (parseFloat(ing.quantity) * portions) / 2,
    }));
  };

  const averageRating =
    userComments.length > 0
      ? userComments.reduce((sum, c) => sum + c.stars, 0) / userComments.length
      : 0;

const handleCommentSubmit = async () => {
  if (comment.trim() === '' || ratingUser === 0) {
    Alert.alert('Comentario incompleto', 'Por favor escribe un comentario y asigna una calificación.');
    return;
  }

    if (!user) {
      Alert.alert('Error', 'No hay un usuario autenticado.');
      return;
    }

    try {
      const newQualification = await addQualification(id as string, {
        userId: user._id,
        star: ratingUser,
        comment: comment,
      });

      setUserComments([
        {
          name: user.username,
          text: comment,
          stars: ratingUser,
        },
        ...userComments,
      ]);

      setComment('');
      setRatingUser(0);
    } catch (err) {
      console.error('Error al enviar comentario:', err);
      Alert.alert('Error', 'No se pudo enviar el comentario.');
    }
  };

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const loadRecipe = async () => {
        try {
          if (!id) throw new Error('ID de receta no proporcionado');
          const recipeFetched = await getRecipeById(id);
          const qualificationsFetched = await getQualificationsByRecipeId(id);

          if (isActive) {
            setRecipe(recipeFetched);
            setUserComments(
              qualificationsFetched.map((q) => ({
                name: q.author?.name || 'Anónimo',
                text: q.content,
                stars: q.stars,
              }))
            );
            setError(null);
          }
        } catch (err) {
          console.error('Error al cargar receta:', err);
          if (isActive) {
            setError(err.message);
            setRecipe(null);
          }
        } finally {
          if (isActive) {
            setLoading(false);
          }
        }
      };
      loadRecipe();
      return () => {
        isActive = false;
      };
    }, [id])
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#9D5C63" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        <Text className="text-lg text-red-500">{error}</Text>
        <Text className="text-sm mt-2 text-gray-600">ID buscado: {id}</Text>
      </View>
    );
  }

  if (!recipe) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-gray-700">No se encontró la receta</Text>
      </View>
    );
  }

  const ingredientsToDisplay = calculateIngredients();

  const SimpleStarRating = ({
    rating,
    onChange,
  }: {
    rating: number;
    onChange?: (rating: number) => void;
  }) => {
    return (
      <View className="flex-row">
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable key={star} onPress={() => onChange?.(star)}>
            <Icon name={star <= rating ? 'star' : 'star-outline'} size={25} color="#FFD700" />
          </Pressable>
        ))}
      </View>
    );
  };

  const handleSaveRecipe = async () => {
     console.log('Intentando guardar receta...');
    try {
      const stored = await AsyncStorage.getItem('RECIPES_STORAGE');
      const storedRecipes: Recipe[] = stored ? JSON.parse(stored) : [];

      const alreadySaved = storedRecipes.some((r) => r.id === recipe?.id);
      if (alreadySaved) {
        Alert.alert('Ya guardada', 'Esta receta ya fue guardada para ver sin conexión.');
        return;
      }

      if (storedRecipes.length >= 10) {
        Alert.alert('Límite alcanzado', 'Solo puedes guardar hasta 10 recetas.');
        return;
      }

      const recipeToSave = {
        ...recipe,
        date: new Date().toISOString(), // Aseguramos que tenga fecha
        author: user?.username || 'Anónimo'
      };

      const updatedRecipes = [...storedRecipes, recipeToSave];
      await AsyncStorage.setItem('RECIPES_STORAGE', JSON.stringify(updatedRecipes));
      Alert.alert('Receta guardada', 'La receta se guardó correctamente.');

    } catch (error) {
      console.error('Error al guardar receta:', error);
      Alert.alert('Error', 'No se pudo guardar la receta.');
    }
  };

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Imagen principal */}
      <View className="relative">
        {recipe.imageUri ? (
          <Image source={{ uri: recipe.imageUri }} className="w-full h-72" resizeMode="cover" />
        ) : (
          <View className="w-full h-72 bg-gray-100 justify-center items-center">
            <Icon name="image-outline" size={50} color="#9D5C63" />
            <Text className="text-gray-500 mt-2">No hay imagen disponible</Text>
          </View>
        )}
      </View>

      {/* Contenido */}
      <View className="p-5">
        <Text className="text-3xl font-bold text-gray-800 mb-2">{recipe.title}</Text>
        <Text className="text-gray-600 mb-5">{recipe.description}</Text>

        {/* Calificación promedio */}
        <View className="bg-[#FEF5EF] p-4 rounded-xl mb-6">
          <Text className="font-bold text-lg text-center text-gray-700 mb-2">Calificación general</Text>
          <View className="items-center">
            <SimpleStarRating rating={Math.round(averageRating)} />
            <Text className="mt-2 text-gray-600">
              {averageRating.toFixed(1)} / 5 ({userComments.length} opiniones)
            </Text>
          </View>
        </View>

        {/* Porciones */}
        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-2">Porciones</Text>
          <View className="flex-row items-center bg-[#FEF5EF] p-3 rounded-lg">
            <Pressable
              onPress={() => setPortions((prev) => Math.max(1, prev - 1))}
              className="bg-[#9D5C63] rounded-full w-8 h-8 justify-center items-center"
            >
              <Icon name="remove" size={20} color="white" />
            </Pressable>
            <Text className="mx-4 text-lg font-semibold">{portions}</Text>
            <Pressable
              onPress={() => setPortions((prev) => Math.min(10, prev + 1))}
              className="bg-[#9D5C63] rounded-full w-8 h-8 justify-center items-center"
            >
              <Icon name="add" size={20} color="white" />
            </Pressable>
          </View>
        </View>

        {/* Ingredientes */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-3">Ingredientes</Text>
          <View className="bg-[#FEF5EF] p-4 rounded-lg">
            {ingredientsToDisplay.map((ing, index) => (
              <View key={index} className="flex-row py-2 border-b border-[#F0B27A] last:border-b-0">
                <Text className="text-gray-700 flex-1">• {ing.name}</Text>
                <Text className="text-gray-700 font-medium">
                  {ing.quantity.toFixed(2)} {ing.unit}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pasos */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-3">Preparación</Text>
          {recipe.steps?.map((step, index) => (
            <View key={index} className="mb-5 bg-[#FEF5EF] p-4 rounded-lg">
              <Text className="font-bold text-[#9D5C63] mb-2">Paso {index + 1}</Text>
              <Text className="text-gray-700 mb-3">{step.description}</Text>
              {step.imageUri && (
                <Image source={{ uri: step.imageUri }} className="w-full h-48 rounded-lg" />
              )}
            </View>
          ))}
        </View>

        {/* Comentarios */}
        <View>
          <Text className="text-xl font-bold text-gray-800 mb-3">Deja tu comentario</Text>
          <TextInput
            className="border-[#F0B27A] border-2 p-3 rounded-lg text-gray-700"
            placeholder="Escribe tu comentario..."
            placeholderTextColor="#9D5C63"
            value={comment}
            onChangeText={setComment}
            multiline
          />
          <View className="bg-[#FEF5EF] p-4 rounded-lg my-4 items-center">
            <Text className="font-semibold text-center text-gray-700 mb-2">Tu calificación</Text>
            <SimpleStarRating rating={ratingUser} onChange={setRatingUser} />
          </View>
          <Pressable
            onPress={handleCommentSubmit}
            className="bg-[#9D5C63] rounded-lg px-6 py-3 items-center mt-2 mb-8"
          >
            <Text className="text-white font-bold text-lg">Publicar comentario</Text>
          </Pressable>

          {/* Lista de comentarios */}
          <Text className="text-xl font-bold text-gray-800 mb-3">Comentarios</Text>
          {userComments.length > 0 ? (
            userComments.map((c, idx) => (
              <View key={idx} className="bg-[#FEF5EF] p-4 rounded-lg mb-4">
                <Text className="font-bold text-gray-800">{c.name}</Text>
                <Text className="text-gray-700 my-2">{c.text}</Text>
                <SimpleStarRating rating={c.stars} />
              </View>
            ))
          ) : (
            <Text className="text-gray-500 text-center py-4">No hay comentarios aún</Text>
          )}
        </View>
        <Pressable
  onPress={handleSaveRecipe}
  className="bg-[#6B0A1D] rounded-lg px-6 py-3 items-center mt-2 mb-10"
>
  <Pressable
  onPress={async () => {
    const data = await AsyncStorage.getItem('RECIPES_STORAGE');
    console.log('Recetas guardadas:', data);
    Alert.alert('Guardadas', data ? `Hay ${JSON.parse(data).length} recetas` : 'No hay recetas guardadas');
  }}
  className="bg-gray-500 rounded-lg px-4 py-2 items-center mt-2"
>
  <Text className="text-white font-medium">Ver recetas guardadas (debug)</Text>
</Pressable>
  <Text className="text-white font-bold text-lg">Guardar para ver sin conexión</Text>
</Pressable>
      </View>
    </ScrollView>
  );
}
