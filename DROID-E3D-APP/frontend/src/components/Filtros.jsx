// Barra de filtros configurable. Cada campo puede ser 'select', 'fecha' o 'texto'.
// Ej: <Filtros campos={[{ nombre: 'estado', etiqueta: 'Estado', tipo: 'select',
//                         opciones: [{ valor: 'activa', texto: 'Activas' }] },
//                       { nombre: 'desde', etiqueta: 'Desde', tipo: 'fecha' }]}
//              valores={filtros} onCambiar={setFiltros} />
const claseCampo = 'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900'

export default function Filtros({ campos, valores, onCambiar }) {
  const cambiar = (nombre, valor) => onCambiar({ ...valores, [nombre]: valor })
  const hayFiltros = Object.values(valores).some((v) => v !== '' && v != null)

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-900">
      {campos.map((campo) => (
        <label key={campo.nombre} className="min-w-36 flex-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
          {campo.etiqueta}
          <div className="mt-1">
            {campo.tipo === 'select' ? (
              <select className={claseCampo} value={valores[campo.nombre] ?? ''}
                      onChange={(e) => cambiar(campo.nombre, e.target.value)}>
                <option value="">Todos</option>
                {campo.opciones.map((op) => <option key={op.valor} value={op.valor}>{op.texto}</option>)}
              </select>
            ) : (
              <input type={campo.tipo === 'fecha' ? 'date' : 'text'} className={claseCampo}
                     value={valores[campo.nombre] ?? ''} placeholder={campo.placeholder}
                     onChange={(e) => cambiar(campo.nombre, e.target.value)} />
            )}
          </div>
        </label>
      ))}
      {hayFiltros && (
        <button type="button" className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
                onClick={() => onCambiar(Object.fromEntries(campos.map((c) => [c.nombre, ''])))}>
          Limpiar
        </button>
      )}
    </div>
  )
}
