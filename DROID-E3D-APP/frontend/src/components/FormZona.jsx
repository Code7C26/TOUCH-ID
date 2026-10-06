// Formulario para crear o editar una zona (se muestra dentro de un <Modal>).
// Incluye una vista previa del mapa: se ve dónde queda la zona y si se superpone con otra.
//  - inicial: la zona a editar, o {} para una nueva
//  - zonas: todas las zonas existentes (para el mapa y para detectar superposiciones)
import { useState } from 'react'
import { botonPrimario, botonSecundario, campo, mensajeError } from '../utils/estilos.js'
import { NOMBRES_EPP } from '../utils/formato.js'
import { zonasQueChocan } from '../utils/mapa.js'
import MapaFabrica from './MapaFabrica.jsx'

const NUMEROS = [
  { nombre: 'grilla_x', etiqueta: 'Columna', min: 0 }, { nombre: 'grilla_y', etiqueta: 'Fila', min: 0 },
  { nombre: 'ancho', etiqueta: 'Ancho', min: 1 }, { nombre: 'alto', etiqueta: 'Alto', min: 1 },
]
const entero = (valor, minimo) => Math.max(minimo, Number.parseInt(valor, 10) || minimo)

export default function FormZona({ inicial, zonas, error, guardando, onGuardar, onCancelar }) {
  const [f, setF] = useState({
    nombre: inicial.nombre || '', maquina: inicial.maquina || '', epp_requerido: inicial.epp_requerido || [],
    grilla_x: inicial.grilla_x ?? 0, grilla_y: inicial.grilla_y ?? 0, ancho: inicial.ancho ?? 3, alto: inicial.alto ?? 2,
  })

  // La zona tal como quedaría: se usa para el mapa de vista previa y para ver si choca
  const borrador = {
    id: inicial.id ?? -1, nombre: f.nombre.trim() || 'Zona nueva', maquina: f.maquina, maquina_activa: inicial.maquina_activa ?? true,
    grilla_x: entero(f.grilla_x, 0), grilla_y: entero(f.grilla_y, 0), ancho: entero(f.ancho, 1), alto: entero(f.alto, 1),
  }
  const choques = zonasQueChocan(zonas, borrador)

  const alternarEpp = (epp) => setF({
    ...f, epp_requerido: f.epp_requerido.includes(epp) ? f.epp_requerido.filter((e) => e !== epp) : [...f.epp_requerido, epp],
  })

  const enviar = (e) => {
    e.preventDefault()
    onGuardar({
      nombre: f.nombre.trim(), maquina: f.maquina.trim(), epp_requerido: f.epp_requerido,
      grilla_x: borrador.grilla_x, grilla_y: borrador.grilla_y, ancho: borrador.ancho, alto: borrador.alto,
    })
  }

  return (
    <form onSubmit={enviar} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium">Nombre de la zona
          <input className={`${campo} mt-1`} value={f.nombre} onChange={(e) => setF({ ...f, nombre: e.target.value })} required autoFocus />
        </label>
        <label className="block text-sm font-medium">Máquina
          <input className={`${campo} mt-1`} value={f.maquina} onChange={(e) => setF({ ...f, maquina: e.target.value })} placeholder="Ej: Sierra circular" />
        </label>
      </div>

      <fieldset>
        <legend className="text-sm font-medium">Equipo de protección obligatorio</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {Object.entries(NOMBRES_EPP).map(([clave, nombre]) => (
            <label key={clave} className={`cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium ${
              f.epp_requerido.includes(clave) ? 'border-marca bg-marca/20' : 'border-zinc-300 dark:border-zinc-700'}`}>
              <input type="checkbox" className="mr-2 accent-[#f5b800]" checked={f.epp_requerido.includes(clave)} onChange={() => alternarEpp(clave)} />
              {nombre}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium">Lugar en el mapa <span className="font-normal text-zinc-500">(en celdas)</span></legend>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {NUMEROS.map(({ nombre, etiqueta, min }) => (
            <label key={nombre} className="text-xs text-zinc-500 dark:text-zinc-400">{etiqueta}
              <input type="number" min={min} max="20" className={`${campo} mt-1`} value={f[nombre]} onChange={(e) => setF({ ...f, [nombre]: e.target.value })} />
            </label>
          ))}
        </div>
        <div className="mt-3"><MapaFabrica zonas={[...zonas.filter((z) => z.id !== borrador.id), borrador]} seleccionada={borrador.id} /></div>
        {choques.length > 0 && (
          <p role="alert" className={`mt-2 ${mensajeError}`}>Esa posición se superpone con: {choques.map((z) => z.nombre).join(', ')}. Cambiá el lugar o el tamaño.</p>
        )}
      </fieldset>

      {error && <p role="alert" className={mensajeError}>{error}</p>}
      <div className="flex justify-end gap-2 pt-2">
        <button type="button" className={botonSecundario} onClick={onCancelar}>Cancelar</button>
        <button type="submit" className={botonPrimario} disabled={guardando || choques.length > 0}>
          {guardando ? 'Guardando…' : inicial.id ? 'Guardar cambios' : 'Crear zona'}
        </button>
      </div>
    </form>
  )
}
