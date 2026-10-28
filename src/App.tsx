import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import PaginaDashboard from './pages/PaginaDashboard'
import PaginaPacientes from './pages/PaginaPacientes'
import PaginaDetallePaciente from './pages/PaginaDetallePaciente'
import PaginaNuevaCita from './pages/PaginaNuevaCita'
import PaginaCitas from './pages/PaginaCitas'
import PaginaReportes from './pages/PaginaReportes'
import PaginaNotFound from './pages/PaginaNotFound'
import PaginaLogin from './pages/PaginaLogin'
import PaginaSinAcceso from './pages/PaginaSinAcceso'
import RutaProtegida from './components/RutaProtegida'

export default function App() {
  return (
    <Routes>
      {/* Pública */}
      <Route path="/login" element={<PaginaLogin />} />

      {/* Todo lo demás: solo con sesión iniciada */}
      <Route element={<RutaProtegida />}>
        <Route element={<Layout />}>
          {/* Rutas generales: cualquier usuario autenticado */}
          <Route path="/" element={<PaginaDashboard />} />
          <Route path="/pacientes" element={<PaginaPacientes />} />
          <Route path="/pacientes/:id" element={<PaginaDetallePaciente />} />
          <Route path="/citas" element={<PaginaCitas />} />
          <Route path="/citas/nueva" element={<PaginaNuevaCita />} />
          <Route path="/sin-acceso" element={<PaginaSinAcceso />} />

          {/* Solo GERENCIA y ADMIN */}
          <Route element={<RutaProtegida rolesPermitidos={['GERENCIA', 'ADMIN']} />}>
            <Route path="/reportes" element={<PaginaReportes />} />
          </Route>

          <Route path="*" element={<PaginaNotFound />} />
        </Route>
      </Route>
    </Routes>
  )
}
