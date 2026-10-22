import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/axios'
import type { Metrica } from '../types'
import type { CitaApi, MedicoApi, PacienteApi } from '../types/api'
import MetricCard from '../components/MetricCard'
import StatusBadge from '../components/StatusBadge'

// Mientras el valor es null (todavía cargando) mostramos "…"
const mostrar = (valor: number | null): number | string => valor ?? '…'

export default function PaginaDashboard() {
  // Métricas reales (null = todavía no llegaron)
  const [totalPacientes, setTotalPacientes] = useState<number | null>(null)
  const [totalMedicos, setTotalMedicos] = useState<number | null>(null)
  const [citasProgramadas, setCitasProgramadas] = useState<number | null>(null)
  const [citasCompletadas, setCitasCompletadas] = useState<number | null>(null)
  const [error, setError] = useState(false)

  // Estado del modo mantenimiento
  const [mantenimiento, setMantenimiento] = useState<boolean>(false)

  const navigate = useNavigate()

  useEffect(() => {
    // Nuestro backend devuelve arrays planos, por eso usamos .length en vez de .total
    api.get<PacienteApi[]>('/patients')
      .then((res) => setTotalPacientes(res.data.length))
      .catch(() => setError(true))

    api.get<MedicoApi[]>('/doctors')
      .then((res) => setTotalMedicos(res.data.length))
      .catch(() => setError(true))

    api.get<CitaApi[]>('/appointments', { params: { estado: 'PROGRAMADA' } })
      .then((res) => setCitasProgramadas(res.data.length))
      .catch(() => setError(true))

    api.get<CitaApi[]>('/appointments', { params: { estado: 'COMPLETADA' } })
      .then((res) => setCitasCompletadas(res.data.length))
      .catch(() => setError(true))
  }, [])

  const toggleMantenimiento = () => setMantenimiento(prev => !prev)

  const metricas: Metrica[] = [
    { id: 'pacientes', titulo: 'Pacientes', valor: mostrar(totalPacientes), descripcion: 'Registrados en el sistema', tendencia: 'positiva', icono: '🧑‍⚕️' },
    { id: 'medicos', titulo: 'Médicos', valor: mostrar(totalMedicos), descripcion: 'Staff de la clínica', tendencia: 'neutra', icono: '🩺' },
    { id: 'programadas', titulo: 'Citas Programadas', valor: mostrar(citasProgramadas), descripcion: 'Pendientes de atención', tendencia: 'neutra', icono: '📅' },
    { id: 'completadas', titulo: 'Citas Completadas', valor: mostrar(citasCompletadas), descripcion: 'Consultas finalizadas', tendencia: 'positiva', icono: '✅' },
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
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge activo={!mantenimiento} />
            <button
              onClick={() => navigate('/pacientes')}
              className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-600"
            >
              Ver Pacientes
            </button>
            <button
              onClick={toggleMantenimiento}
              className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
            >
              {mantenimiento ? 'Desactivar mantenimiento' : 'Activar mantenimiento'}
            </button>
          </div>
        </div>

        {error && (
          <p className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
            No se pudieron cargar algunas métricas. ¿Está corriendo el backend en el puerto 4000?
          </p>
        )}

        {/* Tarjetas */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {metricas.map(m => (
            <MetricCard key={m.id} metrica={m} />
          ))}
        </div>
      </div>
    </main>
  )
}
