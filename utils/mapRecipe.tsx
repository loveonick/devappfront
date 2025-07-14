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
  title: rawRecipe.name,
  description: rawRecipe.description,
  imageUri: rawRecipe.image,
  ingredients: rawRecipe.ingredients || [],
  steps: rawRecipe.procedures || [],
  tags: rawRecipe.tags || [],
  date: rawRecipe.createdAt || new Date().toISOString(),
  author: rawRecipe.author.name, 
});