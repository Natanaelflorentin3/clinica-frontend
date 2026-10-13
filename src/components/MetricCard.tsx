import type { Metrica, Tendencia } from '../types'

interface MetricCardProps {
  metrica: Metrica
}

const colorPorTendencia: Record<Tendencia, string> = {
  positiva: 'text-emerald-600',
  negativa: 'text-rose-600',
  neutra: 'text-slate-600',
}

export default function MetricCard({ metrica }: MetricCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-slate-500">{metrica.titulo}</h3>
        <span className="text-2xl">{metrica.icono}</span>
      </div>
      <p className="mt-2 text-3xl font-bold text-slate-800">{metrica.valor}</p>
      <p className={`mt-1 text-sm ${colorPorTendencia[metrica.tendencia]}`}>
        {metrica.descripcion}
      </p>
    </div>
  )
}