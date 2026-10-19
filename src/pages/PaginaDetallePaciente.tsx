import { useNavigate, useParams } from 'react-router-dom'
import { PACIENTES } from '../data/pacientes'
import BadgeEstado from '../components/BadgeEstado'
import PaginaNotFound from './PaginaNotFound'

export default function PaginaDetallePaciente() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const paciente = PACIENTES.find(p => p.id === id)

  if (!paciente) return <PaginaNotFound />

  const datos = [
    { etiqueta: 'Email', valor: paciente.email, icono: 'mail' },
    { etiqueta: 'Teléfono', valor: paciente.telefono, icono: 'call' },
    { etiqueta: 'Especialidad', valor: paciente.especialidadAsignada, icono: 'stethoscope' },
    { etiqueta: 'Última cita', valor: paciente.ultimaCita, icono: 'calendar_clock' },
  ]

  return (
    <main className="mx-auto max-w-3xl p-4 md:p-8">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="mb-6 text-sm font-semibold text-emerald-700 hover:text-emerald-600"
      >
        ← Volver
      </button>

      <div className="rounded-xl bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {paciente.nombre} {paciente.apellido}
            </h1>
            <p className="text-sm font-semibold tracking-wider text-slate-400">{paciente.id}</p>
          </div>
          <BadgeEstado estado={paciente.estado} />
        </div>

        <dl className="grid gap-4 sm:grid-cols-2">
          {datos.map(dato => (
            <div key={dato.etiqueta} className="rounded-lg bg-slate-50 p-4">
              <dt className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                <span className="material-symbols-outlined text-[16px]">{dato.icono}</span>
                {dato.etiqueta}
              </dt>
              <dd className="mt-1 font-medium text-slate-800">{dato.valor}</dd>
            </div>
          ))}
        </dl>
      </div>
    </main>
  )
}