//const BASE_URL = 'https://dda1-backend.onrender.com//api';
const BASE_URL = 'http://localhost:8080/api'

export const getUserById = async (userId: string) => {
  const response = await fetch(`${BASE_URL}/users/${userId}`, { method: 'GET' });
  if (!response.ok) throw new Error('Error al obtener usuario');
  const data = await response.json();
  return data.user;
};

export const getFavorites = async (userId: string) => {
  const response = await fetch(`${BASE_URL}/users/fav/${userId}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error('Error al obtener favoritos');
  const data = await response.json();

  return data.favorites.map((r) => ({
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
};

export const addFavoriteAPI = async (userId: string, recipeId: string) => {
  const response = await fetch(`${BASE_URL}/users/fav`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, recipeId }),
  });
  if (!response.ok) throw new Error('Error al agregar favorito');
  return response.json();
};

export const removeFavoriteAPI = async (userId: string, recipeId: string) => {
  const response = await fetch(`${BASE_URL}/users/fav`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, recipeId }),
  });
  if (!response.ok) throw new Error('Error al eliminar favorito');
  return response.json();
};

export const updateUserProfile = async (
  userId: string,
  userData: { username: string; email: string; image?: string | null }
) => {
  const formData = new FormData();
  formData.append('username', userData.username);
  formData.append('email', userData.email);

  if (userData.image && !userData.image.startsWith('http')) {
    const fileUri = userData.image;
    const fileName = fileUri.split('/').pop() || 'profile.jpg';
    const mimeType = 'image/jpeg'; // O usar un helper para detectar tipo según extensión

    formData.append('image', {
      uri: fileUri,
      type: mimeType,
      name: fileName,
    } as any);
  }

  const response = await fetch(`${BASE_URL}/users/${userId}`, {
    method: 'PUT',
    body: formData,
  });

  if (!response.ok) throw new Error('Error al actualizar perfil');
  const updatedUser = await response.json();

  return {
    _id: updatedUser.user._id,
    username: updatedUser.user.username,
    email: updatedUser.user.email,
    image: updatedUser.user.imgUrl,
    favorites: updatedUser.user.favorites,
  };
};
