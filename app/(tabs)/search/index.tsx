import { useLocalSearchParams, useRouter } from 'expo-router';
import { View, Text, FlatList, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeCard from '../../../components/RecipeCard';
import { useState } from 'react';
import SearchBar from '../../../components/SearchBar';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';

// Example recipes array; replace with your actual data source or import
const recipes = [
  {
    title: 'Spaghetti Bolognese',
    description: 'A classic Italian pasta dish with rich meat sauce.',
    image: 'https://example.com/spaghetti.jpg',
    tags: ['Italian', 'Pasta']
  },
  {
    title: 'Chicken Curry',
    description: 'Spicy and flavorful chicken curry.',
    image: 'https://example.com/chicken-curry.jpg',
    tags: ['Indian', 'Spicy']
  }
];

const Buscar = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const filteredRecipes = recipes.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.description.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const router = useRouter();
  
  return (
    <SafeAreaView className="h-full bg-white">
      <View className="p-4">
        <View className='flex-1'>
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View className='flex-1 py-2 mx-5 flex-row items-center justify-center'>
          <SearchBar
          placeholder="Buscar recetas..."
          value={searchQuery}
          onChangeText={(text: string) => setSearchQuery(text)}
          />
          <Ionicons name="menu" size={24} color="black" />
        </View>

        <Text className="text-lg font-semibold my-4">Resultados para: {searchQuery}</Text>

        <FlatList
          data={filteredRecipes}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <RecipeCard
              imgsrc={item.image}
              title={item.title}
              description={item.description}
              tags={item.tags}
            />
          )}
        />
      </View>
    </SafeAreaView>
  );
};

export default Buscar;