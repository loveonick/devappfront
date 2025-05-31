import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useProfileStore } from '../../../stores/profileStore';

const EditProfileScreen = () => {
  const router = useRouter();
  //const { username, email, profileImage, updateProfile } = useProfileStore();

  //const [newUsername, setNewUsername] = useState<string>(username);
  //const [newEmail, setNewEmail] = useState<string>(email);
  //const [newImage, setNewImage] = useState<any>(profileImage);

  /*const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setNewImage({ uri: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    await updateProfile({
      username: newUsername,
      email: newEmail,
      profileImage: newImage,
    });

    Alert.alert('Perfil actualizado', 'Los cambios se guardaron correctamente.', [
      { text: 'OK', onPress: () => router.back() },
    ]);
  };*/

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-12" contentContainerStyle={{ paddingBottom: 40 }}>
       <Text>DEBUG: Esto debería aparecer</Text>
      <TouchableOpacity className="absolute top-10 left-4 z-10" onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <View className="mt-12 items-center">
  {/* { <TouchableOpacity onPress={pickImage} className="relative mb-6">
    {newImage ? (
      <Image source={newImage} className="w-24 h-24 rounded-full" resizeMode="contain" />
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

        <TouchableOpacity onPress={handleSave} className="bg-colorboton px-6 py-3 rounded-md">
          <Text className="text-white font-semibold text-lg">Guardar cambios</Text>
        </TouchableOpacity>*/
      }</View> 
    </ScrollView> 
  );
};

export default EditProfileScreen;
