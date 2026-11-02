// Mismo alto y forma que <MetricCard />
export default function SkeletonMetricCard() {
  return (
    <div className="animate-pulse rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="h-4 w-24 rounded bg-slate-200" />
        <div className="h-7 w-7 rounded-full bg-slate-200" />
      </div>
      <div className="mt-3 h-8 w-16 rounded bg-slate-200" />
      <div className="mt-2 h-3 w-32 rounded bg-slate-100" />
    </div>
  )
}
