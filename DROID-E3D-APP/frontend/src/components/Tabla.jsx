// Tabla genérica. Se le dice qué columnas mostrar y cómo dibujar cada celda.
// Ej: <Tabla columnas={[{ clave: 'zona', titulo: 'Zona', ordenable: true },
//                      { clave: 'incidencias', titulo: 'Total', clase: 'text-right' }]}
//            filas={datos} claveFila="zona" />
//  - render(fila): dibuja algo distinto al valor (un botón, una etiqueta de color...)
//  - ordenable: el encabezado se puede tocar para ordenar (otra vez = al revés)
//  - valorOrden(fila): qué valor usar para ordenar, si no es fila[clave]
// Orden: si se pasan `orden` y `onOrdenar`, ordena el que llama (ej. el servidor, con paginado);
// si no, la tabla ordena sola las filas que recibe.
import { useState } from 'react'

const comparar = (a, b) => {
  if (a == null || a === '') return 1                       // los vacíos siempre al final
  if (b == null || b === '') return -1
  return typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b), 'es')
}

function Flecha({ estado }) {
  return <span aria-hidden="true" className={`text-[10px] ${estado ? 'text-zinc-900 dark:text-white' : 'text-zinc-300 dark:text-zinc-600'}`}>
    {estado === 'asc' ? '▲' : estado === 'desc' ? '▼' : '▲▼'}
  </span>
}

export default function Tabla({ columnas, filas, claveFila = 'id', vacio = 'No hay datos para mostrar', orden, onOrdenar }) {
  const [ordenPropio, setOrdenPropio] = useState(null)        // { clave, asc } cuando ordena la tabla
  const controlado = Boolean(onOrdenar)
  const actual = controlado ? orden : ordenPropio

  const tocar = (clave) => {
    const siguiente = { clave, asc: actual?.clave === clave ? !actual.asc : true }
    if (controlado) onOrdenar(siguiente)
    else setOrdenPropio(siguiente)
  }

  let visibles = filas
  if (!controlado && actual) {
    const col = columnas.find((c) => c.clave === actual.clave)
    const valor = col?.valorOrden || ((f) => f[actual.clave])
    visibles = [...filas].sort((a, b) => comparar(valor(a), valor(b)) * (actual.asc ? 1 : -1))
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-zinc-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-200/80 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
          <tr>
            {columnas.map((col) => {
              const estado = actual?.clave === col.clave ? (actual.asc ? 'asc' : 'desc') : null
              return (
                <th key={col.clave} scope="col" className={`px-4 py-3 font-medium ${col.clase || ''}`}
                    aria-sort={estado ? (estado === 'asc' ? 'ascending' : 'descending') : undefined}>
                  {col.ordenable ? (
                    <button type="button" onClick={() => tocar(col.clave)}
                            className="-mx-1 inline-flex items-center gap-1.5 rounded px-1 hover:text-zinc-900 dark:hover:text-white">
                      {col.titulo}<Flecha estado={estado} />
                    </button>
                  ) : col.titulo}
                </th>
              )
            })}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {visibles.length === 0 && (
            <tr><td colSpan={columnas.length} className="px-4 py-8 text-center text-zinc-500">{vacio}</td></tr>
          )}
          {visibles.map((fila) => (
            <tr key={fila[claveFila]} className="transition hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40">
              {columnas.map((col) => (
                <td key={col.clave} className={`px-4 py-3 ${col.clase || ''}`}>
                  {col.render ? col.render(fila) : fila[col.clave]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
