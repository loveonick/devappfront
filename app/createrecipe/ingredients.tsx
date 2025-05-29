import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router'; // Importa useRouter

export default function Ingredients() {
  const [ingredients, setIngredients] = useState([{ id: 1, value: '' }]);
  const router = useRouter(); // Inicializa router

  const addIngredient = () => {
    setIngredients([...ingredients, { id: Date.now(), value: '' }]);
  };

  const removeIngredient = (id: number) => {
    setIngredients(ingredients.filter(item => item.id !== id));
  };

  const updateIngredient = (id: number, value: string) => {
    setIngredients(
      ingredients.map(item => (item.id === id ? { ...item, value } : item))
    );
  };

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <Text className="text-[#1C1B1F] text-xl font-bold mb-6 text-center">
        ¿Qué ingrediente necesita?
      </Text>

      {/* Encabezado */}
      <View className="flex-row justify-between items-center bg-gray-100 px-4 py-3 rounded-md mb-4">
        <Text className="text-[#1C1B1F] font-semibold">Agua</Text>
        <Text className="text-[#1C1B1F] font-semibold">| Cantidad</Text>
        <Text className="text-[#1C1B1F] font-semibold">| Unidad ▼</Text>
      </View>

      {/* Lista de ingredientes */}
      {ingredients.map((item, index) => (
        <View key={item.id} className="flex-row items-center mb-3">
          <TextInput
            placeholder="Ej: 100ml agua"
            placeholderTextColor="#9CA3AF"
            className="bg-gray-100 rounded-md flex-1 px-4 py-2 mr-2"
            value={item.value}
            onChangeText={(text) => updateIngredient(item.id, text)}
          />
          {index === ingredients.length - 1 ? (
            <TouchableOpacity onPress={addIngredient}>
              <Text className="text-2xl text-[#1C1B1F] font-bold">+</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={() => removeIngredient(item.id)}>
              <Text className="text-2xl text-[#1C1B1F] font-bold">−</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      {/* Botón continuar */}
      <View className="items-center mt-6">
        <TouchableOpacity
          onPress={() => router.push('../createrecipe/newProcedure')} // Ruta corregida
          className="bg-[#9D5C63] px-8 py-3 rounded-full"
        >
          <Text className="text-white font-bold text-base">Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}