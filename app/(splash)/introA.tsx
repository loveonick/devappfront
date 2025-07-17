import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function IntroA() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/introA.png')} style={styles.image} />
      <Text style={styles.text}>
        En Cooking Book encontrarás miles de nuevas recetas cada día.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => router.push('/introB')}>
        <Text style={styles.buttonText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fceee7', padding: 20 },
  image: { width: 220, height: 220, marginBottom: 30, resizeMode: 'contain' },
  text: { fontSize: 16, fontWeight: '600', textAlign: 'center', marginBottom: 20 },
  button: { backgroundColor: '#b15d5d', paddingVertical: 10, paddingHorizontal: 25, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
