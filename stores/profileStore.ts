import { create } from 'zustand';

export interface ProfileData {
  username: string;
  email: string;
  profileImage: any;
}

interface ProfileStore {
  username: string;
  email: string;
  profileImage: any;
  isLoading: boolean;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: Partial<ProfileData>) => Promise<void>;
  logout: () => void;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  username: 'Usuario Prueba',
  email: 'prueba@email.com',
  profileImage: require('../assets/profileExample.jpg'),
  isLoading: false,

  fetchProfile: async () => {
    // Simula carga
    console.log('fetchProfile dummy ejecutado');
  },

  updateProfile: async (data) => {
    console.log('Perfil actualizado (dummy):', data);
    set({
      ...data,
      profileImage: data.profileImage || get().profileImage,
    });
  },

  logout: () => {
    console.log('Logout dummy ejecutado');
    set({
      username: '',
      email: '',
      profileImage: require('../assets/profileExample.jpg'),
      isLoading: false,
    });
  },
}));
