// Ventana emergente. Se cierra con la X, con la tecla Esc o tocando afuera.
// Ej: <Modal abierto={ver} titulo="Detalle" onCerrar={() => setVer(false)} pie={<button>Guardar</button>}>...</Modal>
import { useEffect } from 'react'
import Icono from './Icono.jsx'

export default function Modal({ abierto, titulo, onCerrar, children, pie }) {
  useEffect(() => {
    if (!abierto) return undefined
    const conTecla = (e) => e.key === 'Escape' && onCerrar()
    document.addEventListener('keydown', conTecla)
    document.body.style.overflow = 'hidden' // evita que la página de atrás se mueva
    return () => {
      document.removeEventListener('keydown', conTecla)
      document.body.style.overflow = ''
    }
  }, [abierto, onCerrar])

  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4"
         onClick={onCerrar}>
      <div role="dialog" aria-modal="true" aria-label={titulo}
           className="max-h-[90dvh] w-full overflow-y-auto rounded-t-2xl bg-white shadow-xl sm:max-w-lg sm:rounded-2xl dark:bg-zinc-900"
           onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <h2 className="text-lg font-semibold">{titulo}</h2>
          <button type="button" onClick={onCerrar} aria-label="Cerrar"
                  className="grid size-9 place-items-center rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <Icono nombre="cerrar" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {pie && <div className="flex justify-end gap-2 border-t border-zinc-200 px-5 py-3 dark:border-zinc-800">{pie}</div>}
      </div>
    </div>
  )
}
