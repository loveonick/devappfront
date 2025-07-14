import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getPendingRecipes, approveRecipe, deleteRecipe } from '../api/recipe_api';

const AdminScreen = () => {
  const router = useRouter();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  useEffect(() => {
    const fetchPendingRecipes = async () => {
      try {
        setLoading(true);
        const data = await getPendingRecipes();
        setRecipes(data);
      } catch (error) {
        console.error('Error al obtener recetas pendientes:', error);
        showMessage('No se pudieron cargar las recetas', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingRecipes();
  }, []);

  const showMessage = (text: string, type: 'success' | 'error') => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000); // Oculta el mensaje a los 3 segundos
  };

  const handleDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await deleteRecipe(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      showMessage('Receta eliminada correctamente', 'success');
    } catch (err) {
      console.error('Error al eliminar receta:', err);
      showMessage('Error al eliminar la receta', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleView = (id: string) => {
    router.push(`/recipes/${id}`);
  };

  const handleApprove = async (id: string) => {
    try {
      setApprovingId(id);
      await approveRecipe(id);
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      showMessage('Receta aprobada correctamente', 'success');
    } catch (err) {
      console.error('Error al aprobar receta:', err);
      showMessage('Error al aprobar la receta', 'error');
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-14" contentContainerStyle={{ paddingBottom: 40 }}>

      {message !== '' && (
        <View
          className={`absolute top-4 left-4 right-4 z-50 px-4 py-2 rounded-md ${
            messageType === 'success' ? 'bg-green-100' : 'bg-red-100'
          }`}
        >
          <Text
            className={`text-center font-medium ${
              messageType === 'success' ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {message}
          </Text>
        </View>
      )}

      <View className="px-4 pt-12">
        <Text className="text-2xl font-bold text-center mb-4">Recetas pendientes</Text>

        <TouchableOpacity
          className="self-start flex-row items-center mb-4"
          onPress={() => router.replace('/')}
        >
          <Ionicons name="arrow-back" size={20} color="black" />
          <Text className="ml-1 text-base text-black">Volver</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#9D5C63" className="mt-20" />
      ) : recipes.length === 0 ? (
        <Text className="text-center text-gray-500 mt-10">No hay recetas pendientes</Text>
      ) : (
        recipes.map((item) => (
          <View
            key={item.id}
            className="flex-row items-center justify-between bg-white rounded-xl border border-gray-200 shadow-sm px-4 py-3 mb-4"
          >
            <View className="flex-row items-center flex-1 pr-2">
              <Image
                source={item.imageUri ? { uri: item.imageUri } : require('../../assets/splash-icon.png')}
                className="w-16 h-16 rounded-md mr-3"
                resizeMode="cover"
              />
              <View>
                <Text className="text-base font-semibold">{item.title || 'Sin título'}</Text>
                <Text className="text-gray-600 text-sm">Autor: {item.author || 'Desconocido'}</Text>
              </View>
            </View>

            <View className="flex-row items-center space-x-3">
              {approvingId === item.id ? (
                <ActivityIndicator size="small" color="green" />
              ) : (
                <TouchableOpacity onPress={() => handleApprove(item.id)}>
                  <Ionicons name="checkmark-circle" size={24} color="green" />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => handleView(item.id)}
                className="bg-blue-500 rounded-full px-3 py-1"
              >
                <Text className="text-white text-sm font-semibold">Ver</Text>
              </TouchableOpacity>

              {deletingId === item.id ? (
                <ActivityIndicator size="small" color="red" />
              ) : (
                <TouchableOpacity onPress={() => handleDelete(item.id)}>
                  <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

export default AdminScreen;