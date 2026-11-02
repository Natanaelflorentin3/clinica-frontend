// Mismo alto que una fila de cita (76px) → no hay "salto" cuando llegan los datos
export default function SkeletonCitaRow() {
  return (
    <li className="flex h-[76px] animate-pulse items-center justify-between gap-4 rounded-xl bg-white px-5 shadow-sm">
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/3 rounded bg-slate-200" />
        <div className="h-3 w-1/2 rounded bg-slate-100" />
      </div>
      <div className="h-6 w-24 rounded-full bg-slate-200" />
    </li>
  )
}
