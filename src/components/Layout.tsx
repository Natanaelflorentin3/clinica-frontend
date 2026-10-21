import { NavLink, Outlet } from 'react-router-dom'

const LINKS = [
  { to: '/', texto: 'Dashboard', icono: 'dashboard' },
  { to: '/pacientes', texto: 'Pacientes', icono: 'personal_injury' },
  { to: '/citas/nueva', texto: 'Nueva cita', icono: 'calendar_month' },
]

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      {/* Sidebar: barra arriba en móvil, fija a la izquierda en desktop */}
      <aside className="border-b border-slate-200 bg-white md:fixed md:inset-y-0 md:left-0 md:w-64 md:border-b-0 md:border-r">
        <div className="flex items-center gap-2 px-6 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-700 text-white">
            <span className="material-symbols-outlined text-[20px]">local_hospital</span>
          </div>
          <div>
            <p className="font-semibold leading-none text-slate-800">Salud Integral</p>
            <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Clínica médica</p>
          </div>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-0">
          {LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                  isActive ? 'bg-emerald-700 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`
              }
            >
              <span className="material-symbols-outlined text-[20px]">{link.icono}</span>
              {link.texto}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Acá React Router pone la página de la ruta activa */}
      <div className="flex-1 md:ml-64">
        <Outlet />
      </div>
    </div>
  )
}