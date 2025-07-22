import { FlatList, Image, Text, TouchableOpacity, View, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useRecipeContext } from '../context/RecipeContext';
import NetInfo from '@react-native-community/netinfo';
import Icon from 'react-native-vector-icons/Ionicons';

import { getApprovedRecipes } from '../api/recipe_api';
import RecipeCard from '../../components/RecipeCard';
import RecipeWeek from '../../components/RecipeWeek';
import Tags from '../../components/Tags';
import { sanitizeRecipe } from '../../utils/sanitizeRecipe';

const dishTypes = [
  'Todos',
  'Entrada',
  'Plato principal',
  'Guarnición',
  'Postre',
  'Bebida',
  'Ensalada',
  'Sopa',
  'Snack',
  'Desayuno'
];

const Index = () => {
  const router = useRouter();
  const { user } = useAuth();
  const {
    storedRecipes,
    addRecipe,
    deleteRecipe,
    deleteAllRecipes,
    alreadySaved,
    reloadStoredRecipes,
  } = useRecipeContext();

  const [selectedDishType, setSelectedDishType] = useState('Todos');
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState<boolean | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const checkConnectionAndFetchData = async () => {
        const state = await NetInfo.fetch();
        if (!isActive) return;

        setIsConnected(state.isConnected);

        if (!state.isConnected) {
          await reloadStoredRecipes();
          setLoading(false);
          return;
        }

        try {
          const data = await getApprovedRecipes();
          if (isActive) {
            setRecipes(data || []);
          }
        } catch (err) {
          console.error('Error al cargar recetas:', err);
          if (isActive) setRecipes([]);
        } finally {
          if (isActive) setLoading(false);
        }
      };

      checkConnectionAndFetchData();

      return () => {
        isActive = false;
      };
    }, [])
  );

  const filteredRecipes = recipes.filter(r =>
    selectedDishType === 'Todos' || (r.tags && r.tags.includes(selectedDishType))
  );

const handleSaveRecipe = async (recipe: any) => {
  if (!user || !user._id) {
    Alert.alert('Error', 'No se pudo identificar al usuario.');
    return;
  }

  if (alreadySaved(recipe)) {
    Alert.alert('Ya guardada', 'Esta receta ya fue guardada para ver sin conexión.');
    return;
  }

  if (storedRecipes.length >= 10) {
    Alert.alert('Límite alcanzado', 'Solo puedes guardar hasta 10 recetas.');
    return;
  }

  const preparedRecipe = sanitizeRecipe({
    ...recipe,
    author: recipe.author ?? user.username,
    date: recipe.date ?? new Date().toISOString(),
  });

  await addRecipe(preparedRecipe);
  Alert.alert('Receta guardada', 'La receta se guardó correctamente.');
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
          <Text className="text-xl font-bold text-center mt-4">Sin conexión a Internet</Text>
          <Text className="text-gray-600 text-center mt-2 mb-4">
            Mostrando recetas guardadas localmente
          </Text>
        </View>

        <FlatList
          data={storedRecipes}
          keyExtractor={item => item.id.toString()}
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
                onPress={() => deleteRecipe(item.id)}
                className="bg-red-500 mt-2 rounded-lg px-4 py-2 self-start"
              >
                <Text className="text-white font-semibold">Eliminar receta</Text>
              </TouchableOpacity>
            </View>
          )}
          ListFooterComponent={
            storedRecipes.length > 0 ? (
              <TouchableOpacity
                onPress={deleteAllRecipes}
                className="bg-red-700 mx-6 mt-6 rounded-lg px-4 py-3"
              >
                <Text className="text-white font-bold text-center">
                  Eliminar todas las recetas guardadas
                </Text>
              </TouchableOpacity>
            ) : null
          }
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="h-full bg-colorfondo">
      <View className="flex-1 mt-7 bg-white">
        <View className="flex-row items-center justify-between px-4 bg-colorfondo">
          <Image source={require('../../assets/logo.png')} style={{ width: 70, height: 70 }} resizeMode="contain" />

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
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 130, paddingHorizontal: 16, flexGrow: 1 }}
          ListHeaderComponent={
            <>
              <Text className="text-xl font-bold mb-2 mt-4">Recetas recientes</Text>
              {recipes.length === 0 ? (
                <Text className="text-gray-500 mb-4">No hay recetas para mostrar</Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4 space-x-2">
                  {recipes.slice(0, 3).map(recipe => (
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
            const isSaved = alreadySaved(item);

            return (
              <View className="mb-4">
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
                    date={item.date.toString()}
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    if (!isSaved) handleSaveRecipe(item);
                  }}
                  disabled={isSaved}
                  className={`mt-2 rounded-lg px-4 py-2 self-start ${isSaved ? 'bg-gray-400' : 'bg-[#6B0A1D]'}`}
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
