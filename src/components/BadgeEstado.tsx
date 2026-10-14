import type { EstadoPaciente } from '../types/paciente'

interface BadgeEstadoProps {
  estado: EstadoPaciente
}

const configPorEstado: Record<EstadoPaciente, { texto: string; clases: string; punto: string }> = {
  activo: { texto: 'Activo', clases: 'bg-emerald-50 text-emerald-700', punto: 'bg-emerald-500' },
  en_espera: { texto: 'En espera', clases: 'bg-amber-100 text-amber-700', punto: 'bg-amber-500' },
  inactivo: { texto: 'Inactivo', clases: 'bg-slate-100 text-slate-500', punto: 'bg-slate-400' },
}

export default function BadgeEstado({ estado }: BadgeEstadoProps) {
  const { texto, clases, punto } = configPorEstado[estado]
  return (
    <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ${clases}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${punto}`} />
      {texto}
    </span>
  )
}