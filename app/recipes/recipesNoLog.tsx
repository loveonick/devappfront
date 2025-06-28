import React from 'react';
import { ScrollView, View, Text, Image } from 'react-native';

const RecipePage: React.FC = () => {
  return (
    <ScrollView className="mx-auto border-gray-300 border shadow-lg p-4 space-y-6 font-mi-fuente">
      {/* Imagen principal */}
      <Image source={require('../../assets/descarga_1.jpg')}  className="w-full h-44 object-cover rounded-md"
      />

      {/* Ingredientes */}
      <View className='text-lg font-bold mt-5'>
        <Text className="font-bold text-center mb-5">Ingredientes</Text>
        {Array.from({ length: 7 }, (_, i) => (
          <Text key={i} className="text-sm mb-1">
            • Ingrediente
          </Text>
        ))}
      </View>

      {/* Instrucciones */}
      <View className='text-lg font-bold mt-5'>
        <Text className="font-bold text-center mb-5">Instrucciones</Text>
        {Array.from({ length: 5 }, (_, i) => (
          <Text key={i} className="text-sm mb-3">
            {i + 1}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed odio magna,
            dapibus nec ultricies at, rutrum quis tellus. Morbi sed leo eget erat tempus consectetur.
          </Text>
        ))}
      </View>

      {/* Otras fotos */}
      <View className='text-lg font-bold mt-5'>
        <Text className="font-bold text-center mb-5">Otras fotos</Text>
        <View className="space-y-2">
          <Image
            source={require('../../assets/descarga_1.jpg')}
            className="w-full h-28 object-cover rounded-md"
          />
          <Image
            source={require('../../assets/descarga_1.jpg')}
            className="w-full h-28 object-cover rounded-md"
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default RecipePage;
