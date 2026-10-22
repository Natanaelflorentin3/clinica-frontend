import { api } from '../lib/axios';
import type { PacienteApi } from '../types/api';

// DTO: un paciente sin id (el id lo genera la base de datos)
export type PacienteDTO = Omit<PacienteApi, 'id'>;

export const create = (data: PacienteDTO) =>
  api.post<PacienteApi>('/patients', data);

export const update = (id: number, data: Partial<PacienteDTO>) =>
  api.put<PacienteApi>(`/patients/${id}`, data);

export const remove = (id: number) => api.delete(`/patients/${id}`);
