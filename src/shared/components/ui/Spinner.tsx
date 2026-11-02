interface SpinnerProps {
  fullscreen?: boolean
  texto?: string
}

// Spinner chico e inline por defecto; con `fullscreen` ocupa toda la pantalla y queda centrado
export default function Spinner({ fullscreen = false, texto }: SpinnerProps) {
  if (fullscreen) {
    return (
      <div className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-3 bg-slate-50/80">
        <span className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-700" />
        {texto && <p className="text-sm text-slate-500">{texto}</p>}
      </div>
    )
  }

  return (
    <span
      role="status"
      aria-label={texto ?? 'Cargando'}
      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-700"
    />
  )
}
