// Tarjeta con un número grande. Ej: <StatCard titulo="Alertas hoy" valor={3} icono="alerta" tono="alerta" />
import Icono from './Icono.jsx'

const TONOS = {
  marca: 'bg-marca/15 text-marca-oscuro dark:text-marca',
  alerta: 'bg-alerta/10 text-alerta',
  ok: 'bg-ok/10 text-ok',
  neutro: 'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300',
}

// icono es opcional: en pantallas angostas conviene omitirlo para que el título tenga lugar.
export default function StatCard({ titulo, valor, detalle, icono, tono = 'neutro' }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{titulo}</p>
        {icono && (
          <span className={`grid size-9 shrink-0 place-items-center rounded-lg ${TONOS[tono]}`}>
            <Icono nombre={icono} />
          </span>
        )}
      </div>
      <p className="mt-1 text-3xl font-bold tabular-nums">{valor ?? '—'}</p>
      {detalle && <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">{detalle}</p>}
    </div>
  )
}
