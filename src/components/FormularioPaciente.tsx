import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { pacienteSchema } from '../schemas/pacienteSchema'
import type { PacienteFormData } from '../schemas/pacienteSchema'
import { fechaHoy } from '../schemas/citaSchema'
import { usePacientesStore } from '../stores/pacientesStore'
import { extraerMensajeError } from '../lib/errorHandler'

// Borde rojo si el campo tiene error
const clasesCampo = (hayError: boolean): string =>
  `w-full rounded-lg border px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 ${
    hayError
      ? 'border-rose-500 bg-rose-50 focus:ring-rose-200'
      : 'border-slate-200 bg-slate-50 focus:bg-white focus:ring-emerald-200'
  }`

export default function FormularioPaciente() {
  const crear = usePacientesStore(s => s.crear)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PacienteFormData>({ resolver: zodResolver(pacienteSchema) })

  const onSubmit = async (data: PacienteFormData) => {
    try {
      await crear(data)
      toast.success('Paciente registrado')
      reset()
    } catch (err) {
      toast.error(extraerMensajeError(err))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
      <h2 className="font-semibold text-slate-800">Registrar nuevo paciente</h2>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <input type="text" placeholder="Nombre *" {...register('nombre')} className={clasesCampo(!!errors.nombre)} />
          {errors.nombre && <p className="mt-1 text-sm text-rose-600">{errors.nombre.message}</p>}
        </div>
        <div>
          <input type="text" placeholder="Apellido *" {...register('apellido')} className={clasesCampo(!!errors.apellido)} />
          {errors.apellido && <p className="mt-1 text-sm text-rose-600">{errors.apellido.message}</p>}
        </div>
        <div>
          <input type="email" placeholder="Email *" {...register('email')} className={clasesCampo(!!errors.email)} />
          {errors.email && <p className="mt-1 text-sm text-rose-600">{errors.email.message}</p>}
        </div>
        <div>
          <input type="tel" placeholder="Teléfono *" {...register('telefono')} className={clasesCampo(!!errors.telefono)} />
          {errors.telefono && <p className="mt-1 text-sm text-rose-600">{errors.telefono.message}</p>}
        </div>
        <div>
          <label htmlFor="fechaNacimiento" className="mb-1 block text-xs font-medium text-slate-500">
            Fecha de nacimiento *
          </label>
          <input
            id="fechaNacimiento"
            type="date"
            max={fechaHoy()}
            {...register('fechaNacimiento')}
            className={clasesCampo(!!errors.fechaNacimiento)}
          />
          {errors.fechaNacimiento && <p className="mt-1 text-sm text-rose-600">{errors.fechaNacimiento.message}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-fit rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? 'Guardando...' : '+ Agregar paciente'}
      </button>
    </form>
  )
}
