import type { ReactNode } from 'react'

export type TipoAlerta = 'info' | 'exito' | 'advertencia' | 'error'

interface AlertaBannerProps {
  tipo: TipoAlerta
  mensaje: string
  titulo?: string
  accion?: ReactNode
}

const estilos: Record<TipoAlerta, { clases: string; icono: string }> = {
  info: { clases: 'border-sky-200 bg-sky-50 text-sky-800', icono: 'info' },
  exito: { clases: 'border-emerald-200 bg-emerald-50 text-emerald-800', icono: 'check_circle' },
  advertencia: { clases: 'border-amber-200 bg-amber-50 text-amber-800', icono: 'warning' },
  error: { clases: 'border-rose-200 bg-rose-50 text-rose-800', icono: 'error' },
}

export default function AlertaBanner({ tipo, mensaje, titulo, accion }: AlertaBannerProps) {
  const { clases, icono } = estilos[tipo]

  return (
    <div role="alert" className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${clases}`}>
      <span className="material-symbols-outlined text-[20px]">{icono}</span>
      <div className="flex-1">
        {titulo && <p className="font-semibold">{titulo}</p>}
        <p>{mensaje}</p>
      </div>
      {accion}
    </div>
  )
}
