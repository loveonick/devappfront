import { FlatList, Image, Text, TouchableOpacity, View, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

import RecipeCard from '../../components/RecipeCard';
import RecipeWeek from '../../components/RecipeWeek';
import Tags from '../../components/Tags';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import { getRecipes } from '../api/recipe_api';
import { useRecipeContext } from '../context/RecipeContext';
import Icon from 'react-native-vector-icons/Ionicons';
import NetInfo from '@react-native-community/netinfo';

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

  const { recipes, setRecipes } = useRecipeContext();
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(null);

  useEffect(() => {
    const checkConnectionAndFetchData = async () => {
      const state = await NetInfo.fetch();
      setIsConnected(state.isConnected);

      if (!state.isConnected) {
        Alert.alert(
          'Sin conexión',
          'No se puede usar la aplicación sin conexión a internet.'
        );
        setLoading(false);
        return;
      }

      try {
        const data = await getRecipes();
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
      <SafeAreaView className="flex-1 justify-center items-center bg-colorfondo px-4">
        <Icon name="cloud-offline-outline" size={80} color="#6B0A1D" />
        <Text className="text-xl font-bold text-center mt-4">
          ¡Sin conexión a Internet!
        </Text>
        <Text className="text-gray-600 text-center mt-2">
          No podemos mostrar las recetas sin conexión. Por favor, revisa tu conexión e inténtalo de nuevo.
        </Text>
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

          {/* SearchBar no editable que redirige */}
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

          <TouchableOpacity onPress={() => router.push('/notificationsUser')}>
            <View className="ml-4">
              <MaterialIcons name="notifications-none" size={24} color="black" />
            </View>
          </TouchableOpacity>
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
          renderItem={({ item }) => (
            <TouchableOpacity
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
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Index;
