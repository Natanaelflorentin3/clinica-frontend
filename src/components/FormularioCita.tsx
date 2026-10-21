import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from 'react-router-dom'
import { citaSchema, fechaHoy } from '../schemas/citaSchema'
import type { CitaFormData } from '../schemas/citaSchema'
import { useMedicos } from '../hooks/useMedicos'

const URGENCIAS: { valor: CitaFormData['urgencia']; texto: string }[] = [
  { valor: 'baja', texto: 'Baja' },
  { valor: 'media', texto: 'Media' },
  { valor: 'alta', texto: 'Alta' },
  { valor: 'critica', texto: 'Crítica' },
]

// Simula la demora de un servidor
const esperar = (ms: number) => new Promise<void>(resolve => setTimeout(resolve, ms))

// Borde rojo si el campo tiene error
const clasesCampo = (hayError: boolean): string =>
  `w-full rounded-lg border px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 ${
    hayError
      ? 'border-rose-500 bg-rose-50 focus:ring-rose-200'
      : 'border-slate-200 bg-slate-50 focus:bg-white focus:ring-emerald-200'
  }`

export default function FormularioCita() {
  const navigate = useNavigate()
  const { medicos, cargando } = useMedicos()
  const [citaConfirmada, setCitaConfirmada] = useState<CitaFormData | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CitaFormData>({
    resolver: zodResolver(citaSchema),
    defaultValues: { urgencia: 'media' },
  })

  const onSubmit = async (data: CitaFormData) => {
    await esperar(1500)
    setCitaConfirmada(data)
  }

  const agendarOtra = () => {
    reset()
    setCitaConfirmada(null)
  }

  // ---- Tarjeta de confirmación ----
  if (citaConfirmada) {
    const medico = medicos.find(m => m.id === citaConfirmada.medicoId)
    const urgencia = URGENCIAS.find(u => u.valor === citaConfirmada.urgencia)

    return (
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <p className="text-4xl">✅</p>
        <h2 className="mt-2 text-xl font-bold text-slate-800">¡Cita agendada!</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div><dt className="inline font-semibold text-slate-600">Paciente: </dt><dd className="inline text-slate-800">{citaConfirmada.pacienteNombre}</dd></div>
          <div><dt className="inline font-semibold text-slate-600">Médico: </dt><dd className="inline text-slate-800">{medico ? `${medico.nombre} (${medico.especialidad})` : citaConfirmada.medicoId}</dd></div>
          <div><dt className="inline font-semibold text-slate-600">Fecha y hora: </dt><dd className="inline text-slate-800">{citaConfirmada.fecha} a las {citaConfirmada.hora}</dd></div>
          <div><dt className="inline font-semibold text-slate-600">Urgencia: </dt><dd className="inline text-slate-800">{urgencia?.texto}</dd></div>
          <div><dt className="inline font-semibold text-slate-600">Motivo: </dt><dd className="inline text-slate-800">{citaConfirmada.motivo}</dd></div>
        </dl>
        <button
          type="button"
          onClick={agendarOtra}
          className="mt-6 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          Agendar otra cita
        </button>
      </div>
    )
  }

  // ---- Formulario ----
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm" noValidate>
      {/* Paciente */}
      <div>
        <label htmlFor="pacienteNombre" className="mb-1 block text-sm font-medium text-slate-700">Nombre del paciente</label>
        <input id="pacienteNombre" type="text" {...register('pacienteNombre')} className={clasesCampo(!!errors.pacienteNombre)} />
        {errors.pacienteNombre && <p className="mt-1 text-sm text-rose-600">{errors.pacienteNombre.message}</p>}
      </div>

      {/* Médico */}
      <div>
        <label htmlFor="medicoId" className="mb-1 block text-sm font-medium text-slate-700">Médico</label>
        <select id="medicoId" {...register('medicoId')} className={clasesCampo(!!errors.medicoId)}>
          {cargando ? (
            <option disabled value="">Cargando médicos...</option>
          ) : (
            <>
              <option value="">Seleccionar médico...</option>
              {medicos.map(m => (
                <option key={m.id} value={m.id}>{m.nombre} — {m.especialidad}</option>
              ))}
            </>
          )}
        </select>
        {errors.medicoId && <p className="mt-1 text-sm text-rose-600">{errors.medicoId.message}</p>}
      </div>

      {/* Fecha y hora */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="fecha" className="mb-1 block text-sm font-medium text-slate-700">Fecha</label>
          <input id="fecha" type="date" min={fechaHoy()} {...register('fecha')} className={clasesCampo(!!errors.fecha)} />
          {errors.fecha && <p className="mt-1 text-sm text-rose-600">{errors.fecha.message}</p>}
        </div>
        <div>
          <label htmlFor="hora" className="mb-1 block text-sm font-medium text-slate-700">Hora</label>
          <input id="hora" type="time" {...register('hora')} className={clasesCampo(!!errors.hora)} />
          {errors.hora && <p className="mt-1 text-sm text-rose-600">{errors.hora.message}</p>}
        </div>
      </div>

      {/* Urgencia */}
      <div>
        <label htmlFor="urgencia" className="mb-1 block text-sm font-medium text-slate-700">Urgencia</label>
        <select id="urgencia" {...register('urgencia')} className={clasesCampo(!!errors.urgencia)}>
          {URGENCIAS.map(u => (
            <option key={u.valor} value={u.valor}>{u.texto}</option>
          ))}
        </select>
        {errors.urgencia && <p className="mt-1 text-sm text-rose-600">{errors.urgencia.message}</p>}
      </div>

      {/* Motivo */}
      <div>
        <label htmlFor="motivo" className="mb-1 block text-sm font-medium text-slate-700">Motivo de la consulta</label>
        <textarea id="motivo" rows={3} {...register('motivo')} className={clasesCampo(!!errors.motivo)} />
        {errors.motivo && <p className="mt-1 text-sm text-rose-600">{errors.motivo.message}</p>}
      </div>

      {/* Botones */}
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
          disabled={isSubmitting}
          className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Agendando...' : 'Agendar cita'}
        </button>
      </div>
    </form>
  )
}