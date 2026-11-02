import { api } from '../lib/axios';
import type { CitaApi, CitaConDetalle, EstadoCitaApi, RespuestaPaginada } from '../types/api';
import type { ActualizarEstadoCitaDTO, CrearCitaDTO, EstadoFinalCita } from '../types/dtos';

export const getAll = (estado?: EstadoCitaApi) =>
  api.get<CitaConDetalle[]>('/appointments', { params: estado ? { estado } : {} });

export const create = (data: CrearCitaDTO) =>
  api.post<CitaApi>('/appointments', data);

export const updateEstado = (id: number, estado: EstadoFinalCita) => {
  const body: ActualizarEstadoCitaDTO = { estado };
  return api.patch<CitaApi>(`/appointments/${id}/status`, body);
};

// ---------- Historial paginado ----------
export type FiltroEstadoHistorial = 'Todos' | 'Programada' | 'Completada' | 'Cancelada';

interface ParamsHistorial {
  pagina: number;
  estado: FiltroEstadoHistorial;
  limite?: number;
  signal?: AbortSignal;
}

// GET /appointments?pagina=2&limite=10&estado=Completada → RespuestaPaginada<CitaConDetalle>
export const getPaginadas = ({ pagina, estado, limite = 10, signal }: ParamsHistorial) =>
  api.get<RespuestaPaginada<CitaConDetalle>>('/appointments', {
    params: { pagina, limite, estado: estado === 'Todos' ? undefined : estado },
    signal,
  });
