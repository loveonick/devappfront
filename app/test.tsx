import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const test = () => {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Pantalla Principal</Text>

      <TouchableOpacity
        onPress={() => router.push('/auth/login')}
        style={{
          backgroundColor: '#f43f5e',
          padding: 12,
          borderRadius: 8,
          marginBottom: 10,
          width: 200,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Ir a Login</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/auth/recover')}
        style={{
          backgroundColor: '#f43f5e',
          padding: 12,
          borderRadius: 8,
          marginBottom: 10,
          width: 200,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Recuperar Contraseña</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/auth/enterCode')}
        style={{
          backgroundColor: '#f43f5e',
          padding: 12,
          borderRadius: 8,
          marginBottom: 10,
          width: 200,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Ingresar Código</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/auth/createNewPassword')}
        style={{
          backgroundColor: '#f43f5e',
          padding: 12,
          borderRadius: 8,
          width: 200,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Crear Nueva Contraseña</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push('/auth/pleaseLogin')}
        style={{
          backgroundColor: '#f43f5e',
          padding: 12,
          borderRadius: 8,
          marginBottom: 10,
          width: 200,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Please Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default test;



