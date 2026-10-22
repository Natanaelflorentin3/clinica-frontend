import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import * as medicosService from '../services/medicos';
import { extraerMensajeError } from '../lib/errorHandler';
import type { MedicoApi } from '../types/api';

interface MedicosState {
  medicos: MedicoApi[];
  cargando: boolean;
  error: string | null;
  cargar: () => Promise<void>;
}

export const useMedicosStore = create<MedicosState>()(
  devtools(
    (set) => ({
      medicos: [],
      cargando: false,
      error: null,
      cargar: async () => {
        set({ cargando: true, error: null }, undefined, 'medicos/cargar:inicio');
        try {
          const res = await medicosService.getAll();
          set({ medicos: res.data, cargando: false }, undefined, 'medicos/cargar:exito');
        } catch (err) {
          set({ error: extraerMensajeError(err), cargando: false }, undefined, 'medicos/cargar:error');
        }
      },
    }),
    { name: 'MedicosStore' }
  )
);
