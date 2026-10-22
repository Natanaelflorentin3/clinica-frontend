// src/lib/errorHandler.ts — versión simple; el viernes la formalizamos con type guards
export function extraerMensajeError(err: unknown): string {
  if (err instanceof Error) return err.message;
  return 'Error inesperado';
}
