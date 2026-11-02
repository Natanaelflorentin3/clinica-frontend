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
import { usePacientesStore } from '../stores/pacientesStore'
import { useFiltrosStore } from '../stores/filtrosStore'
import { useDebounce } from '../hooks/useDebounce'
import PacienteCard from '../components/PacienteCard'
import FiltrosPacientes from '../components/FiltrosPacientes'
import FormularioPaciente from '../components/FormularioPaciente'
import SkeletonPacienteRow from '../shared/components/skeletons/SkeletonPacienteRow'
import AlertaBanner from '../shared/components/ui/AlertaBanner'
import EstadoVacio from '../shared/components/ui/EstadoVacio'

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

  // Estado de UI local: mostrar u ocultar el formulario de alta
  const [abrirFormulario, setAbrirFormulario] = useState(false)

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

  // Sin búsqueda ni filtro activo = la clínica no tiene pacientes todavía
  const sinFiltros = queryDebounced === '' && estadoFiltro === 'Todos'

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        {/* Encabezado */}
        <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-bold tracking-tight text-slate-800">Pacientes</h1>
              <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                {total} paciente{total === 1 ? '' : 's'} registrado{total === 1 ? '' : 's'}
              </span>
            </div>
            <p className="mt-1 text-slate-500">Gestión y seguimiento de pacientes de Clínica Salud Integral</p>
          </div>
          <button
            type="button"
            onClick={() => setAbrirFormulario(abierto => !abierto)}
            className="rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
          >
            {abrirFormulario ? 'Cerrar formulario' : '+ Nuevo paciente'}
          </button>
        </div>

        {/* Formulario: crea directo con el store */}
        {abrirFormulario && (
          <div className="mb-6 rounded-xl bg-white p-4 shadow-sm md:p-6">
            <FormularioPaciente />
          </div>
        )}

        {/* Filtros: leen y escriben en useFiltrosStore */}
        <div className="mb-4 rounded-xl bg-white p-4 shadow-sm">
          <FiltrosPacientes buscando={buscando} />
        </div>

        {error ? (
          /* ---- Error ---- */
          <AlertaBanner
            tipo="error"
            titulo="No se pudieron cargar los pacientes"
            mensaje={error}
            accion={
              <button
                type="button"
                onClick={() => cargar(queryDebounced)}
                className="rounded-lg bg-white px-3 py-1 text-sm font-semibold text-rose-700 shadow-sm hover:bg-rose-100"
              >
                Reintentar
              </button>
            }
          />
        ) : cargando && pacientes.length === 0 ? (
          /* ---- Primera carga: skeletons con la forma de las cards ---- */
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }, (_, i) => (
              <SkeletonPacienteRow key={i} />
            ))}
          </div>
        ) : cantidad === 0 ? (
          /* ---- Lista vacía ---- */
          sinFiltros ? (
            <EstadoVacio
              icono="person_add"
              titulo="No hay pacientes registrados"
              descripcion="Cuando registres el primer paciente va a aparecer acá."
              accion={{ label: 'Agregar paciente', onClick: () => setAbrirFormulario(true) }}
            />
          ) : (
            <EstadoVacio
              icono="search_off"
              titulo="Ningún paciente coincide con la búsqueda"
              descripcion="Probá con otro nombre o limpiá los filtros."
              accion={{ label: 'Limpiar filtros', onClick: resetFiltros }}
            />
          )
        ) : (
          /* ---- Resultados ---- */
          <>
            <p className="mb-4 text-sm text-slate-500">
              {cantidad} paciente{cantidad === 1 ? '' : 's'} encontrado{cantidad === 1 ? '' : 's'}
              {queryDebounced && <> para “{queryDebounced}”</>}
            </p>
            <div
              className={`flex flex-col gap-4 transition-opacity md:grid md:grid-cols-2 lg:grid-cols-3 ${
                buscando ? 'opacity-60' : ''
              }`}
            >
              {pacientesFiltrados.map(p => (
                <PacienteCard key={p.id} paciente={p} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
