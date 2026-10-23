import { useCallback, useEffect, useState } from 'react';
import { api } from '../lib/axios';
import { extraerMensajeError } from '../lib/errorHandler';

interface ResultadoApi<T> {
  data: T | null;
  cargando: boolean;
  error: string | null;
  recargar: () => void;
}

interface Respuesta<T> {
  clave: string; // a qué petición corresponde esta respuesta
  data: T | null;
  error: string | null;
}

// Hace GET a `url` y maneja cargando / error / cancelación.
export function useApi<T>(url: string): ResultadoApi<T> {
  const [version, setVersion] = useState(0);
  const [respuesta, setRespuesta] = useState<Respuesta<T>>({ clave: '', data: null, error: null });

  // Cada combinación url + versión es una petición distinta
  const clave = `${url}#${version}`;

  useEffect(() => {
    const controller = new AbortController();

    api
      .get<T>(url, { signal: controller.signal })
      .then((res) => setRespuesta({ clave, data: res.data, error: null }))
      .catch((err: unknown) => {
        // Si la cancelamos nosotros (desmontaje), no tocamos el estado
        if (controller.signal.aborted) return;
        setRespuesta({ clave, data: null, error: extraerMensajeError(err) });
      });

    // Cleanup: si el componente se desmonta (o cambia la url), cancelamos la petición
    return () => controller.abort();
  }, [url, clave]);

  const recargar = useCallback(() => setVersion((v) => v + 1), []);

  return {
    data: respuesta.data,
    // Está cargando mientras la última respuesta no sea de la petición actual
    cargando: respuesta.clave !== clave,
    error: respuesta.clave === clave ? respuesta.error : null,
    recargar,
  };
}
