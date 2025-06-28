import React, { useState, useCallback } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const MasterProfile = () => {
  const router = useRouter();

  const [adminName, setAdminName] = useState('ADMIN');
  const [adminEmail, setAdminEmail] = useState('admin@gmail.com');

  useFocusEffect(
    useCallback(() => {
      const loadAdmin = async () => {
        try {
          const data = await AsyncStorage.getItem('adminProfile');
          if (data) {
            const { name, email } = JSON.parse(data);
            if (name) setAdminName(name);
            if (email) setAdminEmail(email);
          }
        } catch (error) {
          console.error('Error cargando datos admin:', error);
        }
      };
      loadAdmin();
    }, [])
  );

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-12">
      <TouchableOpacity className="absolute top-10 left-4 z-10" onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View className="mt-20 items-center">
        <View className="w-28 h-28 rounded-full bg-gray-300 justify-center items-center mb-6">
          <Ionicons name="person" size={64} color="black" />
        </View>

        <Text className="text-2xl font-bold mb-1">{adminName.toUpperCase()}</Text>
        <Text className="text-gray-500 text-base mb-8">{adminEmail}</Text>

<TouchableOpacity
  className="bg-[#9E5A5A] px-6 py-3 rounded-md mb-4 w-48 items-center"
  onPress={() => router.push('/admin/notifications')}
>
  <Text className="text-white font-semibold">Notificaciones</Text>
</TouchableOpacity>

        <TouchableOpacity
          className="bg-[#9E5A5A] px-6 py-3 rounded-md w-48 items-center"
          onPress={() => console.log('Cerrar sesión admin')}
        >
          <Text className="text-white font-semibold">Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default MasterProfile;
