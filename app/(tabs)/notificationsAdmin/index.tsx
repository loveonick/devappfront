import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const NotificationsScreen = () => {
  // Estado de las notificaciones
  const [notifications, setNotifications] = useState([
    { id: '1', content: 'Nueva receta de', idUser: '358', idRecipe: '5' }, // admin
    { id: '77', content: 'Nueva receta de', idUser: '222', idRecipe: '33' },
    { id: '9', content: 'Nueva receta de', idUser: '987', idRecipe: '1' },
  ]);

  // Función para eliminar una notificación
  const removeNotification = (id: string) => {
    setNotifications((prevNotifications) =>
      prevNotifications.filter((notification) => notification.id !== id)
    );
  };

  // Componente de notificación individual
  const NotificationItem = ({
    id,
    title,
    message,
  }: {
    id: string;
    title: string;
    message: string;
  }) => {
    return (
      <TouchableOpacity className="bg-white rounded-lg p-4 mb-4 shadow-sm flex-row items-center">
        {/* Ícono de notificación a la izquierda */}
        <Icon name="notifications" size={40} color="#f43f5e" className="mr-4" />

        {/* Contenido de la notificación */}
        <View style={{ flex: 1 }}>
          <Text className="text-lg font-semibold text-gray-800">{title}</Text>
          <Text className="text-sm text-gray-600 mt-1">{message}</Text>
        </View>

        {/* Botones a la derecha */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
          {/* Botón de aceptar */}
          <TouchableOpacity
            onPress={() => removeNotification(id)}
            style={{
              backgroundColor: '#22c55e',
              width: 30,
              height: 30,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 5,
            }}
          >
            <Icon name="checkmark" size={18} color="white" />
          </TouchableOpacity>

          {/* Botón de eliminar */}
          <TouchableOpacity
            onPress={() => removeNotification(id)}
            style={{
              backgroundColor: '#ef4444',
              width: 30,
              height: 30,
              borderRadius: 15,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 5,
            }}
          >
            <Icon name="trash" size={18} color="white" />
          </TouchableOpacity>

          {/* Botón de ver más con texto "Ver" */}
          <TouchableOpacity
            style={{
              backgroundColor: '#3b82f6',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingHorizontal: 12,
              borderRadius: 20,
              height: 30,
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold', marginRight: 5 }}>Ver</Text>
            <Icon name="arrow-forward" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold text-gray-900 mb-4">Notificaciones</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NotificationItem
            id={item.id}
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





