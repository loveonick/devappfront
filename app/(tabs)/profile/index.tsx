import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useRouter } from 'expo-router';

import RecipeCard from '../../../components/RecipeCard';
import { useAuth } from '../../context/AuthContext';
import { useRecipeContext } from '../../context/RecipeContext';
import { mapRecipe } from '../../../utils/mapRecipe';
import { getRecipesByUserId } from '../../api/recipe_api';

const ProfileScreen = () => {
  const router = useRouter();
  const { user, setUser, logout } = useAuth();
  const {
    storedRecipes,
    deleteRecipe,
    deleteAllRecipes,
    reloadStoredRecipes
  } = useRecipeContext();

  const [activeTab, setActiveTab] = useState<'mis-recetas' | 'guardadas' | 'sin-conexion'>('mis-recetas');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const [userRecipes, setUserRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const savedRecipes = user?.favorites?.map(mapRecipe) || [];

  const fetchUserRecipes = async () => {
    if (!user || !user._id) return;
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await getRecipesByUserId(user._id);
      setUserRecipes(data);
      console.log(userRecipes);
    } catch (error) {
      console.error(error);
      setErrorMessage('No se pudieron cargar tus recetas.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
    await deleteAllRecipes();
    setShowLogoutMessage(true);
  };

  const handleLogoutComplete = () => {
    setShowLogoutMessage(false);
  };

  const handleRemoveOfflineRecipe = (recipeId: string) => {
    deleteRecipe(recipeId);
  };

  useFocusEffect(
    useCallback(() => {
      if (!user) return;

      if (activeTab === 'sin-conexion') {
        reloadStoredRecipes();
      } else if (activeTab === 'mis-recetas') {
        fetchUserRecipes();
      }
    }, [user, activeTab])
  );

  const displayedRecipes =
    activeTab === 'mis-recetas'
      ? userRecipes
      : activeTab === 'guardadas'
      ? savedRecipes
      : storedRecipes;

  
  return (
    <SafeAreaView className="flex-1 bg-colorfondo">
      <ScrollView className="flex-1 bg-white px-4 py-6">
        {/* Botón volver */}
        <View className='p-4 flex-1'>
          <View className="mb-4">
            <TouchableOpacity onPress={() => router.push('/(tabs)/')} className="flex-row items-center">
              <Icon name="arrow-back" size={24} color="black" />
              <Text className="ml-4 text-lg font-semibold">Volver</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-col sm:flex-row items-center sm:items-start mb-6">
          {user?.image ? (
            <Image source={require('../../../assets/user.jpg')} className="w-20 h-20 rounded-full mb-2 sm:mb-0 sm:mr-4" resizeMode="cover" />
          ) : (
            <View className="w-20 h-20 rounded-full bg-gray-200 mb-2 sm:mb-0 sm:mr-4" />
          )}
          <View className="items-center sm:items-start">
            <Text className="text-xl font-bold text-center sm:text-left">{user?.username || 'Usuario'}</Text>
            <Text className="text-gray-500 text-center sm:text-left">{user?.email || 'correo@ejemplo.com'}</Text>
          </View>
        </View>

        <View className="flex-row justify-around flex-wrap gap-y-2 mb-4">
          <TouchableOpacity className="bg-colorboton px-4 py-2 rounded-md" onPress={() => router.push('/(tabs)/profile/edit')}>
            <Text className="text-white font-semibold">Editar perfil</Text>
          </TouchableOpacity>
          {user?.role === 'admin' && (
            <TouchableOpacity className="bg-green-700 px-4 py-2 rounded-md" onPress={() => router.push('/adminboard')}>
              <Text className="text-white font-semibold">Panel Admin</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity className="bg-colorboton px-4 py-2 rounded-md" onPress={() => setShowLogoutConfirm(true)}>
            <Text className="text-white font-semibold">Cerrar sesión</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row flex-wrap mb-4 gap-2">
          {['mis-recetas', 'guardadas', 'sin-conexion'].map(tabKey => (
            <TouchableOpacity
              key={tabKey}
              className={`px-3 py-1 rounded-full ${activeTab === tabKey ? 'bg-colorboton' : 'bg-gray-200'}`}
              onPress={() => setActiveTab(tabKey as any)}
            >
              <Text className={`font-medium ${activeTab === tabKey ? 'text-white' : 'text-black'}`}>
                {{ 'mis-recetas': 'Mis Recetas', 'guardadas': 'Favoritos', 'sin-conexion': 'Sin conexión' }[tabKey]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {isLoading ? (
          <View className="mt-10 items-center">
            <ActivityIndicator size="large" color="#9D5C63" />
            <Text className="text-gray-600 mt-2">Cargando recetas...</Text>
          </View>
        ) : errorMessage ? (
          <View className="mt-10 items-center">
            <Text className="text-red-600 font-semibold">{errorMessage}</Text>
          </View>
        ) : displayedRecipes.length === 0 ? (
          <Text className="text-center text-gray-500 mt-10">No hay recetas para mostrar.</Text>
        ) : (
          displayedRecipes.map(item => (
            <View key={item.id} className="mb-4">
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/recipes/[id]',
                    params: { id: item.id },
                  })
                }
                activeOpacity={0.8}
              >
                <RecipeCard
                  recipeId={item.id}
                  imgsrc={{ uri: item.imageUri }}
                  title={item.title}
                  description={item.description}
                  tags={item.tags}
                  author={item.author}
                  date={item.date?.toString() || ''}
                />
              </TouchableOpacity>
              {activeTab === 'sin-conexion' && (
                <TouchableOpacity
                  onPress={() => handleRemoveOfflineRecipe(item.id)}
                  className="bg-red-500 mt-2 rounded-md px-4 py-2 self-start"
                >
                  <Text className="text-white font-medium">Eliminar receta</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}

        {activeTab === 'sin-conexion' && storedRecipes.length > 0 && (
          <TouchableOpacity onPress={deleteAllRecipes} className="bg-red-700 mt-6 mx-4 rounded-lg px-4 py-3">
            <Text className="text-white text-center font-bold">Eliminar todas las recetas guardadas offline</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal visible={showLogoutConfirm} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-10">
          <View className="bg-white rounded-xl p-6 w-full items-center">
            <Text className="text-lg font-semibold mb-4">¿Querés cerrar sesión?</Text>
            <View className="flex-row">
              <TouchableOpacity
                onPress={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded-md mr-2"
              >
                <Text className="text-black">No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmLogout}
                className="px-4 py-2 bg-colorboton rounded-md ml-2"
              >
                <Text className="text-white">Sí</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showLogoutMessage} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-10">
          <View className="bg-white rounded-xl p-6 w-full items-center">
            <Text className="text-lg font-semibold mb-4">Sesión cerrada</Text>
            <TouchableOpacity onPress={handleLogoutComplete} className="px-6 py-2 bg-colorboton rounded-md">
              <Text className="text-white text-base">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProfileScreen;
