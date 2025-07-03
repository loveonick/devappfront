import React, { useState } from 'react';
import { ScrollView, View, Text, Image, TextInput, Pressable, Alert } from 'react-native';
import StarRating from 'react-native-star-rating-widget';
import Slider from '@react-native-community/slider';
import Icon from 'react-native-vector-icons/Ionicons';

export default function RecipePage() {
  const [ratingUser, setRatingUser] = useState(0);
  const [comment, setComment] = useState('');
  const [userComments, setUserComments] = useState([
    { name: 'Laura Rodríguez', text: '¡Me encantó esta receta! Muy fácil de seguir.', stars: 5 },
    { name: 'José Luis', text: 'Muy sabrosa, ¡la repetiré!', stars: 4 },
  ]);
  const [portions, setPortions] = useState(2);

  const baseIngredients = [
    { name: 'Harina', baseQuantity: 200, unit: 'g' },
    { name: 'Azúcar', baseQuantity: 100, unit: 'g' },
    { name: 'Huevos', baseQuantity: 4, unit: 'unidades' },
    { name: 'Leche', baseQuantity: 400, unit: 'ml' },
    { name: 'Mantequilla', baseQuantity: 50, unit: 'g' },
  ];

  const calculateIngredients = () => {
    const base = 2;
    return baseIngredients.map(i => ({
      ...i,
      quantity: (i.baseQuantity / base) * portions,
    }));
  };

  const averageRating = userComments.length > 0
    ? (
        userComments.reduce((sum, c) => sum + c.stars, 0) / userComments.length
      ).toFixed(1)
    : '0';

  const handleCommentSubmit = () => {
    if (comment.trim() === '' || ratingUser === 0) {
      Alert.alert('Comentario incompleto', 'Por favor escribe un comentario y asigna una calificación.');
      return;
    }

    const newComment = {
      name: 'Usuario Anónimo',
      text: comment,
      stars: ratingUser,
    };

    setUserComments([newComment, ...userComments]);
    setComment('');
    setRatingUser(0);
  };

  const ingredientsToDisplay = calculateIngredients();

  return (
    <ScrollView className="p-4">
      <Image source={require('../../assets/descarga_1.jpg')} className="rounded-xl px-0 py-20" />

      {/* Calificación general del plato */}
      <View className="border border-gray-300 p-3 rounded-xl items-center my-3">
        <Text className="font-bold text-lg">Calificación general</Text>
        <StarRating
          rating={parseFloat(averageRating)}
          onChange={() => {}}
          starSize={25}
          enableSwiping={false}
        />
        <Text className="mt-1">{averageRating} / 5 basado en {userComments.length} opiniones</Text>
      </View>

      {/* Porciones */}
      <Text className="text-lg font-bold mt-5">Calcular Porciones</Text>
      <View className="flex-row items-center my-2">
        <Icon name="remove" size={20} onPress={() => setPortions(prev => Math.max(1, prev - 1))} />
        <Slider
          style={{ width: 150 }}
          minimumValue={1}
          maximumValue={10}
          step={1}
          value={portions}
          onValueChange={setPortions}
        />
        <Icon name="add" size={20} onPress={() => setPortions(prev => Math.min(10, prev + 1))} />
        <Text className="ml-2">{portions} porciones</Text>
      </View>

      {/* Ingredientes */}
      <Text className="text-lg font-bold mt-5">Ingredientes</Text>
      {ingredientsToDisplay.map((i, idx) => (
        <Text key={idx}>• {i.name}: {i.quantity} {i.unit}</Text>
      ))}

      {/* Procedimiento */}
      <Text className="text-lg font-bold mt-5">Procedimiento</Text>
      {[1, 2, 3].map((step, idx) => (
        <View key={idx} className="my-2">
          <Text className="mb-1">{step}. Lorem ipsum dolor sit amet...</Text>
          {(idx === 0 || idx === 1) && (
            <Image source={require('../../assets/descarga_1.jpg')} className="w-full h-36 rounded-lg" />
          )}
        </View>
      ))}

      {/* Añadir Comentario */}
      <Text className="text-lg font-bold mt-6">Añadir comentario</Text>
      <TextInput
        className="border-[#F0B27A] border-2 p-2 rounded-lg mt-2"
        placeholder="Escribe tu comentario..."
        value={comment}
        onChangeText={setComment}
      />
      <View className="border border-gray-300 p-3 rounded-xl items-center my-3">
        <Text className="font-semibold">Tu calificación al plato</Text>
        <StarRating rating={ratingUser} onChange={setRatingUser} starSize={25} />
      </View>
      <Pressable onPress={handleCommentSubmit} className="bg-[#9D5C63] rounded-full px-20 py-2 items-center mt-3">
        <Text className="text-white font-bold">Comentar</Text>
      </Pressable>

      {/* Comentarios Existentes */}
      <Text className="text-lg font-bold mt-6 mb-2">Comentarios</Text>
      {userComments.map((c, idx) => (
        <View key={idx} className="bg-[#FEF5EF] p-3 mt-4 rounded-lg">
          <Text className="font-bold">{c.name}</Text>
          <Text className="mb-1">{c.text}</Text>
          <StarRating
            rating={c.stars}
            starSize={16}
            onChange={() => {}}
            enableSwiping={false}
            enableHalfStar={false}
          />
        </View>
      ))}
    </ScrollView>
  );
}
