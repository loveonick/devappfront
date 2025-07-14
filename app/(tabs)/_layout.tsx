import React, { useEffect } from 'react';
import { Tabs, Redirect } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';
import { useAuth } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';

const TabsLayout = () => {
  const { user, isLoading } = useAuth();
  const color = '#6B0A1D';

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" />
      </View>
    );
  }


  if (!user) {
    return <Redirect href="/auth/login" />;
  }

  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: color }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="home" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="createrecipe"
        options={{
          title: 'Receta',
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="pluscircleo" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          headerShown: false, 
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          href: null, // Oculta esta tab
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="masterprofile"
        options={{
          href: null, // Oculta esta tab
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="notificationsUser"
        options={{
          href: null, // Oculta esta tab
          headerShown: false,
        }}
      />
    </Tabs>
  );
};
export default TabsLayout;