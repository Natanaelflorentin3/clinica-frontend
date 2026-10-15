import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import type { EstadoPaciente, Paciente } from '../types/paciente'

interface FormularioPacienteProps {
  onAgregar: (paciente: Paciente) => void
}

export default function FormularioPaciente({ onAgregar }: FormularioPacienteProps) {
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [estado, setEstado] = useState<EstadoPaciente>('activo')
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!nombre.trim() || !email.trim()) {
      setError('Nombre y email son obligatorios')
      return
    }

    const nuevo: Paciente = {
      id: `PAC-${Date.now().toString().slice(-4)}`,
      nombre: nombre.trim(),
      apellido: apellido.trim(),
      email: email.trim(),
      telefono: 'Sin teléfono',
      especialidadAsignada: 'Sin asignar',
      ultimaCita: 'Sin citas',
      estado,
    }

    onAgregar(nuevo)

    // Limpiar el formulario
    setNombre('')
    setApellido('')
    setEmail('')
    setEstado('activo')
    setError('')
  }

  const inputClases =
    'w-full rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200'

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      <h2 className="font-semibold text-slate-800">Registrar nuevo paciente</h2>

      <div className="grid gap-3 md:grid-cols-2">
        <input
          type="text"
          placeholder="Nombre *"
          value={nombre}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNombre(e.target.value)}
          className={inputClases}
        />
        <input
          type="text"
          placeholder="Apellido"
          value={apellido}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setApellido(e.target.value)}
          className={inputClases}
        />
        <input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          className={inputClases}
        />
        <select
          value={estado}
          onChange={(e: ChangeEvent<HTMLSelectElement>) => setEstado(e.target.value as EstadoPaciente)}
          className={inputClases}
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
          <option value="en_espera">En espera</option>
        </select>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <button
        type="submit"
        className="w-fit rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600"
      >
        + Agregar paciente
      </button>
    </form>
  )
}