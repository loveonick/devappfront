type Recipe = {
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

export const mapRecipe = (rawRecipe: any): Recipe => ({
  id: rawRecipe._id,
  title: rawRecipe.name, // MongoDB tiene name, no title
  description: rawRecipe.description,
  imageUri: rawRecipe.image, // MongoDB tiene image, no imageUri
  ingredients: rawRecipe.ingredients || [], // si no están populados, será un array de ids
  steps: rawRecipe.procedures || [],        // igual que arriba
  tags: rawRecipe.tags || [],
  date: rawRecipe.createdAt || new Date().toISOString(),
  author: rawRecipe.author, // si viene como ID, lo podés mostrar o poblar si querés
});