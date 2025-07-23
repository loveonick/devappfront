import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { verifyRecoveryCodeApi } from '../api/auth_api';

const EnterCodeScreen = () => {
  const { email } = useLocalSearchParams();
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);


  const handleValidateCode = async () => {
    try {
      setError(null);
      setLoading(true);

      if (!code.trim()) {
        throw new Error('El código es obligatorio.');
      }

      await verifyRecoveryCodeApi(email, code.trim());
      router.push(`/createNewPassword?email=${encodeURIComponent(email as string)}`);
    } catch (error: any) {
      console.error('Error al validar el código:', error.message);
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
        <Text className="text-sm text-gray-500">Ingrese el número de Recupero</Text>
      </View>


      <View className="w-full mb-2">
        <TextInput
          placeholder="Código de Recuperación"
          placeholderTextColor={'#9CA3AF'}
          className={`bg-white p-4 rounded-lg shadow-sm border ${
            error ? 'border-red-500' : 'border-gray-300'
          }`}
          value={code}
          onChangeText={setCode}
        />
        {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
      </View>


      <TouchableOpacity
        className={`bg-colorboton p-4 rounded-lg mt-6 w-full items-center ${loading ? 'opacity-60' : ''}`}
        onPress={handleValidateCode}
        disabled={loading}
      >
        <Text className="text-white font-bold">
          {loading ? 'Validando...' : 'Validar'}
        </Text>
      </TouchableOpacity>
      
      {loading && (
      <View className="mt-4">
        <ActivityIndicator size="large" color="#9D5C63" />
      </View>
    )}

    </View>
  );
};

export default EnterCodeScreen;