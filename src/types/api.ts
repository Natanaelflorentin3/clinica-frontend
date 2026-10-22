// Tipos de lo que devuelve el backend de la clínica (Express + Prisma)

export type EstadoCitaApi = 'PROGRAMADA' | 'COMPLETADA' | 'CANCELADA';

export interface PacienteApi {
  id: number;
  nombre: string;
  apellido: string;
  telefono: string;
  email: string;
  fechaNacimiento: string;
}

export interface MedicoApi {
  id: number;
  nombre: string;
  apellido: string;
  especialidadMedica: string;
  telefono: string;
  email: string;
}

export interface CitaApi {
  id: number;
  fecha: string;
  pacienteId: number;
  medicoId: number;
  estado: EstadoCitaApi;
}
