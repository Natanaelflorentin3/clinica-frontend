import { api } from '../lib/axios';
import type { CitaApi, MedicoApi, PacienteApi } from '../types/api';

// DTO: un paciente sin id (el id lo genera la base de datos)
export type PacienteDTO = Omit<PacienteApi, 'id'>;

// GET /patients/:id devuelve el paciente con su historial de citas (y el médico de cada una)
export type PacienteConCitas = PacienteApi & {
  citas: (CitaApi & { medico: MedicoApi })[];
};

export const getAll = (query?: string) =>
  api.get<PacienteApi[]>('/patients', { params: query ? { query } : {} });

export const getById = (id: number) =>
  api.get<PacienteConCitas>(`/patients/${id}`);

export const create = (data: PacienteDTO) =>
  api.post<PacienteApi>('/patients', data);

export const update = (id: number, data: Partial<PacienteDTO>) =>
  api.put<PacienteApi>(`/patients/${id}`, data);

export const remove = (id: number) => api.delete(`/patients/${id}`);
