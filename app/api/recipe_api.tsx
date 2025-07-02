const url = 'http://localhost:8080/api';

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
    return data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw error;
  }
}

export const createRecipe = async (recipeData: FormData) => {
  try {
    const response = await fetch(`${url}/recipes`, {
      method: 'POST',
      body: recipeData, // No agregues headers Content-Type para FormData
    });
    
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
  quantity?: string;
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