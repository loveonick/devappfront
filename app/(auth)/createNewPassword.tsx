import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { resetPasswordApi } from '../api/auth_api';

const CreateNewPasswordScreen = () => {
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const { email } = useLocalSearchParams();

  const handleCreatePassword = async () => {
    try {
      setError(null); // limpiar errores anteriores

      if (!newPassword.trim() || !confirmPassword.trim()) {
        throw new Error('Ambos campos son obligatorios.');
      }

      if (newPassword !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden.');
      }

      await resetPasswordApi(email as string, newPassword.trim());
      router.push('/login');
    } catch (error: any) {
      console.error('Error al crear la nueva contraseña:', error.message);
      setError(error.message);
    }
  };

  return (
    <View className="flex-1 bg-colorfondo items-center justify-center px-6">

      <View className="items-center mb-8">
        <Image
          source={{ uri: 'https://your-logo-url-here.com/logo.png' }}
          className="w-20 h-20 mb-2"
        />
        <Text className="text-xl font-bold">COOKING BOOK</Text>
        <Text className="text-sm text-gray-500">Ingrese Nueva Contraseña</Text>
      </View>

      <View className="w-full space-y-4 mb-2">
        <TextInput
          placeholder="Nueva Contraseña"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
          className={`bg-white p-4 rounded-lg shadow-sm border ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        <TextInput
          placeholder="Repita la Contraseña"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          className={`bg-white p-4 rounded-lg shadow-sm border ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {error && (
          <Text className="text-red-500 text-sm mt-1">{error}</Text>
        )}
      </View>


      <TouchableOpacity
        className="bg-colorboton p-4 rounded-lg mt-6 w-full items-center"
        onPress={handleCreatePassword}
      >
        <Text className="text-white font-bold">Aceptar</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateNewPasswordScreen;