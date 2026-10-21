import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { PACIENTES } from '../data/pacientes'

interface FormularioCita {
  pacienteId: string
  especialidad: string
  fecha: string
  hora: string
  motivo: string
}

const ESPECIALIDADES = ['Cardiología', 'Pediatría', 'Dermatología', 'Traumatología', 'Neurología', 'Clínica Médica']

const inputClases =
  'w-full rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200'

export default function PaginaNuevaCita() {
  const navigate = useNavigate()
  const [confirmacion, setConfirmacion] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormularioCita>()

  const onSubmit = (data: FormularioCita) => {
    const paciente = PACIENTES.find(p => p.id === data.pacienteId)
    setConfirmacion(
      `Cita agendada para ${paciente?.nombre} ${paciente?.apellido} el ${data.fecha} a las ${data.hora}`
    )
    reset()
  }

  return (
    <main className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="mb-1 text-3xl font-bold tracking-tight text-slate-800">Nueva cita</h1>
      <p className="mb-6 text-slate-500">Agendá una consulta para un paciente</p>

      {confirmacion && (
        <p className="mb-4 rounded-lg bg-emerald-50 p-3 text-sm font-medium text-emerald-700">✅ {confirmacion}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Paciente</label>
          <select {...register('pacienteId', { required: 'Elegí un paciente' })} className={inputClases}>
            <option value="">Seleccionar...</option>
            {PACIENTES.map(p => (
              <option key={p.id} value={p.id}>
                {p.nombre} {p.apellido}
              </option>
            ))}
          </select>
          {errors.pacienteId && <p className="mt-1 text-sm text-rose-600">{errors.pacienteId.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Especialidad</label>
          <select {...register('especialidad', { required: 'Elegí una especialidad' })} className={inputClases}>
            <option value="">Seleccionar...</option>
            {ESPECIALIDADES.map(e => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
          {errors.especialidad && <p className="mt-1 text-sm text-rose-600">{errors.especialidad.message}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Fecha</label>
            <input type="date" {...register('fecha', { required: 'La fecha es obligatoria' })} className={inputClases} />
            {errors.fecha && <p className="mt-1 text-sm text-rose-600">{errors.fecha.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-700">Hora</label>
            <input type="time" {...register('hora', { required: 'La hora es obligatoria' })} className={inputClases} />
            {errors.hora && <p className="mt-1 text-sm text-rose-600">{errors.hora.message}</p>}
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Motivo de la consulta</label>
          <textarea
            rows={3}
            {...register('motivo', {
              required: 'El motivo es obligatorio',
              minLength: { value: 10, message: 'Mínimo 10 caracteres' },
            })}
            className={inputClases}
          />
          {errors.motivo && <p className="mt-1 text-sm text-rose-600">{errors.motivo.message}</p>}
        </div>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            Agendar cita
          </button>
        </div>
      </form>
    </main>
  )
}