// Gestión de zonas: su máquina, el EPP obligatorio y su lugar en el mapa de la fábrica.
import { useState } from 'react'
import { createZone, deleteZone, getZones, updateZone } from '../../api/client.js'
import FormZona from '../../components/FormZona.jsx'
import MapaFabrica from '../../components/MapaFabrica.jsx'
import Modal from '../../components/Modal.jsx'
import Titulo from '../../components/Titulo.jsx'
import usePolling from '../../hooks/usePolling.js'
import { botonPeligro, botonPrimario, botonSecundario, mensajeError, tarjeta } from '../../utils/estilos.js'
import { NOMBRES_EPP } from '../../utils/formato.js'

export default function Zonas() {
  const zonas = usePolling(() => getZones(), 10000)
  const [formulario, setFormulario] = useState(null)   // null = cerrado · {} = nueva · zona = editar
  const [aBorrar, setABorrar] = useState(null)
  const [errorModal, setErrorModal] = useState('')
  const [aviso, setAviso] = useState('')
  const [ocupado, setOcupado] = useState(false)
  const lista = zonas.datos?.zonas || []

  // Corre una acción del servidor; si sale bien cierra la ventana, si no muestra el error
  const ejecutar = async (accion, exito) => {
    setOcupado(true); setErrorModal('')
    try {
      await accion()
      zonas.recargar(); setAviso(exito); setTimeout(() => setAviso(''), 4000)
      setFormulario(null); setABorrar(null)
    } catch (e) {
      setErrorModal(e.message)
    } finally {
      setOcupado(false)
    }
  }
  const abrirFormulario = (zona) => { setErrorModal(''); setFormulario(zona) }

  return (
    <>
      <Titulo titulo="Zonas" subtitulo={zonas.datos ? `${lista.length} zonas en la fábrica` : 'Cargando…'}>
        <button type="button" className={botonPrimario} onClick={() => abrirFormulario({})}>+ Nueva zona</button>
      </Titulo>

      <div aria-live="polite" className="space-y-3">
        {aviso && <p role="status" className="rounded-lg bg-ok/10 px-3 py-2 text-sm text-ok">{aviso}</p>}
        {zonas.error && <p role="alert" className={mensajeError}>{zonas.error}</p>}
      </div>

      {lista.length > 0 && (
        <section className={`${tarjeta} mb-6`}>
          <MapaFabrica zonas={lista} onSeleccionar={abrirFormulario} />
          <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">Tocá una zona del mapa para editarla.</p>
        </section>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {lista.map((z) => (
          <article key={z.id} className={tarjeta}>
            <div className="flex items-start justify-between gap-2">
              <div><h2 className="text-lg font-semibold">{z.nombre}</h2><p className="text-sm text-zinc-500 dark:text-zinc-400">{z.maquina || 'Sin máquina'}</p></div>
              {z.maquina && (
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${z.maquina_activa ? 'bg-ok/10 text-ok ring-ok/30' : 'bg-alerta/10 text-alerta ring-alerta/30'}`}>
                  {z.maquina_activa ? 'Máquina activa' : 'Máquina detenida'}
                </span>
              )}
            </div>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {z.epp_requerido.length === 0 && <li className="text-sm text-zinc-500">Sin EPP configurado</li>}
              {z.epp_requerido.map((e) => <li key={e} className="rounded-md bg-marca/15 px-2 py-1 text-xs font-medium">{NOMBRES_EPP[e] || e}</li>)}
            </ul>
            <p className="mt-3 text-xs text-zinc-500 dark:text-zinc-400">Mapa: columna {z.grilla_x + 1}, fila {z.grilla_y + 1} · {z.ancho}×{z.alto} celdas</p>
            <div className="mt-3 flex justify-end gap-2 border-t border-zinc-100 pt-3 dark:border-zinc-800">
              <button type="button" className={botonSecundario} onClick={() => abrirFormulario(z)}>Editar</button>
              <button type="button" className={botonPeligro} onClick={() => { setErrorModal(''); setABorrar(z) }}>Borrar</button>
            </div>
          </article>
        ))}
      </div>

      <Modal abierto={Boolean(formulario)} titulo={formulario?.id ? `Editar ${formulario.nombre}` : 'Nueva zona'} onCerrar={() => setFormulario(null)}>
        {formulario && (
          <FormZona key={formulario.id || 'nueva'} inicial={formulario} zonas={lista} error={errorModal} guardando={ocupado}
                    onCancelar={() => setFormulario(null)}
                    onGuardar={(datos) => ejecutar(() => (formulario.id ? updateZone(formulario.id, datos) : createZone(datos)), formulario.id ? 'Zona guardada' : 'Zona creada')} />
        )}
      </Modal>

      <Modal abierto={Boolean(aBorrar)} titulo="Borrar zona" onCerrar={() => setABorrar(null)}
             pie={<><button type="button" className={botonSecundario} onClick={() => setABorrar(null)}>Cancelar</button>
                     <button type="button" className={botonPeligro} disabled={ocupado} onClick={() => ejecutar(() => deleteZone(aBorrar.id), `${aBorrar.nombre} fue borrada`)}>Sí, borrar</button></>}>
        <p className="text-sm">¿Borrar <strong>{aBorrar?.nombre}</strong>? Solo se puede si no tiene empleados ni alertas registradas.</p>
        {errorModal && <p role="alert" className={`mt-3 ${mensajeError}`}>{errorModal}</p>}
      </Modal>
    </>
  )
}
