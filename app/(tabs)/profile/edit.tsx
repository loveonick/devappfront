import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert, Modal, SafeAreaView, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import AntDesign from '@expo/vector-icons/AntDesign';

const EditProfileScreen = () => {
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const routerBack = {
    back: () => {
      if (Platform.OS === 'web') {
        window.history.back();
      } else {
        router.back(); // Funciona en mobile con expo-router
      }
    },
  };
  

  const handleSave = () => {
    if (!username.trim()) {
      Alert.alert('Error', 'El nombre no puede estar vacío');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmSave = async () => {
    try {
      setLoading(true);
      if (!user?._id) return;
      await updateUser({ username, email });
      setShowConfirmModal(false);
      setShowSuccessModal(true);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.replace('/(tabs)/profile');
  };

  return (
    <SafeAreaView className="flex-1 bg-colorfondo">
      <View className="flex-1 bg-white p-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => routerBack.back()}>
            <AntDesign name="arrowleft" size={24} color="black" />
          </TouchableOpacity>
          <Text className="ml-4 text-lg font-semibold">Buscar recetas</Text>
        </View>
        <View className="self-center mb-4">
          <Image source={require('../../../assets/user.jpg')} className="w-24 h-24 rounded-full" />
        </View>

        <Text className="mb-1">Nombre</Text>
        <TextInput
          value={username}
          onChangeText={setUsername}
          placeholder="Nombre de usuario"
          className="border p-2 rounded mb-4"
        />

        <Text className="mb-1">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          className="border p-2 rounded mb-4"
        />

        <TouchableOpacity onPress={handleSave} className="bg-colorboton p-3 rounded items-center" disabled={loading}>
          <Text className="text-white font-semibold">{loading ? 'Guardando...' : 'Guardar'}</Text>
        </TouchableOpacity>

        {/* Modal confirmación */}
        <Modal visible={showConfirmModal} transparent animationType="fade">
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-10">
            <View className="bg-white rounded-xl p-6 w-full items-center">
              <Text className="text-lg font-semibold mb-4">¿Deseás guardar los cambios?</Text>
              <View className="flex-row space-x-4">
                <TouchableOpacity onPress={() => setShowConfirmModal(false)} className="px-4 py-2 bg-gray-300 rounded-md">
                  <Text className="text-black">No</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmSave} className="px-4 py-2 bg-colorboton rounded-md">
                  <Text className="text-white">Sí</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal éxito */}
        <Modal visible={showSuccessModal} transparent animationType="fade">
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-10">
            <View className="bg-white rounded-xl p-6 w-full items-center">
              <Text className="text-lg font-semibold mb-4">¡Cambios guardados!</Text>
              <TouchableOpacity onPress={handleSuccessClose} className="px-6 py-2 bg-colorboton rounded-md">
                <Text className="text-white text-base">OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;