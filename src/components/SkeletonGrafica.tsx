// Placeholder mientras carga una gráfica
export default function SkeletonGrafica() {
  return (
    <div className="animate-pulse" aria-label="Cargando gráfica">
      <div className="mb-4 h-4 w-1/3 rounded bg-slate-200" />
      <div className="flex h-[300px] items-end gap-3">
        {[40, 70, 55, 85, 30, 65, 50].map((alto, i) => (
          <div key={i} className="flex-1 rounded-t bg-slate-200" style={{ height: `${alto}%` }} />
        ))}
      </div>
    </div>
  )
}
