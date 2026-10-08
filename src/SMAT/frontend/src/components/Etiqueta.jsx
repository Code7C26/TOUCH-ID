// Etiqueta de estado (pastilla de color). Ej: <Etiqueta tono="alerta" punto>activa</Etiqueta>
//  - tono: ok · alerta · naranja · marca · neutro
//  - punto: muestra un puntito de color adelante (útil para estados "en vivo")
const TONOS = {
  ok: 'bg-ok/10 text-green-700 ring-ok/20 dark:text-green-400',
  alerta: 'bg-alerta/10 text-red-700 ring-alerta/20 dark:text-red-400',
  naranja: 'bg-naranja/10 text-orange-700 ring-naranja/25 dark:text-orange-400',
  marca: 'bg-marca/15 text-amber-800 ring-marca/30 dark:text-marca',
  neutro: 'bg-zinc-100 text-zinc-600 ring-zinc-500/15 dark:bg-zinc-800 dark:text-zinc-300',
}
const PUNTOS = { ok: 'bg-ok', alerta: 'bg-alerta', naranja: 'bg-naranja', marca: 'bg-marca', neutro: 'bg-zinc-400' }

export default function Etiqueta({ tono = 'neutro', punto = false, children, className = '' }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap ring-1 ring-inset ${TONOS[tono]} ${className}`}>
      {punto && <span className={`size-1.5 rounded-full ${PUNTOS[tono]}`} />}
      {children}
    </span>
  )
}

// Tono de la etiqueta según el estado de una incidencia
export const tonoDeEstado = (estado) => (estado === 'activa' ? 'alerta' : 'ok')
