import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import RecipeCard from '../../../components/RecipeCard';

const recipes = [
  {
    id: 1,
    title: 'Lorem ipsum',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    image: require('../../../assets/descarga_3.jpg'),
    tags: ['Mexicana', 'Saludable'],
  },
  {
    id: 2,
    title: 'Lorem ipsum',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    image: require('../../../assets/descarga_3.jpg'),
    tags: ['Mexicana', 'Saludable'],
  },
  {
    id: 3,
    title: 'Lorem ipsum',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    image: require('../../../assets/descarga_3.jpg'),
    tags: ['Mexicana', 'Saludable'],
  },
];

const ProfileScreen = () => {
  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      {/* Perfil */}
      <View className="flex-row items-center mb-6">
        <Image
          source={require('../../../assets/profileExample.jpg')}
          className="w-20 h-20 rounded-full mr-4"
          resizeMode="cover"
        />
        <View className="flex-1">
          <Text className="text-xl font-bold">Brad_Pitt</Text>
          <Text className="text-gray-500">brad@gmail.com</Text>
        </View>
      </View>

      {/* Botones de perfil */}
      <View className="flex-row justify-between flex-wrap gap-y-2 mb-4">
        <TouchableOpacity className="bg-colorboton px-4 py-2 rounded-md">
          <Text className="text-white font-semibold">Editar perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-colorboton px-4 py-2 rounded-md">
          <Text className="text-white font-semibold">Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Botones de filtro */}
      <View className="flex-row flex-wrap mb-4 gap-2">
        <TouchableOpacity className="bg-gray-200 px-3 py-1 rounded-full">
          <Text className="text-black font-medium">Mis Recetas</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-200 px-3 py-1 rounded-full">
          <Text className="text-black font-medium">Guardadas</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de recetas */}
      {recipes.map((recipe, i) => (
        <View key={i} className="flex-row mb-4 bg-white rounded-xl shadow p-2">
          <Image
            source={recipe.image}
            className="w-24 h-24 rounded-xl mr-2"
            resizeMode="cover"
          />
          <View className="flex-1">
            <View className="flex-row justify-between items-start">
              <Text className="font-bold text-base flex-1">{recipe.title}</Text>
              <TouchableOpacity className="ml-2">
                <Ionicons name="heart-outline" size={20} color="black" />
              </TouchableOpacity>
            </View>
            <Text className="text-xs text-gray-600 mb-2">{recipe.description}</Text>
            <View className="flex-row flex-wrap">
              {recipe.tags.map((tag, j) => (
                <Text
                  key={j}
                  className="text-xs bg-colorboton text-white px-2 py-1 rounded-full mr-1 mb-1"
                >
                  {tag}
                </Text>
              ))}
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default ProfileScreen;
