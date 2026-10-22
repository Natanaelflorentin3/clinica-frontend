// Problemas encontrados en el código generado por la IA (Stitch):
// 1. No es React ni TypeScript: es HTML + JavaScript que manipula el DOM a mano
//    (innerHTML, getElementById, classList) en vez de usar componentes y estado.
// 2. Todo está en un solo archivo de ~730 líneas: sidebar, header, cards, tabla,
//    modal y lógica mezclados, sin separar responsabilidades.
// 3. Datos hardcodeados en el HTML: "1,248", "5 pacientes registrados" y
//    "Activos (3)" están escritos a mano en vez de calcularse desde los datos.
// 4. No es responsive: el sidebar fijo (w-64) y el pl-64 del contenido rompen
//    el layout en pantallas de celular.

import { useEffect, useState } from 'react'
import type { ChangeEvent } from 'react'
import toast from 'react-hot-toast'
import { api } from '../lib/axios'
import { extraerMensajeError } from '../lib/errorHandler'
import * as pacientesService from '../services/pacientes'
import type { EstadoPaciente, FiltroEstado, Paciente } from '../types/paciente'
import type { PacienteApi } from '../types/api'
import PacienteCard from '../components/PacienteCard'
import FiltrosPacientes from '../components/FiltrosPacientes'
import FormularioPaciente from '../components/FormularioPaciente'
import ModalConfirmacion from '../components/ModalConfirmacion'

// Convierte el paciente que manda el backend al formato que usan nuestros componentes.
// El backend todavía no tiene estado, especialidad ni última cita: usamos valores por defecto.
const mapearPaciente = (p: PacienteApi): Paciente => ({
  id: String(p.id),
  nombre: p.nombre,
  apellido: p.apellido,
  email: p.email,
  telefono: p.telefono,
  especialidadAsignada: 'Sin asignar',
  ultimaCita: 'Sin citas',
  estado: 'activo',
})

export default function PaginaPacientes() {
  // Estado de los datos y de la petición
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)

  // Estado de los filtros
  const [busqueda, setBusqueda] = useState('')
  const [estadoFiltro, setEstadoFiltro] = useState<FiltroEstado>('Todos')

  // Estado del modal de eliminación
  const [pacienteAEliminar, setPacienteAEliminar] = useState<Paciente | null>(null)
  const [eliminando, setEliminando] = useState(false)

  const cargarPacientes = () => {
    setCargando(true)
    setError(false)
    api.get<PacienteApi[]>('/patients')
      .then((res) => setPacientes(res.data.map(mapearPaciente)))
      .catch(() => setError(true))
      .finally(() => setCargando(false))
  }

  useEffect(cargarPacientes, [])

  // Handlers de filtros
  const handleBusquedaChange = (e: ChangeEvent<HTMLInputElement>) => setBusqueda(e.target.value)
  const handleEstadoFiltroChange = (e: ChangeEvent<HTMLSelectElement>) =>
    setEstadoFiltro(e.target.value as FiltroEstado)
  const limpiarFiltros = () => {
    setBusqueda('')
    setEstadoFiltro('Todos')
  }

  // CREAR: el formulario ya hizo el POST; acá solo lo sumamos al estado local
  const handlePacienteCreado = (nuevo: PacienteApi) => {
    setPacientes(prev => [...prev, mapearPaciente(nuevo)])
  }

  // Cambio de estado: el backend todavía no guarda estado de paciente, queda local
  const cambiarEstado = (id: string, estado: EstadoPaciente) => {
    setPacientes(prev => prev.map(p => (p.id === id ? { ...p, estado } : p)))
  }

  // ELIMINAR: 1) abre el modal  2) si confirma, DELETE real
  const pedirEliminacion = (id: string) => {
    setPacienteAEliminar(pacientes.find(p => p.id === id) ?? null)
  }

  const confirmarEliminacion = async () => {
    if (!pacienteAEliminar) return
    const id = pacienteAEliminar.id

    setEliminando(true)
    try {
      await pacientesService.remove(Number(id))
      setPacientes(prev => prev.filter(p => p.id !== id))
      toast.success('Paciente eliminado')
      setPacienteAEliminar(null)
    } catch (err) {
      toast.error(extraerMensajeError(err))
    } finally {
      setEliminando(false)
    }
  }

  // Filtros combinados: se calculan en cada render, no se guardan en el estado
  const texto = busqueda.trim().toLowerCase()
  const pacientesFiltrados = pacientes.filter(
    p =>
      `${p.nombre} ${p.apellido}`.toLowerCase().includes(texto) &&
      (estadoFiltro === 'Todos' || p.estado === estadoFiltro)
  )
  const cantidad = pacientesFiltrados.length
  const total = pacientes.length

  // ---- Cargando ----
  if (cargando) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-slate-500">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700" />
        <p>Cargando pacientes...</p>
      </main>
    )
  }

  // ---- Error ----
  if (error) {
    return (
      <main className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-8 text-center">
        <p className="text-5xl">⚠️</p>
        <p className="font-semibold text-slate-800">No se pudieron cargar los pacientes</p>
        <p className="text-sm text-slate-500">Revisá que el backend esté corriendo e intentá de nuevo.</p>
        <button
          type="button"
          onClick={cargarPacientes}
          className="mt-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          Reintentar
        </button>
      </main>
    )
  }

  // ---- Éxito ----
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        {/* Encabezado */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">Pacientes</h1>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              {total} paciente{total === 1 ? '' : 's'} registrado{total === 1 ? '' : 's'}
            </span>
          </div>
          <p className="mt-1 text-slate-500">Gestión y seguimiento de pacientes de Clínica Salud Integral</p>
        </div>

        {/* Formulario (POST real) */}
        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm md:p-6">
          <FormularioPaciente onCreado={handlePacienteCreado} />
        </div>

        {/* Filtros */}
        <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
          <FiltrosPacientes
            busqueda={busqueda}
            estadoFiltro={estadoFiltro}
            onBusquedaChange={handleBusquedaChange}
            onEstadoChange={handleEstadoFiltroChange}
            onLimpiar={limpiarFiltros}
          />
        </div>

        <p className="mb-4 text-sm text-slate-500">
          {cantidad} paciente{cantidad === 1 ? '' : 's'} encontrado{cantidad === 1 ? '' : 's'}
        </p>

        {/* Lista: columna en móvil, grilla en desktop */}
        {cantidad > 0 ? (
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
            {pacientesFiltrados.map(p => (
              <PacienteCard
                key={p.id}
                paciente={p}
                onCambiarEstado={cambiarEstado}
                onEliminar={pedirEliminacion}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-slate-500">No hay pacientes que coincidan con los filtros.</p>
            <button
              type="button"
              onClick={limpiarFiltros}
              className="mt-3 text-sm font-semibold text-emerald-700 hover:text-emerald-600"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {/* Modal de confirmación para eliminar */}
      <ModalConfirmacion
        abierto={pacienteAEliminar !== null}
        titulo="Eliminar paciente"
        mensaje={`¿Seguro que querés eliminar a ${pacienteAEliminar?.nombre ?? ''} ${pacienteAEliminar?.apellido ?? ''}? Esta acción no se puede deshacer.`}
        cargando={eliminando}
        onConfirmar={confirmarEliminacion}
        onCancelar={() => setPacienteAEliminar(null)}
      />
    </main>
  )
}
