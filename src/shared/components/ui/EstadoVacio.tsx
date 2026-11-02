interface EstadoVacioProps {
  titulo: string
  descripcion?: string
  icono?: string
  accion?: {
    label: string
    onClick: () => void
  }
}

// "Todavía no hay datos" — para que una lista vacía no parezca un error de carga
export default function EstadoVacio({ titulo, descripcion, icono = 'inbox', accion }: EstadoVacioProps) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-white p-10 text-center shadow-sm">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <span className="material-symbols-outlined text-[28px]">{icono}</span>
      </div>
      <p className="mt-2 font-semibold text-slate-800">{titulo}</p>
      {descripcion && <p className="max-w-sm text-sm text-slate-500">{descripcion}</p>}
      {accion && (
        <button
          type="button"
          onClick={accion.onClick}
          className="mt-3 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
        >
          {accion.label}
        </button>
      )}
    </div>
  )
}
