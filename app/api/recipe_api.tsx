import { sanitizeRecipe } from '../../utils/sanitizeRecipe'; 

//const url = 'http://localhost:8080/api'
const url = 'https://dda1-backend.onrender.com/api';

export const getRecipes = async () => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders,
    };

    const response = await fetch(`${url}/recipes`, requestOptions);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    //console.log('Fetched recipes:', data);
const mappedRecipes = data.recipes.map((r) =>
  sanitizeRecipe({
    id: r._id,
    title: r.name,
    description: r.description,
    imageUri: r.image,
    ingredients: r.ingredients,
    steps: r.procedures,
    tags: r.tags,
    date: r.createdAt,
    author: r.author?.name ?? 'Desconocido',
  })
);
return mappedRecipes;

  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
}

export const getRecipeById = async (id) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    const response = await fetch(`${url}/recipes/${id}`, requestOptions);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    let data = await response.json();
    data = data.recipe;

    // Mapeo de datos para el front
    const mapped = {
      id: data._id,
      title: data.name,
      description: data.description,
      imageUri: data.image,
      ingredients: data.ingredients?.map(i => ({
        name: i.name,
        quantity: parseFloat(i.amount),
        unit: i.unit,
      })) || [],
      steps: data.procedures?.map(p => ({
        description: p.content,
        imageUri: p.media ? p.media : '',
      })) || [],
      tags: data.tags || [],
      date: data.createdAt,
      author: data.author?.name ?? 'Desconocido',
    };

    return sanitizeRecipe(mapped);

  } catch (error) {
    console.error('Error fetching recipe by ID:', error);
    throw error;
  }
};

export const createRecipe = async (recipeData: FormData) => {
  try {
    const requestOptions = {
      method: "POST",
      body: recipeData,
    };
    const response = await fetch(`${url}/recipes`, requestOptions);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear la receta');
    }
    return await response.json();
  } catch (error) {
    console.error('Error creating recipe:', error);
    throw error;
  }
};

export const createProcedure = async (procedureData: FormData) => {
  try {
    const response = await fetch(`${url}/procedures`, {
      method: 'POST',
      body: procedureData,
    });
    return await response.json();
  } catch (error) {
    console.error('Error creating procedure:', error);
    throw error;
  }
};

export const createIngredient = async (ingredientData: {
  name: string;
  amount?: string;
  unit?: string;
}) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: JSON.stringify(ingredientData),
    };

    const response = await fetch(`${url}/ingredients`, requestOptions);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Error al crear el ingrediente');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating ingredient:', error);
    throw error;
  }
};

export const getRecipesByUserId = async (userId: string) => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    const response = await fetch(`${url}/recipes/user/${userId}`, requestOptions);
    if (response.status === 404) {
      return [];
    }
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const recipes = data.recipes.map((r) => ({
      id: r._id,
      title: r.name,
      description: r.description,
      imageUri: r.image,
      ingredients: r.ingredients,
      steps: r.procedures,
      tags: r.tags,
      date: r.createdAt,
      author: r.author?.name ?? 'Desconocido',
    }));
    return recipes;
  } catch (error) {
    console.error('Error fetching recipes by user ID:', error);
    throw error;
  }
};

export const getPendingRecipes = async () => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    const response = await fetch(`${url}/recipes/pending`, requestOptions);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    const recipes = data.recipes.map((r) => ({
      id: r._id,
      title: r.name,
      description: r.description,
      imageUri: r.image,
      ingredients: r.ingredients,
      steps: r.procedures,
      tags: r.tags,
      date: r.createdAt,
      isApproved: r.isApproved,
      author: r.author?.name ?? 'Desconocido',
    }));
    return recipes;
  } catch (error) {
    console.error('Error fetching pending recipes:', error);
    throw error;
  }
};

export const getApprovedRecipes = async () => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
      method: "GET",
      headers: myHeaders,
    };

    const response = await fetch(`${url}/recipes/approved`, requestOptions);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    const data = await response.json();
    const recipes = data.recipes.map((r) => ({
      id: r._id,
      title: r.name,
      description: r.description,
      imageUri: r.image,
      ingredients: r.ingredients,
      steps: r.procedures,
      tags: r.tags,
      date: r.createdAt,
      author: r.author?.name ?? 'Desconocido',
    }));
    return recipes;
  } catch (error) {
    console.error('Error fetching approved recipes:', error);
    throw error;
  }
};

export const approveRecipe = async (recipeId) => {
  try {
    const requestOptions = {
      method: "PUT",
    };

    const response = await fetch(`${url}/recipes/${recipeId}/approve`, requestOptions);
    if (!response.ok && response.status !== 500) { 
      throw new Error('Network response was not ok');
    }
    return await response.json();
  } catch (error) {
    console.error('Error approving recipe:', error);
    throw error;
  }
};

export const getRecipeByName = async (name: string) => {
  try {
    const response = await fetch(`${url}/recipes/by-name?name=${encodeURIComponent(name.trim())}`);
    if (!response.ok) return null;

    const data = await response.json();
    return data.recipe || null;
  } catch (error) {
    console.error("Error al obtener receta por nombre:", error);
    return null;
  }
};

export const updateRecipe = async (id: string, recipeData: FormData) => {

  const response = await fetch(`${url}/recipes/${id}`, {
    method: 'PUT', 
    body: recipeData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al actualizar receta: ${errorText}`);
  }

  return response.json();
};

export const deleteRecipe = async (id: string) => {
  const response = await fetch(`${url}/recipes/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error al eliminar receta: ${errorText}`);
  }

  return response.json();
};