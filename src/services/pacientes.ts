import { api } from '../lib/axios';
import type { CitaApi, MedicoApi, PacienteApi, RespuestaPaginada } from '../types/api';
import type { ActualizarPacienteDTO, CrearPacienteDTO } from '../types/dtos';

// GET /patients/:id devuelve el paciente con su historial de citas (y el médico de cada una)
export type PacienteConCitas = PacienteApi & {
  citas: (CitaApi & { medico: MedicoApi })[];
};

// Búsqueda paginada: el backend devuelve { data, total, pagina, totalPaginas }
export const buscar = (query?: string, pagina: number = 1, limite: number = 100) =>
  api.get<RespuestaPaginada<PacienteApi>>('/patients', {
    params: { query: query || undefined, pagina, limite },
  });

export const getById = (id: number) =>
  api.get<PacienteConCitas>(`/patients/${id}`);

export const create = (data: CrearPacienteDTO) =>
  api.post<PacienteApi>('/patients', data);

export const update = (id: number, data: ActualizarPacienteDTO) =>
  api.put<PacienteApi>(`/patients/${id}`, data);

export const remove = (id: number) => api.delete(`/patients/${id}`);
