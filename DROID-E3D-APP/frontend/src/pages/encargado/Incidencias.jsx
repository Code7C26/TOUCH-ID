// Todas las alertas de la fábrica: filtros, tabla (PC) o tarjetas (celular), detalle y resolver.
// Si se entra desde el mapa del panel, viene con la zona ya elegida (?zona_id=2).
import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getIncidents, getUsers, getZones, resolveIncident } from '../../api/client.js'
import AlertCard from '../../components/AlertCard.jsx'
import DetalleAlerta from '../../components/DetalleAlerta.jsx'
import Filtros from '../../components/Filtros.jsx'
import Modal from '../../components/Modal.jsx'
import Paginador from '../../components/Paginador.jsx'
import Tabla from '../../components/Tabla.jsx'
import Titulo from '../../components/Titulo.jsx'
import { useAvisos } from '../../context/AvisosContext.jsx'
import usePolling from '../../hooks/usePolling.js'
import { botonPrimario, botonSecundario, mensajeError } from '../../utils/estilos.js'
import { COLOR_ESTADO, formatearFecha, haceCuanto, nombreTipo, porcentaje } from '../../utils/formato.js'

const POR_PAGINA = 15
const TIPOS = ['sin_casco', 'sin_guantes', 'sin_lentes', 'sin_chaleco'].map((t) => ({ valor: t, texto: nombreTipo(t) }))

export default function Incidencias() {
  const avisar = useAvisos()
  const [params] = useSearchParams()
  const [filtros, setFiltros] = useState({ zona_id: params.get('zona_id') || '', empleado_id: '', tipo: '', estado: '', desde: '', hasta: '' })
  const [pagina, setPagina] = useState(1)
  const [elegida, setElegida] = useState(null)
  const [resolviendo, setResolviendo] = useState(false)
  const [errorAccion, setErrorAccion] = useState('')

  const zonas = usePolling(() => getZones(), 0)
  const empleados = usePolling(() => getUsers({ rol: 'empleado' }), 0)
  const lista = usePolling(() => getIncidents({ ...filtros, page: pagina, limit: POR_PAGINA }), 8000, [filtros, pagina])

  const filas = lista.datos?.incidencias || []
  const total = lista.datos?.total ?? 0

  const campos = [
    { nombre: 'zona_id', etiqueta: 'Zona', tipo: 'select', opciones: (zonas.datos?.zonas || []).map((z) => ({ valor: z.id, texto: z.nombre })) },
    { nombre: 'empleado_id', etiqueta: 'Empleado', tipo: 'select', opciones: (empleados.datos?.usuarios || []).map((u) => ({ valor: u.id, texto: u.nombre })) },
    { nombre: 'tipo', etiqueta: 'Qué faltaba', tipo: 'select', opciones: TIPOS },
    { nombre: 'estado', etiqueta: 'Estado', tipo: 'select', opciones: [{ valor: 'activa', texto: 'Activas' }, { valor: 'resuelta', texto: 'Resueltas' }] },
    { nombre: 'desde', etiqueta: 'Desde', tipo: 'fecha' },
    { nombre: 'hasta', etiqueta: 'Hasta', tipo: 'fecha' },
  ]

  const resolver = async (id) => {
    setErrorAccion('')
    setResolviendo(true)
    try {
      await resolveIncident(id)
      setElegida(null)
      lista.recargar()
      avisar('Alerta marcada como resuelta')
    } catch (e) {
      setErrorAccion(e.message)
    } finally {
      setResolviendo(false)
    }
  }

  const columnas = [
    { clave: 'timestamp', titulo: 'Cuándo', render: (i) => <span title={formatearFecha(i.timestamp)}>{haceCuanto(i.timestamp)}</span> },
    { clave: 'zona', titulo: 'Zona' },
    { clave: 'empleado_nombre', titulo: 'Empleado' },
    { clave: 'tipo', titulo: 'Qué faltaba', render: (i) => nombreTipo(i.tipo) },
    { clave: 'confianza', titulo: 'Confianza', clase: 'tabular-nums', render: (i) => porcentaje(i.confianza) },
    { clave: 'estado', titulo: 'Estado', render: (i) => (
      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${COLOR_ESTADO[i.estado]}`}>{i.estado}</span>
    ) },
    { clave: 'acciones', titulo: '', clase: 'text-right', render: (i) => (
      <button type="button" className="font-medium text-marca-oscuro hover:underline dark:text-marca" onClick={() => setElegida(i)}>Ver detalle</button>
    ) },
  ]

  return (
    <>
      <Titulo titulo="Incidencias" subtitulo={lista.cargando && !lista.datos ? 'Cargando…' : `${total} en total`} />
      <Filtros campos={campos} valores={filtros} onCambiar={(f) => { setPagina(1); setFiltros(f) }} />

      {(lista.error || errorAccion) && <p role="alert" className={`mt-4 ${mensajeError}`}>{lista.error || errorAccion}</p>}

      <div className="mt-4 hidden md:block">
        <Tabla columnas={columnas} filas={filas} vacio="No hay alertas con esos filtros" />
      </div>
      <div className="mt-4 space-y-2 md:hidden">
        {!lista.cargando && filas.length === 0 && <p className="rounded-xl bg-white p-6 text-center text-sm text-zinc-500 dark:bg-zinc-900">No hay alertas con esos filtros.</p>}
        {filas.map((inc) => <AlertCard key={inc.id} incidencia={inc} onResolver={resolver} onVer={setElegida} />)}
      </div>

      <Paginador pagina={pagina} total={total} porPagina={POR_PAGINA} onCambiar={setPagina} />

      <Modal abierto={Boolean(elegida)} titulo="Detalle de la alerta" onCerrar={() => setElegida(null)}
             pie={elegida && (
               <>
                 <button type="button" className={botonSecundario} onClick={() => setElegida(null)}>Cerrar</button>
                 {elegida.estado === 'activa' && (
                   <button type="button" className={botonPrimario} disabled={resolviendo} onClick={() => resolver(elegida.id)}>
                     {resolviendo ? 'Resolviendo…' : 'Marcar como resuelta'}
                   </button>
                 )}
               </>
             )}>
        {elegida && <DetalleAlerta incidencia={elegida} />}
      </Modal>
    </>
  )
}
