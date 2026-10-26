import { Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuthStore } from '../stores/authStore'

const LINKS = [
  { to: '/', texto: 'Dashboard', icono: 'dashboard' },
  { to: '/pacientes', texto: 'Pacientes', icono: 'personal_injury' },
  { to: '/citas', texto: 'Citas', icono: 'event_note' },
  { to: '/citas/nueva', texto: 'Nueva cita', icono: 'calendar_month' },
  { to: '/reportes', texto: 'Reportes', icono: 'bar_chart' },
]

export default function Layout() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const usuario = useAuthStore(s => s.usuario)
  const logout = useAuthStore(s => s.logout)
  const navigate = useNavigate()

  // Sin sesión no se ve ninguna pantalla (mañana esto pasa a rutas protegidas por rol)
  if (!isAuthenticated) return <Navigate to="/login" replace />

  const cerrarSesion = () => {
    logout()
    toast.success('Sesión cerrada')
    navigate('/login', { replace: true })
  }

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
              end={link.to === '/' || link.to === '/citas'}
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

        {/* Usuario logueado + cerrar sesión */}
        <div className="border-t border-slate-100 px-6 py-4 md:absolute md:inset-x-0 md:bottom-0">
          <p className="truncate text-sm font-semibold text-slate-800">{usuario?.nombre}</p>
          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">{usuario?.rol}</p>
          <button
            type="button"
            onClick={cerrarSesion}
            className="flex items-center gap-1.5 text-sm font-medium text-rose-600 hover:text-rose-500"
          >
            <span className="material-symbols-outlined text-[18px]">logout</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Acá React Router pone la página de la ruta activa */}
      <div className="flex-1 md:ml-64">
        <Outlet />
      </div>
    </div>
  )
}