import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { } from "../api/recipe_api";

interface RecipeDraft {
  title?: string;
  description?: string;
  imageUri?: string;
  imageFile?: File;
  ingredients?: { name: string; quantity: string; unit: string }[];
  steps?: { description: string; imageUri?: string }[];
  tags?: string[];
  type?: string;
};

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
};

interface RecipeContextType {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => Promise<void>;
  getRecipeById: (id: string) => Recipe | undefined;
  setRecipes: (recipes: Recipe[]) => void;

  draft: RecipeDraft;
  updateDraft: (data: Partial<RecipeDraft>) => void;
  clearDraft: () => void;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);
const STORAGE_KEY = 'RECIPES_STORAGE';

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recipes, setRecipesState] = useState<Recipe[]>([]);
  const [draft, setDraft] = useState<RecipeDraft>({});


  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const savedRecipes = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedRecipes) {
          setRecipesState(JSON.parse(savedRecipes));
        }
      } catch (error) {
        console.error('Error loading recipes:', error);
      }
    };
    loadRecipes();
  }, []);

  // Guardar recetas cuando cambian
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  }, [recipes]);

  const updateDraft = (data: Partial<RecipeDraft>) => {
    setDraft(prev => ({ ...prev, ...data }));
  };
  const clearDraft = () => {
    setDraft({});
  } ;

  const addRecipe = async (recipe: Recipe) => {
    setRecipesState(prev => {
      const newRecipes = [...prev, recipe];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newRecipes));
      return newRecipes;
    });
  };

  const getRecipeById = (id: string) => {
    return recipes.find(r => r.id === id);
  };
  
  const updateRecipe = (id: string, updatedRecipe: Partial<Recipe>) => {
  setRecipesState(prev => prev.map(r => r.id === id ? {...r, ...updatedRecipe} : r));
  };

  const deleteRecipe = (id: string) => {
    setRecipesState(prev => prev.filter(r => r.id !== id));
  };
  const setRecipes = (recipes: Recipe[]) => {
    setRecipesState(recipes);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(recipes));
  }
  return (
    <RecipeContext.Provider value={{ recipes, addRecipe, getRecipeById, setRecipes, draft, updateDraft, clearDraft }}>
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