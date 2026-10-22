import { useEffect, useOptimistic, useState, useTransition } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import * as citasService from '../services/citas'
import type { EstadoFinalCita } from '../services/citas'
import { extraerMensajeError } from '../lib/errorHandler'
import type { CitaConDetalle, EstadoCitaApi } from '../types/api'

const estiloEstado: Record<EstadoCitaApi, { texto: string; clases: string }> = {
  PROGRAMADA: { texto: 'Programada', clases: 'bg-sky-100 text-sky-700' },
  COMPLETADA: { texto: 'Completada', clases: 'bg-emerald-100 text-emerald-700' },
  CANCELADA: { texto: 'Cancelada', clases: 'bg-slate-200 text-slate-600' },
}

interface CambioEstado {
  id: number
  estado: EstadoFinalCita
}

const formatearFecha = (fechaIso: string): string =>
  new Date(fechaIso).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })

export default function PaginaCitas() {
  // Estado REAL (lo que confirmó el backend)
  const [citas, setCitas] = useState<CitaConDetalle[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)
  const [, startTransition] = useTransition()

  // Estado OPTIMISTA: lo que se muestra mientras la petición está en curso.
  // Si la petición falla y no tocamos `citas`, vuelve solo al valor real (se revierte).
  const [citasOptimistas, aplicarCambioOptimista] = useOptimistic(
    citas,
    (actuales: CitaConDetalle[], cambio: CambioEstado) =>
      actuales.map(c => (c.id === cambio.id ? { ...c, estado: cambio.estado } : c))
  )

  const cargarCitas = () => {
    setCargando(true)
    setError(false)
    citasService.getAll()
      .then((res) => setCitas(res.data))
      .catch(() => setError(true))
      .finally(() => setCargando(false))
  }

  useEffect(cargarCitas, [])

  const cambiarEstado = (id: number, estado: EstadoFinalCita) => {
    startTransition(async () => {
      // 1. La UI cambia al instante
      aplicarCambioOptimista({ id, estado })

      try {
        // 2. Petición real al backend
        const res = await citasService.updateEstado(id, estado)

        // 3. Éxito: actualizamos el estado real con lo que confirmó el servidor
        startTransition(() => {
          setCitas(prev => prev.map(c => (c.id === id ? { ...c, estado: res.data.estado } : c)))
        })
        toast.success(`Cita ${estiloEstado[res.data.estado].texto.toLowerCase()}`)
      } catch (err) {
        // 4. Error: no tocamos `citas`, así que la UI vuelve al estado anterior
        toast.error(`Cambio revertido: ${extraerMensajeError(err)}`)
      }
    })
  }

  // ---- Cargando ----
  if (cargando) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-500">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700" />
        <p>Cargando citas...</p>
      </main>
    )
  }

  // ---- Error ----
  if (error) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="text-5xl">⚠️</p>
        <p className="font-semibold text-slate-800">No se pudieron cargar las citas</p>
        <button
          type="button"
          onClick={cargarCitas}
          className="mt-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          Reintentar
        </button>
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
            {citasOptimistas.length} cita{citasOptimistas.length === 1 ? '' : 's'} en total
          </p>
        </div>
        <Link
          to="/citas/nueva"
          className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          + Nueva cita
        </Link>
      </div>

      {citasOptimistas.length === 0 ? (
        <p className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm">No hay citas registradas.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {citasOptimistas.map(cita => (
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
