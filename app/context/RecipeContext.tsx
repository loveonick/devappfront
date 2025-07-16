import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface RecipeDraft {
  title?: string;
  description?: string;
  imageUri?: string;
  imageFile?: File;
  ingredients?: { name: string; quantity: string; unit: string }[];
  steps?: { description: string; imageUri?: string }[];
  tags?: string[];
  type?: string;
}

interface Recipe {
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
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);
const STORAGE_KEY = 'RECIPES_STORAGE';

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
    setRecipesState(prev => {
      const newRecipes = [...prev, recipe];
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