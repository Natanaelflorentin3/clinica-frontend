// src/types/dtos.ts — DTOs derivados con Utility Types (sin repetir campos)
import type { CitaApi, EstadoCitaApi, PacienteApi } from './api';

// ---------- Pacientes ----------
// Para crear: todo menos el id (lo genera la base de datos)
export type CrearPacienteDTO = Omit<PacienteApi, 'id'>;

// Para actualizar: cualquier campo, todos opcionales
export type ActualizarPacienteDTO = Partial<CrearPacienteDTO>;

// Versión corta para listados o selects
export type ResumenPaciente = Pick<PacienteApi, 'id' | 'nombre' | 'apellido' | 'email'>;

// ---------- Citas ----------
// Para crear: solo lo que manda el cliente (el estado nace PROGRAMADA en el backend)
export type CrearCitaDTO = Pick<CitaApi, 'pacienteId' | 'medicoId' | 'fecha'>;

// Una cita solo puede pasar de PROGRAMADA a COMPLETADA o CANCELADA
export type EstadoFinalCita = Exclude<EstadoCitaApi, 'PROGRAMADA'>;

// Body del PATCH /appointments/:id/status
export type ActualizarEstadoCitaDTO = { estado: EstadoFinalCita };

// Cantidad de citas por estado (ej: { PROGRAMADA: 3, COMPLETADA: 5, CANCELADA: 1 })
export type ConteoPorEstado = Record<EstadoCitaApi, number>;
