import { z } from 'zod'

// Fecha de hoy en hora LOCAL (YYYY-MM-DD).
// toISOString() usa hora UTC: en Argentina, después de las 21:00 ya te da el día siguiente.
export const fechaHoy = (): string => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().split('T')[0]
}

export const citaSchema = z.object({
  pacienteNombre: z.string().trim().min(3, 'El nombre debe tener al menos 3 caracteres'),
  medicoId: z.string().min(1, 'Seleccioná un médico'),
  fecha: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'La fecha debe tener formato YYYY-MM-DD')
    .refine(fecha => fecha >= fechaHoy(), 'La fecha no puede ser pasada'),
  hora: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Hora inválida (HH:MM, de 00:00 a 23:59)'),
  motivo: z
    .string()
    .trim()
    .min(10, 'El motivo debe tener al menos 10 caracteres')
    .max(500, 'El motivo no puede superar los 500 caracteres'),
  urgencia: z.enum(['baja', 'media', 'alta', 'critica'], { message: 'Elegí un nivel de urgencia' }),
})

export type CitaFormData = z.infer<typeof citaSchema>