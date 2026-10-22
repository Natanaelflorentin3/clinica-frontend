import { api } from '../lib/axios';
import type { MedicoApi } from '../types/api';

export const getAll = () => api.get<MedicoApi[]>('/doctors');
