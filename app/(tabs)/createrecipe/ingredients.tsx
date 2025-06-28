import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; 

export default function Ingredients() {
  const [ingredients, setIngredients] = useState([{ 
    id: 1, 
    name: '', 
    quantity: '', 
    unit: '' 
  }]);
  const router = useRouter(); 

  const addIngredient = () => {
    setIngredients([...ingredients, { 
      id: Date.now(), 
      name: '', 
      quantity: '', 
      unit: '' 
    }]);
  };

  const removeIngredient = (id) => {
    if (ingredients.length > 1) {
      setIngredients(ingredients.filter(item => item.id !== id));
    }
  };

  const updateIngredientField = (id, field, value) => {
    setIngredients(
      ingredients.map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <Text className="text-[#1C1B1F] text-xl font-bold mb-6 text-center">
        ¿Qué ingrediente necesita?
      </Text>

      {/* Encabezado de la lista de ingredientes */}
      <View className="flex-row justify-between items-center bg-gray-100 px-4 py-3 rounded-md mb-4">
        <Text className="text-[#1C1B1F] font-semibold flex-1">Ingrediente</Text>
        <Text className="text-[#1C1B1F] font-semibold px-1">Cantidad</Text>
        <Text className="text-[#1C1B1F] font-semibold px-2">Unidad</Text>
      </View>

      {/* Lista de ingredientes */}
      {ingredients.map((item, index) => (
        <View key={item.id} className="flex-row items-center mb-3">
          {/* Campo Ingrediente */}
          <TextInput
            placeholder="Agua"
            placeholderTextColor="#9CA3AF"
            className="bg-gray-100 rounded-md flex-1 px-4 py-2 mr-2"
            value={item.name}
            onChangeText={(text) => updateIngredientField(item.id, 'name', text)}
          />
          
          {/* Campo Cantidad */}
          <TextInput
            placeholder="100"
            placeholderTextColor="#9CA3AF"
            className="bg-gray-100 rounded-md w-20 px-2 py-2 mr-2 text-center"
            value={item.quantity}
            onChangeText={(text) => updateIngredientField(item.id, 'quantity', text)}
            keyboardType="numeric"
          />
          
          {/* Campo Unidad */}
          <TextInput
            placeholder="ml"
            placeholderTextColor="#9CA3AF"
            className="bg-gray-100 rounded-md w-16 px-2 py-2 mr-2 text-center"
            value={item.unit}
            onChangeText={(text) => updateIngredientField(item.id, 'unit', text)}
          />
          
          {/* Botones */}
          {index === ingredients.length - 1 ? (
            <TouchableOpacity 
              onPress={addIngredient}
              className="w-8 h-8 items-center justify-center"
            >
              <Text className="text-2xl text-[#1C1B1F] font-bold">+</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              onPress={() => removeIngredient(item.id)}
              className="w-8 h-8 items-center justify-center"
            >
              <Text className="text-2xl text-[#1C1B1F] font-bold">−</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}

      {/* Botón continuar */}
      <View className="items-center mt-6">
        <TouchableOpacity
          onPress={() => router.push('../createrecipe/newProcedure')}
          className="bg-[#9D5C63] px-8 py-3 rounded-full"
        >
          <Text className="text-white font-bold text-base">Continuar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}