import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

export default function Ingredients() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [ingredients, setIngredients] = useState<Ingredient[]>([{ 
    name: '', 
    quantity: '', 
    unit: '' 
  }]);

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length <= 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleContinue = () => {
    router.push({
      pathname: '/createrecipe/newProcedure',
      params: {
        ...params,
        ingredients: JSON.stringify(ingredients),
      },
    });
  };

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <TouchableOpacity 
        onPress={() => router.back()}
        className="absolute top-12 left-6 z-10"
      >
        <Ionicons name="arrow-back" size={24} color="#9D5C63" />
      </TouchableOpacity>

      <Text className="text-xl font-bold mb-6 text-center">Ingredientes</Text>

      {ingredients.map((item, index) => (
        <View key={index} className="flex-row mb-3">
          <TextInput
            placeholder="Ingrediente"
            className="flex-1 border border-gray-300 rounded-md px-3 py-2 mr-2"
            value={item.name}
            onChangeText={(text) => updateIngredient(index, 'name', text)}
          />
          <TextInput
            placeholder="Cant"
            className="w-20 border border-gray-300 rounded-md px-3 py-2 mr-2"
            value={item.quantity}
            onChangeText={(text) => updateIngredient(index, 'quantity', text)}
            keyboardType="numeric"
          />
          <TextInput
            placeholder="Unidad"
            className="w-16 border border-gray-300 rounded-md px-3 py-2 mr-2"
            value={item.unit}
            onChangeText={(text) => updateIngredient(index, 'unit', text)}
          />
          {ingredients.length > 1 && (
            <TouchableOpacity
              onPress={() => removeIngredient(index)}
              className="justify-center"
            >
              <Ionicons name="trash" size={20} color="#9D5C63" />
            </TouchableOpacity>
          )}
        </View>
      ))}

      <TouchableOpacity
        onPress={addIngredient}
        className="flex-row items-center mb-6"
      >
        <Ionicons name="add-circle" size={24} color="#9D5C63" />
        <Text className="ml-2 text-[#9D5C63]">Agregar ingrediente</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleContinue}
        className="bg-[#9D5C63] rounded-full px-8 py-3 self-center"
      >
        <Text className="text-white font-bold">Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}