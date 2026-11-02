import { useCallback, useEffect } from 'react'
import { usePacientesStore } from '../../../stores/pacientesStore'

// Solo las acciones (sin carga): para componentes como la card o el formulario
export function usePacientesAcciones() {
  const crear = usePacientesStore(s => s.crear)
  const actualizar = usePacientesStore(s => s.actualizar)
  const eliminar = usePacientesStore(s => s.eliminar)
  const cambiarEstado = usePacientesStore(s => s.cambiarEstado)

  return { crear, actualizar, eliminar, cambiarEstado }
}

// Todo lo que una página necesita de los pacientes: datos, carga inicial y acciones.
// La página ya no sabe que existe Zustand.
export function usePacientes(query: string = '') {
  const pacientes = usePacientesStore(s => s.pacientes)
  const total = usePacientesStore(s => s.total)
  const cargando = usePacientesStore(s => s.cargando)
  const error = usePacientesStore(s => s.error)
  const cargar = usePacientesStore(s => s.cargar)
  const acciones = usePacientesAcciones()

  // Carga inicial (y cada vez que cambia la búsqueda)
  useEffect(() => {
    cargar(query)
  }, [cargar, query])

  const recargar = useCallback(() => cargar(query), [cargar, query])

  return { pacientes, total, cargando, error, recargar, ...acciones }
}
