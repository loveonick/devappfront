import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';

const RegisterScreen = () => {
  type Errors = {
    username?: string;
    email?: string;
    password?: string;
    password2?: string;
    general?: string;
  };

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const { register, user } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      router.replace('/(tabs)');
    }
  }, [user]);

  const handleRegister = async () => {
    const newErrors: Errors = {};

    if (!username.trim()) newErrors.username = 'El nombre de usuario es obligatorio.';
    if (!email.trim()) newErrors.email = 'El correo es obligatorio.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = 'El correo no es válido.';
    if (!password.trim()) newErrors.password = 'La contraseña es obligatoria.';
    if (!password2.trim()) newErrors.password2 = 'Repetir contraseña es obligatorio.';
    else if (password !== password2) newErrors.password2 = 'Las contraseñas no coinciden.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true); // <--- INICIA carga

    try {
      await register(username.trim(), email.trim(), password);
    } catch (err: any) {
      console.log('Error al registrarse:', err);
      if (err.message.toLowerCase().includes('username')) {
        setErrors({ username: err.message });
        setSuggestions(err.suggestions || []);
      } else if (err.message.toLowerCase().includes('email')) {
        setErrors({ email: err.message });
      } else {
        setErrors({ general: err.message || 'Error al registrarse.' });
      }
    } finally {
      setLoading(false); // <--- FINALIZA carga
    }
  };

  const inputClass = 'bg-white p-4 rounded-lg shadow-sm border';

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-colorfondo"
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
    >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 items-center justify-center px-6 pt-10 pb-24 min-h-[700px]">
            <View className="items-center mb-8 mt-10">
              <Image
                source={require('../../assets/logo.png')}
                className="w-24 h-24 mb-2"
                resizeMode="contain"
              />
              <Text className="text-xl font-bold">COOKING</Text>
              <Text className="text-sm text-gray-500">Regístrate</Text>
            </View>

            <View className="w-full">
              <View className="mb-4">
                <TextInput
                  placeholder="Usuario"
                  placeholderTextColor={'#9CA3AF'}
                  value={username}
                  onChangeText={setUsername}
                  className={`${inputClass} text-black ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.username && (
                  <Text className="text-red-500 text-sm mt-1">{errors.username}</Text>
                )}
                {suggestions.length > 0 && (
                  <View className="mt-1">
                    <Text className="text-gray-600 text-sm">Sugerencias:</Text>
                    {suggestions.map((sugg) => (
                      <TouchableOpacity key={sugg} onPress={() => setUsername(sugg)}>
                        <Text className="text-blue-500 underline text-sm">{sugg}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View className="mb-4">
                <TextInput
                  placeholder="Correo"
                  placeholderTextColor={'#9CA3AF'}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  className={`${inputClass}  ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && (
                  <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
                )}
              </View>

              <View className="mb-4">
                <TextInput
                  placeholder="Contraseña"
                  placeholderTextColor={'#9CA3AF'}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  className={`${inputClass} text-black ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.password && (
                  <Text className="text-red-500 text-sm mt-1">{errors.password}</Text>
                )}
              </View>

              <View className="mb-4">
                <TextInput
                  placeholder="Repetir Contraseña"
                  placeholderTextColor={'#9CA3AF'}
                  secureTextEntry
                  value={password2}
                  onChangeText={setPassword2}
                  className={`${inputClass} text-black ${errors.password2 ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.password2 && (
                  <Text className="text-red-500 text-sm mt-1">{errors.password2}</Text>
                )}
              </View>
            </View>

            {errors.general && (
              <Text className="text-red-500 text-center mt-4">{errors.general}</Text>
            )}

            <TouchableOpacity
              className={`bg-colorboton p-4 rounded-lg mt-6 w-full items-center ${loading ? 'opacity-60' : ''}`}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text className="text-white font-bold">
                {loading ? 'Registrando...' : 'Registrarse'}
              </Text>
            </TouchableOpacity>
            {loading && (
              <View className="mt-4">
                <Text className="text-gray-500 text-sm mb-2 text-center">Creando cuenta...</Text>
                <ActivityIndicator size="large" color="#000" />
              </View>
            )}

            <View className="w-full items-center mt-4 mb-4">
              <TouchableOpacity onPress={() => router.replace('/login')}>
                <Text className="text-sm text-gray-500">
                  ¿Ya tienes cuenta? <Text className="text-colorboton">Inicia sesión</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;