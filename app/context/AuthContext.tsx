// app/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { loginApi } from '../api/auth_api'; 
import { getFavorites, toggleFavoriteBack } from '../api/user_api';

type User = {
    username: string;
    email: string;
};

type AuthContextType = {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
    updateUser: (newData: Partial<User>) => Promise<void>;
    favorites: string[];
    toggleFavorite: (recipeId: string) => Promise<void>;
    isFavorite: (recipeId: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true); // true al inicio
    const [favorites, setFavorites] = useState<string[]>([]);

    // Mover loadFavorites fuera de useEffect para que esté disponible globalmente
    const loadFavorites = async (userId: string) => {
        const data = await getFavorites(userId);
        setFavorites(data);
    };

    useEffect(() => {
        // Cargar usuario al iniciar app
        const loadUser = async () => {
            try {
                const userData = await AsyncStorage.getItem('user');
                if (userData) {
                setUser(JSON.parse(userData));
                }
            } catch (error) {
                console.error('Error al cargar usuario:', error);
            } finally {
                setIsLoading(false);
            }
            };
            loadUser();
        }, []);

        const toggleFavorite = async (recipeId: string) => {
            const data = await toggleFavoriteBack(user?.username || '', recipeId);
            if (!data) {
                Alert.alert('Error', 'No se pudo actualizar favorito');
                return;
            }
            // actualizar localmente
            if (favorites.includes(recipeId)) {
                setFavorites(favorites.filter(id => id !== recipeId));
            } else {
                setFavorites([...favorites, recipeId]);
            }
        };

        const isFavorite = (recipeId: string) => favorites.includes(recipeId);

        const login = async (email: string, password: string) => {
            setIsLoading(true);
            try {
            // Simulación. Usar tu backend real.

            const user = await loginApi(email,password);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            setUser(user);
            loadFavorites(user._id);
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
            setUser(newUser);
            } catch (error) {
            console.error(error);
            Alert.alert('Error', 'No se pudo registrar');
            } finally {
            setIsLoading(false);
            }
        };

        const updateUser = async (newData) => {
            try {
                const updatedUser = { ...user, ...newData };
                setUser(updatedUser);
                await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
            } catch (error) {
                console.error('Error actualizando usuario:', error);
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
    <AuthContext.Provider value={{ user, login, register, logout, isLoading, updateUser, favorites, toggleFavorite, isFavorite }}>
      {children}
    </AuthContext.Provider>
    );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
};