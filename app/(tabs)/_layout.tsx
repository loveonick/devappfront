import { Tabs } from 'expo-router';
import AntDesign from '@expo/vector-icons/AntDesign';

const color = '#6B0A1D';

export default function TabLayout() {
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
          tabBarIcon: ({ color, size }) => (
            <AntDesign name="user" size={size} color={color} />
          ),
          headerShown: false,
        }}
      />
    </Tabs>
  );
}