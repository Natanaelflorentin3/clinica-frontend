// Problemas encontrados en el código generado por la IA (Stitch):
// 1. No es React ni TypeScript: es HTML + JavaScript que manipula el DOM a mano
//    (innerHTML, getElementById, classList) en vez de usar componentes y estado.
// 2. Todo está en un solo archivo de ~730 líneas: sidebar, header, cards, tabla,
//    modal y lógica mezclados, sin separar responsabilidades.
// 3. Datos hardcodeados en el HTML: "1,248", "5 pacientes registrados" y
//    "Activos (3)" están escritos a mano en vez de calcularse desde los datos.
// 4. No es responsive: el sidebar fijo (w-64) y el pl-64 del contenido rompen
//    el layout en pantallas de celular.

import { useState } from 'react'
import { PACIENTES } from '../data/pacientes'
import PacienteCard from '../components/PacienteCard'
import BuscadorPacientes from '../components/BuscadorPacientes'

export default function PaginaPacientes() {
  const [busqueda, setBusqueda] = useState('')

  const texto = busqueda.trim().toLowerCase()
  const pacientesFiltrados = PACIENTES.filter(p =>
    `${p.nombre} ${p.apellido} ${p.id}`.toLowerCase().includes(texto)
  )

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-6xl p-4 md:p-8">
        {/* Encabezado */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight text-slate-800">Pacientes</h1>
            <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
              {pacientesFiltrados.length} pacientes registrados
            </span>
          </div>
          <p className="mt-1 text-slate-500">Gestión y seguimiento de pacientes de Clínica Salud Integral</p>
        </div>

        {/* Buscador */}
        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
          <BuscadorPacientes value={busqueda} onChange={setBusqueda} />
        </div>

        {/* Móvil: columna | Desktop: grilla */}
        {pacientesFiltrados.length > 0 ? (
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2 lg:grid-cols-3">
            {pacientesFiltrados.map(p => (
              <PacienteCard key={p.id} paciente={p} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl bg-white p-8 text-center text-slate-500 shadow-sm">
            No se encontraron pacientes con "{busqueda}"
          </p>
        )}
      </div>
    </main>
  )
}