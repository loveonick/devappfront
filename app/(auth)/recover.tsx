import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { sendRecoveryCodeApi } from '../api/auth_api';
import { router } from 'expo-router';

const RecoverPasswordScreen = () => {
  const [email, setEmail] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);


  const handleSendCode = async () => {
    try {
      setError(null);
      setLoading(true);

      if (!email.trim()) throw new Error('El correo es obligatorio.');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('El correo no es válido.');

      await sendRecoveryCodeApi(email.trim());
      router.push(`/enterCode?email=${encodeURIComponent(email.trim())}`);
    } catch (error: any) {
      console.error('Error al enviar el código de recuperación:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-colorfondo items-center justify-center px-6">
      <View className="items-center mb-8">
        <Image
          source={require('../../assets/logo.png')}
          className="w-20 h-20 mb-2"
        />
        <Text className="text-xl font-bold">COOKING BOOK</Text>
        <Text className="text-sm text-gray-500">Recuperar Contraseña</Text>
      </View>

      <View className="w-full mb-2">
        <TextInput
          placeholder="Correo"
          placeholderTextColor={'#9CA3AF'}
          value={email}
          onChangeText={setEmail}
          className={`bg-white p-4 rounded-lg shadow-sm border ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {error && (
          <Text className="text-red-500 text-sm mt-1">{error}</Text>
        )}
      </View>

      <TouchableOpacity
        className={`bg-colorboton p-4 rounded-lg mt-6 w-full items-center ${loading ? 'opacity-60' : ''}`}
        onPress={handleSendCode}
        disabled={loading}
      >
        <Text className="text-white font-bold">
          {loading ? 'Enviando...' : 'Enviar Código'}
        </Text>
      </TouchableOpacity>
      
      {loading && (
        <View className="mt-4">
          <ActivityIndicator size="large" color="#9D5C63" />
        </View>
      )}

      <View className="w-full items-center mt-8">
        <TouchableOpacity className="mt-4" onPress={() => router.push('/register')}>
          <Text className="text-sm text-gray-500">
            ¿No tienes cuenta? <Text className="text-colorboton">Regístrate</Text>
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-xs text-gray-400 mt-8">
        Términos y condiciones
      </Text>
      <Text className="text-xs text-gray-400">Cooking Book Corp.</Text>
    </View>
  );
};

export default RecoverPasswordScreen;