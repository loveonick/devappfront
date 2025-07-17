import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext'; 

const MasterProfile = () => {
  const router = useRouter();
  const { logout } = useAuth(); 

  const [adminName, setAdminName] = useState('ADMIN');
  const [adminEmail, setAdminEmail] = useState('admin@gmail.com');

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showLogoutMessage, setShowLogoutMessage] = useState(false);

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

  const handleConfirmLogout = async () => {
    setShowLogoutConfirm(false);
    await logout(); 
    setShowLogoutMessage(true);
  };

  const handleLogoutComplete = () => {
    setShowLogoutMessage(false);
    //router.replace('/login')
  };

  return (
    <>
      <ScrollView className="flex-1 bg-white px-6 pt-12">
        <TouchableOpacity className="absolute top-10 left-4 z-10" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <View className="mt-20 items-center">
          <TouchableOpacity
            onPress={() => router.push('/profile/edit')}
            className="w-28 h-28 rounded-full bg-gray-300 justify-center items-center mb-6"
          >
            <Ionicons name="person" size={64} color="black" />
          </TouchableOpacity>

          <Text className="text-2xl font-bold mb-1">{adminName.toUpperCase()}</Text>
          <Text className="text-gray-500 text-base mb-8">{adminEmail}</Text>

          <TouchableOpacity
            className="bg-colorboton px-6 py-3 rounded-md mb-4 w-48 items-center"
            onPress={() => router.push('/masterprofile/notifications')}
          >
            <Text className="text-white font-semibold">Notificaciones</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-colorboton px-6 py-3 rounded-md w-48 items-center"
            onPress={() => setShowLogoutConfirm(true)}
          >
            <Text className="text-white font-semibold">Cerrar Sesión</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal confirmación cierre de sesión */}
      <Modal visible={showLogoutConfirm} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-10">
          <View className="bg-white rounded-xl p-6 w-full items-center">
            <Text className="text-lg font-semibold mb-4">¿Querés cerrar sesión?</Text>
            <View className="flex-row space-x-4">
              <TouchableOpacity
                onPress={() => setShowLogoutConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded-md"
              >
                <Text className="text-black">No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleConfirmLogout}
                className="px-4 py-2 bg-colorboton rounded-md"
              >
                <Text className="text-white">Sí</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal sesión cerrada */}
      <Modal visible={showLogoutMessage} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-10">
          <View className="bg-white rounded-xl p-6 w-full items-center">
            <Text className="text-lg font-semibold mb-4">Sesión cerrada</Text>
            <TouchableOpacity
              onPress={handleLogoutComplete}
              className="px-6 py-2 bg-colorboton rounded-md"
            >
              <Text className="text-white text-base">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default MasterProfile;