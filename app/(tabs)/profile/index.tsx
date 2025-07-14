import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, Image, TouchableOpacity, ScrollView, Modal, Alert } from 'react-native';
import RecipeCard from '../../../components/RecipeCard';

import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { mapRecipe } from '../../../utils/mapRecipe';
import { getRecipesByUserId } from '../../api/recipe_api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';


const ProfileScreen = () => {
  const router = useRouter();
  const { user, setUser, logout } = useAuth();

  const [activeTab, setActiveTab] = useState<'mis-recetas' | 'guardadas' | 'sin-conexion'>('mis-recetas');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);
  const [userRecipes, setUserRecipes] = useState([]);
  const [offlineRecipes, setOfflineRecipes] = useState<any[]>([]);

  const savedRecipes = user?.favorites?.map(mapRecipe) || [];

  const loadOfflineRecipes = async () => {
    if (!user || !user._id) return;
    try {
      const key = `RECIPES_STORAGE_${user._id}`;
      const stored = await AsyncStorage.getItem(key);
      const parsed = stored ? JSON.parse(stored) : [];
      setOfflineRecipes(parsed);
    } catch (error) {
      console.error('Error al cargar recetas offline:', error);
    }
  };

useEffect(() => {
  const loadUserFromStorage = async () => {
    const storedUser = await AsyncStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };
  loadUserFromStorage();
}, []);

useFocusEffect(
  useCallback(() => {
    if (!user || !user._id) return;

    const loadOfflineRecipes = async () => {
      try {
        const key = `RECIPES_STORAGE_${user._id}`;
        const stored = await AsyncStorage.getItem(key);
        const parsed = stored ? JSON.parse(stored) : [];
        setOfflineRecipes(parsed);
      } catch (error) {
        console.error('Error al cargar recetas offline:', error);
      }
    };

    loadOfflineRecipes();
  }, [user])
);

  useEffect(() => {
  const fetchUserRecipes = async () => {
    try {
      console.log('Cargando recetas para usuario:', user?._id);
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

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
  };

  const handleLogoutComplete = () => {
    setShowLogoutMessage(false);
  };

  const handleRemoveOfflineRecipe = async (recipeId: string) => {
    if (!user || !user._id) return;
    const key = `RECIPES_STORAGE_${user._id}`;
    const updated = offlineRecipes.filter(r => r.id !== recipeId);
    await AsyncStorage.setItem(key, JSON.stringify(updated));
    setOfflineRecipes(updated);
  };

  const handleClearOfflineRecipes = async () => {
    if (!user || !user._id) return;
    const key = `RECIPES_STORAGE_${user._id}`;
    await AsyncStorage.removeItem(key);
    setOfflineRecipes([]);
    Alert.alert('Éxito', 'Se eliminaron todas las recetas offline.');
  };

  const displayedRecipes =
    activeTab === 'mis-recetas'
      ? userRecipes
      : activeTab === 'guardadas'
      ? savedRecipes
      : offlineRecipes;

  return (
    <>
      <ScrollView className="flex-1 bg-white px-4 py-6">
        <View className="mb-4">
  <TouchableOpacity onPress={() => router.push('/(tabs)/')} className="flex-row items-center">
    <Icon name="arrow-back" size={24} color="black" />
    <Text className="ml-2 text-base text-black">Volver</Text>
  </TouchableOpacity>
</View>
        {/* Perfil */}
        <View className="flex-col sm:flex-row items-center sm:items-start mb-6">
          {user?.image ? (
            <Image
              source={require('../../../assets/user.jpg')}
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
          {['mis-recetas', 'guardadas', 'sin-conexion'].map((tabKey) => (
            <TouchableOpacity
              key={tabKey}
              className={`px-3 py-1 rounded-full ${activeTab === tabKey ? 'bg-colorboton' : 'bg-gray-200'}`}
              onPress={() => setActiveTab(tabKey as any)}
            >
              <Text className={`font-medium ${activeTab === tabKey ? 'text-white' : 'text-black'}`}>
                {{
                  'mis-recetas': 'Mis Recetas',
                  'guardadas': 'Guardadas',
                  'sin-conexion': 'Sin conexión',
                }[tabKey]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recetas */}
        {displayedRecipes.length === 0 ? (
          <Text className="text-center text-gray-500 mt-4">No hay recetas para mostrar.</Text>
        ) : (
          displayedRecipes.map((item) => (
            <View key={item.id} className="mb-4">
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: '/recipes/[id]',
                    params: { id: item.id },
                  })
                }
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

        {/* Botón eliminar todas (solo en sin conexión) */}
        {activeTab === 'sin-conexion' && offlineRecipes.length > 0 && (
          <TouchableOpacity
            onPress={handleClearOfflineRecipes}
            className="bg-red-700 mt-6 mx-4 rounded-lg px-4 py-3"
          >
            <Text className="text-white text-center font-bold">Eliminar todas las recetas guardadas offline</Text>
          </TouchableOpacity>
        )}
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
