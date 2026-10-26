import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { FiltroEstado } from '../types/paciente';
import type { EstadoCitaApi } from '../types/api';

interface FiltrosState {
  queryPacientes: string;
  estadoPacienteFiltro: FiltroEstado;
  especialidadFiltro: string; // 'Todas' o una especialidad (CARDIOLOGIA, PEDIATRIA, ...)
  estadoCitaFiltro: EstadoCitaApi | 'Todos';
  setQueryPacientes: (query: string) => void;
  setEstadoPaciente: (estado: FiltroEstado) => void;
  setEspecialidad: (especialidad: string) => void;
  setEstadoCita: (estado: EstadoCitaApi | 'Todos') => void;
  resetFiltros: () => void;
}

const FILTROS_INICIALES = {
  queryPacientes: '',
  estadoPacienteFiltro: 'Todos' as FiltroEstado,
  especialidadFiltro: 'Todas',
  estadoCitaFiltro: 'Todos' as EstadoCitaApi | 'Todos',
};

export const useFiltrosStore = create<FiltrosState>()(
  devtools(
    (set) => ({
      ...FILTROS_INICIALES,
      setQueryPacientes: (query) => set({ queryPacientes: query }, undefined, 'filtros/setQueryPacientes'),
      setEstadoPaciente: (estado) => set({ estadoPacienteFiltro: estado }, undefined, 'filtros/setEstadoPaciente'),
      setEspecialidad: (especialidad) => set({ especialidadFiltro: especialidad }, undefined, 'filtros/setEspecialidad'),
      setEstadoCita: (estado) => set({ estadoCitaFiltro: estado }, undefined, 'filtros/setEstadoCita'),
      resetFiltros: () => set(FILTROS_INICIALES, undefined, 'filtros/resetFiltros'),
    }),
    { name: 'FiltrosStore' }
  )
);
