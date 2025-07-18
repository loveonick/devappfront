import { View, Text, Image, ScrollView, ActivityIndicator, TextInput, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';

import { getRecipeById } from '../api/recipe_api';
import { getQualificationsByRecipeId, addQualification } from '../api/qualification_api';
import { useAuth } from '../context/AuthContext';
import { useRecipeContext } from '../context/RecipeContext';
import { sanitizeRecipe } from '../../utils/sanitizeRecipe';

interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUri: string;
  ingredients: { name: string; quantity: string; unit: string }[];
  steps: { description: string; imageUri?: string }[];
  tags: string[];
  author?: string;
  date?: string;
}

interface Comment {
  name: string;
  text: string;
  stars: number;
}

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { getRecipeById: getRecipeLocal } = useRecipeContext();

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratingUser, setRatingUser] = useState(0);
  const [comment, setComment] = useState('');
  const [userComments, setUserComments] = useState<Comment[]>([]);
  const [portions, setPortions] = useState(2);

const calculateIngredients = () => {
  if (!recipe?.ingredients) return [];

  return recipe.ingredients.map((ing) => {
    const quantityNum = parseFloat(ing.quantity?.toString() || '0');
    return {
      ...ing,
      quantity: ((quantityNum * portions) / 2).toFixed(2),
    };
  });
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
      await addQualification(id as string, {
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
        const recipeId = Array.isArray(id) ? id[0] : id;
        if (!recipeId) throw new Error('ID de receta no proporcionado');

        const connection = await NetInfo.fetch();

        if (!connection.isConnected) {
          const localRecipe = getRecipeLocal(recipeId);

          console.log('🔌 Modo offline — receta cruda desde AsyncStorage:', localRecipe);

          if (!localRecipe) throw new Error('Esta receta no está disponible sin conexión.');

          const sanitized = sanitizeRecipe(localRecipe);
          console.log('✅ Receta saneada offline:', sanitized);
          console.log('🍽 Ingredientes:', sanitized.ingredients);
          console.log('📋 Pasos:', sanitized.steps);

          setRecipe(sanitized);
          setUserComments([]);
          setError(null);
          return;
        }

        // Modo online
        const recipeFetched = await getRecipeById(recipeId);
        const qualificationsFetched = await getQualificationsByRecipeId(recipeId);

        if (isActive) {
          const sanitizedOnline = sanitizeRecipe(recipeFetched);

          console.log('🌐 Receta cargada online:', sanitizedOnline);

          setRecipe(sanitizedOnline);
          setUserComments(
            qualificationsFetched.map((q) => ({
              name: q.author?.name || 'Anónimo',
              text: q.content,
              stars: q.stars,
            }))
          );
          setError(null);
        }
      } catch (err: any) {
        console.error('❌ Error al cargar receta:', err);
        if (isActive) {
          setError(err.message || 'Error desconocido');
          setRecipe(null);
        }
      } finally {
        if (isActive) setLoading(false);
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

  const SimpleStarRating = ({ rating, onChange }: { rating: number; onChange?: (rating: number) => void }) => {
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

  return (
    <ScrollView className="flex-1 bg-white">
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

      <View className="p-5">
        <Text className="text-3xl font-bold text-gray-800 mb-2">{recipe.title}</Text>
        <Text className="text-gray-600 mb-5">{recipe.description}</Text>

        <View className="bg-[#FEF5EF] p-4 rounded-xl mb-6">
          <Text className="font-bold text-lg text-center text-gray-700 mb-2">Calificación general</Text>
          <View className="items-center">
            <SimpleStarRating rating={Math.round(averageRating)} />
            <Text className="mt-2 text-gray-600">
              {averageRating.toFixed(1)} / 5 ({userComments.length} opiniones)
            </Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-2">Porciones</Text>
          <View className="flex-row items-center bg-[#FEF5EF] p-3 rounded-lg">
            <Pressable onPress={() => setPortions((prev) => Math.max(1, prev - 1))} className="bg-[#9D5C63] rounded-full w-8 h-8 justify-center items-center">
              <Icon name="remove" size={20} color="white" />
            </Pressable>
            <Text className="mx-4 text-lg font-semibold">{portions}</Text>
            <Pressable onPress={() => setPortions((prev) => Math.min(10, prev + 1))} className="bg-[#9D5C63] rounded-full w-8 h-8 justify-center items-center">
              <Icon name="add" size={20} color="white" />
            </Pressable>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-3">Ingredientes</Text>
          <View className="bg-[#FEF5EF] p-4 rounded-lg">
            {ingredientsToDisplay.map((ing, index) => (
              <View key={index} className="flex-row py-2 border-b border-[#F0B27A] last:border-b-0">
                <Text className="text-gray-700 flex-1">• {ing.name}</Text>
                <Text className="text-gray-700 font-medium">
                  {ing.quantity} {ing.unit}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-3">Preparación</Text>
          {recipe.steps && recipe.steps.length > 0 ? (
  recipe.steps.map((step, index) => (
    <View key={index} className="mb-4">
      <Text className="font-bold text-lg mb-1">Paso {index + 1}</Text>
      <Text className="text-gray-700">{step.description || 'Sin descripción'}</Text>
      {step.imageUri ? (
        <Image
          source={{ uri: step.imageUri }}
          className="w-full h-48 rounded-lg mt-2"
          resizeMode="cover"
        />
      ) : null}
    </View>
  ))
) : (
  <Text className="text-gray-500">No hay pasos disponibles</Text>
)}
        </View>
      </View>
    </ScrollView>
  );
}
