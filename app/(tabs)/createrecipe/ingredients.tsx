import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import React, { useState } from 'react';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRecipeContext } from '../../context/RecipeContext';

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

export default function Ingredients() {
  const router = useRouter();
  const { updateDraft, draft } = useRecipeContext();
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', quantity: '', unit: '' },
  ]);
  const [errorMessage, setErrorMessage] = useState('');

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '' }]);
    setErrorMessage('');
  };

  const removeIngredient = (index: number) => {
    if (ingredients.length <= 1) return;
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
    if (errorMessage) setErrorMessage('');
  };

  const handleContinue = () => {
    const ingredientNames = ingredients
      .map(i => i.name)
      .filter(name => name.trim() !== '');

    if (ingredientNames.length === 0) {
      setErrorMessage('Debes agregar al menos un ingrediente con nombre.');
      return;
    }
    setErrorMessage('');

    const baseTags = draft.type ? [draft.type] : [];

    const allTags = Array.from(new Set([...baseTags, ...ingredientNames]));

    updateDraft({
      ...draft,
      ingredients,
      tags: allTags,
    });

    router.push('/createrecipe/newProcedure');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: 'white', paddingHorizontal: 24, paddingTop: 48 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ position: 'absolute', top: 48, left: 24, zIndex: 10 }}
          >
            <Ionicons name="arrow-back" size={24} color="#9D5C63" />
          </TouchableOpacity>

          <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 24, textAlign: 'center' }}>
            Ingredientes
          </Text>

          {ingredients.map((item, index) => (
            <View key={index} style={{ flexDirection: 'row', marginBottom: 12 }}>
              <TextInput
                placeholder="Ingrediente"
                placeholderTextColor={'#9CA3AF'}
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  marginRight: 8,
                }}
                value={item.name}
                onChangeText={(text) => updateIngredient(index, 'name', text)}
                returnKeyType="done"
              />
              <TextInput
                placeholder="Cant"
                placeholderTextColor={'#9CA3AF'}
                style={{
                  width: 60,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  marginRight: 8,
                }}
                value={item.quantity}
                onChangeText={(text) => updateIngredient(index, 'quantity', text)}
                keyboardType="numeric"
                returnKeyType="done"
              />
              <TextInput
                placeholder="Unidad"
                placeholderTextColor={'#9CA3AF'}
                style={{
                  width: 60,
                  borderWidth: 1,
                  borderColor: '#ccc',
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  marginRight: 8,
                }}
                value={item.unit}
                onChangeText={(text) => updateIngredient(index, 'unit', text)}
                returnKeyType="done"
              />
              {ingredients.length > 1 && (
                <TouchableOpacity
                  onPress={() => removeIngredient(index)}
                  style={{ justifyContent: 'center' }}
                >
                  <Ionicons name="trash" size={20} color="#9D5C63" />
                </TouchableOpacity>
              )}
            </View>
          ))}

          <TouchableOpacity
            onPress={addIngredient}
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 24 }}
          >
            <Ionicons name="add-circle" size={24} color="#9D5C63" />
            <Text style={{ marginLeft: 8, color: '#9D5C63' }}>Agregar ingrediente</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleContinue}
            style={{
              backgroundColor: '#9D5C63',
              borderRadius: 24,
              paddingVertical: 12,
              paddingHorizontal: 32,
              alignSelf: 'center',
            }}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Continuar</Text>
          </TouchableOpacity>

          {errorMessage !== '' && (
            <Text style={{ color: 'red', textAlign: 'center', marginTop: 16 }}>{errorMessage}</Text>
          )}
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}