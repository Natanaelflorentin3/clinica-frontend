import { Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import PaginaDashboard from './pages/PaginaDashboard'
import PaginaPacientes from './pages/PaginaPacientes'
import PaginaDetallePaciente from './pages/PaginaDetallePaciente'
import PaginaNuevaCita from './pages/PaginaNuevaCita'
import PaginaNotFound from './pages/PaginaNotFound'

export default function App() {
  return (
    <Routes>
      {/* Layout envuelve a todas las páginas */}
      <Route element={<Layout />}>
        <Route path="/" element={<PaginaDashboard />} />
        <Route path="/pacientes" element={<PaginaPacientes />} />
        <Route path="/pacientes/:id" element={<PaginaDetallePaciente />} />
        <Route path="/citas/nueva" element={<PaginaNuevaCita />} />
        <Route path="*" element={<PaginaNotFound />} />
      </Route>
    </Routes>
  )
}