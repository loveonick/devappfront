import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';

const LoginScreen = () => {
  return (
    <View className="flex-1 bg-pink-50 items-center justify-center px-6">
      {/* Logo */}
      <View className="items-center mb-8">
        <Image
          source={{ uri: 'https://your-logo-url-here.com/logo.png' }}
          className="w-20 h-20 mb-2"
        />
        <Text className="text-xl font-bold">COOKING</Text>
        <Text className="text-sm text-gray-500">Inicia Sesión</Text>
      </View>

      {/* Input Fields */}
      <View className="w-full space-y-4">
        <TextInput
          placeholder="Correo"
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-300"
        />
        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-300"
        />
        <View className="flex-row items-center">
          <Feather name="check-square" size={20} color="gray" />
          <Text className="ml-2 text-sm text-gray-600">Recordar Contraseña</Text>
        </View>
      </View>

      {/* Login Button */}
      <TouchableOpacity className="bg-rose-500 p-4 rounded-lg mt-6 w-full items-center">
        <Text className="text-white font-bold">Iniciar Sesión</Text>
      </TouchableOpacity>

      {/* Links */}
      <View className="w-full items-center mt-4">
        <TouchableOpacity>
          <Text className="text-sm text-rose-500">¿Olvidé mi contraseña?</Text>
        </TouchableOpacity>

        <View className="flex-row items-center mt-4">
          <View className="flex-1 h-[1px] bg-gray-300" />
          <Text className="mx-2 text-gray-500">Otra forma</Text>
          <View className="flex-1 h-[1px] bg-gray-300" />
        </View>

        {/* Social Login */}
        <View className="flex-row justify-center space-x-4 mt-4">
          <TouchableOpacity className="p-2">
            <Feather name="facebook" size={24} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            {/* <Feather name="google" size={24} color="gray" /> */}
          </TouchableOpacity>
          <TouchableOpacity className="p-2">
            <Feather name="twitter" size={24} color="gray" />
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <TouchableOpacity className="mt-4">
          <Text className="text-sm text-gray-500">
            ¿No tienes cuenta? <Text className="text-rose-500">Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text className="text-xs text-gray-400 mt-8">
        Términos y condiciones
      </Text>
      <Text className="text-xs text-gray-400">Cooking Book Corp.</Text>
    </View>
  );
};

export default LoginScreen;
