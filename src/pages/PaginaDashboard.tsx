import { useState } from 'react'
import type { Metrica } from '../types'
import MetricCard from '../components/MetricCard'
import StatusBadge from '../components/StatusBadge'

export default function PaginaDashboard() {
  // Estado de las métricas
  const [pacientes, setPacientes] = useState(128)
  const [citasHoy] = useState(24)
  const [pendientes] = useState(7)
  const [disponibilidad] = useState('92%')

  // Estado del modo mantenimiento
  const [mantenimiento, setMantenimiento] = useState<boolean>(false)

  // Handlers
  const incrementarPacientes = () => setPacientes(prev => prev + 1)
  const decrementarPacientes = () => setPacientes(prev => (prev > 0 ? prev - 1 : 0))
  const toggleMantenimiento = () => setMantenimiento(prev => !prev)

  // Armamos el array con los valores actuales del estado
  const metricas: Metrica[] = [
    { id: 'pacientes', titulo: 'Pacientes', valor: pacientes, descripcion: '+12 este mes', tendencia: 'positiva', icono: '🧑‍⚕️' },
    { id: 'citas', titulo: 'Citas Hoy', valor: citasHoy, descripcion: 'Igual que ayer', tendencia: 'neutra', icono: '📅' },
    { id: 'pendientes', titulo: 'Consultas Pendientes', valor: pendientes, descripcion: '+3 sin atender', tendencia: 'negativa', icono: '⏳' },
    { id: 'disponibilidad', titulo: 'Disponibilidad', valor: disponibilidad, descripcion: 'Por encima del objetivo', tendencia: 'positiva', icono: '✅' },
  ]

  return (
    <main className="min-h-screen bg-slate-50">
      {/* Banner rojo: solo aparece si mantenimiento es true */}
      {mantenimiento && (
        <div className="bg-rose-600 px-6 py-3 text-center font-medium text-white">
          ⚠️ El sistema está en modo mantenimiento
        </div>
      )}

      <div className="mx-auto max-w-6xl p-6">
        {/* Encabezado */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Clínica Salud Integral</h1>
            <p className="text-slate-500">Panel general</p>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge activo={!mantenimiento} />
            <button
              onClick={toggleMantenimiento}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              {mantenimiento ? 'Desactivar mantenimiento' : 'Activar mantenimiento'}
            </button>
          </div>
        </div>

        {/* Tarjetas */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metricas.map(m => (
            <MetricCard key={m.id} metrica={m} />
          ))}
        </div>

        {/* Botones de pacientes */}
        <div className="mt-6 flex items-center gap-3">
          <span className="text-sm text-slate-600">Pacientes:</span>
          <button
            onClick={decrementarPacientes}
            className="h-10 w-10 rounded-lg bg-rose-100 text-xl font-bold text-rose-700 hover:bg-rose-200"
          >
            −
          </button>
          <button
            onClick={incrementarPacientes}
            className="h-10 w-10 rounded-lg bg-emerald-100 text-xl font-bold text-emerald-700 hover:bg-emerald-200"
          >
            +
          </button>
        </div>
      </div>
    </main>
  )
}