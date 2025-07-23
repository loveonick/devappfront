import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../app/context/AuthContext';

interface Props {
    recipeId: string;
    imgsrc: any;
    title: string;
    description: string;
    tags: string[];
    author:string;
    date: string;

}

const RecipeCard = ({ recipeId, imgsrc, title, description, tags, author, date }: Props) => {
  const { user, toggleFavorite, isFavorite } = useAuth();

  const handleToggleFavorite = async () => {
    if (!user) return;
    await toggleFavorite(recipeId);
  };

  return (
    <View className="flex-row mb-4 bg-white rounded-xl shadow p-2">
      <View className="justify-center mr-2">
        <Image source={imgsrc} className="w-24 h-24 rounded-xl" />
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between">
          <Text className="font-bold text-base">{title}</Text>
          <TouchableOpacity onPress={handleToggleFavorite}>
            <Ionicons
              name={isFavorite(recipeId) ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite(recipeId) ? 'red' : 'black'}
            />
          </TouchableOpacity>
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

export default RecipeCard