// Problemas encontrados en el código generado por la IA (Stitch):
// 1. No es React ni TypeScript: es HTML + JavaScript que manipula el DOM a mano
//    (innerHTML, getElementById, classList) en vez de usar componentes y estado.
// 2. Todo está en un solo archivo de ~730 líneas: sidebar, header, cards, tabla,
//    modal y lógica mezclados, sin separar responsabilidades.
// 3. Datos hardcodeados en el HTML: "1,248", "5 pacientes registrados" y
//    "Activos (3)" están escritos a mano en vez de calcularse desde los datos.
// 4. No es responsive: el sidebar fijo (w-64) y el pl-64 del contenido rompen
//    el layout en pantallas de celular.

import { useEffect } from 'react'
import { usePacientesStore } from '../stores/pacientesStore'
import { useFiltrosStore } from '../stores/filtrosStore'
import { useDebounce } from '../hooks/useDebounce'
import PacienteCard from '../components/PacienteCard'
import FiltrosPacientes from '../components/FiltrosPacientes'
import FormularioPaciente from '../components/FormularioPaciente'

export default function PaginaPacientes() {
  // Datos de la API: vienen del store (un selector por campo)
  const pacientes = usePacientesStore(s => s.pacientes)
  const total = usePacientesStore(s => s.total)
  const cargando = usePacientesStore(s => s.cargando)
  const error = usePacientesStore(s => s.error)
  const cargar = usePacientesStore(s => s.cargar)

  // Filtros: viven en su propio store, por eso NO se pierden al cambiar de ruta
  const query = useFiltrosStore(s => s.queryPacientes)
  const estadoFiltro = useFiltrosStore(s => s.estadoPacienteFiltro)
  const resetFiltros = useFiltrosStore(s => s.resetFiltros)

  // El valor viene del store, pero al hook no le importa: espera 350ms sin cambios
  const queryDebounced = useDebounce(query, 350)

  // Una sola petición, 350ms después de la última tecla (query vacía = todos los pacientes)
  useEffect(() => {
    cargar(queryDebounced)
  }, [queryDebounced, cargar])

  // Mostramos el spinner mientras el usuario escribe o mientras llega la respuesta
  const buscando = cargando || query !== queryDebounced

  // La búsqueda por texto la hace el backend; el filtro de estado es local
  const pacientesFiltrados = pacientes.filter(
    p => estadoFiltro === 'Todos' || p.estado === estadoFiltro
  )
  const cantidad = pacientesFiltrados.length

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

        {/* Formulario: crea directo con el store */}
        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm md:p-6">
          <FormularioPaciente />
        </div>

        {/* Filtros: leen y escriben en useFiltrosStore */}
        <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
          <FiltrosPacientes buscando={buscando} />
        </div>

        {/* ---- Error ---- */}
        {error ? (
          <div className="flex flex-col items-center gap-3 rounded-xl bg-white p-8 text-center shadow-sm">
            <p className="text-5xl">⚠️</p>
            <p className="font-semibold text-slate-800">No se pudieron cargar los pacientes</p>
            <p className="text-sm text-slate-500">{error}</p>
            <button
              type="button"
              onClick={() => cargar(queryDebounced)}
              className="mt-2 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
            >
              Reintentar
            </button>
          </div>
        ) : cargando && pacientes.length === 0 ? (
          /* ---- Primera carga ---- */
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-slate-500">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700" />
            <p>Cargando pacientes...</p>
          </div>
        ) : (
          /* ---- Resultados ---- */
          <>
            <p className="mb-4 text-sm text-slate-500">
              {cantidad} paciente{cantidad === 1 ? '' : 's'} encontrado{cantidad === 1 ? '' : 's'}
              {queryDebounced && <> para “{queryDebounced}”</>}
            </p>

            {cantidad > 0 ? (
              <div
                className={`flex flex-col gap-4 transition-opacity md:grid md:grid-cols-2 lg:grid-cols-3 ${
                  buscando ? 'opacity-60' : ''
                }`}
              >
                {pacientesFiltrados.map(p => (
                  <PacienteCard key={p.id} paciente={p} />
                ))}
              </div>
            ) : (
              <div className="rounded-xl bg-white p-8 text-center shadow-sm">
                <p className="text-slate-500">No hay pacientes que coincidan con los filtros.</p>
                <button
                  type="button"
                  onClick={resetFiltros}
                  className="mt-3 text-sm font-semibold text-emerald-700 hover:text-emerald-600"
                >
                  Limpiar filtros
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  )
}
