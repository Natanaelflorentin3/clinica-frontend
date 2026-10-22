import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as pacientesService from '../services/pacientes';
import type { PacienteDTO } from '../services/pacientes';
import { extraerMensajeError } from '../lib/errorHandler';
import type { EstadoPaciente, Paciente } from '../types/paciente';
import type { PacienteApi } from '../types/api';

// Convierte el paciente del backend al formato que usan nuestros componentes.
// El backend todavía no tiene estado, especialidad ni última cita: usamos valores por defecto.
export const mapearPaciente = (p: PacienteApi): Paciente => ({
  id: String(p.id),
  nombre: p.nombre,
  apellido: p.apellido,
  email: p.email,
  telefono: p.telefono,
  especialidadAsignada: 'Sin asignar',
  ultimaCita: 'Sin citas',
  estado: 'activo',
});

interface PacientesState {
  pacientes: Paciente[];
  cargando: boolean;
  error: string | null;
  cargar: (query?: string) => Promise<void>;
  crear: (data: PacienteDTO) => Promise<void>;
  actualizar: (id: string, data: Partial<PacienteDTO>) => Promise<void>;
  eliminar: (id: string) => Promise<void>;
  cambiarEstado: (id: string, estado: EstadoPaciente) => void;
}

export const usePacientesStore = create<PacientesState>()(
  devtools(
    (set) => ({
      pacientes: [],
      cargando: false,
      error: null,

      cargar: async (query) => {
        set({ cargando: true, error: null }, undefined, 'pacientes/cargar:inicio');
        try {
          const res = await pacientesService.getAll(query);
          set({ pacientes: res.data.map(mapearPaciente), cargando: false }, undefined, 'pacientes/cargar:exito');
        } catch (err) {
          set({ error: extraerMensajeError(err), cargando: false }, undefined, 'pacientes/cargar:error');
        }
      },

      // Las mutaciones vuelven a lanzar el error para que el componente muestre el toast.
      // (`error` queda reservado para el error de carga de la lista.)
      crear: async (data) => {
        try {
          const res = await pacientesService.create(data);
          set(
            (state) => ({ pacientes: [...state.pacientes, mapearPaciente(res.data)] }),
            undefined,
            'pacientes/crear'
          );
        } catch (err) {
          throw new Error(extraerMensajeError(err), { cause: err });
        }
      },

      actualizar: async (id, data) => {
        try {
          const res = await pacientesService.update(Number(id), data);
          const actualizado = mapearPaciente(res.data);
          set(
            (state) => ({
              // conservamos el estado local (el backend todavía no lo guarda)
              pacientes: state.pacientes.map((p) => (p.id === id ? { ...actualizado, estado: p.estado } : p)),
            }),
            undefined,
            'pacientes/actualizar'
          );
        } catch (err) {
          throw new Error(extraerMensajeError(err), { cause: err });
        }
      },

      eliminar: async (id) => {
        try {
          await pacientesService.remove(Number(id));
          set(
            (state) => ({ pacientes: state.pacientes.filter((p) => p.id !== id) }),
            undefined,
            'pacientes/eliminar'
          );
        } catch (err) {
          throw new Error(extraerMensajeError(err), { cause: err });
        }
      },

      // Solo local: el backend todavía no tiene estado de paciente
      cambiarEstado: (id, estado) =>
        set(
          (state) => ({ pacientes: state.pacientes.map((p) => (p.id === id ? { ...p, estado } : p)) }),
          undefined,
          'pacientes/cambiarEstado'
        ),
    }),
    { name: 'PacientesStore' }
  )
);
