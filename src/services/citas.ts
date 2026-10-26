import { api } from '../lib/axios';
import type { CitaApi, CitaConDetalle, EstadoCitaApi } from '../types/api';
import type { ActualizarEstadoCitaDTO, CrearCitaDTO, EstadoFinalCita } from '../types/dtos';

export const getAll = (estado?: EstadoCitaApi) =>
  api.get<CitaConDetalle[]>('/appointments', { params: estado ? { estado } : {} });

export const create = (data: CrearCitaDTO) =>
  api.post<CitaApi>('/appointments', data);

export const updateEstado = (id: number, estado: EstadoFinalCita) => {
  const body: ActualizarEstadoCitaDTO = { estado };
  return api.patch<CitaApi>(`/appointments/${id}/status`, body);
};
