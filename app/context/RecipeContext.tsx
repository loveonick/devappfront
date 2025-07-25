import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sanitizeRecipe } from '../../utils/sanitizeRecipe'; // ajustá la ruta si es distinta


interface RecipeDraft {
  title?: string;
  description?: string;
  imageUri?: string;
  imageFile?: File;
  ingredients?: { name: string; quantity: string; unit: string }[];
  steps?: { description: string; imageUri?: string }[];
  tags?: string[];
  type?: string;
  duplicateId?: string;
};

export interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUri: string;
  ingredients: { name: string; quantity: string; unit: string }[];
  steps: { description: string; imageUri?: string }[];
  tags: string[];
  date: string;
  author: string;
}

export interface RecipeStep {
  description: string;
  imageUri?: string;
  // Add other fields if needed
}

interface RecipeContextType {
  storedRecipes: Recipe[];
  addRecipe: (recipe: Recipe) => Promise<void>;
  getRecipeById: (id: string) => Recipe | undefined;
  setRecipes: (recipes: Recipe[]) => void;
  reloadStoredRecipes: () => Promise<void>;

  draft: RecipeDraft;
  updateDraft: (data: Partial<RecipeDraft>) => void;
  alreadySaved: (recipe: Recipe) => boolean;
  deleteRecipe: (id: string) => void;
  deleteAllRecipes: () => Promise<void>;
  clearDraft: () => void;
  updateRecipe: (id: string, updatedRecipe: Partial<Recipe>) => void;

  addPendingRecipe: (draft: RecipeDraft, steps: RecipeStep[]) => Promise<void>;
  getPendingRecipes: () => Promise<{ draft: RecipeDraft; steps: RecipeStep[] }[]>;
  clearPendingRecipes: () => Promise<void>;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);
const STORAGE_KEY = 'RECIPES_STORAGE';
const PENDING_KEY = 'PENDING_RECIPES_STORAGE';


export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storedRecipes, setRecipesState] = useState<Recipe[]>([]);
  const [draft, setDraft] = useState<RecipeDraft>({});

  useEffect(() => {
    reloadStoredRecipes();
  }, []);

  const reloadStoredRecipes = async () => {
    try {
      const savedRecipes = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedRecipes) {
        setRecipesState(JSON.parse(savedRecipes));
      } else {
        setRecipesState([]);
      }
    } catch (error) {
      console.error('Error reloading recipes:', error);
    }
  };

  const addRecipe = async (recipe: Recipe) => {
    if (!recipe.steps || recipe.steps.length === 0) {
      console.warn('Intentando guardar una receta sin pasos');
      return;
    }

  // Asegurar que las cantidades sean strings con dos decimales desde el principio
  const sanitizedIngredients = recipe.ingredients.map((i) => ({
    name: i.name || '',
    quantity: (() => {
      const q = i.quantity;
      const parsed = typeof q === 'number' ? q : parseFloat(q?.toString() || '0');
      return parsed.toFixed(2);
    })(),
    unit: i.unit || '',
  }));

  const sanitizedSteps = recipe.steps.map((s) => ({
    description: s.description || '',
    imageUri: s.imageUri || '',
  }));

  const sanitizedRecipe: Recipe = {
    ...recipe,
    ingredients: sanitizedIngredients,
    steps: sanitizedSteps,
    tags: recipe.tags || [],
    author: recipe.author || 'Desconocido',
    date: recipe.date || new Date().toISOString(),
  };

  // Guardar en estado y AsyncStorage
  setRecipesState((prev) => {
    const newRecipes = [...prev, sanitizedRecipe];
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newRecipes));
    return newRecipes;
  });
};



  const deleteRecipe = (id: string) => {
    setRecipesState(prev => {
      const updated = prev.filter(r => r.id !== id);
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const deleteAllRecipes = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setRecipesState([]);
    } catch (error) {
      console.error('Error deleting all recipes:', error);
    }
  };

  const alreadySaved = (recipe: Recipe) => {
    return storedRecipes.some(r => r.id === recipe.id);
  };

  const getRecipeById = (id: string) => {
    return storedRecipes.find(r => r.id === id);
  };

  const updateDraft = (data: Partial<RecipeDraft>) => {
    setDraft(prev => ({ ...prev, ...data }));
  };

  const clearDraft = () => {
    setDraft({});
  };

  const updateRecipe = (id: string, updatedRecipe: Partial<Recipe>) => {
    setRecipesState(prev =>
      prev.map(r => (r.id === id ? { ...r, ...updatedRecipe } : r))
    );
  };

  const setRecipes = (recipes: Recipe[]) => {
    setRecipesState(recipes);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  };

  const addPendingRecipe = async (draft: RecipeDraft, steps: RecipeStep[]) => {
    try {
      const recipeToStore = {
        draft,
        steps,
        date: new Date().toISOString()
      };

      const stored = await AsyncStorage.getItem(PENDING_KEY);
      const pending = stored ? JSON.parse(stored) : [];

      pending.push(recipeToStore);
      await AsyncStorage.setItem(PENDING_KEY, JSON.stringify(pending));
    } catch (err) {
      console.error('Error al guardar receta pendiente:', err);
    }
  };

  const getPendingRecipes = async (): Promise<{ draft: RecipeDraft; steps: RecipeStep[] }[]> => {
    try {
      const stored = await AsyncStorage.getItem(PENDING_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error('Error al obtener recetas pendientes:', err);
      return [];
    }
  };

  const clearPendingRecipes = async () => {
    try {
      await AsyncStorage.removeItem(PENDING_KEY);
    } catch (err) {
      console.error('Error al limpiar recetas pendientes:', err);
    }
  };

  return (
    <RecipeContext.Provider
      value={{
        storedRecipes,
        addRecipe,
        alreadySaved,
        getRecipeById,
        deleteRecipe,
        deleteAllRecipes,
        setRecipes,
        reloadStoredRecipes,
        draft,
        updateDraft,
        clearDraft,
        updateRecipe,
        addPendingRecipe,
        getPendingRecipes,
        clearPendingRecipes
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export const useRecipeContext = () => {
  const context = useContext(RecipeContext);
  if (!context) {
    throw new Error('useRecipeContext must be used within a RecipeProvider');
  }
  return context;
};