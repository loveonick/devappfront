import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { loginApi } from '../api/auth_api'; 
import { updateUserProfile, getFavorites, addFavoriteAPI, removeFavoriteAPI, getUserById } from '../api/user_api';

type User = {
  _id: string;
  username: string;
  email: string;
  image?: string;
  favorites: Recipe[];
};

type Recipe = {
  _id: string;
  title: string;
  description: string;
  imageUri: string;
  ingredients: { name: string; quantity: string; unit: string }[];
  steps: { description: string; imageUri?: string }[];
  tags: string[];
  date: string;
  author: string;
};

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
  updateUser: (newData: Partial<User>) => Promise<void>;
  favorites: Recipe[];
  toggleFavorite: (recipeId: string) => Promise<void>;
  isFavorite: (recipeId: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const favorites = user?.favorites || [];

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        if (userData) setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error al cargar usuario:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const toggleFavorite = async (recipeId: string) => {
    try {
      if (!user) return;
      if (user.favorites.some((r) => r._id === recipeId)) {
        await removeFavoriteAPI(user._id, recipeId);
      } else {
        await addFavoriteAPI(user._id, recipeId);
      }
      const updatedUser = await getUserById(user._id);
      const mappedUser = {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        image: updatedUser.imgUrl,
        favorites: updatedUser.favorites,
      };
      setUser(mappedUser);
      await AsyncStorage.setItem('user', JSON.stringify(mappedUser));
    } catch (err) {
      console.error("Error al actualizar favorito:", err);
    }
  };

  const isFavorite = (recipeId: string) => {
    return user?.favorites?.some((r) => r._id === recipeId) || false;
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const user = await loginApi(email, password);
      const mappedUser = {
        _id: user._id,
        username: user.username,
        email: user.email,
        image: user.imgUrl,
        favorites: user.favorites,
      };
      setUser(mappedUser);
      await AsyncStorage.setItem('user', JSON.stringify(mappedUser));
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const newUser = { username, email };
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      // setUser(newUser); // TODO: Implementar registro
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'No se pudo registrar');
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (newData: { username: string; email: string; image?: string | null }) => {
    if (!user) return;
    try {
      const updatedUser = await updateUserProfile(user._id, newData);
      const mappedUser = {
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        image: updatedUser.image,
        favorites: updatedUser.favorites,
      };
      setUser(mappedUser);
      await AsyncStorage.setItem('user', JSON.stringify(mappedUser));
    } catch (error) {
      console.error('Error actualizando usuario:', error);
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, isLoading, updateUser, favorites, toggleFavorite, isFavorite }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};