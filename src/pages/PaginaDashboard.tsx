import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePacientesStore } from '../stores/pacientesStore'
import { useMedicosStore } from '../stores/medicosStore'
import { useCitasStore } from '../stores/citasStore'
import type { Metrica } from '../types'
import MetricCard from '../components/MetricCard'
import StatusBadge from '../components/StatusBadge'

// Mientras se carga mostramos "…"
const mostrar = (cargando: boolean, valor: number): number | string => (cargando ? '…' : valor)

export default function PaginaDashboard() {
  // Datos de la API: desde los stores
  const pacientes = usePacientesStore(s => s.pacientes)
  const cargandoPacientes = usePacientesStore(s => s.cargando)
  const errorPacientes = usePacientesStore(s => s.error)
  const cargarPacientes = usePacientesStore(s => s.cargar)

  const medicos = useMedicosStore(s => s.medicos)
  const cargandoMedicos = useMedicosStore(s => s.cargando)
  const errorMedicos = useMedicosStore(s => s.error)
  const cargarMedicos = useMedicosStore(s => s.cargar)

  const citas = useCitasStore(s => s.citas)
  const cargandoCitas = useCitasStore(s => s.cargando)
  const errorCitas = useCitasStore(s => s.error)
  const cargarCitas = useCitasStore(s => s.cargar)

  // Estado de UI local (no es dato de la API)
  const [mantenimiento, setMantenimiento] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    cargarPacientes()
    cargarMedicos()
    cargarCitas()
  }, [cargarPacientes, cargarMedicos, cargarCitas])

  // Contamos por estado sobre las citas del store (una sola petición en vez de dos)
  const citasProgramadas = citas.filter(c => c.estado === 'PROGRAMADA').length
  const citasCompletadas = citas.filter(c => c.estado === 'COMPLETADA').length
  const error = errorPacientes ?? errorMedicos ?? errorCitas

  const toggleMantenimiento = () => setMantenimiento(prev => !prev)

  const metricas: Metrica[] = [
    { id: 'pacientes', titulo: 'Pacientes', valor: mostrar(cargandoPacientes, pacientes.length), descripcion: 'Registrados en el sistema', tendencia: 'positiva', icono: '🧑‍⚕️' },
    { id: 'medicos', titulo: 'Médicos', valor: mostrar(cargandoMedicos, medicos.length), descripcion: 'Staff de la clínica', tendencia: 'neutra', icono: '🩺' },
    { id: 'programadas', titulo: 'Citas Programadas', valor: mostrar(cargandoCitas, citasProgramadas), descripcion: 'Pendientes de atención', tendencia: 'neutra', icono: '📅' },
    { id: 'completadas', titulo: 'Citas Completadas', valor: mostrar(cargandoCitas, citasCompletadas), descripcion: 'Consultas finalizadas', tendencia: 'positiva', icono: '✅' },
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
