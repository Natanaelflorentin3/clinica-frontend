import { api } from '../lib/axios';
import type { LoginFormData } from '../schemas/loginSchema';

export type RolUsuario = 'RECEPCIONISTA' | 'MEDICO' | 'GERENCIA';

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
