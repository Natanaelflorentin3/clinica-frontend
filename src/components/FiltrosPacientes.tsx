import type { ChangeEvent } from 'react'
import type { FiltroEstado } from '../types/paciente'
import BuscadorPacientes from './BuscadorPacientes'

interface FiltrosPacientesProps {
  busqueda: string
  estadoFiltro: FiltroEstado
  onBusquedaChange: (e: ChangeEvent<HTMLInputElement>) => void
  onEstadoChange: (e: ChangeEvent<HTMLSelectElement>) => void
  onLimpiar: () => void
}

const OPCIONES_ESTADO: { valor: FiltroEstado; texto: string }[] = [
  { valor: 'Todos', texto: 'Todos' },
  { valor: 'activo', texto: 'Activo' },
  { valor: 'inactivo', texto: 'Inactivo' },
  { valor: 'en_espera', texto: 'En espera' },
]

export default function FiltrosPacientes({
  busqueda,
  estadoFiltro,
  onBusquedaChange,
  onEstadoChange,
  onLimpiar,
}: FiltrosPacientesProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="md:flex-1">
        <BuscadorPacientes value={busqueda} onChange={onBusquedaChange} />
      </div>
      <select
        value={estadoFiltro}
        onChange={onEstadoChange}
        className="rounded-xl bg-slate-100 px-4 py-2 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-200"
      >
        {OPCIONES_ESTADO.map(op => (
          <option key={op.valor} value={op.valor}>
            {op.texto}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={onLimpiar}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Limpiar filtros
      </button>
    </div>
  )
}