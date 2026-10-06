// Gestión de empleados: alta, edición, baja y reactivación. Solo lo ve el encargado.
// La baja NO borra al empleado (se perdería su historial de alertas): lo marca como inactivo.
import { useState } from 'react'
import { createUser, deactivateUser, getUsers, getZones, updateUser } from '../../api/client.js'
import Filtros from '../../components/Filtros.jsx'
import FormEmpleado from '../../components/FormEmpleado.jsx'
import Modal from '../../components/Modal.jsx'
import Tabla from '../../components/Tabla.jsx'
import Titulo from '../../components/Titulo.jsx'
import usePolling from '../../hooks/usePolling.js'
import { botonPeligro, botonPrimario, botonSecundario, mensajeError } from '../../utils/estilos.js'

const etiqueta = (activo) => (
  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ring-1 ${activo ? 'bg-ok/10 text-ok ring-ok/30' : 'bg-zinc-100 text-zinc-500 ring-zinc-300 dark:bg-zinc-800 dark:ring-zinc-700'}`}>
    {activo ? 'Activo' : 'De baja'}
  </span>
)

export default function Empleados() {
  const [filtros, setFiltros] = useState({ q: '', rol: '', zona_id: '', activo: 'true' })
  const [formulario, setFormulario] = useState(null)   // null = cerrado · {} = nuevo · empleado = editar
  const [aBaja, setABaja] = useState(null)             // empleado que se está por dar de baja
  const [errorForm, setErrorForm] = useState('')
  const [errorLista, setErrorLista] = useState('')
  const [aviso, setAviso] = useState('')
  const [ocupado, setOcupado] = useState(false)

  const usuarios = usePolling(() => getUsers(), 15000)
  const zonas = usePolling(() => getZones(), 0)
  const listaZonas = zonas.datos?.zonas || []

  // Los filtros se aplican acá (son pocos empleados): texto, rol, zona y si está activo
  const texto = filtros.q.trim().toLowerCase()
  const filas = (usuarios.datos?.usuarios || []).filter((u) =>
    (!texto || [u.nombre, u.usuario, u.legajo].some((v) => (v || '').toLowerCase().includes(texto)))
    && (!filtros.rol || u.rol === filtros.rol)
    && (!filtros.zona_id || String(u.zona_id) === String(filtros.zona_id))
    && (!filtros.activo || String(u.activo) === filtros.activo))

  const campos = [
    { nombre: 'q', etiqueta: 'Buscar', tipo: 'texto', placeholder: 'Nombre o legajo' },
    { nombre: 'rol', etiqueta: 'Rol', tipo: 'select', opciones: [{ valor: 'empleado', texto: 'Empleados' }, { valor: 'encargado', texto: 'Encargados' }] },
    { nombre: 'zona_id', etiqueta: 'Zona', tipo: 'select', opciones: listaZonas.map((z) => ({ valor: z.id, texto: z.nombre })) },
    { nombre: 'activo', etiqueta: 'Estado', tipo: 'select', opciones: [{ valor: 'true', texto: 'Activos' }, { valor: 'false', texto: 'De baja' }] },
  ]

  const avisar = (texto) => { setAviso(texto); setTimeout(() => setAviso(''), 4000) }

  // Corre una acción del servidor y muestra el error donde corresponda
  const ejecutar = async (accion, alFallar, exito) => {
    setOcupado(true); alFallar('')
    try { await accion(); usuarios.recargar(); avisar(exito); return true }
    catch (e) { alFallar(e.message); return false }
    finally { setOcupado(false) }
  }

  const guardar = async (datos) => {
    const editando = formulario?.id
    const ok = await ejecutar(() => (editando ? updateUser(formulario.id, datos) : createUser(datos)), setErrorForm,
      editando ? 'Cambios guardados' : 'Empleado creado')
    if (ok) setFormulario(null)
  }
  const darDeBaja = async () => {
    const ok = await ejecutar(() => deactivateUser(aBaja.id), setErrorLista, `${aBaja.nombre} quedó de baja`)
    if (ok) setABaja(null)
  }

  const abrir = (u) => { setErrorForm(''); setFormulario(u) }
  const acciones = (u) => (
    <div className="flex justify-end gap-3">
      <button type="button" className="font-medium text-marca-oscuro hover:underline dark:text-marca" onClick={() => abrir(u)}>Editar</button>
      {u.activo
        ? <button type="button" className="font-medium text-alerta hover:underline" onClick={() => { setErrorLista(''); setABaja(u) }}>Dar de baja</button>
        : <button type="button" className="font-medium text-ok hover:underline" onClick={() => ejecutar(() => updateUser(u.id, { activo: true }), setErrorLista, `${u.nombre} fue reactivado`)}>Reactivar</button>}
    </div>
  )

  const columnas = [
    { clave: 'nombre', titulo: 'Nombre', render: (u) => <><strong>{u.nombre}</strong><span className="block text-xs text-zinc-500">{u.legajo || 'sin legajo'}</span></> },
    { clave: 'usuario', titulo: 'Usuario', render: (u) => `@${u.usuario}` },
    { clave: 'rol', titulo: 'Rol', clase: 'capitalize' },
    { clave: 'zona', titulo: 'Zona', render: (u) => u.zona || '—' },
    { clave: 'activo', titulo: 'Estado', render: (u) => etiqueta(u.activo) },
    { clave: 'acciones', titulo: '', render: acciones },
  ]

  return (
    <>
      <Titulo titulo="Empleados" subtitulo={usuarios.datos ? `${filas.length} de ${usuarios.datos.usuarios.length}` : 'Cargando…'}>
        <button type="button" className={botonPrimario} onClick={() => abrir({})}>+ Nuevo empleado</button>
      </Titulo>
      <Filtros campos={campos} valores={filtros} onCambiar={setFiltros} />

      <div className="mt-4 space-y-3" aria-live="polite">
        {aviso && <p role="status" className="rounded-lg bg-ok/10 px-3 py-2 text-sm text-ok">{aviso}</p>}
        {(usuarios.error || errorLista) && <p role="alert" className={mensajeError}>{usuarios.error || errorLista}</p>}
      </div>

      <div className="mt-4 hidden md:block"><Tabla columnas={columnas} filas={filas} vacio="No hay empleados con esos filtros" /></div>
      <ul className="mt-4 space-y-2 md:hidden">
        {filas.map((u) => (
          <li key={u.id} className="rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-start justify-between gap-2">
              <div><strong>{u.nombre}</strong><p className="text-xs text-zinc-500">@{u.usuario} · {u.legajo || 'sin legajo'}</p></div>
              {etiqueta(u.activo)}
            </div>
            <p className="mt-1 text-sm capitalize text-zinc-600 dark:text-zinc-300">{u.rol} · {u.zona || 'sin zona'}</p>
            <div className="mt-2 border-t border-zinc-100 pt-2 text-sm dark:border-zinc-800">{acciones(u)}</div>
          </li>
        ))}
        {filas.length === 0 && !usuarios.cargando && <li className="rounded-xl bg-white p-6 text-center text-sm text-zinc-500 dark:bg-zinc-900">No hay empleados con esos filtros.</li>}
      </ul>

      <Modal abierto={Boolean(formulario)} titulo={formulario?.id ? 'Editar empleado' : 'Nuevo empleado'} onCerrar={() => setFormulario(null)}>
        {formulario && <FormEmpleado key={formulario.id || 'nuevo'} inicial={formulario.id ? formulario : null} zonas={listaZonas}
                                     error={errorForm} guardando={ocupado} onGuardar={guardar} onCancelar={() => setFormulario(null)} />}
      </Modal>

      <Modal abierto={Boolean(aBaja)} titulo="Dar de baja" onCerrar={() => setABaja(null)}
             pie={<><button type="button" className={botonSecundario} onClick={() => setABaja(null)}>Cancelar</button>
                     <button type="button" className={botonPeligro} disabled={ocupado} onClick={darDeBaja}>Sí, dar de baja</button></>}>
        <p className="text-sm">¿Dar de baja a <strong>{aBaja?.nombre}</strong>? Ya no podrá entrar a la web, pero se conserva su historial de alertas. Podés reactivarlo cuando quieras.</p>
      </Modal>
    </>
  )
}
