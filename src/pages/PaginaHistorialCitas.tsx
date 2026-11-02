import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import * as citasService from '../services/citas'
import type { FiltroEstadoHistorial } from '../services/citas'
import { extraerMensajeError } from '../lib/errorHandler'
import type { CitaConDetalle, EstadoCitaApi, RespuestaPaginada } from '../types/api'

const LIMITE = 10
const ESTADOS: FiltroEstadoHistorial[] = ['Todos', 'Programada', 'Completada', 'Cancelada']

const estiloEstado: Record<EstadoCitaApi, string> = {
  PROGRAMADA: 'bg-sky-100 text-sky-700',
  COMPLETADA: 'bg-emerald-100 text-emerald-700',
  CANCELADA: 'bg-slate-200 text-slate-600',
}

const esFiltroValido = (valor: string | null): valor is FiltroEstadoHistorial =>
  valor !== null && (ESTADOS as string[]).includes(valor)

const formatearFecha = (fechaIso: string): string =>
  new Date(fechaIso).toLocaleString('es-AR', { dateStyle: 'medium', timeStyle: 'short' })

// Resultado de una carga, marcado con la "clave" (página + estado) a la que pertenece
interface Resultado {
  clave: string
  respuesta: RespuestaPaginada<CitaConDetalle> | null
  error: string | null
}

// Placeholder del mismo alto que una fila real (evita el "salto" de layout)
function FilaSkeleton() {
  return (
    <li className="flex h-[76px] animate-pulse items-center justify-between gap-4 rounded-xl bg-white px-5 shadow-sm">
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 rounded bg-slate-200" />
        <div className="h-3 w-1/2 rounded bg-slate-100" />
      </div>
      <div className="h-6 w-24 rounded-full bg-slate-200" />
    </li>
  )
}

export default function PaginaHistorialCitas() {
  // La URL es la fuente de verdad: ?pagina=2&estado=Completada
  const [searchParams, setSearchParams] = useSearchParams()
  const pagina = Math.max(1, Number(searchParams.get('pagina')) || 1)
  const estadoParam = searchParams.get('estado')
  const estado: FiltroEstadoHistorial = esFiltroValido(estadoParam) ? estadoParam : 'Todos'

  const claveActual = `${pagina}|${estado}`
  const [resultado, setResultado] = useState<Resultado>({ clave: '', respuesta: null, error: null })
  const [reintentos, setReintentos] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    citasService
      .getPaginadas({ pagina, estado, limite: LIMITE, signal: controller.signal })
      .then(res => setResultado({ clave: claveActual, respuesta: res.data, error: null }))
      .catch((err: unknown) => {
        // Si la cancelamos nosotros (cambió la página o el filtro), no es un error real
        if (axios.isCancel(err) || controller.signal.aborted) return
        setResultado({ clave: claveActual, respuesta: null, error: extraerMensajeError(err) })
      })

    // Cleanup: cancela la petición anterior → evita mostrar datos de una página vieja
    return () => controller.abort()
  }, [pagina, estado, claveActual, reintentos])

  // Está cargando mientras el último resultado no sea de la página/filtro actuales
  const cargando = resultado.clave !== claveActual
  const respuesta = cargando ? null : resultado.respuesta
  const error = cargando ? null : resultado.error

  const totalPaginas = respuesta?.totalPaginas ?? 1
  const total = respuesta?.total ?? 0

  // Cambiar el filtro → vuelve a página 1, en UNA sola llamada
  const handleCambiarEstado = (e: ChangeEvent<HTMLSelectElement>) => {
    const nuevoEstado = e.target.value
    if (!esFiltroValido(nuevoEstado)) return
    setSearchParams({ pagina: '1', estado: nuevoEstado })
  }

  const irAPagina = (nueva: number) => {
    setSearchParams({ pagina: String(nueva), estado })
  }

  return (
    <main className="mx-auto max-w-5xl p-4 md:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Historial de citas</h1>
          <p className="mt-1 text-slate-500">Todas las citas de la clínica, de la más reciente a la más antigua</p>
        </div>
        <select
          value={estado}
          onChange={handleCambiarEstado}
          className="rounded-xl bg-white px-4 py-2 text-sm text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
        >
          {ESTADOS.map(est => (
            <option key={est} value={est}>
              {est === 'Todos' ? 'Todos los estados' : est}
            </option>
          ))}
        </select>
      </div>

      {/* Lista */}
      {cargando ? (
        <ul className="flex flex-col gap-3" aria-label="Cargando citas">
          {Array.from({ length: LIMITE }, (_, i) => (
            <FilaSkeleton key={i} />
          ))}
        </ul>
      ) : error ? (
        <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-8 text-center shadow-sm">
          <p className="text-sm text-rose-600">{error}</p>
          <button
            type="button"
            onClick={() => setReintentos(n => n + 1)}
            className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            Reintentar
          </button>
        </div>
      ) : respuesta && respuesta.data.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {respuesta.data.map(cita => (
            <li
              key={cita.id}
              className="flex h-[76px] items-center justify-between gap-4 rounded-xl bg-white px-5 shadow-sm"
            >
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-800">
                  {cita.paciente.nombre} {cita.paciente.apellido}
                </p>
                <p className="truncate text-sm text-slate-500">
                  📅 {formatearFecha(cita.fecha)} · Dr/a. {cita.medico.nombre} {cita.medico.apellido}
                </p>
              </div>
              <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${estiloEstado[cita.estado]}`}>
                {cita.estado}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm">No hay citas para mostrar.</p>
      )}

      {/* Paginación */}
      <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => irAPagina(pagina - 1)}
          disabled={pagina <= 1 || cargando}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          ← Anterior
        </button>
        <p className="text-sm text-slate-500">
          Página {pagina} de {totalPaginas} — {total} registro{total === 1 ? '' : 's'}
        </p>
        <button
          type="button"
          onClick={() => irAPagina(pagina + 1)}
          disabled={pagina >= totalPaginas || cargando}
          className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Siguiente →
        </button>
      </div>
    </main>
  )
}
