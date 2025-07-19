import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { router, useLocalSearchParams, useRouter } from 'expo-router';
import {resetPasswordApi} from '../api/auth_api'; // Asegúrate de importar tu API de creación de contraseña

const CreateNewPasswordScreen = () => {
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const { email } = useLocalSearchParams(); 
  const handleCreatePassword = async () => {
    try{
      await resetPasswordApi(email as string, newPassword);
      router.push('/login');
    }
    catch (error: any) {
      console.error('Error al crear la nueva contraseña:', error.message);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  }

  return (
    <View className="flex-1 bg-colorfondo items-center justify-center px-6">
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
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          placeholder="Repita la Contraseña"
          secureTextEntry
          className="bg-white p-4 rounded-lg shadow-sm border border-gray-300"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      {/* Accept Button */}
      <TouchableOpacity className="bg-colorboton p-4 rounded-lg mt-6 w-full items-center" onPress={handleCreatePassword}>
        <Text className="text-white font-bold">Aceptar</Text>
      </TouchableOpacity>

    </View>
  );
};

export default CreateNewPasswordScreen;
