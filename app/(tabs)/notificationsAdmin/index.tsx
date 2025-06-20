import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Datos de notificaciones
const notifications = [
  { id: '1', content: 'Nueva receta de', idUser: '358', idRecipe: '5' }, // admin
  { id: '77', content: 'Nueva receta de', idUser: '222', idRecipe: '33' },
  { id: '9', content: 'Nueva receta de', idUser: '987', idRecipe: '1' },
];

// Componente de notificación individual
const NotificationItem = ({
  icon,
  title,
  message,
}: {
  icon: string;
  title: string;
  message: string;
}) => {
  return (
    <TouchableOpacity className="bg-white rounded-lg p-4 mb-4 shadow-sm flex-row items-center">
      {/* Ícono a la izquierda */}
      <Icon name="notifications" size={40} color="#f43f5e" className="mr-4" />
      
      {/* Contenido de la notificación */}
      <View>
        <Text className="text-lg font-semibold text-gray-800">{title}</Text>
        <Text className="text-sm text-gray-600 mt-1">{message}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Pantalla de notificaciones
const NotificationsScreen = () => {
  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-gray-900 mb-4">Notificaciones</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            icon="notifications"
            title={`${item.content} Usuario ${item.idUser}`}
            message={`ID Receta: ${item.idRecipe}`}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default NotificationsScreen;

