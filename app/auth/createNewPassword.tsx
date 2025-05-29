import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';

const CreateNewPasswordScreen = () => {
  return (
    <View className="flex-1 bg-pink-50 items-center justify-center px-6">
      {/* Logo */}
      <View className="items-center mb-8">
        <Image
          source={{ uri: 'https://your-logo-url-here.com/logo.png' }}
          className="w-20 h-20 mb-2"
        />
        <Text className="text-xl font-bold">COOKING BOOK</Text>
        <Text className="text-sm text-gray-500">Ingrese Nueva Contraseña</Text>
      </View>

      {/* Password Inputs */}
      <View className="w-full space-y-4">
        <TextInput
          placeholder="Nueva Contraseña"
          secureTextEntry
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-300"
        />
        <TextInput
          placeholder="Repita la Contraseña"
          secureTextEntry
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-300"
        />
      </View>

      {/* Accept Button */}
      <TouchableOpacity className="bg-rose-500 p-4 rounded-lg mt-6 w-full items-center">
        <Text className="text-white font-bold">Aceptar</Text>
      </TouchableOpacity>

      {/* Links and Footer */}
      {/* Reutiliza el diseño de la primera pantalla */}
    </View>
  );
};

export default CreateNewPasswordScreen;
