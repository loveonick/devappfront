import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Modal,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useState, useCallback } from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { useRecipeContext } from '../../context/RecipeContext';
import { useAuth } from '../../context/AuthContext';
import { getRecipeByName, getRecipesByUserId } from '../../api/recipe_api';

const DISH_TYPES = [
  'Entrada',
  'Plato principal',
  'Guarnición',
  'Postre',
  'Bebida',
  'Ensalada',
  'Sopa',
  'Snack',
  'Desayuno',
];

export default function Index() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [type, setType] = useState<string>('');
  const { updateDraft } = useRecipeContext();
  const { user } = useAuth();

  const [showDuplicateModal, setShowDuplicateModal] = useState(false);
  const [existingRecipe, setExistingRecipe] = useState<any>(null);
  const [isChecking, setIsChecking] = useState(false);

  const [errorModal, setErrorModal] = useState<{ visible: boolean; message: string }>({
    visible: false,
    message: '',
  });

  useFocusEffect(
    useCallback(() => {
      setTitle('');
      setDescription('');
      setImageUri(null);
      setImageFile(null);
      setType('');
      setShowDuplicateModal(false);
      setExistingRecipe(null);
    }, [])
  );

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      if (Platform.OS === 'web') {
        setImageFile(asset.file ?? null);
      }
    }
  };

  const handleNext = async () => {
    if (!title || !description || !imageUri || !type) {
      setErrorModal({
        visible: true,
        message: 'Por favor, completá todos los campos y cargá una imagen.',
      });
      return;
    }

    setIsChecking(true);
    try {
      const recipeByName = await getRecipeByName(title);

      if (recipeByName) {
        const userRecipes = await getRecipesByUserId(user._id);
        const userHasRecipe = userRecipes.some(
          (r) => r.title.trim().toLowerCase() === title.trim().toLowerCase()
        );

        if (userHasRecipe) {
          setExistingRecipe(recipeByName);
          updateDraft({ duplicateId: recipeByName._id });
          setShowDuplicateModal(true);
          setIsChecking(false);
          return;
        }
      }

      updateDraft({
        title,
        description,
        imageUri,
        imageFile,
        type,
        duplicateId: null,
      });

      router.push('/createrecipe/ingredients');
    } catch (error) {
      console.error('Error checking recipe existence:', error);
      setErrorModal({
        visible: true,
        message: 'Ocurrió un error al verificar la receta.',
      });
    } finally {
      setIsChecking(false);
    }
  };

  const handleEditExisting = () => {
    setShowDuplicateModal(false);
    router.push(`/editrecipe/${existingRecipe._id}`);
  };

  const handleReplaceExisting = () => {
    setShowDuplicateModal(false);

    if (!title || !description || !type) {
      setErrorModal({
        visible: true,
        message: 'Por favor completa todos los campos antes de reemplazar.',
      });
      return;
    }

    updateDraft({
      title,
      description,
      imageUri,
      imageFile,
      type,
      duplicateId: existingRecipe._id,
    });

    router.push('/createrecipe/ingredients');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 bg-white px-6 pt-12 pb-12">
          <Text className="text-xl font-bold mb-6 text-center">¡Agrega una receta!</Text>

          <Text className="font-semibold mb-1">Nombre del plato</Text>
          <TextInput
            className="border border-[#9D5C63] rounded-md px-4 py-2 mb-4"
            placeholder="Ej: Tacos al pastor"
            value={title}
            onChangeText={setTitle}
            placeholderTextColor={'#9CA3AF'}
          />

          <Text className="font-semibold mb-1">Descripción</Text>
          <TextInput
            className="border border-[#9D5C63] rounded-md px-4 py-2 mb-4"
            placeholder="Describe tu plato"
            value={description}
            onChangeText={setDescription}
            placeholderTextColor={'#9CA3AF'}
            multiline
          />

          <Text className="font-bold mb-2">Tipo de plato</Text>
          <View className="flex-row flex-wrap mb-4">
            {DISH_TYPES.map((item) => (
              <TouchableOpacity
                key={item}
                onPress={() => setType(item)}
                className={`px-4 py-2 mr-2 mb-2 rounded-full border ${
                  type === item ? 'bg-[#9D5C63] border-[#9D5C63]' : 'border-gray-400'
                }`}
              >
                <Text className={type === item ? 'text-white' : 'text-black'}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text className="font-bold mb-2">Imagen del Plato</Text>
          <TouchableOpacity
            onPress={pickImage}
            className="bg-gray-200 rounded-md h-32 justify-center items-center mb-4"
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} className="w-full h-32 rounded-md" />
            ) : (
              <>
                <Text className="text-gray-500 text-lg">⬆️</Text>
                <Text className="text-black">Agregar imagen</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleNext}
            disabled={isChecking}
            className={`bg-[#9D5C63] rounded-xl w-40 mx-auto py-2 ${
              isChecking ? 'opacity-50' : ''
            }`}
          >
            <Text className="text-white font-bold text-center">
              {isChecking ? 'Verificando...' : 'Siguiente'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Modal: receta duplicada */}
        <Modal
          visible={showDuplicateModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDuplicateModal(false)}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-6">
            <View className="bg-white rounded-xl p-6 w-full max-w-md">
              <Text className="text-lg font-bold mb-4 text-center">
                Ya tienes una receta llamada "{title}". ¿Qué deseas hacer?
              </Text>

              <TouchableOpacity
                onPress={handleEditExisting}
                className="bg-[#9D5C63] rounded-md py-3 mb-3"
              >
                <Text className="text-white text-center font-bold">Editar receta existente</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleReplaceExisting}
                className="border border-gray-400 rounded-md py-3"
              >
                <Text className="text-black text-center">Reemplazar receta existente</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal: error general */}
        <Modal
          visible={errorModal.visible}
          transparent
          animationType="fade"
          onRequestClose={() => setErrorModal({ visible: false, message: '' })}
        >
          <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-6">
            <View className="bg-white rounded-xl p-6 w-full max-w-md">
              <Text className="text-lg font-bold mb-4 text-center text-red-600">Error</Text>
              <Text className="text-center mb-4">{errorModal.message}</Text>
              <TouchableOpacity
                onPress={() => setErrorModal({ visible: false, message: '' })}
                className="bg-[#9D5C63] rounded-md py-3"
              >
                <Text className="text-white text-center font-bold">Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}