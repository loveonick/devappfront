import { FlatList, Image, Text, TouchableOpacity, View, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import SearchBar from '../../components/SearchBar';
import { useRouter } from 'expo-router';

import RecipeCard from '../../components/RecipeCard';
import RecipeWeek from '../../components/RecipeWeek';
import Tags from '../../components/Tags';

import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';
import { getRecipes } from '../api/recipe_api';

const dishTypes = [
  'Todos',
  'Entrada',
  'Principal',
  'Postre',
  'Aperitivo',
  'Bebida',
  'Snack',
];

const Index = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [selectedDishType, setSelectedDishType] = useState('Todos');
  const { user } = useAuth();

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Traer recetas al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getRecipes();
        setRecipes(data.recipes || []);
      } catch (err) {
        console.error('Error al cargar recetas:', err);
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filtrar recetas por búsqueda y tipo de plato
  const filteredRecipes = recipes.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(searchText.toLowerCase());
    const matchDishType =
      selectedDishType === 'Todos' || (r.tags && r.tags.includes(selectedDishType));
    return matchSearch && matchDishType;
  });

  return (
    <SafeAreaView className="h-full bg-colorfondo">
      <View className="flex-1 mt-7 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 bg-colorfondo">
          <Image
            source={require('../../assets/logo.png')}
            style={{ width: 70, height: 70 }}
            resizeMode="contain"
          />
          <View className="flex-1 ml-4">
            <TouchableOpacity onPress={() => router.push('/search')}>
              <SearchBar
                placeholder="Buscar recetas..."
                value=""
                onChangeText={() => {}}
              />
            </TouchableOpacity>
          </View>
          <View className="ml-4">
            <MaterialIcons name="notifications-none" size={24} color="black" />
          </View>
          <View>
            <Ionicons name="notifications-outline" size={20} className="ml-4" />
          </View>
        </View>

        {/* Lista de recetas */}
        <FlatList
          data={filteredRecipes}
          keyExtractor={(item) => item._id.toString()}
          contentContainerStyle={{ paddingBottom: 130, paddingHorizontal: 16, flexGrow: 1 }}
          ListHeaderComponent={
            <>
              <Text className="text-xl font-bold mb-2 mt-4">Recetas de la semana</Text>

              {filteredRecipes.length === 0 && !loading ? (
                <Text className="text-gray-500 mb-4">No hay recetas para mostrar</Text>
              ) : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4 space-x-2">
                  {filteredRecipes.slice(0, 3).map((recipe) => (
                    <RecipeWeek
                      key={recipe._id}
                      imgsrc={{ uri: recipe.image }}
                      title={recipe.name}
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
          ListEmptyComponent={
            
            <View className="flex-1 justify-center items-center mt-10">
              {loading ? (
                <ActivityIndicator size="large" color="#6B0A1D" />
              ) : (
                <Text className="text-gray-500">No se encontraron recetas</Text>
              )}
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: '/recipes/[id]',
                  params: { id: item._id },
                })
              }
              className="mb-4"
            >
              <RecipeCard
                imgsrc={{ uri: item.image }}
                title={item.name}
                description={item.description}
                tags={item.tags}
                author={item.author}
                date={item.createdAt}
              />
            </TouchableOpacity>
          )}
        />

        {/* Footer solo si no está logueado */}
        {!user && (
          <View className="absolute bottom-0 left-0 right-0 bg-colorboton p-4 flex-row items-center justify-between">
            <Text className="text-sm font-semibold text-white">¿Todavía no tienes cuenta? ¡Únete!</Text>
            <TouchableOpacity
              className="bg-white px-3 py-1 rounded"
              onPress={() => router.push('/auth/login')}
            >
              <Text className="text-colorboton font-semibold">Iniciar Sesión</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Index;
