import { useEffect, useState } from 'react';

// Devuelve el valor recién cuando dejó de cambiar durante `delay` ms.
// Es genérico: sirve para string, number o cualquier tipo.
export function useDebounce<T>(valor: T, delay: number = 350): T {
  const [debounced, setDebounced] = useState<T>(valor);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(valor), delay);
    // Si el valor cambia antes de que se cumpla el delay, cancelamos el timeout viejo
    return () => clearTimeout(timeout);
  }, [valor, delay]);

  return debounced;
}
