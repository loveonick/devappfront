const url = 'http://localhost:8080/api';

export const getFavorites = async (userId: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const requestOptions = {
        method: "GET",
        headers: myHeaders
    };
    const response = await fetch(`${url}/users/fav/${userId}`,requestOptions);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const mappedRecipes = data.favorites.map((r) => ({
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
}
export const addFavoriteAPI = async (userId: string, recipeId: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
    "userId": userId,
    "recipeId": recipeId
    });

    const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw
    };
    const response = await fetch(`${url}/users/fav`, requestOptions);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
}
export const removeFavoriteAPI = async (userId: string, recipeId: string) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "userId": userId,
        "recipeId": recipeId
    });

    const requestOptions = {
        method: "DELETE",
        headers: myHeaders,
        body: raw
    };
    const response = await fetch(`${url}/users/fav`, requestOptions);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
}
export const getUserById = async (userId: string) => {
    const requestOptions = {
    method: "GET"
    };
    const response = await fetch(`${url}/users/${userId}`, requestOptions);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.user;
}