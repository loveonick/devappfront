import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

const EditProfileScreen = () => {
  const router = useRouter();
  const [username, setUsername] = useState<string>('Brad_Pitt');
  const [email, setEmail] = useState<string>('brad@gmail.com');
  const [image, setImage] = useState<any>(require('../../../assets/profileExample.jpg'));

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      setImage({ uri: result.assets[0].uri });
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-6 pt-12" contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Botón atrás */}
      <TouchableOpacity className="absolute top-10 left-4 z-10" onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Espaciado para que el botón no tape el contenido */}
      <View className="mt-10" />

      {/* Foto editable */}
      <TouchableOpacity onPress={pickImage} className="items-center mb-6">
        <Image source={image} className="w-32 h-32 rounded-full" resizeMode="cover" />
        <View className="absolute bottom-4 right-28 bg-white p-1 rounded-full">
          <Ionicons name="pencil" size={16} color="black" />
        </View>
      </TouchableOpacity>

      {/* Inputs */}
      <TextInput
        className="border border-colorboton text-center text-lg px-4 py-2 mb-4 rounded-md"
        value={username}
        onChangeText={setUsername}
        placeholder="Nombre de usuario"
      />
      <TextInput
        className="border border-colorboton text-center text-lg px-4 py-2 mb-6 rounded-md"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="Correo electrónico"
      />

      {/* Botón guardar */}
      <TouchableOpacity className="bg-colorboton px-6 py-3 rounded-md items-center">
        <Text className="text-white font-semibold text-lg">Guardar cambios</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfileScreen;
