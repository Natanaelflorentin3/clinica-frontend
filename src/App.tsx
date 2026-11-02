import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { Route, Routes } from 'react-router-dom'
import ErrorBoundary from './shared/components/ui/ErrorBoundary'
import AlertaBanner from './shared/components/ui/AlertaBanner'
import Spinner from './shared/components/ui/Spinner'
import Layout from './components/Layout'
import PaginaDashboard from './pages/PaginaDashboard'
import PaginaPacientes from './pages/PaginaPacientes'
import PaginaDetallePaciente from './pages/PaginaDetallePaciente'
import PaginaNuevaCita from './pages/PaginaNuevaCita'
import PaginaCitas from './pages/PaginaCitas'
import PaginaNotFound from './pages/PaginaNotFound'
import PaginaLogin from './pages/PaginaLogin'
import PaginaSinAcceso from './pages/PaginaSinAcceso'
import PaginaHistorialCitas from './pages/PaginaHistorialCitas'
import RutaProtegida from './components/RutaProtegida'

// Reportes trae Recharts (pesado): se descarga recién cuando entrás a /reportes
const PaginaReportes = lazy(() => import('./pages/PaginaReportes'))

// Un ErrorBoundary por sección: si una falla, el resto de la app sigue funcionando
function Seccion({ nombre, children }: { nombre: string; children: ReactNode }) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 md:p-8">
          <AlertaBanner
            tipo="error"
            titulo={`Error al cargar ${nombre}`}
            mensaje="Esta sección tuvo un problema. Podés seguir usando el resto de la aplicación."
          />
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Pública */}
      <Route path="/login" element={<PaginaLogin />} />

      {/* Todo lo demás: solo con sesión iniciada */}
      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          {/* Rutas generales: cualquier usuario autenticado */}
          <Route path="/" element={<Seccion nombre="el dashboard"><PaginaDashboard /></Seccion>} />
          <Route path="/pacientes" element={<Seccion nombre="los pacientes"><PaginaPacientes /></Seccion>} />
          <Route path="/pacientes/:id" element={<Seccion nombre="el paciente"><PaginaDetallePaciente /></Seccion>} />
          <Route path="/citas" element={<Seccion nombre="las citas"><PaginaCitas /></Seccion>} />
          <Route path="/citas/nueva" element={<Seccion nombre="el formulario de cita"><PaginaNuevaCita /></Seccion>} />
          <Route path="/historial" element={<Seccion nombre="el historial"><PaginaHistorialCitas /></Seccion>} />
          <Route path="/sin-acceso" element={<PaginaSinAcceso />} />

          {/* Solo GERENCIA y ADMIN */}
          <Route element={<RutaProtegida rolesPermitidos={['GERENCIA', 'ADMIN']} />}>
            <Route
              path="/reportes"
              element={
                <Seccion nombre="reportes">
                  <Suspense fallback={<Spinner fullscreen texto="Cargando reportes..." />}>
                    <PaginaReportes />
                  </Suspense>
                </Seccion>
              }
            />
          </Route>

          <Route path="*" element={<PaginaNotFound />} />
        </Route>
      </Route>
    </Routes>
  )
}
