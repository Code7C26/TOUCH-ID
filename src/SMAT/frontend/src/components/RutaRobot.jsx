// Editor de la ruta del robot: en qué orden recorre las zonas y cuántos segundos espera en cada una.
//  - ruta: lista guardada [{ zona_id, tiempo_espera_seg }]  ·  zonas: todas las zonas de la fábrica
//  - onGuardar(ruta): guarda la ruta nueva (devuelve una promesa)
import { useEffect, useState } from 'react'
import { botonPrimario, botonSecundario, campo, mensajeError, tarjeta } from '../utils/estilos.js'

const MIN = 5, MAX = 3600
const flecha = 'grid size-7 shrink-0 place-items-center sm:size-8 rounded-lg border border-zinc-300 text-sm hover:bg-zinc-100 disabled:opacity-30 dark:border-zinc-700 dark:hover:bg-zinc-800'

export default function RutaRobot({ ruta, zonas, onGuardar }) {
  const [pasos, setPasos] = useState(ruta)          // copia que se edita
  const [nueva, setNueva] = useState('')
  const [estado, setEstado] = useState({ guardando: false, error: '', ok: false })

  // Cuando el servidor devuelve la ruta guardada, la copia que se edita se pone al día
  // (sin reiniciar el componente, para que el aviso «Ruta guardada» no se pierda)
  const guardada = JSON.stringify(ruta)
  useEffect(() => { setPasos(ruta) }, [guardada]) // eslint-disable-line react-hooks/exhaustive-deps

  const cambiado = JSON.stringify(pasos) !== guardada
  const nombre = (id) => zonas.find((z) => z.id === id)?.nombre || `Zona ${id}`
  const total = pasos.reduce((suma, p) => suma + (Number(p.tiempo_espera_seg) || 0), 0)
  const invalido = pasos.some((p) => !(p.tiempo_espera_seg >= MIN && p.tiempo_espera_seg <= MAX))

  const editar = (nuevos) => { setPasos(nuevos); setEstado({ guardando: false, error: '', ok: false }) }
  const mover = (i, d) => { const c = [...pasos]; [c[i], c[i + d]] = [c[i + d], c[i]]; editar(c) }
  const guardar = async () => {
    setEstado({ guardando: true, error: '', ok: false })
    try { await onGuardar(pasos.map((p) => ({ zona_id: p.zona_id, tiempo_espera_seg: Number(p.tiempo_espera_seg) }))); setEstado({ guardando: false, error: '', ok: true }) }
    catch (e) { setEstado({ guardando: false, error: e.message, ok: false }) }
  }

  return (
    <section className={tarjeta}>
      <h2 className="text-lg font-semibold">Ruta del robot</h2>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Recorre las zonas en este orden y espera unos segundos en cada una.</p>

      <ol className="mt-3 space-y-2">
        {pasos.length === 0 && <li className="text-sm text-zinc-500">La ruta está vacía: agregá al menos una zona.</li>}
        {pasos.map((p, i) => (
          <li key={`${i}-${p.zona_id}`} className="flex items-center gap-1.5 rounded-lg sm:gap-2 bg-zinc-50 p-2 dark:bg-zinc-800/50">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-marca text-sm font-bold text-tinta">{i + 1}</span>
            <span className="min-w-0 flex-1 truncate font-medium">{nombre(p.zona_id)}</span>
            <label className="flex items-center gap-1 text-xs text-zinc-500">
              <input type="number" min={MIN} max={MAX} aria-label={`Segundos de espera en ${nombre(p.zona_id)}`} className={`${campo} !w-16 !px-2 !py-1.5 sm:!w-20`}
                     value={p.tiempo_espera_seg} onChange={(e) => editar(pasos.map((q, j) => (j === i ? { ...q, tiempo_espera_seg: e.target.value } : q)))} /> s
            </label>
            <button type="button" className={flecha} aria-label="Subir" disabled={i === 0} onClick={() => mover(i, -1)}>↑</button>
            <button type="button" className={flecha} aria-label="Bajar" disabled={i === pasos.length - 1} onClick={() => mover(i, 1)}>↓</button>
            <button type="button" className={`${flecha} text-alerta`} aria-label={`Quitar ${nombre(p.zona_id)}`} onClick={() => editar(pasos.filter((_, j) => j !== i))}>✕</button>
          </li>
        ))}
      </ol>

      <div className="mt-3 flex gap-2">
        <select className={campo} aria-label="Zona a agregar" value={nueva} onChange={(e) => setNueva(e.target.value)}>
          <option value="">Agregar una zona…</option>
          {zonas.map((z) => <option key={z.id} value={z.id}>{z.nombre}</option>)}
        </select>
        <button type="button" className={botonSecundario} disabled={!nueva}
                onClick={() => { editar([...pasos, { zona_id: Number(nueva), tiempo_espera_seg: 30 }]); setNueva('') }}>Agregar</button>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">{pasos.length} paradas · {Math.floor(total / 60)} min {total % 60} s de espera</p>
        <button type="button" className={botonPrimario} disabled={!cambiado || invalido || pasos.length === 0 || estado.guardando} onClick={guardar}>
          {estado.guardando ? 'Guardando…' : 'Guardar ruta'}
        </button>
      </div>
      {invalido && <p className={`mt-2 ${mensajeError}`}>La espera de cada zona tiene que estar entre {MIN} y {MAX} segundos.</p>}
      {estado.error && <p role="alert" className={`mt-2 ${mensajeError}`}>{estado.error}</p>}
      {estado.ok && <p role="status" className="mt-2 rounded-lg bg-ok/10 px-3 py-2 text-sm text-ok">Ruta guardada. El robot la toma la próxima vez que inicie.</p>}
    </section>
  )
}
