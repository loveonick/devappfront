import { FlatList, Image, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import SearchBar from '../../components/SearchBar';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeCard from '../../components/RecipeCard';
import Tags from '../../components/Tags';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useAuth } from '../context/AuthContext';

type Category = {
  category: string;
  title: string;
};


const tags: Category[] = [
  { category: 'Todos', title: 'Todos' },
  { category: 'Mexicana', title: 'Mexicana' },
  { category: 'Argentina', title: 'Argentina' },
  { category: 'Saludable', title: 'Saludable' },
  { category: 'Vegana', title: 'Vegana' },
];

const recipes = [
  {
    image: require('../../assets/descarga_1.jpg'),
    title: 'Lorem ipsum',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dapibus mauris ut sagittis lobortis.',
    tags: ['Mexicana', 'Saludable', 'Vegana'],
  },
  {
    image: require('../../assets/descarga_2.jpg'),
    title: 'Lorem ipsum',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dapibus mauris ut sagittis lobortis.',
    tags: ['Mexicana', 'Saludable', 'Vegana'],
  },
  {
    image: require('../../assets/descarga_3.jpg'),
    title: 'Lorem ipsum',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dapibus mauris ut sagittis lobortis.',
    tags: ['Mexicana', 'Saludable', 'Vegana'],
  },
];

const index = () => {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [selectedTag, setSelectedTag] = useState('Todos');
  const { user } = useAuth();

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
          <View>
            <Ionicons name="notifications-outline" size={20} className="ml-4" />
          </View>
        </View>

        {/* FlatList*/}
        <FlatList
          data={recipes}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={{ paddingBottom: 130, paddingHorizontal: 16 }}
          ListHeaderComponent={
            <>
            {/* Recetas de la semana */}
            <Text className="text-xl font-bold mb-2 mt-4">Recetas de la semana</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
                <Image source={require('../../assets/descarga_1.jpg')} className="w-32 h-24 rounded-xl mr-2" />
                <Image source={require('../../assets/descarga_1.jpg')} className="w-32 h-24 rounded-xl mr-2" />
                <Image source={require('../../assets/descarga_1.jpg')} className="w-32 h-24 rounded-xl mr-2" />
            </ScrollView>

            {/* Filtros */}
            <Tags categories={tags}/>
            </>
        }
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push('/recipes/recipeslog')}>
            <RecipeCard
              imgsrc={item.image}
              title={item.title}
              description={item.description}
              tags={item.tags}
            />
          </TouchableOpacity>
        )}
        />

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

export default index;