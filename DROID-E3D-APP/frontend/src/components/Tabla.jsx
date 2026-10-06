// Tabla genérica. Se le dice qué columnas mostrar y cómo dibujar cada celda.
// Ej: <Tabla columnas={[{ clave: 'zona', titulo: 'Zona' },
//                      { clave: 'incidencias', titulo: 'Total', clase: 'text-right' }]}
//            filas={datos} claveFila="zona" />
// render(fila) permite dibujar algo distinto al valor (un botón, una etiqueta de color...).
export default function Tabla({ columnas, filas, claveFila = 'id', vacio = 'No hay datos para mostrar' }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <table className="w-full text-left text-sm">
        <thead className="bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-400">
          <tr>
            {columnas.map((col) => (
              <th key={col.clave} scope="col" className={`px-4 py-3 font-semibold ${col.clase || ''}`}>{col.titulo}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
          {filas.length === 0 && (
            <tr><td colSpan={columnas.length} className="px-4 py-6 text-center text-zinc-500">{vacio}</td></tr>
          )}
          {filas.map((fila) => (
            <tr key={fila[claveFila]} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
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
