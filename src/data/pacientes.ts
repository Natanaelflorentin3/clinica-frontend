import type { Paciente } from '../types/paciente'

export const PACIENTES: Paciente[] = [
  { id: 'PAC-1042', nombre: 'Valentina', apellido: 'Ríos Morales', email: 'valentina.rios@email.com', telefono: '+54 11 4821-9920', especialidadAsignada: 'Cardiología', ultimaCita: '14 Feb 2025', estado: 'activo' },
  { id: 'PAC-1087', nombre: 'Mateo', apellido: 'Navarro Ruiz', email: 'mateo.navarro@email.com', telefono: '+54 11 5532-1109', especialidadAsignada: 'Traumatología', ultimaCita: '28 Ene 2025', estado: 'en_espera' },
  { id: 'PAC-0931', nombre: 'Lucía', apellido: 'Fernández Gómez', email: 'lucia.f@email.com', telefono: '+54 11 3918-4471', especialidadAsignada: 'Dermatología', ultimaCita: '05 Mar 2025', estado: 'activo' },
  { id: 'PAC-1120', nombre: 'Santiago', apellido: 'Castro Benítez', email: 'santiago.c@email.com', telefono: '+54 11 6729-3382', especialidadAsignada: 'Neurología', ultimaCita: '12 Nov 2024', estado: 'inactivo' },
  { id: 'PAC-1055', nombre: 'Camila', apellido: 'Herrera Varga', email: 'camila.herrera@email.com', telefono: '+54 11 4402-8815', especialidadAsignada: 'Pediatría', ultimaCita: '02 Mar 2025', estado: 'activo' },
]