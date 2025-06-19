import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RecipeCard from '../../../components/RecipeCard';
import { useState } from 'react';
import SearchBar from '../../../components/SearchBar';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Checkbox from 'expo-checkbox';

const { height } = Dimensions.get('window');

const allTags = ['Italian', 'Pasta', 'Indian', 'Spicy'];

const recipes = [
  {
    title: 'Spaghetti Bolognese',
    description: 'A classic Italian pasta dish with rich meat sauce.',
    image: 'https://example.com/spaghetti.jpg',
    tags: ['Italian', 'Pasta'],
  },
  {
    title: 'Chicken Curry',
    description: 'Spicy and flavorful chicken curry.',
    image: 'https://example.com/chicken-curry.jpg',
    tags: ['Indian', 'Spicy'],
  },
];

const Buscar = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const router = useRouter();

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredRecipes = recipes.filter((r) => {
    const matchSearch =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchTags =
      selectedTags.length === 0 || selectedTags.every((tag) => r.tags.includes(tag));

    return matchSearch && matchTags;
  });

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="p-4 flex-1">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>

          <Text className="ml-4 text-lg font-semibold">Buscar recetas</Text>
        </View>

        {/* Barra búsqueda + botón filtro en la misma fila */}
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

        <Text className="text-lg font-semibold mb-4">
          Resultados para: {searchQuery || 'todos'}{' '}
          {selectedTags.length > 0 && `(Filtros: ${selectedTags.join(', ')})`}
        </Text>

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
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-20">
              No se encontraron recetas con esos criterios.
            </Text>
          }
        />
      </View>

      {/* Modal filtro */}
      <Modal transparent visible={modalVisible} animationType="none">
        {/* Fondo semitransparente oscuro */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
          className="flex-1 bg-black bg-opacity-70"
        />

        <View className="absolute left-0 right-0 bottom-0 h-[60%] bg-white rounded-t-2xl p-8 shadow-lg">
          <Text className="text-2xl font-bold mb-6">Filtrar por tags</Text>

          {allTags.map((tag) => (
            <View key={tag} className="flex-row items-center mb-5">
              <Checkbox
                value={selectedTags.includes(tag)}
                onValueChange={() => toggleTag(tag)}
                color={selectedTags.includes(tag) ? '#2563EB' : undefined}
              />
              <Text className="ml-4 text-lg">{tag}</Text>
            </View>
          ))}

          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            className="mt-8 bg-blue-600 py-4 rounded-lg"
          >
            <Text className="text-white font-semibold text-center text-lg">Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Buscar;