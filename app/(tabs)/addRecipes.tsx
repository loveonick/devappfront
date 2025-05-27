import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch } from 'react-native';

export default function AddRecipes() {
  const [comentarios, setComentarios] = useState(false);
  const [soloWifi, setSoloWifi] = useState(false);

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <Text className="text-[#1C1B1F] text-xl font-bold mb-6">
        ¡Agrega una receta!
      </Text>

      <Text className="text-[#1C1B1F] mb-1">Nombre del plato</Text>
      <TextInput
        className="border border-[#9D5C63] rounded-md px-3 py-2 mb-4 text-[#1C1B1F]"
      />

      <Text className="text-[#1C1B1F] mb-1">Descripción del plato</Text>
      <TextInput
        className="border border-[#9D5C63] rounded-md px-3 py-2 mb-4 text-[#1C1B1F]"
        multiline
      />

      <Text className="text-[#1C1B1F] mb-2">Imagen del Plato</Text>
      <View className="bg-gray-200 rounded-md h-32 justify-center items-center mb-4">
        <Text className="text-gray-500">⬆️</Text>
      </View>

      {/* Switch 1 */}
      <View className="flex-row items-center mb-3">
        <Switch
          value={comentarios}
          onValueChange={setComentarios}
          trackColor={{ false: '#D3B1B3', true: '#9D5C63' }}
          thumbColor="#3B1F22"
          ios_backgroundColor="#D3B1B3"
          style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
        />
        <Text className="text-[#1C1B1F] font-bold ml-2">Autorizar comentarios</Text>
      </View>

      {/* Switch 2 */}
      <View className="flex-row items-center mb-6">
        <Switch
          value={soloWifi}
          onValueChange={setSoloWifi}
          trackColor={{ false: '#D3B1B3', true: '#9D5C63' }}
          thumbColor="#3B1F22"
          ios_backgroundColor="#D3B1B3"
          style={{ transform: [{ scaleX: 1 }, { scaleY: 1 }] }}
        />
        <Text className="text-[#1C1B1F] font-bold ml-2">Publicar Solo WIFI</Text>
      </View>

      {/* Botón */}
      <View className="items-center">
        <TouchableOpacity className="bg-[#9D5C63] px-10 py-3 rounded-xl">
          <Text className="text-white font-bold text-base">Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
