// Botones "Anterior / Siguiente" con el número de página. Se oculta si todo entra en una sola página.
import { botonSecundario } from '../utils/estilos.js'

export default function Paginador({ pagina, total, porPagina, onCambiar }) {
  const paginas = Math.max(1, Math.ceil(total / porPagina))
  if (total <= porPagina) return null

  return (
    <nav className="mt-4 flex items-center justify-between" aria-label="Paginado">
      <button type="button" className={botonSecundario} disabled={pagina <= 1} onClick={() => onCambiar(pagina - 1)}>Anterior</button>
      <span className="text-sm text-zinc-500 dark:text-zinc-400">Página {pagina} de {paginas}</span>
      <button type="button" className={botonSecundario} disabled={pagina >= paginas} onClick={() => onCambiar(pagina + 1)}>Siguiente</button>
    </nav>
  )
}
