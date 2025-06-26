import { FlatList, Image, Text, TouchableOpacity, View, ScrollView, SafeAreaView } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import SearchBar from '../../components/SearchBar';
import { useRouter } from 'expo-router';
import RecipeCard from '../../components/RecipeCard';
import Tags from '../../components/Tags';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRecipeContext } from '../context/RecipeContext';

const tags = [
  { category: 'Todos', title: 'Todos' },
  { category: 'Mexicana', title: 'Mexicana' },
  { category: 'Argentina', title: 'Argentina' },
  { category: 'Saludable', title: 'Saludable' },
  { category: 'Vegana', title: 'Vegana' },
];

const sampleRecipes = [
  {
    id: '1',
    image: require('../../assets/descarga_1.jpg'),
    title: 'Tacos al Pastor',
    description: 'Deliciosos tacos con carne marinada y piña',
    tags: ['Mexicana', 'Popular'],
  },
  {
    id: '2',
    image: require('../../assets/descarga_2.jpg'),
    title: 'Empanadas Argentinas',
    description: 'Masa casera rellena de carne cortada a cuchillo',
    tags: ['Argentina', 'Carne'],
  },
];

const Index = () => {
  const router = useRouter();
  const { recipes } = useRecipeContext();

  // Combinar recetas creadas con las de muestra
  const allRecipes = [
    ...recipes.map(r => ({
      id: r.id,
      image: { uri: r.imageUri },
      title: r.title,
      description: r.description,
      tags: r.tags,
    })),
    ...sampleRecipes
  ];

  return (
    <SafeAreaView className='h-full bg-colorfondo'>
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
        </View>

        {/* FlatList */}
        <FlatList
          data={allRecipes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 130, paddingHorizontal: 16 }}
          ListHeaderComponent={
            <>
              <Text className="text-xl font-bold mb-2 mt-4">Recetas de la semana</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                <Image source={require('../../assets/descarga_1.jpg')} className="w-32 h-24 rounded-xl mr-2" />
                <Image source={require('../../assets/descarga_2.jpg')} className="w-32 h-24 rounded-xl mr-2" />
                <Image source={require('../../assets/descarga_3.jpg')} className="w-32 h-24 rounded-xl mr-2" />
              </ScrollView>

              <Tags categories={tags}/>
            </>
          }
          renderItem={({ item }) => (
            <TouchableOpacity 
              onPress={() => router.push({
                pathname: '/recipes/[id]',
                params: { id: item.id }
              })}
              className="mb-4"
            >
              <RecipeCard
                imgsrc={item.image}
                title={item.title}
                description={item.description}
                tags={item.tags}
              />
            </TouchableOpacity>
          )}
        />

        {/* Footer */}
        <View className="absolute bottom-0 left-0 right-0 bg-colorboton p-4 flex-row items-center justify-between">
          <Text className="text-sm font-semibold text-white">¿Todavía no tienes cuenta? ¡Únete!</Text>
          <TouchableOpacity 
            className="bg-white px-3 py-1 rounded"
            onPress={() => router.push('/auth/register')}
          >
            <Text className="text-colorboton font-semibold">Registrarse</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Index;