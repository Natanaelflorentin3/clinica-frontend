interface BuscadorPacientesProps {
  value: string
  onChange: (value: string) => void
}

export default function BuscadorPacientes({ value, onChange }: BuscadorPacientesProps) {
  return (
    <div className="relative w-full md:max-w-lg">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[20px] text-slate-400">
        search
      </span>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="Buscar por nombre, apellido o ID..."
        className="w-full rounded-xl bg-slate-100 py-2 pl-10 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200"
      />
    </div>
  )
}