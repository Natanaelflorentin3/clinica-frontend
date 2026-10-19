import { Link } from 'react-router-dom'

export default function PaginaNotFound() {
  return (
    <main className="flex min-h-[70vh] flex-col items-center justify-center p-8 text-center">
      <p className="text-7xl">🩺</p>
      <h1 className="mt-4 text-5xl font-bold text-slate-800">404</h1>
      <p className="mt-2 text-slate-500">La página que buscás no existe o fue movida.</p>
      <Link
        to="/"
        className="mt-6 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
      >
        Ir al inicio
      </Link>
    </main>
  )
}