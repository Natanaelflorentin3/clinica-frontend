interface ModalConfirmacionProps {
  abierto: boolean
  titulo: string
  mensaje: string
  cargando: boolean
  textoConfirmar?: string
  textoCargando?: string
  onConfirmar: () => void
  onCancelar: () => void
}

// Modal reutilizable para acciones destructivas (eliminar, cancelar, etc.)
export default function ModalConfirmacion({
  abierto,
  titulo,
  mensaje,
  cargando,
  textoConfirmar = 'Eliminar',
  textoCargando = 'Eliminando...',
  onConfirmar,
  onCancelar,
}: ModalConfirmacionProps) {
  if (!abierto) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
      onClick={cargando ? undefined : onCancelar}
    >
      <div
        role="dialog"
        aria-modal="true"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <span className="material-symbols-outlined">warning</span>
          </div>
          <h2 className="text-lg font-semibold text-slate-800">{titulo}</h2>
        </div>
        <p className="mb-6 text-sm text-slate-600">{mensaje}</p>

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancelar}
            disabled={cargando}
            className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirmar}
            disabled={cargando}
            className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cargando ? textoCargando : textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}
