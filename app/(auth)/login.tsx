import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const { login, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/postLoginSplash');
    }
  }, [user]);

  const handleLogin = async () => {
    const newErrors: typeof errors = {};

    if (!email.trim()) newErrors.email = 'El correo es obligatorio.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'El correo no es válido.';
    if (!password.trim()) newErrors.password = 'La contraseña es obligatoria.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    try {
      await login(email.trim(), password);
    } catch (error: any) {
      const msg = error?.message?.toLowerCase() || '';
      if (msg.includes('correo') || msg.includes('email')) {
        setErrors({ email: error.message });
      } else if (msg.includes('contraseña') || msg.includes('password')) {
        setErrors({ password: error.message });
      } else {
        setErrors({ general: error.message || 'Error al iniciar sesión.' });
      }
    }
  };

  const inputClass = 'bg-white p-4 rounded-lg shadow-sm border';

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={60} // ajusta este valor según tu header
    >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="bg-colorfondo px-6"
        >
          <View className="flex-1 items-center justify-center pt-12 pb-8">

            <View className="items-center mb-8">
              <Image
                source={require('../../assets/logo.png')}
                className="w-24 h-24 mb-2"
                resizeMode="contain"
              />
              <Text className="text-xl font-bold">COOKING</Text>
              <Text className="text-sm text-gray-500">Inicia Sesión</Text>
            </View>

            <View className="w-full">
              <View className="mb-4">
                <TextInput
                  placeholder="Correo"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  className={`${inputClass} ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && (
                  <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
                )}
              </View>

              <View className="mb-4">
                <TextInput
                  placeholder="Contraseña"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  className={`${inputClass} ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.password && (
                  <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
                )}
              </View>
            </View>

            {errors.general && (
              <Text className="text-red-500 text-center mt-4">{errors.general}</Text>
            )}

            <TouchableOpacity
              onPress={handleLogin}
              className="bg-colorboton p-4 rounded-lg mt-6 w-full items-center"
            >
              <Text className="text-white font-bold">Iniciar Sesión</Text>
            </TouchableOpacity>

            <View className="w-full items-center mt-4">
              <TouchableOpacity onPress={() => router.push('/recover')}>
                <Text className="text-sm text-colorboton">¿Olvidé mi contraseña?</Text>
              </TouchableOpacity>

              <TouchableOpacity className="mt-4" onPress={() => router.push('/register')}>
                <Text className="text-sm text-gray-500">
                  ¿No tienes cuenta? <Text className="text-colorboton">Regístrate</Text>
                </Text>
              </TouchableOpacity>
            </View>

          </View>
        </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;