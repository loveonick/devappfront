import { View, Text } from 'react-native'
import React from 'react'
import {Tabs} from 'expo-router'
import { Ionicons } from '@expo/vector-icons';

const _layout = () => {
  return (
    <Tabs>
        <Tabs.Screen
            name="index"
            options={{
                title: 'Inicio',
                headerShown: false,
            }}
        />
        <Tabs.Screen
        name="perfil"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
        />
        <Tabs.Screen
        name="receta"
        options={{
          title: 'Recetas',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" color={color} size={size} />
          ),
        }}
        />
        <Tabs.Screen
        name="notificacion User"
         options={{
          title: 'notificaciones',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
        }}
        />
         <Tabs.Screen
        name="notificacion Admin"
         options={{
          title: 'notificaciones',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
        }}
        />
    </Tabs>

  )
}

export default _layout