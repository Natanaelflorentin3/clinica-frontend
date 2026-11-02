import { useAuthStore } from '../../../stores/authStore'

export function useAuth() {
  const usuario = useAuthStore(s => s.usuario)
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  const login = useAuthStore(s => s.login)
  const logout = useAuthStore(s => s.logout)

  return { usuario, isAuthenticated, login, logout }
}
