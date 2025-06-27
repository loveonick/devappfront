import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';

const LoginScreen = () => {
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Si ya está logueado, redirigir
  useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      await login(email, password);
    } catch (error) {
      Alert.alert('Error', 'No se pudo iniciar sesión');
    }
  };

  return (
    <View className="flex-1 bg-colorfondo items-center justify-center px-6">
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
          value={email}
          onChangeText={setEmail}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-300"
        />
        <TextInput
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-300"
        />
        <View className="flex-row items-center">
          <Feather name="check-square" size={20} color="gray" />
          <Text className="ml-2 text-sm text-gray-600">Recordar Contraseña</Text>
        </View>
      </View>

      {/* Login Button */}
      <TouchableOpacity
        onPress={handleLogin}
        className="bg-colorboton p-4 rounded-lg mt-6 w-full items-center"
      >
        <Text className="text-white font-bold">Iniciar Sesión</Text>
      </TouchableOpacity>

      {/* Links */}
      <View className="w-full items-center mt-4">
        <TouchableOpacity>
          <Text className="text-sm text-colorboton">¿Olvidé mi contraseña?</Text>
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
        <TouchableOpacity className="mt-4" onPress={() => router.push('/auth/register')}>
          <Text className="text-sm text-gray-500">
            ¿No tienes cuenta? <Text className="text-colorboton">Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text className="text-xs text-gray-400 mt-8">Términos y condiciones</Text>
      <Text className="text-xs text-gray-400">Cooking Book Corp.</Text>
    </View>
  );
};

export default LoginScreen;