import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RecipeCard from '../../components/RecipeCard';
import { useRouter } from 'expo-router';

interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUri: string;
  tags: string[];
  author: string;
  date: string;
}

export default function SavedRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadSavedRecipes = async () => {
      try {
        const stored = await AsyncStorage.getItem('RECIPES_STORAGE');
        const parsed: Recipe[] = stored ? JSON.parse(stored) : [];
        setRecipes(parsed);
      } catch (error) {
        console.error('Error al cargar recetas guardadas:', error);
        Alert.alert('Error', 'No se pudieron cargar las recetas guardadas.');
      } finally {
        setLoading(false);  
      }
    };

    loadSavedRecipes();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-colorfondo px-4 pt-4">
      <Text className="text-2xl font-bold mb-4 text-gray-800">Mis recetas guardadas</Text>
      {loading ? (
        <Text>Cargando...</Text>
      ) : recipes.length === 0 ? (
        <Text className="text-gray-600">No tenés recetas guardadas aún.</Text>
      ) : (
        <FlatList
          data={recipes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
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
                date={item.date}
              />
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
