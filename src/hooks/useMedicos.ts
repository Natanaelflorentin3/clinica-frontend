import { useEffect, useState } from 'react'
import type { Medico } from '../types/medico'

const MEDICOS_SIMULADOS: Medico[] = [
  { id: 'MED-01', nombre: 'Dra. Laura Gómez', especialidad: 'Cardiología' },
  { id: 'MED-02', nombre: 'Dr. Martín Sosa', especialidad: 'Pediatría' },
  { id: 'MED-03', nombre: 'Dra. Ana Torres', especialidad: 'Dermatología' },
  { id: 'MED-04', nombre: 'Dr. Pablo Ruiz', especialidad: 'Traumatología' },
  { id: 'MED-05', nombre: 'Dra. Sofía Medina', especialidad: 'Neurología' },
]

export function useMedicos(): { medicos: Medico[]; cargando: boolean } {
  const [medicos, setMedicos] = useState<Medico[]>([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMedicos(MEDICOS_SIMULADOS)
      setCargando(false)
    }, 800)

    // Si el componente se desmonta antes de los 800ms, cancelamos el timer
    return () => clearTimeout(timer)
  }, [])

  return { medicos, cargando }
}