import { router } from 'expo-router';
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

const PleaseLoginScreen = () => {
  return (
    <View className="flex-1 bg-[#FFF7F0] p-4">
      {/* Botón de regreso */}
      <TouchableOpacity className="absolute top-4 left-4">
        <Text className="text-xl text-gray-500">{'<'}</Text>
      </TouchableOpacity>

      {/* Imagen principal */}
      <View className="flex-1 justify-center items-center">
        <Image
          source={require('../../assets/image-pleaseLogin.png') }
          style= {{width: 400, height: 400}} 
          resizeMode="contain"
        />
      </View>

      {/* Texto de título */}
      <Text className="text-center text-2xl font-bold text-gray-800 mb-6">
        ¡Únete y conoce miles de recetas distintas!
      </Text>

      {/* Botón de registro */}
      <TouchableOpacity onPress={() => router.push('')} className="bg-[#D9544F] py-3 rounded-full mx-4">
        <Text className="text-center text-white font-bold text-lg">Regístrate</Text>
      </TouchableOpacity>

      {/* Enlace para iniciar sesión */}
      <View className="flex-row justify-center mt-4">
        <Text className="text-gray-500 text-sm">¿Ya tienes cuenta? </Text>
        <TouchableOpacity onPress={() => router.push('/auth/login')}>
          <Text className="text-[#D9544F] text-sm font-bold">Inicia sesión</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PleaseLoginScreen;
