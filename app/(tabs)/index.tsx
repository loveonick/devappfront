import { FlatList, Image, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import SearchBar from '../../components/SearchBar';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const tags = ['Mexicana', 'Argentina', 'Saludable', 'Vegana'];

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
            <SearchBar
              onPress={() => router.push('')}
              placeholder="Buscar recetas..."
            />
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
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4 p-3">
                {tags.map((tag, i) => (
                  <TouchableOpacity key={i} className="px-4 py-2 bg-white rounded-full mr-2 shadow">
                    <Text>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          }
          renderItem={({ item }) => (
            <View className="flex-row mb-4 bg-white rounded-xl shadow p-2">
              <Image source={item.image} className="w-24 h-24 rounded-xl mr-2" />
              <View className="flex-1">
                <View className="flex-row justify-between">
                  <Text className="font-bold text-base">{item.title}</Text>
                  <TouchableOpacity>
                    <Ionicons name="heart-outline" size={20} color="black" />
                  </TouchableOpacity>
                </View>
                <Text className="text-xs text-gray-600 mb-2">{item.description}</Text>
                <View className="flex-row flex-wrap">
                  {item.tags.map((tag, j) => (
                    <Text key={j} className="text-xs bg-colortag text-white px-2 py-1 rounded-full mr-1 mb-1">
                      {tag}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          )}
        />

        {/* Footer fijo */}
        <View className="absolute bottom-0 left-0 right-0 bg-pink-200 p-4 flex-row items-center justify-between">
          <Text className="text-sm font-semibold">¿Todavía no tienes cuenta? ¡Únete!</Text>
          <TouchableOpacity className="bg-white px-3 py-1 rounded">
            <Text className="text-pink-600 font-semibold">Iniciar Sesión</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default index;