import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';


const EditProfileScreen = () => {
  const router = useRouter();

  const { user, updateUser } = useAuth();
  const [newUsername, setNewUsername] = useState(user?.username || '');
  const [newEmail, setNewEmail] = useState(user?.email || '');

  const [emailValid, setEmailValid] = useState(true);

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSavedMessage, setShowSavedMessage] = useState(false);

  // Cargar datos existentes al entrar
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem('profileData');
        if (data) {
          const { username, email, image } = JSON.parse(data);
          setNewUsername(username || '');
          setNewEmail(email || '');
          if (image) setNewImage({ uri: image });
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };
    loadData();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleConfirm = async () => {
    try {
      await updateUser({
        username: newUsername,
        email: newEmail,
      });
      setShowConfirm(false);
      setShowSavedMessage(true);
    } catch (error) {
      console.error('Error actualizando perfil:', error);
    }
  };


  return (
    <>
      <ScrollView className="flex-1 bg-white px-6 pt-12" contentContainerStyle={{ paddingBottom: 40 }}>
        <TouchableOpacity className="absolute top-10 left-4 z-10" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        <View className="mt-12 items-center">
          {/* Imagen de perfil seleccionable */}
          <TouchableOpacity onPress={pickImage} className="relative mb-6">

            <View className="w-24 h-24 rounded-full bg-gray-200" />
            <View className="absolute bottom-1 right-1 bg-white p-1 rounded-full">
              <Ionicons name="pencil" size={16} color="black" />
            </View>
          </TouchableOpacity>

          {/* Input: Nombre de usuario */}
          <TextInput
            className="border border-colorboton text-center text-lg px-4 py-2 mb-4 rounded-md w-full"
            value={newUsername}
            onChangeText={setNewUsername}
            placeholder="Nombre de usuario"
          />

          {/* Input: Email */}
          <TextInput
            className="border border-colorboton text-center text-lg px-4 py-2 rounded-md w-full"
            value={newEmail}
            onChangeText={(text) => {
              setNewEmail(text);
              setEmailValid(validateEmail(text));
            }}
            keyboardType="email-address"
            placeholder="Correo electrónico"
          />
          {!emailValid && (
            <Text className="text-red-500 text-sm mb-4">Correo electrónico inválido</Text>
          )}

          {/* Botón: Guardar cambios */}
          <TouchableOpacity
            onPress={() => setShowConfirm(true)}
            className={`px-6 py-3 rounded-md ${emailValid ? 'bg-colorboton' : 'bg-gray-400'}`}
            disabled={!emailValid}
          >
            <Text className="text-white font-semibold text-lg">Guardar cambios</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de confirmación */}
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

      {/* Modal de “Cambios guardados” */}
      <Modal visible={showSavedMessage} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-10">
          <View className="bg-white rounded-xl p-6 w-full items-center">
            <Text className="text-lg font-semibold mb-4">Cambios guardados</Text>
            <TouchableOpacity
              onPress={() => {
                setShowSavedMessage(false);
                router.back();
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
