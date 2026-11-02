// src/lib/errorHandler.ts — versión final con type guards
import axios from 'axios';

// Forma de los errores que manda nuestro backend:
//   { error: "Paciente no encontrado" }  o  { error: [ { message: "..." } ] } (Zod)
interface ErrorBackend {
  error?: string | { message?: string }[];
  message?: string;
}

export function extraerMensajeError(err: unknown): string {
  // Type guard: dentro de este if, TypeScript sabe que `err` es un AxiosError<ErrorBackend>
  if (axios.isAxiosError<ErrorBackend>(err)) {
    // Sin respuesta = el backend no contestó (apagado, sin red, timeout)
    if (!err.response) return 'No se pudo conectar con el servidor';

    const data = err.response.data;
    if (typeof data?.error === 'string') return data.error;
    if (Array.isArray(data?.error)) return data.error[0]?.message ?? 'Datos inválidos';
    if (typeof data?.message === 'string') return data.message;

    return `Error del servidor (${err.response.status})`;
  }

  if (err instanceof Error) return err.message;

  return 'Error inesperado';
}
