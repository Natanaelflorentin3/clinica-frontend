import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as citasService from '../services/citas';
import type { CrearCitaDTO, EstadoFinalCita } from '../types/dtos';
import * as pacientesService from '../services/pacientes';
import { extraerMensajeError } from '../lib/errorHandler';
import type { CitaConDetalle } from '../types/api';

interface CitasState {
  citas: CitaConDetalle[];
  citaSeleccionada: CitaConDetalle | null;
  cargando: boolean;
  error: string | null;
  cargar: () => Promise<void>;
  cargarPorPaciente: (pacienteId: number) => Promise<void>;
  seleccionar: (id: number | null) => void;
  actualizarEstado: (id: number, estado: EstadoFinalCita) => Promise<void>;
  agregarCita: (data: CrearCitaDTO) => Promise<void>;
}

export const useCitasStore = create<CitasState>()(
  devtools(
    (set, get) => ({
      citas: [],
      citaSeleccionada: null,
      cargando: false,
      error: null,

      // Todas las citas (GET /appointments, ya trae paciente y médico)
      cargar: async () => {
        set({ cargando: true, error: null }, undefined, 'citas/cargar:inicio');
        try {
          const res = await citasService.getAll();
          set({ citas: res.data, cargando: false }, undefined, 'citas/cargar:exito');
        } catch (err) {
          set({ error: extraerMensajeError(err), cargando: false }, undefined, 'citas/cargar:error');
        }
      },

      // Historial de un paciente (GET /patients/:id trae el paciente con sus citas)
      cargarPorPaciente: async (pacienteId) => {
        set({ cargando: true, error: null, citaSeleccionada: null }, undefined, 'citas/cargarPorPaciente:inicio');
        try {
          const res = await pacientesService.getById(pacienteId);
          const { citas, ...paciente } = res.data;
          set(
            { citas: citas.map((c) => ({ ...c, paciente })), cargando: false },
            undefined,
            'citas/cargarPorPaciente:exito'
          );
        } catch (err) {
          set({ error: extraerMensajeError(err), cargando: false }, undefined, 'citas/cargarPorPaciente:error');
        }
      },

      // Busca en las citas que YA están en memoria: no hace otra petición a la API
      seleccionar: (id) => {
        const cita = id === null ? null : get().citas.find((c) => c.id === id) ?? null;
        set({ citaSeleccionada: cita }, undefined, 'citas/seleccionar');
      },

      actualizarEstado: async (id, estado) => {
        try {
          const res = await citasService.updateEstado(id, estado);
          const nuevoEstado = res.data.estado;
          set(
            (state) => ({
              citas: state.citas.map((c) => (c.id === id ? { ...c, estado: nuevoEstado } : c)),
              citaSeleccionada:
                state.citaSeleccionada?.id === id
                  ? { ...state.citaSeleccionada, estado: nuevoEstado }
                  : state.citaSeleccionada,
            }),
            undefined,
            'citas/actualizarEstado'
          );
        } catch (err) {
          throw new Error(extraerMensajeError(err), { cause: err });
        }
      },

      // POST /appointments devuelve la cita sin paciente/médico: recargamos la lista completa
      agregarCita: async (data) => {
        try {
          await citasService.create(data);
          await get().cargar();
        } catch (err) {
          throw new Error(extraerMensajeError(err), { cause: err });
        }
      },
    }),
    { name: 'CitasStore' }
  )
);
