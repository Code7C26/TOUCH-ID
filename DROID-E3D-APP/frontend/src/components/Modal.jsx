// Ventana emergente centrada. Se cierra con la X, con Esc o tocando afuera.
// Ej: <Modal abierto={ver} titulo="Detalle" onCerrar={() => setVer(false)} pie={<button>Guardar</button>}>...</Modal>
import useVentana from '../hooks/useVentana.js'
import Icono from './Icono.jsx'

export default function Modal({ abierto, titulo, onCerrar, children, pie }) {
  const ref = useVentana(abierto, onCerrar)
  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-zinc-950/40 p-0 backdrop-blur-[2px] sm:items-center sm:p-4"
         onClick={onCerrar}>
      <div ref={ref} role="dialog" aria-modal="true" aria-label={titulo} tabIndex={-1}
           className="animar-aviso max-h-[90dvh] w-full overflow-y-auto rounded-t-2xl border border-zinc-200/80 bg-white shadow-lg outline-none sm:max-w-lg sm:rounded-2xl dark:border-zinc-800 dark:bg-zinc-900"
           onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between border-b border-zinc-200/80 px-5 py-4 dark:border-zinc-800">
          <h2 className="text-base font-semibold">{titulo}</h2>
          <button type="button" onClick={onCerrar} aria-label="Cerrar"
                  className="grid size-8 place-items-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <Icono nombre="cerrar" className="size-4" />
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
        {pie && <div className="flex justify-end gap-2 border-t border-zinc-200/80 bg-zinc-50/60 px-5 py-3 dark:border-zinc-800 dark:bg-zinc-900">{pie}</div>}
      </div>
    </div>
  )
}
