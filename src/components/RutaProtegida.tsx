import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import type { RolUsuario } from '../services/auth'

interface RutaProtegidaProps {
  rolesPermitidos?: RolUsuario[]
}

// Guard reutilizable: se usa como "ruta layout" que envuelve a un grupo de rutas
export default function RutaProtegida({ rolesPermitidos }: RutaProtegidaProps) {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const usuario = useAuthStore(s => s.usuario)

  // 1. Sin sesión → al login
  if (!isAuthenticated || !usuario) return <Navigate to="/login" replace />

  // 2. Con sesión pero sin el rol necesario → pantalla de sin acceso
  if (rolesPermitidos && !rolesPermitidos.includes(usuario.rol)) {
    return <Navigate to="/sin-acceso" replace />
  }

  // 3. Pasó las verificaciones → muestra las rutas hijas
  return <Outlet />
}
