import React, { useState,useEffect,useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, ScrollView, Modal } from 'react-native';
import RecipeCard from '../../../components/RecipeCard';

import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import {mapRecipe} from '../../../utils/mapRecipe';
import { getRecipesByUserId } from '../../api/recipe_api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = () => {
  const router = useRouter();
  const { user, setUser, logout} = useAuth();

  const [activeTab, setActiveTab] = useState<'mis-recetas' | 'guardadas'>('mis-recetas');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const [userRecipes, setUserRecipes] = useState([]);
  const savedRecipes = user?.favorites?.map(mapRecipe) || [];
  const displayedRecipes = activeTab === 'mis-recetas' ? userRecipes : savedRecipes;

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
  };

  const handleLogoutComplete = () => {
    setShowLogoutMessage(false);
  };

  //const { recipes } = useRecipeContext();
  useFocusEffect(
    useCallback(() => {
      const loadUserFromStorage = async () => {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      };
      loadUserFromStorage();
    }, [])
  );
  useEffect(() => {
    const fetchUserRecipes = async () => {
      try {
        const userRecipes = await getRecipesByUserId(user._id);
        setUserRecipes(userRecipes); 
      } catch (error) {
        console.error(error);
      }
    };

    if (user && activeTab === 'mis-recetas') {
      fetchUserRecipes();
    }
  }, [user, activeTab]);
  return (
    <>
      <ScrollView className="flex-1 bg-white px-4 py-6">
        {/* Perfil */}
        <View className="flex-col sm:flex-row items-center sm:items-start mb-6">
          {user ? (
            <Image
              source={require('../../../assets/profileExample.jpg')}
              className="w-20 h-20 rounded-full mb-2 sm:mb-0 sm:mr-4"
              resizeMode="cover"
            />
          ) : (
            <View className="w-20 h-20 rounded-full bg-gray-200 mb-2 sm:mb-0 sm:mr-4" />
          )}
          <View className="items-center sm:items-start">
            <Text className="text-xl font-bold text-center sm:text-left">{user?.username || 'Usuario'}</Text>
            <Text className="text-gray-500 text-center sm:text-left">{user?.email || 'correo@ejemplo.com'}</Text>
          </View>
        </View>

        {/* Botones */}
        <View className="flex-row justify-between flex-wrap gap-y-2 mb-4">
          <TouchableOpacity
            className="bg-colorboton px-4 py-2 rounded-md"
            onPress={() => router.push('/(tabs)/profile/edit')}
          >
            <Text className="text-white font-semibold">Editar perfil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-colorboton px-4 py-2 rounded-md"
            onPress={() => setShowLogoutConfirm(true)}
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

        {/* Recetas */}
        {displayedRecipes.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() =>
              router.push({
                pathname: '/recipes/[id]',
                params: { id: item.id },
              })
            }
            className="mb-4"
          >
            <RecipeCard
              recipeId={item.id}
              imgsrc={{ uri: item.imageUri }}
              title={item.title}
              description={item.description}
              tags={item.tags}
              author={item.author}
              date={item.date.toString()}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Modal confirmación cierre de sesión */}
      <Modal visible={showLogoutConfirm} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-10">
          <View className="bg-white rounded-xl p-6 w-full items-center">
            <Text className="text-lg font-semibold mb-4">¿Querés cerrar sesión?</Text>
            <View className="flex-row space-x-4">
              <TouchableOpacity
                onPress={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                <Text className="text-black">No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmLogout}
                className="px-4 py-2 bg-colorboton rounded-md"
              >
                <Text className="text-white">Sí</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal sesión cerrada */}
      <Modal visible={showLogoutMessage} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-10">
          <View className="bg-white rounded-xl p-6 w-full items-center">
            <Text className="text-lg font-semibold mb-4">Sesión cerrada</Text>
            <TouchableOpacity
              onPress={handleLogoutComplete}
              className="px-6 py-2 bg-colorboton rounded-md"
            >
              <Text className="text-white text-base">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ProfileScreen;