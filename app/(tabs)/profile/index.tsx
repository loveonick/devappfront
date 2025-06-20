import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const ProfileScreen = () => {
  const router = useRouter();

  const [username, setUsername] = useState('Usuario');
  const [email, setEmail] = useState('correo@ejemplo.com');
  const [profileImage, setProfileImage] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<'mis-recetas' | 'guardadas'>('mis-recetas');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadProfile = async () => {
        try {
          const data = await AsyncStorage.getItem('profileData');
          if (data) {
            const { username, email, image } = JSON.parse(data);
            if (username) setUsername(username);
            if (email) setEmail(email);
            if (image) setProfileImage({ uri: image });
          }
        } catch (error) {
          console.error('Error cargando perfil:', error);
        }
      };
      loadProfile();
    }, [])
  );

  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false);
    setShowLogoutMessage(true);
  };

  const handleLogoutComplete = () => {
    setShowLogoutMessage(false);
    // lógica de logout si la implementás
  };

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

  const displayedRecipes = activeTab === 'mis-recetas' ? recipes : savedRecipes;

  return (
    <>
      <ScrollView className="flex-1 bg-white px-4 py-6">
        {/* Perfil */}
        <View className="flex-col sm:flex-row items-center sm:items-start mb-6">
          {profileImage ? (
            <Image
              source={profileImage}
              className="w-20 h-20 rounded-full mb-2 sm:mb-0 sm:mr-4"
              resizeMode="contain"
            />
          ) : (
            <View className="w-20 h-20 rounded-full bg-gray-200 mb-2 sm:mb-0 sm:mr-4" />
          )}
          <View className="items-center sm:items-start">
            <Text className="text-xl font-bold text-center sm:text-left">{username}</Text>
            <Text className="text-gray-500 text-center sm:text-left">{email}</Text>
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
