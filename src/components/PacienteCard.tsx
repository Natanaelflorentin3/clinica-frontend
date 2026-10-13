import type { Paciente } from '../types/paciente'
import BadgeEstado from './BadgeEstado'

interface PacienteCardProps {
  paciente: Paciente
}

const obtenerIniciales = (nombre: string, apellido: string): string =>
  `${nombre[0] ?? ''}${apellido[0] ?? ''}`.toUpperCase()

export default function PacienteCard({ paciente }: PacienteCardProps) {
  return (
    <article className="flex flex-col gap-4 rounded-xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      {/* Encabezado */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 font-bold text-emerald-700">
            {obtenerIniciales(paciente.nombre, paciente.apellido)}
          </div>
          <div className="min-w-0">
            <h3 className="truncate font-semibold text-slate-800">
              {paciente.nombre} {paciente.apellido}
            </h3>
            <p className="text-xs font-semibold tracking-wider text-slate-400">{paciente.id}</p>
          </div>
        </div>
        <BadgeEstado estado={paciente.estado} />
      </div>

      {/* Especialidad */}
      <span className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
        <span className="material-symbols-outlined text-[16px] text-emerald-600">stethoscope</span>
        {paciente.especialidadAsignada}
      </span>

      {/* Contacto */}
      <div className="space-y-2 text-sm text-slate-600">
        <p className="flex items-center gap-2 truncate">
          <span className="material-symbols-outlined text-[18px] text-slate-400">mail</span>
          {paciente.email}
        </p>
        <p className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-slate-400">call</span>
          {paciente.telefono}
        </p>
        <p className="flex items-center gap-2 pt-1 text-slate-500">
          <span className="material-symbols-outlined text-[18px] text-slate-400">calendar_clock</span>
          Última cita: <strong className="text-slate-800">{paciente.ultimaCita}</strong>
        </p>
      </div>

            {/* Acciones (visuales por ahora) */}
      <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-4 text-sm">
        <button className="font-semibold text-emerald-700 hover:text-emerald-600">Historial →</button>
        <span className="text-slate-300">•</span>
        <button className="text-slate-600 hover:text-slate-800">Agendar Cita</button>
      </div>
    </article>
  )
}