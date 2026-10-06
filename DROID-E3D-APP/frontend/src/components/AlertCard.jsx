// Tarjeta de una alerta (incidencia).
//  - onResolver: muestra el botón "Resolver" (solo si la alerta está activa)
//  - onVer: muestra el botón "Detalle"
import { COLOR_ESTADO, formatearFecha, haceCuanto, nombreTipo, porcentaje } from '../utils/formato.js'
import Icono from './Icono.jsx'

export default function AlertCard({ incidencia, onResolver, onVer }) {
  const activa = incidencia.estado === 'activa'

  return (
    <article className={`flex items-center gap-3 rounded-xl border border-zinc-200 border-l-4 bg-white p-3 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 ${
      activa ? 'border-l-alerta' : 'border-l-ok opacity-75'
    }`}>
      <span className={`grid size-10 shrink-0 place-items-center rounded-lg ${activa ? 'bg-alerta/10 text-alerta' : 'bg-ok/10 text-ok'}`}>
        <Icono nombre={activa ? 'alerta' : 'ok'} />
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <strong className="text-sm">{nombreTipo(incidencia.tipo)}</strong>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${COLOR_ESTADO[incidencia.estado] || ''}`}>
            {incidencia.estado}
          </span>
        </div>
        <p className="truncate text-sm text-zinc-600 dark:text-zinc-300">
          {incidencia.zona} · {incidencia.empleado_nombre}
        </p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400" title={formatearFecha(incidencia.timestamp)}>
          {haceCuanto(incidencia.timestamp)} · confianza {porcentaje(incidencia.confianza)}
        </p>
      </div>

      {(onVer || (onResolver && activa)) && (
        <div className="flex shrink-0 flex-col gap-1.5">
          {onResolver && activa && (
            <button type="button" onClick={() => onResolver(incidencia.id)}
                    className="rounded-lg bg-marca px-3 py-1.5 text-sm font-semibold text-tinta hover:bg-marca-oscuro">
              Resolver
            </button>
          )}
          {onVer && (
            <button type="button" onClick={() => onVer(incidencia)}
                    className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-medium hover:bg-zinc-100 dark:border-zinc-700 dark:hover:bg-zinc-800">
              Detalle
            </button>
          )}
        </div>
      )}
    </article>
  )
}
