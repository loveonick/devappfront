import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useProfileStore } from '../../../stores/profileStore';

const ProfileScreen = () => {
  const router = useRouter();
  const { username, email, profileImage, logout } = useProfileStore();

  const [activeTab, setActiveTab] = useState<'mis-recetas' | 'guardadas'>('mis-recetas');

  const recipes = [
    {
      id: 1,
      title: 'Tacos saludables',
      description: 'Tacos de pollo con vegetales y salsa picante.',
      image: require('../../../assets/descarga_3.jpg'),
      tags: ['Mexicana', 'Saludable'],
    },
    {
      id: 2,
      title: 'Ensalada fresca',
      description: 'Mezcla de hojas verdes con quinoa y palta.',
      image: require('../../../assets/descarga_3.jpg'),
      tags: ['Vegana', 'Ligera'],
    },
  ];

  const savedRecipes = [
    {
      id: 3,
      title: 'Sushi casero',
      description: 'Rolls de salmón con arroz y palta.',
      image: require('../../../assets/descarga_3.jpg'),
      tags: ['Japonesa', 'Clásico'],
    },
  ];

  const handleLogout = () => {
    Alert.alert('Cerrar sesión', 'Estás seguro que querés cerrar sesión?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Cerrar sesión', style: 'destructive', onPress: logout },
    ]);
  };

  const displayedRecipes = activeTab === 'mis-recetas' ? recipes : savedRecipes;

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      {/* Perfil */}
      <View className="flex-col sm:flex-row items-center sm:items-start mb-6">
        <Image
          source={profileImage}
          className="w-20 h-20 rounded-full mb-2 sm:mb-0 sm:mr-4"
          resizeMode="contain"
        />
        <View className="items-center sm:items-start">
          <Text className="text-xl font-bold text-center sm:text-left">{username}</Text>
          <Text className="text-gray-500 text-center sm:text-left">{email}</Text>
        </View>
      </View>

      {/* Botones de perfil */}
      <View className="flex-row justify-between flex-wrap gap-y-2 mb-4">
        <TouchableOpacity
          className="bg-colorboton px-4 py-2 rounded-md"
          onPress={() => router.push('/(tabs)/profile/edit')}
        >
          <Text className="text-white font-semibold">Editar perfil</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-colorboton px-4 py-2 rounded-md"
          onPress={handleLogout}
        >
          <Text className="text-white font-semibold">Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Filtros */}
      <View className="flex-row flex-wrap mb-4 gap-2">
        <TouchableOpacity
          className={`px-3 py-1 rounded-full ${activeTab === 'mis-recetas' ? 'bg-colorboton' : 'bg-gray-200'}`}
          onPress={() => setActiveTab('mis-recetas')}
        >
          <Text className={`font-medium ${activeTab === 'mis-recetas' ? 'text-white' : 'text-black'}`}>Mis Recetas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-3 py-1 rounded-full ${activeTab === 'guardadas' ? 'bg-colorboton' : 'bg-gray-200'}`}
          onPress={() => setActiveTab('guardadas')}
        >
          <Text className={`font-medium ${activeTab === 'guardadas' ? 'text-white' : 'text-black'}`}>Guardadas</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de recetas */}
      {displayedRecipes.map((recipe) => (
        <View
          key={recipe.id}
          className="flex-col sm:flex-row mb-4 bg-white rounded-xl shadow p-2"
        >
          <Image
            source={recipe.image}
            className="w-full h-48 sm:w-40 sm:h-32 rounded-xl mb-2 sm:mb-0 sm:mr-2"
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
              {recipe.tags.map((tag, index) => (
                <Text
                  key={index}
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
