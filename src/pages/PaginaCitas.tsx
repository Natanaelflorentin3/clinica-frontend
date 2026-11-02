import { useOptimistic, useTransition } from 'react'
import type { ChangeEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import type { EstadoFinalCita } from '../types/dtos'
import { useCitas } from '../features/citas/hooks/useCitas'
import { useFiltrosCitas } from '../shared/hooks/useFiltros'
import { extraerMensajeError } from '../lib/errorHandler'
import type { CitaConDetalle, EstadoCitaApi } from '../types/api'
import SkeletonCitaRow from '../shared/components/skeletons/SkeletonCitaRow'
import AlertaBanner from '../shared/components/ui/AlertaBanner'
import EstadoVacio from '../shared/components/ui/EstadoVacio'

const estiloEstado: Record<EstadoCitaApi, { texto: string; clases: string }> = {
  PROGRAMADA: { texto: 'Programada', clases: 'bg-sky-100 text-sky-700' },
  COMPLETADA: { texto: 'Completada', clases: 'bg-emerald-100 text-emerald-700' },
  CANCELADA: { texto: 'Cancelada', clases: 'bg-slate-200 text-slate-600' },
}

const ESPECIALIDADES = ['CARDIOLOGIA', 'PEDIATRIA', 'TRAUMATOLOGIA', 'DERMATOLOGIA', 'CLINICA_GENERAL']
const ESTADOS: (EstadoCitaApi | 'Todos')[] = ['Todos', 'PROGRAMADA', 'COMPLETADA', 'CANCELADA']

interface CambioEstado {
  id: number
  estado: EstadoFinalCita
}

const formatearFecha = (fechaIso: string): string =>
  new Date(fechaIso).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })

const selectClases =
  'rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-200'

export default function PaginaCitas() {
  // Datos de la API + carga inicial: todo dentro del custom hook
  const { citas, cargando, error, recargar, actualizarEstado } = useCitas()

  // Filtros
  const {
    estado: estadoFiltro,
    especialidad: especialidadFiltro,
    setEstado: setEstadoCita,
    setEspecialidad,
  } = useFiltrosCitas()

  const [, startTransition] = useTransition()
  const navigate = useNavigate()

  // Estado OPTIMISTA sobre las citas del store.
  // Si la petición falla, el store no cambia y la UI vuelve sola al valor real (se revierte).
  const [citasOptimistas, aplicarCambioOptimista] = useOptimistic(
    citas,
    (actuales: CitaConDetalle[], cambio: CambioEstado) =>
      actuales.map(c => (c.id === cambio.id ? { ...c, estado: cambio.estado } : c))
  )


  const cambiarEstado = (id: number, estado: EstadoFinalCita) => {
    startTransition(async () => {
      // 1. La UI cambia al instante
      aplicarCambioOptimista({ id, estado })
      try {
        // 2. El store hace la petición y, si sale bien, actualiza el estado real
        await actualizarEstado(id, estado)
        toast.success(`Cita ${estiloEstado[estado].texto.toLowerCase()}`)
      } catch (err) {
        // 3. Error: el store no cambió, así que la UI vuelve al estado anterior
        toast.error(`Cambio revertido: ${extraerMensajeError(err)}`)
      }
    })
  }

  // Filtros combinados (se calculan en cada render)
  const citasFiltradas = citasOptimistas.filter(
    c =>
      (estadoFiltro === 'Todos' || c.estado === estadoFiltro) &&
      (especialidadFiltro === 'Todas' || c.medico.especialidadMedica === especialidadFiltro)
  )

  // ---- Cargando ----
  if (cargando) {
    return (
      <main className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="mb-6 h-9 w-40 animate-pulse rounded bg-slate-200" />
        <ul className="flex flex-col gap-3" aria-label="Cargando citas">
          {Array.from({ length: 6 }, (_, i) => (
            <SkeletonCitaRow key={i} />
          ))}
        </ul>
      </main>
    )
  }

  // ---- Error ----
  if (error) {
    return (
      <main className="mx-auto max-w-6xl p-4 md:p-8">
        <AlertaBanner
          tipo="error"
          titulo="No se pudieron cargar las citas"
          mensaje={error}
          accion={
            <button
              type="button"
              onClick={recargar}
              className="rounded-lg bg-white px-3 py-1 text-sm font-semibold text-rose-700 shadow-sm hover:bg-rose-100"
            >
              Reintentar
            </button>
          }
        />
      </main>
    )
  }

  // ---- Éxito ----
  return (
    <main className="mx-auto max-w-6xl p-4 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Citas</h1>
          <p className="mt-1 text-slate-500">
            {citasFiltradas.length} de {citasOptimistas.length} cita{citasOptimistas.length === 1 ? '' : 's'}
          </p>
        </div>
        <Link
          to="/citas/nueva"
          className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          + Nueva cita
        </Link>
      </div>

      {/* Filtros (useFiltrosStore) */}
      <div className="mb-4 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-sm md:flex-row">
        <select
          value={estadoFiltro}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setEstadoCita(e.target.value as EstadoCitaApi | 'Todos')}
          className={selectClases}
        >
          {ESTADOS.map(est => (
            <option key={est} value={est}>
              {est === 'Todos' ? 'Todos los estados' : estiloEstado[est].texto}
            </option>
          ))}
        </select>
        <select
          value={especialidadFiltro}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setEspecialidad(e.target.value)}
          className={selectClases}
        >
          <option value="Todas">Todas las especialidades</option>
          {ESPECIALIDADES.map(esp => (
            <option key={esp} value={esp}>
              {esp.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {citasFiltradas.length === 0 ? (
        citasOptimistas.length === 0 ? (
          <EstadoVacio
            icono="event_busy"
            titulo="Todavía no hay citas registradas"
            accion={{ label: 'Agendar una cita', onClick: () => navigate('/citas/nueva') }}
          />
        ) : (
          <EstadoVacio
            icono="filter_alt_off"
            titulo="Ninguna cita coincide con los filtros"
            accion={{
              label: 'Ver todas',
              onClick: () => {
                setEstadoCita('Todos')
                setEspecialidad('Todas')
              },
            }}
          />
        )
      ) : (
        <div className="flex flex-col gap-3">
          {citasFiltradas.map(cita => (
            <article
              key={cita.id}
              className="flex flex-col gap-3 rounded-xl bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
            >
              <div className="min-w-0">
                <p className="font-semibold text-slate-800">
                  {cita.paciente.nombre} {cita.paciente.apellido}
                </p>
                <p className="text-sm text-slate-500">
                  Dr/a. {cita.medico.nombre} {cita.medico.apellido} ·{' '}
                  {cita.medico.especialidadMedica.replace('_', ' ')}
                </p>
                <p className="text-sm text-slate-500">📅 {formatearFecha(cita.fecha)}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${estiloEstado[cita.estado].clases}`}>
                  {estiloEstado[cita.estado].texto}
                </span>

                {cita.estado === 'PROGRAMADA' && (
                  <>
                    <button
                      type="button"
                      onClick={() => cambiarEstado(cita.id, 'COMPLETADA')}
                      className="rounded-lg bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700 hover:bg-emerald-100"
                    >
                      Completar
                    </button>
                    <button
                      type="button"
                      onClick={() => cambiarEstado(cita.id, 'CANCELADA')}
                      className="rounded-lg bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-700 hover:bg-rose-100"
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  )
}
