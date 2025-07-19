import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import {sendRecoveryCodeApi} from '../api/auth_api';
import { router } from 'expo-router';

const RecoverPasswordScreen = () => {
  const [email, setEmail] = React.useState('');
  const handleSendCode =  async () => {
    try{
      if (!email.trim()) {
        throw new Error('El correo es obligatorio.');
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new Error('El correo no es válido.');
      }
      await sendRecoveryCodeApi(email.trim());
      router.push(`/enterCode?email=${encodeURIComponent(email.trim())}`);
    } catch (error: any) {
      console.error('Error al enviar el código de recuperación:', error.message);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  }
  return (
    <View className="flex-1 bg-colorfondo items-center justify-center px-6">
      {/* Logo */}
      <View className="items-center mb-8">
        <Image
          source={require('../../assets/logo.png')}
          className="w-20 h-20 mb-2"
        />
        <Text className="text-xl font-bold">COOKING BOOK</Text>
        <Text className="text-sm text-gray-500">Recuperar Contraseña</Text>
      </View>

      {/* Email Input */}
      <View className="w-full">
        <TextInput
          placeholder="Correo"
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-300"
          value={email}
          onChangeText={setEmail}
        />
      </View>

      {/* Send Code Button */}
      <TouchableOpacity className="bg-colorboton p-4 rounded-lg mt-6 w-full items-center" onPress={handleSendCode}>
        <Text className="text-white font-bold">Enviar Código</Text>
      </TouchableOpacity>

      {/* Links */}
      <View className="w-full items-center mt-8">

        {/* Register Link */}
        <TouchableOpacity className="mt-4" onPress={() => router.push('/register')}>
          <Text className="text-sm text-gray-500">
            ¿No tienes cuenta? <Text className="text-colorboton">Regístrate</Text>
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

export default RecoverPasswordScreen;
