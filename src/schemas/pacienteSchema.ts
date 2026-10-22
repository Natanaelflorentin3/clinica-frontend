import { z } from 'zod';
import { fechaHoy } from './citaSchema';

// Mismas reglas que valida el backend en validate-patient.ts
export const pacienteSchema = z.object({
  nombre: z.string().trim().min(1, 'El nombre es obligatorio'),
  apellido: z.string().trim().min(1, 'El apellido es obligatorio'),
  telefono: z.string().trim().min(6, 'El teléfono debe tener al menos 6 dígitos'),
  email: z.string().trim().email('El correo no tiene un formato válido'),
  fechaNacimiento: z
    .string()
    .min(1, 'La fecha de nacimiento es obligatoria')
    .refine(fecha => fecha <= fechaHoy(), 'La fecha de nacimiento no puede ser futura'),
});

export type PacienteFormData = z.infer<typeof pacienteSchema>;
