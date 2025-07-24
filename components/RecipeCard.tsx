import { View, Text, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../app/context/AuthContext';
import { useRecipeContext } from '../app/context/RecipeContext';
import { getRecipeById } from '../app/api/recipe_api';

interface Props {
  recipeId: string;
  imgsrc: any;
  title: string;
  description: string;
  tags: string[];
  author: string;
  date: string;
  isSaved?: boolean;
}

const RecipeCard = ({ recipeId, imgsrc, title, description, tags, author, date, isSaved }: Props) => {
  const { user, toggleFavorite, isFavorite } = useAuth();
  const { addRecipe, deleteRecipe, alreadySaved, storedRecipes } = useRecipeContext();

  const [isSavedState, setIsSavedState] = useState(isSaved ?? false);
  const [loadingFavorite, setLoadingFavorite] = useState(false);
  const [loadingDownload, setLoadingDownload] = useState(false);

  useEffect(() => {
    setIsSavedState(isSaved ?? false);
  }, [isSaved]);

  const handleRemoveOfflineRecipe = async (recipeId: string) => {
    await deleteRecipe(recipeId);
    setIsSavedState(false);
    Alert.alert('Receta eliminada', 'La receta fue eliminada del modo offline.');
  };

  const handleToggleFavorite = async () => {
    if (!user) return;
    setLoadingFavorite(true);
    try {
      await toggleFavorite(recipeId);
    } finally {
      setLoadingFavorite(false);
    }
  };

  const handleDownload = async () => {
    if (!user || !user._id) {
      Alert.alert('Error', 'No se pudo identificar al usuario.');
      return;
    }

    if (storedRecipes.length >= 10) {
      Alert.alert('Límite alcanzado', 'Solo puedes guardar hasta 10 recetas.');
      return;
    }

    setLoadingDownload(true);
    try {
      if (isSavedState) {
        await handleRemoveOfflineRecipe(recipeId);
      } else {
        const preparedRecipe = await getRecipeById(recipeId);
        await addRecipe(preparedRecipe);
        setIsSavedState(true);
        Alert.alert('Receta guardada', 'La receta se guardó correctamente.');
      }
    } catch (error) {
      console.error('❌ Error al guardar receta:', error);
      Alert.alert('Error', 'No se pudo guardar la receta.');
    } finally {
      setLoadingDownload(false);
    }
  };

  return (
    <View className="flex-row mb-4 bg-white rounded-xl shadow p-2">
      <View className="justify-center mr-2">
        <Image source={imgsrc} className="w-24 h-24 rounded-xl" />
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between items-center">
          <Text className="font-bold text-base flex-1 mr-2">{title}</Text>
          <View className="flex-row space-x-2">
            <TouchableOpacity onPress={handleDownload} disabled={loadingDownload}>
              {loadingDownload ? (
                <ActivityIndicator size="small" color="#6B0A1D" />
              ) : (
                <Ionicons
                  name={isSavedState ? 'download' : 'download-outline'}
                  size={20}
                  color={isSavedState ? '#6B0A1D' : 'black'}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={handleToggleFavorite} disabled={loadingFavorite}>
              {loadingFavorite ? (
                <ActivityIndicator size="small" color="red" />
              ) : (
                <Ionicons
                  name={isFavorite(recipeId) ? 'heart' : 'heart-outline'}
                  size={20}
                  color={isFavorite(recipeId) ? 'red' : 'black'}
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
        <Text className="text-xs text-gray-600 mb-2">{description}</Text>
        <Text className="text-xs text-gray-500 mb-1">Por: {author}</Text>
        <Text className="text-xs text-gray-500 mb-2">Fecha: {new Date(date).toLocaleDateString()}</Text>
        <View className="flex-row flex-wrap">
          {tags.map((tag, j) => (
            <Text key={j} className="text-xs bg-colortag text-white px-2 py-1 rounded-full mr-1 mb-1">
              {tag}
            </Text>
          ))}
        </View>
      </View>
    </View>
  );
};

export default RecipeCard;