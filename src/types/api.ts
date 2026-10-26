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

// Cita tal como la devuelve GET /appointments (incluye paciente y médico)
export interface CitaConDetalle extends CitaApi {
  paciente: PacienteApi;
  medico: MedicoApi;
}

// Respuesta paginada genérica (GET /patients?pagina=1&limite=...)
export interface RespuestaPaginada<T> {
  data: T[];
  total: number;
  pagina: number;
  totalPaginas: number;
}
