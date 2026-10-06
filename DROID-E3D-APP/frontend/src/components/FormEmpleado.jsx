// Formulario para dar de alta o editar un empleado (se muestra dentro de un <Modal>).
//  - inicial: el empleado a editar, o null para uno nuevo
//  - onGuardar(datos): devuelve una promesa; si falla, el padre muestra el error
import { useState } from 'react'
import { botonPrimario, botonSecundario, campo, mensajeError } from '../utils/estilos.js'

function Campo({ etiqueta, ayuda, children }) {
  return (
    <label className="block text-sm font-medium">
      {etiqueta}
      <div className="mt-1">{children}</div>
      {ayuda && <span className="mt-1 block text-xs font-normal text-zinc-500 dark:text-zinc-400">{ayuda}</span>}
    </label>
  )
}

export default function FormEmpleado({ inicial, zonas, error, guardando, onGuardar, onCancelar }) {
  const editando = Boolean(inicial)
  const [f, setF] = useState({
    nombre: inicial?.nombre || '', usuario: inicial?.usuario || '', contrasena: '',
    legajo: inicial?.legajo || '', rol: inicial?.rol || 'empleado', zona_id: inicial?.zona_id ?? '',
  })
  const cambiar = (nombre) => (e) => setF({ ...f, [nombre]: e.target.value })

  const enviar = (e) => {
    e.preventDefault()
    const datos = {
      nombre: f.nombre.trim(), legajo: f.legajo.trim() || null, rol: f.rol,
      zona_id: f.zona_id === '' ? null : Number(f.zona_id),
    }
    if (!editando) datos.usuario = f.usuario.trim()
    if (f.contrasena) datos.contrasena = f.contrasena // al editar, vacío = no cambiarla
    onGuardar(datos)
  }

  return (
    <form onSubmit={enviar} className="space-y-4">
      <Campo etiqueta="Nombre completo">
        <input className={campo} value={f.nombre} onChange={cambiar('nombre')} required autoFocus />
      </Campo>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etiqueta="Usuario" ayuda={editando ? 'El usuario no se puede cambiar.' : 'Con este nombre entra a la web.'}>
          <input className={campo} value={f.usuario} onChange={cambiar('usuario')} required disabled={editando} autoComplete="off" />
        </Campo>
        <Campo etiqueta="Legajo">
          <input className={campo} value={f.legajo} onChange={cambiar('legajo')} placeholder="L-007" />
        </Campo>
      </div>
      <Campo etiqueta={editando ? 'Contraseña nueva' : 'Contraseña'}
             ayuda={editando ? 'Dejala vacía para no cambiarla.' : 'Mínimo 6 caracteres.'}>
        <input className={campo} type="password" value={f.contrasena} onChange={cambiar('contrasena')}
               required={!editando} minLength={6} autoComplete="new-password" />
      </Campo>
      <div className="grid gap-4 sm:grid-cols-2">
        <Campo etiqueta="Rol">
          <select className={campo} value={f.rol} onChange={cambiar('rol')}>
            <option value="empleado">Empleado</option>
            <option value="encargado">Encargado</option>
          </select>
        </Campo>
        <Campo etiqueta="Zona">
          <select className={campo} value={f.zona_id} onChange={cambiar('zona_id')}>
            <option value="">Sin zona</option>
            {zonas.map((z) => <option key={z.id} value={z.id}>{z.nombre}</option>)}
          </select>
        </Campo>
      </div>

      {error && <p role="alert" className={mensajeError}>{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className={botonSecundario} onClick={onCancelar}>Cancelar</button>
        <button type="submit" className={botonPrimario} disabled={guardando}>
          {guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear empleado'}
        </button>
      </div>
    </form>
  )
}
