import { api } from '../lib/axios';
import type { CitaApi, CitaConDetalle, EstadoCitaApi } from '../types/api';

// DTO para crear una cita: solo lo que manda el cliente
export type CitaDTO = Pick<CitaApi, 'pacienteId' | 'medicoId' | 'fecha'>;

// Una cita nace PROGRAMADA y solo puede pasar a COMPLETADA o CANCELADA
export type EstadoFinalCita = Exclude<EstadoCitaApi, 'PROGRAMADA'>;

export const getAll = (estado?: EstadoCitaApi) =>
  api.get<CitaConDetalle[]>('/appointments', { params: estado ? { estado } : {} });

export const create = (data: CitaDTO) =>
  api.post<CitaApi>('/appointments', data);

export const updateEstado = (id: number, estado: EstadoFinalCita) =>
  api.patch<CitaApi>(`/appointments/${id}/status`, { estado });
