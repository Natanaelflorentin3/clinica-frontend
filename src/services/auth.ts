import { api } from '../lib/axios';
import type { LoginFormData } from '../schemas/loginSchema';

// ADMIN todavía no existe en el backend, pero la consigna lo pide para /reportes
export type RolUsuario = 'RECEPCIONISTA' | 'MEDICO' | 'GERENCIA' | 'ADMIN';

export interface LoginResponse {
  token: string;
  usuario: {
    id: number;
    nombre: string;
    email: string;
    rol: RolUsuario;
  };
}

export async function login(datos: LoginFormData): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', datos);
  return data;
}
