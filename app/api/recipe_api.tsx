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
    //console.log('Fetched recipes:', data);
    const mappedRecipes = data.recipes.map((r) => ({
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
        imageUri: p.media[0],
      })) || [],
      tags: data.tags || [],
    };

    return mapped;
  } catch (error) {
    console.error('Error fetching recipe by ID:', error);
    throw error;
  }
};