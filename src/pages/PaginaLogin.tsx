import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { loginSchema } from '../schemas/loginSchema'
import type { LoginFormData } from '../schemas/loginSchema'
import { login } from '../services/auth'
import { useAuthStore } from '../stores/authStore'
import { extraerMensajeError } from '../lib/errorHandler'

// Borde rojo si el campo tiene error
const clasesCampo = (hayError: boolean): string =>
  `w-full rounded-lg border px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 ${
    hayError
      ? 'border-rose-500 bg-rose-50 focus:ring-rose-200'
      : 'border-slate-200 bg-slate-50 focus:bg-white focus:ring-emerald-200'
  }`

export default function PaginaLogin() {
  const setAuth = useAuthStore(s => s.login)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  // Si ya hay sesión, no tiene sentido mostrar el login
  if (isAuthenticated) return <Navigate to="/" replace />

  const onSubmit = async (datos: LoginFormData) => {
    try {
      const { token, usuario } = await login(datos)
      setAuth(token, usuario)
      toast.success(`¡Bienvenido, ${usuario.nombre}!`)
      // replace: el botón "atrás" no vuelve a /login con la sesión iniciada
      navigate('/', { replace: true })
    } catch (err) {
      toast.error(extraerMensajeError(err))
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-700 text-white">
            <span className="material-symbols-outlined text-[28px]">local_hospital</span>
          </div>
          <h1 className="text-xl font-bold text-slate-800">Clínica Salud Integral</h1>
          <p className="text-sm text-slate-500">Ingresá con tu cuenta para continuar</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              {...register('email')}
              className={clasesCampo(!!errors.email)}
            />
            {errors.email && <p className="mt-1 text-sm text-rose-600">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="password" className="mb-1 block text-sm font-medium text-slate-700">Contraseña</label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register('password')}
              className={clasesCampo(!!errors.password)}
            />
            {errors.password && <p className="mt-1 text-sm text-rose-600">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </main>
  )
}
