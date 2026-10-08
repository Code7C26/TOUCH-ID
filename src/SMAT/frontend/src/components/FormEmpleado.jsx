// Formulario para dar de alta o editar un empleado (se muestra dentro de un <PanelLateral>).
//  - inicial: el empleado a editar, o null para uno nuevo
//  - usuarios: todos los usuarios (para avisar en vivo si el usuario o el legajo ya existen)
//  - onGuardar(datos): devuelve una promesa; si el servidor rechaza algo, el padre muestra el error
import { useState } from 'react'
import useValidacion from '../hooks/useValidacion.js'
import { botonPrimario, botonSecundario, campo, mensajeError } from '../utils/estilos.js'
import Campo from './Campo.jsx'

const USUARIO_VALIDO = /^[a-z0-9._-]+$/i

export default function FormEmpleado({ inicial, zonas, usuarios = [], error, guardando, onGuardar, onCancelar }) {
  const editando = Boolean(inicial)
  const [f, setF] = useState({
    nombre: inicial?.nombre || '', usuario: inicial?.usuario || '', contrasena: '',
    legajo: inicial?.legajo || '', rol: inicial?.rol || 'empleado', zona_id: inicial?.zona_id ?? '',
  })
  const cambiar = (nombre) => (e) => setF({ ...f, [nombre]: e.target.value })
  const otros = usuarios.filter((u) => u.id !== inicial?.id)

  // Reglas: se recalculan en cada tecla (los mismos chequeos que hace el servidor, para avisar antes)
  const errores = {
    nombre: f.nombre.trim().length < 3 ? 'Escribí el nombre y apellido (mínimo 3 letras).' : '',
    usuario: editando ? ''
      : !f.usuario.trim() ? 'Elegí un nombre de usuario.'
      : !USUARIO_VALIDO.test(f.usuario.trim()) ? 'Solo letras, números, punto, guion o guion bajo (sin espacios).'
      : otros.some((u) => u.usuario.toLowerCase() === f.usuario.trim().toLowerCase()) ? 'Ya existe un usuario con ese nombre.' : '',
    legajo: f.legajo.trim() && otros.some((u) => (u.legajo || '').toLowerCase() === f.legajo.trim().toLowerCase())
      ? 'Ese legajo ya lo tiene otra persona.' : '',
    contrasena: (!editando || f.contrasena) && f.contrasena.length < 6 ? 'La contraseña necesita al menos 6 caracteres.' : '',
  }
  const { error: errorDe, tocar, puedeEnviar } = useValidacion(errores)

  const enviar = (e) => {
    e.preventDefault()
    if (!puedeEnviar()) return
    const datos = { nombre: f.nombre.trim(), legajo: f.legajo.trim() || null, rol: f.rol, zona_id: f.zona_id === '' ? null : Number(f.zona_id) }
    if (!editando) datos.usuario = f.usuario.trim()
    if (f.contrasena) datos.contrasena = f.contrasena // al editar, vacía = no cambiarla
    onGuardar(datos)
  }

  return (
    <form onSubmit={enviar} className="space-y-5" noValidate>
      <Campo etiqueta="Nombre completo" obligatorio error={errorDe('nombre')}>
        <input className={campo} value={f.nombre} onChange={cambiar('nombre')} onBlur={tocar('nombre')} autoComplete="off" />
      </Campo>
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo etiqueta="Usuario" obligatorio={!editando} error={errorDe('usuario')}
               ayuda={editando ? 'El usuario no se puede cambiar.' : 'Con este nombre entra a la web.'}>
          <input className={campo} value={f.usuario} onChange={cambiar('usuario')} onBlur={tocar('usuario')} disabled={editando} autoComplete="off" />
        </Campo>
        <Campo etiqueta="Legajo" error={errorDe('legajo')}>
          <input className={campo} value={f.legajo} onChange={cambiar('legajo')} onBlur={tocar('legajo')} placeholder="L-007" />
        </Campo>
      </div>
      <Campo etiqueta={editando ? 'Contraseña nueva' : 'Contraseña'} obligatorio={!editando} error={errorDe('contrasena')}
             ayuda={editando ? 'Dejala vacía para no cambiarla.' : 'Mínimo 6 caracteres.'}>
        <input className={campo} type="password" value={f.contrasena} onChange={cambiar('contrasena')} onBlur={tocar('contrasena')} autoComplete="new-password" />
      </Campo>
      <div className="grid gap-5 sm:grid-cols-2">
        <Campo etiqueta="Rol">
          <select className={campo} value={f.rol} onChange={cambiar('rol')}>
            <option value="empleado">Empleado</option>
            <option value="encargado">Encargado</option>
          </select>
        </Campo>
        <Campo etiqueta="Zona" ayuda={f.rol === 'empleado' && f.zona_id === '' ? 'Sin zona no va a ver qué equipo le corresponde.' : ''}>
          <select className={campo} value={f.zona_id} onChange={cambiar('zona_id')}>
            <option value="">Sin zona</option>
            {zonas.map((z) => <option key={z.id} value={z.id}>{z.nombre}</option>)}
          </select>
        </Campo>
      </div>

      {error && <p role="alert" className={mensajeError}>{error}</p>}
      <div className="flex justify-end gap-2 border-t border-zinc-100 pt-5 dark:border-zinc-800">
        <button type="button" className={botonSecundario} onClick={onCancelar}>Cancelar</button>
        <button type="submit" className={botonPrimario} disabled={guardando}>
          {guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear empleado'}
        </button>
      </div>
    </form>
  )
}
