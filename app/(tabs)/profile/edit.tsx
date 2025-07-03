import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
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

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });
    // Podés guardar o mostrar la imagen seleccionada si lo necesitás
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
      <View className="flex-1 bg-white px-6 pt-12">
        {/* Botón atrás */}
        <TouchableOpacity className="absolute top-10 left-4 z-10" onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="black" />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={{ paddingBottom: 60 }} className="mt-20">
          <View className="items-center space-y-6">
            {/* Imagen de perfil */}
            <TouchableOpacity onPress={pickImage} className="relative">
              <View className="w-28 h-28 rounded-full bg-gray-200 border-4 border-colorboton shadow-md" />
              <View className="absolute bottom-1 right-1 bg-white p-1.5 rounded-full shadow">
                <Ionicons name="pencil" size={18} color="black" />
              </View>
            </TouchableOpacity>

            {/* Input: Nombre de usuario */}
            <TextInput
              className="border border-gray-300 text-center text-base px-4 py-3 rounded-xl w-full bg-gray-50 focus:border-colorboton"
              value={newUsername}
              onChangeText={setNewUsername}
              placeholder="Nombre de usuario"
              placeholderTextColor="#999"
            />

            {/* Input: Email */}
            <TextInput
              className="border border-gray-300 text-center text-base px-4 py-3 rounded-xl w-full bg-gray-50 focus:border-colorboton"
              value={newEmail}
              onChangeText={(text) => {
                setNewEmail(text);
                setEmailValid(validateEmail(text));
              }}
              keyboardType="email-address"
              placeholder="Correo electrónico"
              placeholderTextColor="#999"
            />
            {!emailValid && (
              <Text className="text-red-500 text-sm -mt-4">Correo electrónico inválido</Text>
            )}

            {/* Botón guardar */}
            <TouchableOpacity
              onPress={() => setShowConfirm(true)}
              className={`mt-6 w-full py-3 rounded-xl ${emailValid ? 'bg-colorboton' : 'bg-gray-300'}`}
              disabled={!emailValid}
            >
              <Text className="text-white font-semibold text-lg text-center">Guardar cambios</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* Modal de confirmación */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-10">
          <View className="bg-white rounded-2xl p-6 w-full items-center shadow-xl">
            <Text className="text-lg font-semibold mb-4 text-center">¿Querés guardar los cambios?</Text>
            <View className="flex-row space-x-4 mt-2">
              <TouchableOpacity onPress={() => setShowConfirm(false)} className="px-5 py-2 bg-gray-200 rounded-xl">
                <Text className="text-black font-medium">No</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleConfirm} className="px-5 py-2 bg-colorboton rounded-xl">
                <Text className="text-white font-medium">Sí</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de cambios guardados */}
      <Modal visible={showSavedMessage} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-10">
          <View className="bg-white rounded-2xl p-6 w-full items-center shadow-xl">
            <Text className="text-lg font-semibold mb-4 text-center">Cambios guardados</Text>
            <TouchableOpacity
              onPress={() => {
                setShowSavedMessage(false);
                router.back();
              }}
              className="mt-2 px-6 py-2 bg-colorboton rounded-xl"
            >
              <Text className="text-white text-base font-medium">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default EditProfileScreen;
