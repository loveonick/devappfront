import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';

const recipes = [
  {
    id: 1,
    title: 'Lorem ipsum',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    image: 'https://via.placeholder.com/100',
    tags: ['Mexicana', 'Saludable'],
  },
  {
    id: 2,
    title: 'Lorem ipsum',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    image: 'https://via.placeholder.com/100',
    tags: ['Mexicana', 'Saludable'],
  },
  {
    id: 3,
    title: 'Lorem ipsum',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    image: 'https://via.placeholder.com/100',
    tags: ['Mexicana', 'Saludable'],
  },
];

const ProfileScreen = () => {
  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      {/* Perfil */}
      <View className="flex-row items-center mb-6">
        <Image
          source={{ uri: 'https://via.placeholder.com/80' }}
          className="w-20 h-20 rounded-full mr-4"
        />
        <View>
          <Text className="text-xl font-bold">Brad_Pitt</Text>
          <Text className="text-gray-500">brad@gmail.com</Text>
        </View>
      </View>

      {/* Botones de perfil */}
      <View className="flex-row justify-between mb-4">
        <TouchableOpacity className="bg-rose-400 px-4 py-2 rounded-md">
          <Text className="text-white font-semibold">Editar perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-rose-400 px-4 py-2 rounded-md">
          <Text className="text-white font-semibold">Cerrar Sesion</Text>
        </TouchableOpacity>
      </View>

      {/* Botones de filtro */}
      <View className="flex-row mb-4">
        <TouchableOpacity className="bg-gray-200 px-3 py-1 rounded-full mr-2">
          <Text className="text-black font-medium">Mis Recetas</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-gray-200 px-3 py-1 rounded-full">
          <Text className="text-black font-medium">Guardadas</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de recetas */}
      {recipes.map((recipe) => (
        <View
          key={recipe.id}
          className="flex-row bg-rose-50 p-3 rounded-lg mb-4 items-center"
        >
          <Image
            source={{ uri: recipe.image }}
            className="w-20 h-20 rounded-lg mr-4"
          />
          <View className="flex-1">
            <Text className="text-base font-semibold">{recipe.title}</Text>
            <Text className="text-xs text-gray-600">{recipe.description}</Text>
            <View className="flex-row mt-1 flex-wrap">
              {recipe.tags.map((tag, index) => (
                <Text
                  key={index}
                  className="text-white bg-rose-700 px-2 py-0.5 rounded-full text-xs mr-2 mt-1"
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
