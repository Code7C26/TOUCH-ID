// Tarjeta de una zona en la página Zonas: máquina y su estado, EPP obligatorio, lugar en el mapa y acciones.
import { botonPeligro, botonPrimario, botonSecundario, tarjeta } from '../utils/estilos.js'
import { NOMBRES_EPP } from '../utils/formato.js'
import Etiqueta from './Etiqueta.jsx'

export default function TarjetaZona({ zona, onEditar, onBorrar, onMaquina }) {
  return (
    <article className={tarjeta}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold">{zona.nombre}</h2>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{zona.maquina || 'Sin máquina'}</p>
        </div>
        {zona.maquina && (
          <Etiqueta tono={zona.maquina_activa ? 'ok' : 'naranja'} punto>{zona.maquina_activa ? 'Máquina activa' : 'Máquina detenida'}</Etiqueta>
        )}
      </div>

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Equipo de protección obligatorio">
        {zona.epp_requerido.length === 0 && <li className="text-sm text-zinc-500">Sin EPP configurado</li>}
        {zona.epp_requerido.map((e) => <li key={e}><Etiqueta tono="marca">{NOMBRES_EPP[e] || e}</Etiqueta></li>)}
      </ul>
      <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">Mapa: columna {zona.grilla_x + 1}, fila {zona.grilla_y + 1} · {zona.ancho}×{zona.alto} celdas</p>

      <div className="mt-4 flex flex-wrap justify-end gap-2 border-t border-zinc-100 pt-4 dark:border-zinc-800">
        {zona.maquina && (zona.maquina_activa
          ? <button type="button" className={botonSecundario} onClick={() => onMaquina(zona, 'detener')}>Detener máquina</button>
          : <button type="button" className={botonPrimario} onClick={() => onMaquina(zona, 'reactivar')}>Reactivar máquina</button>)}
        <button type="button" className={botonSecundario} onClick={() => onEditar(zona)}>Editar</button>
        <button type="button" className={botonPeligro} onClick={() => onBorrar(zona)}>Borrar</button>
      </div>
    </article>
  )
}
