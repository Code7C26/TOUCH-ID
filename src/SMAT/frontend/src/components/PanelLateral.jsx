// Panel que se desliza desde la derecha (en celular ocupa toda la pantalla). Se usa para formularios
// y detalles, así no se pierde de vista la lista de atrás. Esc, la X o tocar afuera lo cierran.
// Ej: <PanelLateral abierto titulo="Nuevo empleado" descripcion="..." onCerrar={...}>formulario</PanelLateral>
import useVentana from '../hooks/useVentana.js'
import Icono from './Icono.jsx'

const ANCHOS = { md: 'sm:max-w-md', lg: 'sm:max-w-xl' }

export default function PanelLateral({ abierto, titulo, descripcion, onCerrar, children, ancho = 'md' }) {
  const ref = useVentana(abierto, onCerrar)
  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-zinc-950/30 backdrop-blur-[2px]" onClick={onCerrar}>
      <section ref={ref} role="dialog" aria-modal="true" aria-label={titulo} tabIndex={-1}
               className={`animar-panel flex h-full w-full flex-col border-l border-zinc-200/80 bg-white shadow-lg outline-none dark:border-zinc-800 dark:bg-zinc-900 ${ANCHOS[ancho]}`}
               onClick={(e) => e.stopPropagation()}>
        <header className="flex items-start justify-between gap-3 border-b border-zinc-200/80 px-6 py-5 dark:border-zinc-800">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">{titulo}</h2>
            {descripcion && <p className="mt-0.5 text-sm text-zinc-500 dark:text-zinc-400">{descripcion}</p>}
          </div>
          <button type="button" onClick={onCerrar} aria-label="Cerrar"
                  className="grid size-8 shrink-0 place-items-center rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <Icono nombre="cerrar" className="size-4" />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </section>
    </div>
  )
}
