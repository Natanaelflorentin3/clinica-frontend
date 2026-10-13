interface StatusBadgeProps {
  activo: boolean
}

export default function StatusBadge({ activo }: StatusBadgeProps) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-sm font-medium ${
        activo ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
      }`}
    >
      {activo ? 'Sistema Operativo' : 'Modo Mantenimiento'}
    </span>
  )
}