import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, ScrollView} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';

const RegisterScreen = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const { register, user } = useAuth();

    useEffect(() => {
        if (user) {
        router.replace('/(tabs)');
        }
    }, [user]);

    const handleRegister = async () => {
        if (!email || !password || !password2) {
        Alert.alert('Error', 'Todos los campos son obligatorios');
        return;
        }

        if (password !== password2) {
        Alert.alert('Error', 'Las contraseñas no coinciden');
        return;
        }

        try {
        await register(username,email, password);
        } catch (err) {
        Alert.alert('Error', 'No se pudo registrar');
        }
    };

    return (
        <ScrollView className="flex-1 bg-colorfondo">
            <View className="flex-1 bg-colorfondo items-center justify-center px-6">
                {/* Logo */}
                <View className="items-center mb-8">
                    <Image
                    source={require('../../assets/logo.png') }
                    className="w-20 h-20 mb-2"
                    />
                    <Text className="text-xl font-bold">COOKING</Text>
                    <Text className="text-sm text-gray-500">Regístrate</Text>
                </View>

                {/* Input Fields */}
                <View className="w-full space-y-4">
                    <TextInput
                    placeholder="Usuario"
                    value={username}
                    onChangeText={setUsername}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-300"
                    />
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
                    <TextInput
                    placeholder="Repetir Contraseña"
                    secureTextEntry
                    value={password2}
                    onChangeText={setPassword2}
                    className="bg-white p-4 rounded-lg shadow-sm border border-gray-300"
                    />
                </View>

                {/* Register Button */}
                <TouchableOpacity
                    className="bg-colorboton p-4 rounded-lg mt-6 w-full items-center"
                    onPress={handleRegister}
                >
                    <Text className="text-white font-bold">Registrarse</Text>
                </TouchableOpacity>

                {/* Links */}
                <View className="w-full items-center mt-4 mb-4">

                    {/* Login Link */}
                    <TouchableOpacity className="mt-4" onPress={() => router.replace('/login')}>
                        <Text className="text-sm text-gray-500">
                            ¿Ya tienes cuenta? <Text className="text-colorboton">Inicia sesión</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

export default RegisterScreen;