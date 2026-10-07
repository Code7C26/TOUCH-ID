// Detalle de una zona para el panel lateral del Panel: máquina (con detener/reactivar),
// EPP obligatorio, alertas activas (con "Resolver") y empleados que trabajan ahí.
// Props: zona, alertas (activas de esta zona), onResolver(id), onMaquina(accion) → promesa
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getUsers } from '../api/client.js'
import usePolling from '../hooks/usePolling.js'
import { botonPeligroFuerte, botonPrimario, botonSecundario, mensajeError } from '../utils/estilos.js'
import { NOMBRES_EPP } from '../utils/formato.js'
import AlertCard from './AlertCard.jsx'
import Avatar from './Avatar.jsx'
import Etiqueta from './Etiqueta.jsx'
import Icono from './Icono.jsx'

const subtitulo = 'mb-2 text-xs font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400'

function Maquina({ zona, onMaquina }) {
  const [confirmando, setConfirmando] = useState(false)
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState('')
  const accion = zona.maquina_activa ? 'detener' : 'reactivar'

  const confirmar = async () => {
    setOcupado(true); setError('')
    try { await onMaquina(accion); setConfirmando(false) }
    catch (e) { setError(e.message) }
    finally { setOcupado(false) }
  }

  return (
    <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
      <div className="flex items-center justify-between gap-2">
        <p className="flex items-center gap-2 font-medium">
          <Icono nombre="maquina" className={`size-5 ${zona.maquina_activa ? 'text-ok' : 'text-naranja'}`} />{zona.maquina}
        </p>
        <Etiqueta tono={zona.maquina_activa ? 'ok' : 'naranja'} punto>{zona.maquina_activa ? 'Activa' : 'Detenida'}</Etiqueta>
      </div>
      {!confirmando ? (
        <button type="button" className={`mt-3 ${zona.maquina_activa ? botonSecundario : botonPrimario}`} onClick={() => setConfirmando(true)}>
          {zona.maquina_activa ? 'Detener máquina' : 'Reactivar máquina'}
        </button>
      ) : (
        <div className="mt-3 rounded-lg bg-zinc-50 p-3 text-sm dark:bg-zinc-800/60">
          <p>{zona.maquina_activa ? 'La máquina se corta hasta que la reactives.' : 'Confirmá que ya se corrigió el uso del equipo antes de reactivarla.'}</p>
          {error && <p role="alert" className={`mt-2 ${mensajeError}`}>{error}</p>}
          <div className="mt-2 flex gap-2">
            <button type="button" disabled={ocupado} className={zona.maquina_activa ? botonPeligroFuerte : botonPrimario} onClick={confirmar}>
              {accion === 'detener' ? 'Sí, detener' : 'Sí, reactivar'}
            </button>
            <button type="button" className={botonSecundario} onClick={() => setConfirmando(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DetalleZona({ zona, alertas, onResolver, onMaquina }) {
  const empleados = usePolling(() => getUsers({ zona_id: zona.id, rol: 'empleado', activo: 'true' }), 0, [zona.id])
  const lista = empleados.datos?.usuarios || []

  return (
    <div className="space-y-6">
      {zona.maquina ? <Maquina zona={zona} onMaquina={onMaquina} /> : <p className="text-sm text-zinc-500">Esta zona no tiene máquina.</p>}

      <section>
        <h3 className={subtitulo}>EPP obligatorio</h3>
        <ul className="flex flex-wrap gap-2">
          {zona.epp_requerido.length === 0 && <li className="text-sm text-zinc-500">Sin EPP configurado</li>}
          {zona.epp_requerido.map((e) => (
            <li key={e} className="flex items-center gap-1.5 rounded-lg bg-marca/15 px-2.5 py-1 text-sm font-medium text-marca-oscuro dark:text-marca">
              <Icono nombre={e} className="size-4" />{NOMBRES_EPP[e] || e}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className={subtitulo}>Alertas activas ({alertas.length})</h3>
        {alertas.length === 0 && <p className="text-sm text-zinc-500">No hay alertas sin resolver.</p>}
        <div className="space-y-2">{alertas.map((inc) => <AlertCard key={inc.id} incidencia={inc} onResolver={onResolver} />)}</div>
        <Link to={`/app/incidencias?zona_id=${zona.id}`} className="mt-3 inline-block text-sm font-medium text-marca-oscuro hover:underline dark:text-marca">
          Ver todas las incidencias de la zona →
        </Link>
      </section>

      <section>
        <h3 className={subtitulo}>Empleados ({lista.length})</h3>
        {empleados.cargando && <p className="text-sm text-zinc-500">Cargando…</p>}
        {!empleados.cargando && lista.length === 0 && <p className="text-sm text-zinc-500">No hay empleados asignados.</p>}
        <ul className="space-y-2">
          {lista.map((u) => (
            <li key={u.id} className="flex items-center gap-2 text-sm"><Avatar nombre={u.nombre} tamano="sm" />{u.nombre}
              <span className="text-xs text-zinc-500">· legajo {u.legajo || '—'}</span></li>
          ))}
        </ul>
      </section>
    </div>
  )
}
