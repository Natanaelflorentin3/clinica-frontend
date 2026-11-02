import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import * as citasService from '../../../services/citas'
import type { FiltroEstadoHistorial } from '../../../services/citas'
import { extraerMensajeError } from '../../../lib/errorHandler'
import type { CitaConDetalle, RespuestaPaginada } from '../../../types/api'

// Resultado de una carga, marcado con la "clave" (página + estado) a la que pertenece
interface Resultado {
  clave: string
  respuesta: RespuestaPaginada<CitaConDetalle> | null
  error: string | null
}

// Historial paginado: la página le pasa la página y el filtro (que vienen de la URL)
export function useHistorialCitas(pagina: number, estado: FiltroEstadoHistorial, limite: number) {
  const claveActual = `${pagina}|${estado}|${limite}`
  const [resultado, setResultado] = useState<Resultado>({ clave: '', respuesta: null, error: null })
  const [reintentos, setReintentos] = useState(0)

  useEffect(() => {
    const controller = new AbortController()

    citasService
      .getPaginadas({ pagina, estado, limite, signal: controller.signal })
      .then(res => setResultado({ clave: claveActual, respuesta: res.data, error: null }))
      .catch((err: unknown) => {
        // Si la cancelamos nosotros (cambió la página o el filtro), no es un error real
        if (axios.isCancel(err) || controller.signal.aborted) return
        setResultado({ clave: claveActual, respuesta: null, error: extraerMensajeError(err) })
      })

    // Cleanup: cancela la petición anterior → evita mostrar datos de una página vieja
    return () => controller.abort()
  }, [pagina, estado, limite, claveActual, reintentos])

  // Está cargando mientras el último resultado no sea de la página/filtro actuales
  const cargando = resultado.clave !== claveActual
  const respuesta = cargando ? null : resultado.respuesta
  const error = cargando ? null : resultado.error

  // Al reintentar con la misma clave forzamos el "cargando" limpiando la clave
  const recargar = useCallback(() => {
    setResultado({ clave: '', respuesta: null, error: null })
    setReintentos(n => n + 1)
  }, [])

  return {
    citas: respuesta?.data ?? [],
    total: respuesta?.total ?? 0,
    totalPaginas: respuesta?.totalPaginas ?? 1,
    cargando,
    error,
    recargar,
  }
}
