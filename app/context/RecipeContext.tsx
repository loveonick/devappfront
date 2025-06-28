import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Recipe {
  id: string;
  title: string;
  description: string;
  imageUri: string;
  ingredients: { name: string; quantity: string; unit: string }[];
  steps: { description: string; imageUri?: string }[];
  tags: string[];
}

interface RecipeContextType {
  recipes: Recipe[];
  addRecipe: (recipe: Recipe) => Promise<void>;
  getRecipeById: (id: string) => Recipe | undefined;
}

const RecipeContext = createContext<RecipeContextType | undefined>(undefined);
const STORAGE_KEY = 'RECIPES_STORAGE';

export const RecipeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // Cargar recetas al iniciar
  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const savedRecipes = await AsyncStorage.getItem(STORAGE_KEY);
        if (savedRecipes) {
          setRecipes(JSON.parse(savedRecipes));
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

  const addRecipe = async (recipe: Recipe) => {
    setRecipes(prev => {
      const newRecipes = [...prev, recipe];
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newRecipes));
      return newRecipes;
    });
  };

  const getRecipeById = (id: string) => {
    return recipes.find(r => r.id === id);
  };
  
  const updateRecipe = (id: string, updatedRecipe: Partial<Recipe>) => {
  setRecipes(prev => prev.map(r => r.id === id ? {...r, ...updatedRecipe} : r));
  };

  const deleteRecipe = (id: string) => {
    setRecipes(prev => prev.filter(r => r.id !== id));
  };

  return (
    <RecipeContext.Provider value={{ recipes, addRecipe, getRecipeById }}>
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