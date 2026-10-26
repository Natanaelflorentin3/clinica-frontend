import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { LoginResponse } from '../services/auth';

type Usuario = LoginResponse['usuario'];

interface AuthState {
  token: string | null;
  usuario: Usuario | null;
  isAuthenticated: boolean;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  devtools(
    // persist guarda el estado en localStorage ('auth-storage') y lo rehidrata al recargar (F5)
    persist(
      (set) => ({
        token: null,
        usuario: null,
        isAuthenticated: false,
        login: (token, usuario) => set({ token, usuario, isAuthenticated: true }, undefined, 'auth/login'),
        logout: () => set({ token: null, usuario: null, isAuthenticated: false }, undefined, 'auth/logout'),
      }),
      { name: 'auth-storage' }
    ),
    { name: 'AuthStore' }
  )
);
