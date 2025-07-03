import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeCard from '../../../components/RecipeCard';
import SearchBar from '../../../components/SearchBar';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Checkbox from 'expo-checkbox';

import { useRouter } from 'expo-router';
import { useRecipeContext } from '../../context/RecipeContext';

const dishTypes = [
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

type TagFilterState = 'include' | 'exclude' | 'none';

const Buscar = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [sortOrder, setSortOrder] = useState<'alphabetical' | 'recent'>('alphabetical');
  const [tagFilters, setTagFilters] = useState<Record<string, TagFilterState>>(() => {
    const initial: Record<string, TagFilterState> = {};
    dishTypes.forEach((t) => (initial[t] = 'none'));
    return initial;
  });
  const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
  const [ingredientInput, setIngredientInput] = useState<string>('');
  const { recipes } = useRecipeContext();
  const router = useRouter();
  const routerBack = {
    back: () => window.history.back(),
  };

  // Obtener todos los ingredientes únicos de las recetas
  const allIngredients = Array.from(
    new Set(
      recipes.flatMap(recipe => 
        recipe.ingredients ? recipe.ingredients.map(ing => ing.name.toLowerCase()) : []
      )
    )
  ).sort();

  const sortedRecipes = [...recipes].sort((a, b) => {
    if (sortOrder === 'alphabetical') {
      return a.title.localeCompare(b.title);
    } else {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const toggleTagState = (tag: string) => {
    setTagFilters((prev) => {
      const current = prev[tag];
      let next: TagFilterState;
      if (current === 'none') next = 'include';
      else if (current === 'include') next = 'exclude';
      else next = 'none';
      return { ...prev, [tag]: next };
    });
  };

  const addExcludedIngredient = () => {
    if (ingredientInput.trim() && !excludedIngredients.includes(ingredientInput.toLowerCase())) {
      setExcludedIngredients([...excludedIngredients, ingredientInput.toLowerCase()]);
      setIngredientInput('');
    }
  };

  const removeExcludedIngredient = (ingredient: string) => {
    setExcludedIngredients(excludedIngredients.filter(ing => ing !== ingredient));
  };

  const filteredRecipes = sortedRecipes.filter((r) => {
    // Filtro por búsqueda (título, autor o ingredientes)
    const searchLower = searchQuery.toLowerCase();
    const matchSearch =
      searchQuery === '' ||
      r.title?.toLowerCase().includes(searchLower) ||
      r.author?.toLowerCase().includes(searchLower) ||
      r.ingredients?.some(ing => 
        ing.name.toLowerCase().includes(searchLower)
      );

    // Filtro por tags
    const includeTags = Object.entries(tagFilters)
      .filter(([_, v]) => v === 'include')
      .map(([k]) => k);

    const excludeTags = Object.entries(tagFilters)
      .filter(([_, v]) => v === 'exclude')
      .map(([k]) => k);

    const matchIncludeTags = includeTags.every((tag) => r.tags.includes(tag));
    const hasExcludeTags = excludeTags.some((tag) => r.tags.includes(tag));

    // Filtro por ingredientes excluidos
    const hasExcludedIngredients = excludedIngredients.length > 0
      ? r.ingredients?.some(ing => 
          excludedIngredients.includes(ing.name.toLowerCase())
        )
      : false;

    return matchSearch && matchIncludeTags && !hasExcludeTags && !hasExcludedIngredients;
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4 flex-1">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => routerBack.back()}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text className="ml-4 text-lg font-semibold">Buscar recetas</Text>
        </View>

        {/* Barra búsqueda unificada + botón filtro */}
        <View className="flex-row items-center mb-4 mx-1">
          <View className="flex-1 mr-3">
            <SearchBar
              placeholder="Buscar recetas..."
              value={searchQuery}
              onChangeText={(text: string) => setSearchQuery(text)}
            />
          </View>

          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            className="bg-gray-200 p-3 rounded-md"
            activeOpacity={0.7}
          >
            <Ionicons name="options-outline" size={24} color="black" />
          </TouchableOpacity>
        </View>

        {/* Texto resultados y filtros */}
        <Text className="text-lg font-semibold mb-4">
          Resultados para: {searchQuery || 'todos'}{' '}
          {Object.entries(tagFilters)
            .filter(([_, v]) => v !== 'none')
            .map(([k, v]) => `${v === 'include' ? '+' : '-'}${k}`)
            .join(', ')}
          {excludedIngredients.length > 0 && ` (sin: ${excludedIngredients.join(', ')})`}
        </Text>

        {/* Lista de recetas */}
        <FlatList
          data={filteredRecipes}
          keyExtractor={(_, i) => i.toString()}
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
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-20">
              No se encontraron recetas con esos criterios.
            </Text>
          }
        />
      </View>

      {/* Modal filtro */}
      <Modal transparent visible={modalVisible} animationType="fade">
        {/* Fondo oscuro */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          className="flex-1 bg-black bg-opacity-70"
        />

        {/* Contenedor modal */}
        <View className="absolute left-0 right-0 bottom-0 h-[70%] bg-white rounded-t-2xl p-8 shadow-lg">
          <ScrollView showsVerticalScrollIndicator={true}>
            <View className="mb-6">
              <Text className="text-lg font-semibold mb-2">Ordenar por:</Text>
              <TouchableOpacity
                className="bg-gray-100 px-4 py-2 rounded"
                onPress={() =>
                  setSortOrder((prev) => (prev === 'alphabetical' ? 'recent' : 'alphabetical'))
                }
              >
                <Text className="text-base">
                  {sortOrder === 'alphabetical' ? 'A-Z (alfabético)' : 'más nueva a más antigua'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <Text className="text-2xl font-bold mb-6">Filtrar por tags</Text>

            {dishTypes.map((tag) => {
              const state = tagFilters[tag];
              let color = 'gray';
              let label = 'No usar';
              if (state === 'include') {
                color = '#2563EB';
                label = 'Incluir';
              } else if (state === 'exclude') {
                color = '#EF4444';
                label = 'Excluir';
              }
              return (
                <TouchableOpacity
                  key={tag}
                  className="flex-row items-center mb-4"
                  onPress={() => toggleTagState(tag)}
                  style={{ opacity: state === 'none' ? 0.6 : 1 }}
                >
                  <Checkbox
                    value={state !== 'none'}
                    onValueChange={() => toggleTagState(tag)}
                    color={color}
                  />
                  <Text className="ml-4 text-lg font-semibold">{tag}</Text>
                  <Text className="ml-2 text-sm font-medium text-gray-500">{label}</Text>
                </TouchableOpacity>
              );
            })}

            {/* Sección para excluir ingredientes */}
            <View className="mt-8">
              <Text className="text-2xl font-bold mb-4">Excluir ingredientes</Text>
              <View className="flex-row items-center mb-2">
                <TextInput
                  className="flex-1 border border-gray-300 rounded p-2 mr-2"
                  placeholder="Ingresa un ingrediente a excluir"
                  value={ingredientInput}
                  onChangeText={setIngredientInput}
                  onSubmitEditing={addExcludedIngredient}
                />
                <TouchableOpacity
                  onPress={addExcludedIngredient}
                  className="bg-blue-500 p-2 rounded"
                >
                  <Text className="text-white">Agregar</Text>
                </TouchableOpacity>
              </View>
              
              {/* Lista de ingredientes excluidos */}
              <View className="flex-row flex-wrap">
                {excludedIngredients.map((ingredient) => (
                  <TouchableOpacity
                    key={ingredient}
                    onPress={() => removeExcludedIngredient(ingredient)}
                    className="bg-red-100 px-3 py-1 rounded-full m-1 flex-row items-center"
                  >
                    <Text className="text-red-800 mr-1">{ingredient}</Text>
                    <AntDesign name="close" size={14} color="#991b1b" />
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity
              className="mt-8 bg-blue-600 py-3 rounded-lg"
              onPress={() => setModalVisible(false)}
            >
              <Text className="text-white text-center font-semibold text-lg">Cerrar</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Buscar;