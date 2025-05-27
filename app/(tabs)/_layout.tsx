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
    </Tabs>
  )
}

export default _layout