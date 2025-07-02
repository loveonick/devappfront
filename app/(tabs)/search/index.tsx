import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
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
  'Entrada',
  'Principal',
  'Postre',
  'Aperitivo',
  'Bebida',
  'Snack',
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
  const { recipes } = useRecipeContext();
  const router = useRouter();
  const routerBack = {
    back: () => window.history.back(), // O tu método real con expo-router
  };
  console.log('Recipes:', recipes);
  const sortedRecipes = [...recipes].sort((a, b) => {
    if (sortOrder === 'alphabetical') {
      return a.title.localeCompare(b.title);
    } else {
      return new Date(b.date).getTime() - new Date(a.date).getTime(); // más recientes primero
    }
  });



  // Cambiar estado del tag: none -> include -> exclude -> none
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

  // Filtrado de recetas con búsqueda + filtros tags include/exclude
  const filteredRecipes = sortedRecipes.filter((r) => {
    const matchSearch =
      r.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.author?.toLowerCase().includes(searchQuery.toLowerCase());



    const includeTags = Object.entries(tagFilters)
      .filter(([_, v]) => v === 'include')
      .map(([k]) => k);

    const excludeTags = Object.entries(tagFilters)
      .filter(([_, v]) => v === 'exclude')
      .map(([k]) => k);

    const matchIncludeTags = includeTags.every((tag) => r.tags.includes(tag));
    const hasExcludeTags = excludeTags.some((tag) => r.tags.includes(tag));

    return matchSearch && matchIncludeTags && !hasExcludeTags;
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

        {/* Barra búsqueda + botón filtro */}
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
        <View className="absolute left-0 right-0 bottom-0 h-[60%] bg-white rounded-t-2xl p-8 shadow-lg">
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-2">Ordenar por:</Text>
            <TouchableOpacity
              className="bg-gray-100 px-4 py-2 rounded"
              onPress={() =>
                setSortOrder((prev) => (prev === 'alphabetical' ? 'recent' : 'alphabetical'))
              }
            >
              <Text className="text-base">
                {sortOrder === 'alphabetical' ? 'A-Z (alfabético)' : 'Más recientes primero'}
              </Text>
            </TouchableOpacity>
          </View>
          <Text className="text-2xl font-bold mb-6">Filtrar por tags</Text>

          {dishTypes.map((tag) => {
            const state = tagFilters[tag];
            let color = 'gray';
            let label = 'No usar';
            if (state === 'include') {
              color = '#2563EB'; // azul
              label = 'Incluir';
            } else if (state === 'exclude') {
              color = '#EF4444'; // rojo
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

          <TouchableOpacity
            className="mt-8 bg-blue-600 py-3 rounded-lg"
            onPress={() => setModalVisible(false)}
          >
            <Text className="text-white text-center font-semibold text-lg">Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Buscar;
