import { useFiltrosStore } from '../../stores/filtrosStore'

export function useFiltrosPacientes() {
  const query = useFiltrosStore(s => s.queryPacientes)
  const estado = useFiltrosStore(s => s.estadoPacienteFiltro)
  const setQuery = useFiltrosStore(s => s.setQueryPacientes)
  const setEstado = useFiltrosStore(s => s.setEstadoPaciente)
  const resetFiltros = useFiltrosStore(s => s.resetFiltros)

  return { query, estado, setQuery, setEstado, resetFiltros }
}

export function useFiltrosCitas() {
  const estado = useFiltrosStore(s => s.estadoCitaFiltro)
  const especialidad = useFiltrosStore(s => s.especialidadFiltro)
  const setEstado = useFiltrosStore(s => s.setEstadoCita)
  const setEspecialidad = useFiltrosStore(s => s.setEspecialidad)

  return { estado, especialidad, setEstado, setEspecialidad }
}
