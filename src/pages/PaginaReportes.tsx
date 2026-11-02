import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useApi } from '../hooks/useApi'
import type { CitaConDetalle, ReporteEspecialidadApi } from '../types/api'
import SkeletonGrafica from '../components/SkeletonGrafica'

interface DatoEspecialidad {
  especialidad: string
  total: number
}

interface DatoDia {
  dia: string
  total: number
}

// "CLINICA_GENERAL" → "Clínica general"
const NOMBRES_ESPECIALIDAD: Record<string, string> = {
  CARDIOLOGIA: 'Cardiología',
  PEDIATRIA: 'Pediatría',
  TRAUMATOLOGIA: 'Traumatología',
  DERMATOLOGIA: 'Dermatología',
  CLINICA_GENERAL: 'Clínica general',
}

// Fecha ISO → clave "YYYY-MM-DD" en hora local
const claveDia = (fechaIso: string): string => {
  const d = new Date(fechaIso)
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().split('T')[0]
}

// "2026-10-26" → "26/10"
const etiquetaDia = (clave: string): string => {
  const [, mes, dia] = clave.split('-')
  return `${dia}/${mes}`
}

// Transformación: citas sueltas → cantidad por día, los últimos 7 días que tienen citas
const agruparPorDia = (citas: CitaConDetalle[]): DatoDia[] => {
  const conteo: Record<string, number> = {}
  for (const cita of citas) {
    const clave = claveDia(cita.fecha)
    conteo[clave] = (conteo[clave] ?? 0) + 1
  }
  return Object.keys(conteo)
    .sort()
    .slice(-7)
    .map(clave => ({ dia: etiquetaDia(clave), total: conteo[clave] }))
}

function EstadoVacio({ mensaje }: { mensaje: string }) {
  return (
    <div className="flex h-[300px] flex-col items-center justify-center gap-2 text-slate-400">
      <span className="material-symbols-outlined text-[40px]">bar_chart_off</span>
      <p className="text-sm">{mensaje}</p>
    </div>
  )
}

function EstadoError({ mensaje, onReintentar }: { mensaje: string; onReintentar: () => void }) {
  return (
    <div className="flex h-[300px] flex-col items-center justify-center gap-2 text-center">
      <p className="text-sm text-rose-600">{mensaje}</p>
      <button
        type="button"
        onClick={onReintentar}
        className="rounded-lg bg-emerald-700 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-600"
      >
        Reintentar
      </button>
    </div>
  )
}

export default function PaginaReportes() {
  // Datos reales de la API con el hook genérico useApi<T>
  const especialidades = useApi<ReporteEspecialidadApi[]>('/reports/appointments-by-specialty')
  const citas = useApi<CitaConDetalle[]>('/appointments')

  // Transformaciones para las gráficas
  const datosEspecialidades: DatoEspecialidad[] = (especialidades.data ?? []).map(r => ({
    especialidad: NOMBRES_ESPECIALIDAD[r.especialidad] ?? r.especialidad,
    total: r.total_citas,
  }))
  const datosPorDia = agruparPorDia(citas.data ?? [])

  return (
    <main className="mx-auto max-w-6xl p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">Reportes</h1>
        <p className="mt-1 text-slate-500">Volumen de citas de la clínica</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* BarChart: citas por especialidad */}
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-800">Citas por especialidad</h2>
          {especialidades.cargando ? (
            <SkeletonGrafica />
          ) : especialidades.error ? (
            <EstadoError mensaje={especialidades.error} onReintentar={especialidades.recargar} />
          ) : datosEspecialidades.length === 0 ? (
            <EstadoVacio mensaje="Todavía no hay citas registradas" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={datosEspecialidades}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="especialidad" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="total" name="Citas" fill="#047857" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </section>

        {/* LineChart: citas por día */}
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 font-semibold text-slate-800">Citas por día (últimos 7 días con citas)</h2>
          {citas.cargando ? (
            <SkeletonGrafica />
          ) : citas.error ? (
            <EstadoError mensaje={citas.error} onReintentar={citas.recargar} />
          ) : datosPorDia.length === 0 ? (
            <EstadoVacio mensaje="Todavía no hay citas registradas" />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={datosPorDia}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="dia" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="total" name="Citas" stroke="#4f46e5" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </section>
      </div>
    </main>
  )
}
