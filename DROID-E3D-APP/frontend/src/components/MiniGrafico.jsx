// Mini gráfico de línea (sparkline) en SVG propio, sin librerías.
// Ej: <MiniGrafico valores={[0, 2, 1, 4, 3]} tono="alerta" etiqueta="Alertas por día" />
const COLORES = { alerta: 'text-alerta', ok: 'text-ok', marca: 'text-marca-oscuro dark:text-marca', neutro: 'text-zinc-400' }
const ANCHO = 120
const ALTO = 32

export default function MiniGrafico({ valores, tono = 'neutro', etiqueta }) {
  if (!valores?.length) return null
  const maximo = Math.max(...valores, 1)
  const paso = ANCHO / Math.max(valores.length - 1, 1)
  const puntos = valores.map((v, i) => [i * paso, ALTO - 3 - (v / maximo) * (ALTO - 6)])
  const linea = puntos.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ')
  const [ultX, ultY] = puntos[puntos.length - 1]

  return (
    <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} preserveAspectRatio="none" className={`h-8 w-full ${COLORES[tono]}`}
         role="img" aria-label={`${etiqueta}: ${valores.join(', ')}`}>
      <polygon points={`0,${ALTO} ${linea} ${ANCHO},${ALTO}`} fill="currentColor" opacity="0.08" />
      <polyline points={linea} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
      <circle cx={ultX} cy={ultY} r="2.2" fill="currentColor" />
    </svg>
  )
}
