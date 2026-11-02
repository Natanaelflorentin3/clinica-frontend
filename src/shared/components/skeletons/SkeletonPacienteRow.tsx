// Mismo alto y forma que <PacienteCard />
export default function SkeletonPacienteRow() {
  return (
    <div className="flex animate-pulse flex-col gap-4 rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-slate-200" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-2/3 rounded bg-slate-200" />
          <div className="h-3 w-1/4 rounded bg-slate-100" />
        </div>
      </div>
      <div className="h-6 w-28 rounded-lg bg-slate-100" />
      <div className="space-y-2">
        <div className="h-3 w-3/4 rounded bg-slate-100" />
        <div className="h-3 w-1/2 rounded bg-slate-100" />
        <div className="h-3 w-2/3 rounded bg-slate-100" />
      </div>
      <div className="h-8 rounded bg-slate-100" />
    </div>
  )
}
