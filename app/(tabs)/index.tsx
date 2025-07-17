import { FlatList, Image, Text, TouchableOpacity, View, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

import RecipeCard from '../../components/RecipeCard';
import RecipeWeek from '../../components/RecipeWeek';
import Tags from '../../components/Tags';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import { getRecipes,getApprovedRecipes } from '../api/recipe_api';
import { useRecipeContext } from '../context/RecipeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const dishTypes = [
  "Todos",
  "Entrada",
  "Plato principal",
  "Guarnición",
  "Postre",
  "Bebida",
  "Ensalada",
  "Sopa",
  "Snack",
  "Desayuno"
];

const Index = () => {
  const router = useRouter();
  const [selectedDishType, setSelectedDishType] = useState('Todos');
  const { user } = useAuth();

  //const { recipes, setRecipes } = useRecipeContext(); este es para el async storage
  const [recipes, setRecipes] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<any[]>([]);

  const key = user?._id ? `RECIPES_STORAGE_${user._id}` : null;

  const loadSavedRecipes = async () => {
    if (!key) return;
    try {
      const stored = await AsyncStorage.getItem(key);
      const parsed = stored ? JSON.parse(stored) : [];
      setSavedRecipes(parsed);
    } catch (error) {
      console.error('Error al cargar recetas guardadas:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSavedRecipes();
    }, [user])
  );

  useEffect(() => {
    const checkConnectionAndFetchData = async () => {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected);

      if (!state.isConnected) {
        setLoading(false);
        return;
      }

      try {
        const data = await getApprovedRecipes(); //cambiado para obtener recetas aprobadas
        setRecipes(data || []);
      } catch (err) {
        console.error('Error al cargar recetas:', err);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };

    checkConnectionAndFetchData();
  }, []);

  const filteredRecipes = recipes.filter((r) => {
    const matchDishType =
      selectedDishType === 'Todos' || (r.tags && r.tags.includes(selectedDishType));
    return matchDishType;
  });

  const handleSaveRecipe = async (recipeToSave: any) => {
    if (!key) {
      Alert.alert('Error', 'No se pudo identificar al usuario.');
      return;
    }

    try {
      const stored = await AsyncStorage.getItem(key);
      const storedRecipes = stored ? JSON.parse(stored) : [];

      const alreadySaved = storedRecipes.some((r: any) => r.id === recipeToSave.id);
      if (alreadySaved) {
        Alert.alert('Ya guardada', 'Esta receta ya fue guardada para ver sin conexión.');
        return;
      }

      if (storedRecipes.length >= 10) {
        Alert.alert('Límite alcanzado', 'Solo puedes guardar hasta 10 recetas.');
        return;
      }

      const updatedRecipes = [...storedRecipes, recipeToSave];
      await AsyncStorage.setItem(key, JSON.stringify(updatedRecipes));
      setSavedRecipes(updatedRecipes);

      Alert.alert('Receta guardada', 'La receta se guardó correctamente.');
    } catch (err) {
      console.error('Error al guardar receta offline:', err);
      Alert.alert('Error', 'No se pudo guardar la receta.');
    }
  };

  const handleRemoveRecipe = async (recipeId: string) => {
    if (!key) return;
    try {
      const updated = savedRecipes.filter(r => r.id !== recipeId);
      await AsyncStorage.setItem(key, JSON.stringify(updated));
      setSavedRecipes(updated);
    } catch (err) {
      console.error('Error al eliminar receta guardada:', err);
    }
  };

  const handleClearAllRecipes = async () => {
    if (!key) return;
    try {
      await AsyncStorage.removeItem(key);
      setSavedRecipes([]);
      Alert.alert('Limpieza completa', 'Se eliminaron todas las recetas guardadas.');
    } catch (err) {
      console.error('Error al limpiar recetas guardadas:', err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-colorfondo">
        <ActivityIndicator size="large" color="#6B0A1D" />
        <Text className="mt-4 text-gray-700">Cargando...</Text>
      </SafeAreaView>
    );
  }

  if (!isConnected) {
    return (
      <SafeAreaView className="flex-1 bg-colorfondo">
        <View className="px-4 pt-10 items-center">
          <Icon name="cloud-offline-outline" size={80} color="#6B0A1D" />
          <Text className="text-xl font-bold text-center mt-4">¡Sin conexión a Internet!</Text>
          <Text className="text-gray-600 text-center mt-2 mb-4">
            Mostrando recetas guardadas localmente.
          </Text>
        </View>

        {savedRecipes.length === 0 ? (
          <View className="items-center justify-center px-4">
            <Text className="text-gray-500">No tienes recetas guardadas offline.</Text>
          </View>
        ) : (
          <FlatList
            data={savedRecipes}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingBottom: 130, paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <View className="mb-4">
                <RecipeCard
                  recipeId={item.id}
                  imgsrc={{ uri: item.imageUri }}
                  title={item.title}
                  description={item.description}
                  tags={item.tags}
                  author={item.author}
                  date={item.date?.toString() || ''}
                />
                <TouchableOpacity
                  onPress={() => handleRemoveRecipe(item.id)}
                  className="bg-red-500 mt-2 rounded-lg px-4 py-2 self-start"
                >
                  <Text className="text-white font-semibold">Eliminar receta</Text>
                </TouchableOpacity>
              </View>
            )}
            ListFooterComponent={
              <TouchableOpacity
                onPress={handleClearAllRecipes}
                className="bg-red-700 mx-6 mt-6 rounded-lg px-4 py-3"
              >
                <Text className="text-white font-bold text-center">Eliminar todas las recetas guardadas</Text>
              </TouchableOpacity>
            }
          />
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full bg-colorfondo">
      <View className="flex-1 mt-7 bg-white">
        <View className="flex-row items-center justify-between px-4 bg-colorfondo">
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: 70, height: 70 }}
            resizeMode="contain"
          />

          <View className="flex-1 ml-4">
            <TouchableOpacity 
              onPress={() => router.push('/search')}
              activeOpacity={0.7}
              className="w-full"
            >
              <View className="bg-white rounded-full px-4 py-2 flex-row items-center">
                <Icon name="search-outline" size={20} color="#888" />
                <Text className="ml-2 text-gray-500">Buscar recetas...</Text>
              </View>
            </TouchableOpacity>
          </View>
          
        </View>

        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 130, paddingHorizontal: 16, flexGrow: 1 }}
          ListHeaderComponent={
            <>
              <Text className="text-xl font-bold mb-2 mt-4">Recetas recientes</Text>
              {recipes.length === 0 ? (
                <Text className="text-gray-500 mb-4">No hay recetas para mostrar</Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4 space-x-2">
                  {recipes.slice(0, 3).map((recipe) => (
                    <RecipeWeek
                      key={recipe.id}
                      imgsrc={{ uri: recipe.imageUri }}
                      title={recipe.title}
                    />
                  ))}
                </ScrollView>
              )}
              <Tags
                dishTypes={dishTypes}
                selectedDishType={selectedDishType}
                onSelectDishType={setSelectedDishType}
              />
            </>
          }
          renderItem={({ item }) => {
            const isSaved = savedRecipes.some((r) => r.id === item.id);

            return (
              <View className="mb-4">
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: '/recipes/[id]',
                      params: { id: item.id },
                    })
                  }
                  activeOpacity={0.9}
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

                <TouchableOpacity
                  onPress={() => {
                    if (!isSaved) handleSaveRecipe(item);
                  }}
                  disabled={isSaved}
                  className={`mt-2 rounded-lg px-4 py-2 self-start ${
                    isSaved ? 'bg-gray-400' : 'bg-[#6B0A1D]'
                  }`}
                >
                  <Text className="text-white font-semibold">
                    {isSaved ? 'Ya guardada' : 'Guardar offline'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default Index;