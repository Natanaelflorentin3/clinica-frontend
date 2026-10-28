import { Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

// No redirige sola: le explica al usuario qué pasó y él decide a dónde ir
export default function PaginaSinAcceso() {
  const rol = useAuthStore(s => s.usuario?.rol)

  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center p-8 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
        <span className="material-symbols-outlined text-[36px]">lock</span>
      </div>
      <h1 className="mt-4 text-3xl font-bold text-slate-800">Sin acceso</h1>
      <p className="mt-2 max-w-md text-slate-500">
        Tu usuario {rol && <strong className="text-slate-700">({rol})</strong>} no tiene permiso para ver esta
        sección. Si creés que es un error, pedile acceso a un administrador.
      </p>
      <Link
        to="/"
        className="mt-6 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
      >
        Volver al inicio
      </Link>
    </main>
  )
}
