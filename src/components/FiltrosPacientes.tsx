import type { ChangeEvent } from 'react'
import type { FiltroEstado } from '../types/paciente'
import { useFiltrosStore } from '../stores/filtrosStore'
import BuscadorPacientes from './BuscadorPacientes'

const OPCIONES_ESTADO: { valor: FiltroEstado; texto: string }[] = [
  { valor: 'Todos', texto: 'Todos' },
  { valor: 'activo', texto: 'Activo' },
  { valor: 'inactivo', texto: 'Inactivo' },
  { valor: 'en_espera', texto: 'En espera' },
]

interface FiltrosPacientesProps {
  buscando: boolean
}

// Lee y escribe los filtros directo en el store (filtrosStore)
export default function FiltrosPacientes({ buscando }: FiltrosPacientesProps) {
  const busqueda = useFiltrosStore(s => s.queryPacientes)
  const estadoFiltro = useFiltrosStore(s => s.estadoPacienteFiltro)
  const setQueryPacientes = useFiltrosStore(s => s.setQueryPacientes)
  const setEstadoPaciente = useFiltrosStore(s => s.setEstadoPaciente)
  const resetFiltros = useFiltrosStore(s => s.resetFiltros)

  const handleBusquedaChange = (e: ChangeEvent<HTMLInputElement>) => setQueryPacientes(e.target.value)
  const handleEstadoChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setEstadoPaciente(e.target.value as FiltroEstado)

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center">
      <div className="md:flex-1">
        <BuscadorPacientes value={busqueda} onChange={handleBusquedaChange} buscando={buscando} />
      </div>
      <select
        value={estadoFiltro}
        onChange={handleEstadoChange}
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
        onClick={resetFiltros}
        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
      >
        Limpiar filtros
      </button>
    </div>
  )
}
