import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuth = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      setUser: (user: any) => set({ user }),
      setToken: (token: any) => set({ token }),
      logout: () => set({ user: null, token: null }),
      noToken: () => set({ token: null }),
    }),
    {
      name: 'auth-store',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);