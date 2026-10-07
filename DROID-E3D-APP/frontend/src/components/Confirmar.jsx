// Ventana de confirmación clara: ícono, título con la acción y el nombre de lo afectado, y un botón
// que dice exactamente qué va a pasar (ej. "Sí, borrar"). El foco arranca en "Cancelar" por seguridad.
// Ej: <Confirmar abierto titulo="Borrar Zona E" accion="Sí, borrar" tono="peligro" onConfirmar={...} onCancelar={...}>
//       Se borra para siempre.</Confirmar>
import { botonPeligroFuerte, botonPrimario, botonSecundario, mensajeError } from '../utils/estilos.js'
import Icono from './Icono.jsx'
import Modal from './Modal.jsx'

const TONOS = {
  peligro: { icono: 'alerta', color: 'bg-alerta/10 text-alerta', boton: botonPeligroFuerte },
  aviso: { icono: 'alerta', color: 'bg-naranja/10 text-naranja', boton: botonPrimario },
  info: { icono: 'ok', color: 'bg-ok/10 text-ok', boton: botonPrimario },
}

export default function Confirmar({ abierto, titulo, accion, tono = 'peligro', ocupado, error, onConfirmar, onCancelar, children }) {
  const t = TONOS[tono]
  return (
    <Modal abierto={abierto} titulo={titulo} onCerrar={onCancelar}
           pie={<>
             <button type="button" className={botonSecundario} onClick={onCancelar}>Cancelar</button>
             <button type="button" className={t.boton} disabled={ocupado} onClick={onConfirmar}>{ocupado ? 'Un momento…' : accion}</button>
           </>}>
      <div className="flex gap-4">
        <span className={`grid size-10 shrink-0 place-items-center rounded-full ${t.color}`}><Icono nombre={t.icono} /></span>
        <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300">{children}</div>
      </div>
      {error && <p role="alert" className={`mt-4 ${mensajeError}`}>{error}</p>}
    </Modal>
  )
}
