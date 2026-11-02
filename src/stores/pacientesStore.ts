import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as pacientesService from '../services/pacientes';
import type { ActualizarPacienteDTO, CrearPacienteDTO } from '../types/dtos';
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
  total: number;
  cargando: boolean;
  error: string | null;
  cargar: (query?: string) => Promise<void>;
  crear: (data: CrearPacienteDTO) => Promise<void>;
  actualizar: (id: string, data: ActualizarPacienteDTO) => Promise<void>;
  eliminar: (id: string) => Promise<void>;
  cambiarEstado: (id: string, estado: EstadoPaciente) => void;
}

// Contador para descartar respuestas de búsquedas viejas (condición de carrera)
let ultimaPeticion = 0;

export const usePacientesStore = create<PacientesState>()(
  devtools(
    (set) => ({
      pacientes: [],
      total: 0,
      cargando: false,
      error: null,

      cargar: async (query) => {
        // Cada búsqueda tiene un número; si llega tarde la respuesta de una búsqueda vieja, se ignora
        const peticion = ++ultimaPeticion;
        set({ cargando: true, error: null }, undefined, 'pacientes/cargar:inicio');
        try {
          const res = await pacientesService.buscar(query);
          if (peticion !== ultimaPeticion) return;
          set(
            { pacientes: res.data.data.map(mapearPaciente), total: res.data.total, cargando: false },
            undefined,
            'pacientes/cargar:exito'
          );
        } catch (err) {
          if (peticion !== ultimaPeticion) return;
          set({ error: extraerMensajeError(err), cargando: false }, undefined, 'pacientes/cargar:error');
        }
      },

      // Las mutaciones vuelven a lanzar el error para que el componente muestre el toast.
      // (`error` queda reservado para el error de carga de la lista.)
      crear: async (data) => {
        try {
          const res = await pacientesService.create(data);
          set(
            (state) => ({ pacientes: [...state.pacientes, mapearPaciente(res.data)], total: state.total + 1 }),
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
            (state) => ({ pacientes: state.pacientes.filter((p) => p.id !== id), total: state.total - 1 }),
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
