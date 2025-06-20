import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// Datos de notificaciones
const notifications = [
  { id: '1', content: 'Nuevo like en la receta', idRecipe: '333' },
  { id: '2', content: 'Nuevo comentario en la receta', idRecipe: '22' },
  { id: '3', content: 'Nuevo like en la receta', idRecipe: '8' },
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
      {/* Ícono */}
      <Icon name={icon} size={40} color="#f43f5e" className="mr-4" />
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
            icon="heart" // Nombre del ícono
            title={item.content}
            message={`ID Receta: ${item.idRecipe}`}
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
  );
};

export default NotificationsScreen;


