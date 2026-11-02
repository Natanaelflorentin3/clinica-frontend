import { useNavigate, useParams } from 'react-router-dom'
import { usePacientes } from '../features/pacientes/hooks/usePacientes'
import { useCitas } from '../features/citas/hooks/useCitas'
import type { EstadoCitaApi } from '../types/api'
import BadgeEstado from '../components/BadgeEstado'
import PaginaNotFound from './PaginaNotFound'
import Spinner from '../shared/components/ui/Spinner'
import SkeletonCitaRow from '../shared/components/skeletons/SkeletonCitaRow'

const estiloEstado: Record<EstadoCitaApi, string> = {
  PROGRAMADA: 'bg-sky-100 text-sky-700',
  COMPLETADA: 'bg-emerald-100 text-emerald-700',
  CANCELADA: 'bg-slate-200 text-slate-600',
}

const formatearFecha = (fechaIso: string): string =>
  new Date(fechaIso).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })

export default function PaginaDetallePaciente() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  // Paciente: el hook carga la lista (sirve también si se entra directo por URL)
  const { pacientes, cargando: cargandoPacientes } = usePacientes()

  // Historial: el hook carga solo las citas de este paciente
  const {
    citas,
    citaSeleccionada,
    cargando: cargandoCitas,
    seleccionar,
  } = useCitas({ pacienteId: id ? Number(id) : undefined })

  const paciente = pacientes.find(p => p.id === id)

  if (cargandoPacientes || (!paciente && pacientes.length === 0)) {
    return <Spinner fullscreen texto="Cargando paciente..." />
  }

  if (!paciente) return <PaginaNotFound />

  const datos = [
    { etiqueta: 'Email', valor: paciente.email, icono: 'mail' },
    { etiqueta: 'Teléfono', valor: paciente.telefono, icono: 'call' },
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

      {/* Datos del paciente */}
      <div className="mb-6 rounded-xl bg-white p-6 shadow-sm md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">
              {paciente.nombre} {paciente.apellido}
            </h1>
            <p className="text-sm font-semibold tracking-wider text-slate-400">ID {paciente.id}</p>
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

      {/* Historial de citas (citasStore.cargarPorPaciente) */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Historial de citas</h2>

        {cargandoCitas ? (
          <ul className="flex flex-col gap-2" aria-label="Cargando citas">
            {Array.from({ length: 3 }, (_, i) => (
              <SkeletonCitaRow key={i} />
            ))}
          </ul>
        ) : citas.length === 0 ? (
          <p className="text-sm text-slate-500">Este paciente todavía no tiene citas.</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {citas.map(cita => (
              <li key={cita.id}>
                <button
                  type="button"
                  onClick={() => seleccionar(cita.id)}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg border px-4 py-3 text-left text-sm transition-colors ${
                    citaSeleccionada?.id === cita.id
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-slate-700">📅 {formatearFecha(cita.fecha)}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold uppercase ${estiloEstado[cita.estado]}`}>
                    {cita.estado}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* Detalle de la cita seleccionada (citasStore.seleccionar, sin pedir nada a la API) */}
        {citaSeleccionada && (
          <div className="mt-4 rounded-lg bg-slate-50 p-4 text-sm">
            <p className="mb-1 font-semibold text-slate-800">Cita #{citaSeleccionada.id}</p>
            <p className="text-slate-600">
              Médico: Dr/a. {citaSeleccionada.medico.nombre} {citaSeleccionada.medico.apellido} (
              {citaSeleccionada.medico.especialidadMedica.replace('_', ' ')})
            </p>
            <p className="text-slate-600">Fecha: {formatearFecha(citaSeleccionada.fecha)}</p>
            <p className="text-slate-600">Estado: {citaSeleccionada.estado}</p>
            <button
              type="button"
              onClick={() => seleccionar(null)}
              className="mt-2 text-xs font-semibold text-slate-500 hover:text-slate-700"
            >
              Cerrar detalle
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
