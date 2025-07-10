import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

const EnterCodeScreen = () => {
  return (
    <View className="flex-1 bg-pink-50 items-center justify-center px-6">
      {/* Logo */}
      <View className="items-center mb-8">
        <Image
          source={{ uri: '../../assets/logo.png' }}
          className="w-20 h-20 mb-2"
        />
        <Text className="text-xl font-bold">COOKING BOOK</Text>
        <Text className="text-sm text-gray-500">Ingrese el número de Recupero</Text>
      </View>

      {/* Code Input */}
      <View className="w-full">
        <TextInput
          placeholder="Código de Recuperación"
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-300"
        />
      </View>

      {/* Validate Button */}
      <TouchableOpacity className="bg-rose-500 p-4 rounded-lg mt-6 w-full items-center">
        <Text className="text-white font-bold">Validar</Text>
      </TouchableOpacity>

      {/* Links and Footer */}
      {/* Reutiliza el diseño de la primera pantalla */}
    </View>
  );
};

export default EnterCodeScreen;