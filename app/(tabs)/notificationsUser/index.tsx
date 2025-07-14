import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import { SafeAreaView } from 'react-native-safe-area-context';

const NOTIFICATIONS_KEY = '@notifications';

// Componente reutilizable de notificación
const NotificationItem = ({
  icon,
  title,
  message,
  onPress,
}: {
  icon: string;
  title: string;
  message: string;
  onPress?: () => void;
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="bg-[rgb(254,245,239)] rounded-lg p-4 mb-4 shadow-sm flex-row items-center"
    >
      <Icon name={icon} size={40} color="#f43f5e" style={{ marginRight: 12 }} />
      <View>
        <Text className="text-lg font-semibold text-gray-800">{title}</Text>
        <Text className="text-sm text-gray-600 mt-1">{message}</Text>
      </View>
    </TouchableOpacity>
  );
};

// Función auxiliar para guardar una notificación
export const saveNotification = async ({
  id,
  content,
  idRecipe,
}: {
  id: string;
  content: string;
  idRecipe: string;
}) => {
  try {
    const existing = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    const current = existing ? JSON.parse(existing) : [];
    const updated = [...current, { id, content, idRecipe }];
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Error guardando notificación:', error);
  }
};

// Pantalla de notificaciones
const NotificationsScreen = () => {
  const router = useRouter();
  const routerBack = {
    back: () => window.history.back(),
  };
  const [notifications, setNotifications] = useState<
    { id: string; content: string; idRecipe: string }[]
  >([]);

  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error cargando notificaciones:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
    }, [])
  );

  return (
    <SafeAreaView className='flex-1'>
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => routerBack.back()}>
          <AntDesign name="arrowleft" size={24} color="black" />
        </TouchableOpacity>
        <Text className="ml-4 text-lg font-semibold">Notificacion</Text>
      </View>
      <View className="flex-1 bg-gray-100 p-4">
        <Text className="text-2xl font-bold text-gray-900 mb-4">Notificaciones</Text>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <NotificationItem
              icon="heart"
              title={item.content}
              message={`ID Receta: ${item.idRecipe}`}
                onPress={() =>
                  router.push(`/recipes/${item.idRecipe}`)
                }
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-10">
              No hay notificaciones disponibles.
            </Text>
          }
        />
      </View>
    </SafeAreaView>
    
  );
};

export default NotificationsScreen;


