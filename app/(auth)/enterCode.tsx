import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import {verifyRecoveryCodeApi} from '../api/auth_api'; // Asegúrate de importar tu API de verificación de código

const EnterCodeScreen = () => {
  const { email } = useLocalSearchParams();
  const [code, setCode] = React.useState('');
  const handleValidateCode = async () => {
    try {
      if (!code.trim()) {
        throw new Error('El código es obligatorio.');
      }
      await verifyRecoveryCodeApi(email, code.trim());
      router.push(`/createNewPassword?email=${encodeURIComponent(email as string)}`);
    } catch (error: any) {
      console.error('Error al validar el código:', error.message);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };
  return (
    <View className="flex-1 bg-colorfondo items-center justify-center px-6">
      {/* Logo */}
      <View className="items-center mb-8">
        <Image
          source={require('../../assets/logo.png')}
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
          value={code}
          onChangeText={setCode}
        />
      </View>

      {/* Validate Button */}
      <TouchableOpacity className="bg-colorboton p-4 rounded-lg mt-6 w-full items-center" onPress={handleValidateCode}>
        <Text className="text-white font-bold">Validar</Text>
      </TouchableOpacity>

    </View>
  );
};

export default EnterCodeScreen;