import { useCallback, useEffect } from 'react'
import { useCitasStore } from '../../../stores/citasStore'

interface OpcionesUseCitas {
  // Si viene, carga solo el historial de ese paciente; si no, todas las citas
  pacienteId?: number
}

export function useCitas({ pacienteId }: OpcionesUseCitas = {}) {
  const citas = useCitasStore(s => s.citas)
  const citaSeleccionada = useCitasStore(s => s.citaSeleccionada)
  const cargando = useCitasStore(s => s.cargando)
  const error = useCitasStore(s => s.error)
  const cargar = useCitasStore(s => s.cargar)
  const cargarPorPaciente = useCitasStore(s => s.cargarPorPaciente)
  const seleccionar = useCitasStore(s => s.seleccionar)
  const actualizarEstado = useCitasStore(s => s.actualizarEstado)
  const agregarCita = useCitasStore(s => s.agregarCita)

  const recargar = useCallback(() => {
    if (pacienteId !== undefined) return cargarPorPaciente(pacienteId)
    return cargar()
  }, [pacienteId, cargar, cargarPorPaciente])

  // Carga inicial
  useEffect(() => {
    recargar()
  }, [recargar])

  return { citas, citaSeleccionada, cargando, error, recargar, seleccionar, actualizarEstado, agregarCita }
}
