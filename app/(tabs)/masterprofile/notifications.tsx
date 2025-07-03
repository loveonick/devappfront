import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const NotificationsScreen = () => {
  const router = useRouter();

  const [notifications, setNotifications] = useState([
    { id: 1, user: 'Juanceto07', message: 'creó una nueva receta' },
    { id: 2, user: 'Juanceto07', message: 'creó una nueva receta' },
    { id: 3, user: 'Juanceto07', message: 'creó una nueva receta' },
    { id: 4, user: 'Juanceto07', message: 'creó una nueva receta' },
  ]);

  const handleDelete = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleView = (id: number) => {
    console.log('Ver receta con ID:', id);
    // router.push(`/ruta/receta/${id}`);
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 pt-12" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Botón atrás */}
      <TouchableOpacity className="absolute top-10 left-4 z-10" onPress={() => router.replace('/masterprofile/indexMasterProfile')}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text className="text-2xl font-bold text-center mb-6">Notificaciones</Text>

      {notifications.map((item) => (
        <View
          key={item.id}
          className="items-center bg-[#FFF5F5] rounded-lg px-4 py-4 mb-4 border border-gray-200"
        >
          {/* Imagen */}
          <Image
            source={require('../../../assets/profile-icon.png')} 
            className="w-16 h-16 rounded-full mb-2"
            resizeMode="cover"
          />

          {/* Texto */}
          <Text className="font-bold text-base mb-1">{item.user}</Text>
          <Text className="text-sm text-gray-600 mb-3">{item.message}</Text>

          {/* Botones */}
          <View className="flex-row items-center space-x-3">
            <Ionicons name="checkmark-circle" size={18} color="green" />
            <TouchableOpacity
              onPress={() => handleView(item.id)}
              className="bg-blue-500 rounded-full px-4 py-1"
            >
              <Text className="text-white text-sm font-semibold">Ver</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Ionicons name="trash" size={18} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default NotificationsScreen;
