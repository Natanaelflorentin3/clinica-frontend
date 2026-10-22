import FormularioCita from '../components/FormularioCita'

export default function PaginaNuevaCita() {
  return (
    <main className="mx-auto max-w-2xl p-4 md:p-8">
      <h1 className="mb-1 text-3xl font-bold tracking-tight text-slate-800">Nueva cita</h1>
      <p className="mb-6 text-slate-500">Agendá una consulta para un paciente</p>
      <FormularioCita />
    </main>
  )
}