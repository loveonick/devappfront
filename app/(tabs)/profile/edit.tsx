import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

const EditProfileScreen = () => {
  const { user, updateUser } = useAuth();
  const router = useRouter();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [image, setImage] = useState<string | null>(user?.image || null);
  const [loading, setLoading] = useState(false);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      if (!user?._id) return;
      await updateUser({ username, email, image });
      Alert.alert('Éxito', 'Perfil actualizado');
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white p-4">
      <Text className="text-xl font-bold mb-4">Editar Perfil</Text>
      <TouchableOpacity onPress={handlePickImage} className="self-center mb-4">
        {image ? (
          <Image source={{ uri: image }} className="w-24 h-24 rounded-full" />
        ) : (
          <View className="w-24 h-24 rounded-full bg-gray-300 items-center justify-center">
            <Text>Cargar Imagen</Text>
          </View>
        )}
      </TouchableOpacity>

      <Text className="mb-1">Nombre</Text>
      <TextInput value={username} onChangeText={setUsername} className="border p-2 rounded mb-4" />
      <Text className="mb-1">Email</Text>
      <TextInput value={email} onChangeText={setEmail} className="border p-2 rounded mb-4" />

      <TouchableOpacity onPress={handleSave} className="bg-colorboton p-3 rounded items-center" disabled={loading}>
        <Text className="text-white font-semibold">{loading ? 'Guardando...' : 'Guardar'}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditProfileScreen;