import { Recipe } from '../app/context/RecipeContext';

export const sanitizeRecipe = (recipe: Recipe): Recipe => {
  const safeIngredients = recipe.ingredients.map((i) => ({
    name: i.name || '',
    quantity: i.quantity
      ? parseFloat(i.quantity.toString()).toFixed(2)
      : '0',
    unit: i.unit || '',
  }));

const safeSteps = Array.isArray(recipe.steps)
  ? recipe.steps.map((s: any) => ({
      description: s.description || s.content || '',
      imageUri: s.imageUri || s.media || '',
    }))
  : [];

  return {
    ...recipe,
    ingredients: safeIngredients,
    steps: safeSteps,
    tags: recipe.tags || [],
    author: recipe.author || 'Desconocido',
    date: recipe.date || new Date().toISOString(), // ← garantiza que siempre tenga uno
  };
};
