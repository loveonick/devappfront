import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import * as Network from 'expo-network';
import { handleUpload } from '../utils/handleUpload';
import { useAuth } from '../app/context/AuthContext';
import { useRecipeContext } from '../app/context/RecipeContext';

export const usePendingRecipeUploader = () => {
  const { user } = useAuth();
  const { getPendingRecipes, clearPendingRecipes } = useRecipeContext();

  useFocusEffect(
    useCallback(() => {
      const checkAndUploadPending = async () => {
        try {
          const network = await Network.getNetworkStateAsync();
          if (network.isConnected && network.type === Network.NetworkStateType.WIFI) {
            const pending = await getPendingRecipes();

            for (const item of pending) {
              try {
                const data = await handleUpload(item.draft, item.steps, user);
                console.log('Receta pendiente subida', data);
              } catch (err) {
                console.error('Error al subir receta pendiente:', err);
              }
            }

            await clearPendingRecipes();
          }
        } catch (err) {
          console.error('Error al revisar conexión WiFi:', err);
        }
      };

      checkAndUploadPending();
    }, [user])
  );
};