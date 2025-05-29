import { View, Text } from 'react-native'
import React from 'react'
import {Tabs} from 'expo-router'
import {createrecipe} from 'app'

const _layout = () => {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: '#9B5C5C' }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
        }}
      />
      <Tabs.Screen
        name="../createrecipe/index"
        options={{
          title: 'Crear',
        }}
      />
    </Tabs>
    
  )
}

export default _layout