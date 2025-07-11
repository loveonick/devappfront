import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {getPendingRecipes, approveRecipe} from '../api/recipe_api';

const NotificationsScreen = () => {
  const router = useRouter();

  const [recipes, setRecipes] = useState([]);
  useEffect(() => {
    const fetchPendingRecipes = async () => {
      try {
        const data = await getPendingRecipes();
        setRecipes(data); // Guardar en estado
      } catch (error) {
        console.error('Error al obtener recetas pendientes:', error);
      }
    };

    fetchPendingRecipes();
  }, []);

  const handleDelete = (id: string) => {
  };

  const handleView = (id: string) => {
    router.push(`/recipes/${id}`);
  };

  const handleApprove = async (id: string) => {
    try {
      await approveRecipe(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      console.log('Aprobada', 'La receta ha sido aprobada');
    } catch (err) {
      console.error(err);
    }
  };
  console.log('Recetas pendientes:', recipes);
  return (
    <ScrollView className="flex-1 bg-white px-4 pt-12" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Botón atrás */}
      <TouchableOpacity className="absolute top-10 left-4 z-10" onPress={() => router.replace('/')}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text className="text-2xl font-bold text-center mb-6">Notificaciones</Text>

      {recipes.map((item) => (
        <View
          key={item.id}
          className="items-center bg-[#FFF5F5] rounded-lg px-4 py-4 mb-4 border border-gray-200"
        >
          {/* Imagen */}
          <Image
            source={item.imageUri ? { uri: item.image } : require('../../assets/splash-icon.png')}
            className="w-16 h-16 rounded-full mb-2"
            resizeMode="cover"
          />

          {/* Texto */}
          <Text className="font-bold text-base mb-1">{item.author}</Text>

          {/* Botones */}
          <View className="flex-row items-center space-x-3">
            <TouchableOpacity onPress={() => handleApprove(item.id)}>
              <Ionicons name="checkmark-circle" size={24} color="green" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => handleView(item.id)}
              className="bg-blue-500 rounded-full px-4 py-1"
            >
              <Text className="text-white text-sm font-semibold">Ver</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Ionicons name="trash" size={18} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default NotificationsScreen;
