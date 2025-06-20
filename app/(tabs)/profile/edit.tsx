import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const EditProfileScreen = () => {
  const router = useRouter();

  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newImage, setNewImage] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setNewImage({ uri: result.assets[0].uri });
    }
  };

  const handleConfirm = async () => {
    try {
      await AsyncStorage.setItem('profileData', JSON.stringify({
        username: newUsername,
        email: newEmail,
        image: newImage?.uri || null,
      }));
      console.log('Cambios guardados en AsyncStorage');
      setShowConfirm(false);
      setShowSavedMessage(true);
    } catch (error) {
      console.error('Error guardando datos:', error);
    }
  };

  return (
    <>
      <ScrollView className="flex-1 bg-white px-6 pt-12" contentContainerStyle={{ paddingBottom: 40 }}>
        <TouchableOpacity className="absolute top-10 left-4 z-10" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <View className="mt-12 items-center">
          <TouchableOpacity onPress={pickImage} className="relative mb-6">
            {newImage?.uri ? (
              <Image source={{ uri: newImage.uri }} className="w-24 h-24 rounded-full" resizeMode="contain" />
            ) : (
              <View className="w-24 h-24 rounded-full bg-gray-200" />
            )}
            <View className="absolute bottom-1 right-1 bg-white p-1 rounded-full">
              <Ionicons name="pencil" size={16} color="black" />
            </View>
          </TouchableOpacity>

          <TextInput
            className="border border-colorboton text-center text-lg px-4 py-2 mb-4 rounded-md w-full"
            value={newUsername}
            onChangeText={setNewUsername}
            placeholder="Nombre de usuario"
          />

          <TextInput
            className="border border-colorboton text-center text-lg px-4 py-2 mb-6 rounded-md w-full"
            value={newEmail}
            onChangeText={setNewEmail}
            keyboardType="email-address"
            placeholder="Correo electrónico"
          />

          <TouchableOpacity onPress={() => setShowConfirm(true)} className="bg-colorboton px-6 py-3 rounded-md">
            <Text className="text-white font-semibold text-lg">Guardar cambios</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <Modal visible={showConfirm} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-10">
          <View className="bg-white rounded-xl p-6 w-full items-center">
            <Text className="text-lg font-semibold mb-4">¿Querés guardar los cambios?</Text>
            <View className="flex-row space-x-4">
              <TouchableOpacity onPress={() => setShowConfirm(false)} className="px-4 py-2 bg-gray-300 rounded-md">
                <Text className="text-black">No</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirm} className="px-4 py-2 bg-colorboton rounded-md">
                <Text className="text-white">Sí</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showSavedMessage} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-10">
          <View className="bg-white rounded-xl p-6 w-full items-center">
            <Text className="text-lg font-semibold mb-4">Cambios guardados</Text>
            <TouchableOpacity
              onPress={() => {
                setShowSavedMessage(false);
                router.back(); // vuelve al perfil
              }}
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

export default EditProfileScreen;
