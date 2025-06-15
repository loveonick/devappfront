import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

const EditProfileScreen = () => {
  const router = useRouter();

  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newImage, setNewImage] = useState<any>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      setNewImage({ uri: result.assets[0].uri });
    }
  };

  const confirmSave = () => {
    Alert.alert(
      '¿Estás seguro?',
      '¿Querés guardar los cambios?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Sí',
          onPress: () => {
            // Acá va la lógica para guardar (por ahora, solo console.log)
            console.log('Cambios guardados:', {
              username: newUsername,
              email: newEmail,
              image: newImage,
            });
            Alert.alert('Guardado', 'Los cambios fueron guardados correctamente.');
            router.back();
          },
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-12" contentContainerStyle={{ paddingBottom: 40 }}>
      <TouchableOpacity className="absolute top-10 left-4 z-10" onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View className="mt-12 items-center">
        {/* Imagen de perfil seleccionable */}
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

        {/* Input: Nombre de usuario */}
        <TextInput
          className="border border-colorboton text-center text-lg px-4 py-2 mb-4 rounded-md w-full"
          value={newUsername}
          onChangeText={setNewUsername}
          placeholder="Nombre de usuario"
        />

        {/* Input: Email */}
        <TextInput
          className="border border-colorboton text-center text-lg px-4 py-2 mb-6 rounded-md w-full"
          value={newEmail}
          onChangeText={setNewEmail}
          keyboardType="email-address"
          placeholder="Correo electrónico"
        />

        {/* Botón: Guardar cambios */}
        <TouchableOpacity onPress={confirmSave} className="bg-colorboton px-6 py-3 rounded-md">
          <Text className="text-white font-semibold text-lg">Guardar cambios</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default EditProfileScreen;
