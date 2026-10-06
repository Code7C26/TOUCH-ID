// Historial de las alertas del empleado, con filtros por fecha, tipo y estado, y detalle al tocar una.
import { useState } from 'react'
import { getIncidents } from '../../api/client.js'
import AlertCard from '../../components/AlertCard.jsx'
import DetalleAlerta from '../../components/DetalleAlerta.jsx'
import Filtros from '../../components/Filtros.jsx'
import Modal from '../../components/Modal.jsx'
import Titulo from '../../components/Titulo.jsx'
import usePolling from '../../hooks/usePolling.js'
import { nombreTipo } from '../../utils/formato.js'

const POR_PAGINA = 10

const CAMPOS = [
  { nombre: 'desde', etiqueta: 'Desde', tipo: 'fecha' },
  { nombre: 'hasta', etiqueta: 'Hasta', tipo: 'fecha' },
  { nombre: 'tipo', etiqueta: 'Qué faltaba', tipo: 'select',
    opciones: ['sin_casco', 'sin_guantes', 'sin_lentes', 'sin_chaleco'].map((t) => ({ valor: t, texto: nombreTipo(t) })) },
  { nombre: 'estado', etiqueta: 'Estado', tipo: 'select',
    opciones: [{ valor: 'activa', texto: 'Activas' }, { valor: 'resuelta', texto: 'Resueltas' }] },
]
const SIN_FILTROS = { desde: '', hasta: '', tipo: '', estado: '' }

export default function MisAlertas() {
  const [filtros, setFiltros] = useState(SIN_FILTROS)
  const [pagina, setPagina] = useState(1)
  const [elegida, setElegida] = useState(null)

  // Al cambiar un filtro o la página se vuelve a pedir enseguida (deps). Además se refresca cada 10 s.
  const { datos, error, cargando } = usePolling(
    () => getIncidents({ ...filtros, page: pagina, limit: POR_PAGINA }), 10000, [filtros, pagina],
  )
  const lista = datos?.incidencias || []
  const total = datos?.total ?? 0
  const paginas = Math.max(1, Math.ceil(total / POR_PAGINA))

  const cambiarFiltros = (nuevos) => {
    setPagina(1) // un filtro nuevo siempre empieza en la primera página
    setFiltros(nuevos)
  }
  const hayFiltros = Object.values(filtros).some(Boolean)
  const botonPagina = 'rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium disabled:opacity-40 dark:border-zinc-700'

  return (
    <>
      <Titulo titulo="Mis alertas" subtitulo={cargando && !datos ? 'Cargando…' : `${total} en total`} />
      <Filtros campos={CAMPOS} valores={filtros} onCambiar={cambiarFiltros} />

      {error && <p role="alert" className="mt-4 rounded-lg bg-alerta/10 px-3 py-2 text-sm text-alerta">{error}</p>}

      <div className="mt-4 space-y-2">
        {!cargando && lista.length === 0 && (
          <p className="rounded-xl bg-white p-6 text-center text-sm text-zinc-500 dark:bg-zinc-900">
            {hayFiltros ? 'No hay alertas con esos filtros.' : 'No tenés alertas registradas.'}
          </p>
        )}
        {lista.map((inc) => (
          <button key={inc.id} type="button" onClick={() => setElegida(inc)}
                  className="block w-full text-left" aria-label={`Ver detalle: ${nombreTipo(inc.tipo)}`}>
            <AlertCard incidencia={inc} />
          </button>
        ))}
      </div>

      {total > POR_PAGINA && (
        <div className="mt-4 flex items-center justify-between">
          <button type="button" className={botonPagina} disabled={pagina <= 1} onClick={() => setPagina(pagina - 1)}>Anterior</button>
          <span className="text-sm text-zinc-500">Página {pagina} de {paginas}</span>
          <button type="button" className={botonPagina} disabled={pagina >= paginas} onClick={() => setPagina(pagina + 1)}>Siguiente</button>
        </div>
      )}

      <Modal abierto={Boolean(elegida)} titulo="Detalle de la alerta" onCerrar={() => setElegida(null)}>
        {elegida && <DetalleAlerta incidencia={elegida} />}
      </Modal>
    </>
  )
}
