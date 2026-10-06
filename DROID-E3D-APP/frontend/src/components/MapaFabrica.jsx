// Plano de la fábrica en grilla (SVG). Cada zona es un rectángulo de celdas.
//  - verde: todo en orden · rojo: alertas activas · naranja: máquina detenida
//  - el robot aparece en la zona donde está (amarillo = conectado, gris = sin conexión)
// Props:
//   zonas            lista de zonas (con grilla_x, grilla_y, ancho, alto)
//   alertasPorZona   { zona_id: cantidad de alertas activas }
//   robot            { zona_actual_id, conectado } (opcional)
//   seleccionada     id de la zona resaltada (opcional)
//   onSeleccionar    función(zona) al tocar una zona (opcional; si no se pasa, el mapa es solo para mirar)
import { estadoZona, medidasGrilla } from '../utils/mapa.js'

const CELDA = 100   // cada celda mide 100 unidades dentro del SVG (se escala sola a la pantalla)
const MARGEN = 5

const COLORES = {
  ok: { caja: 'fill-ok/15 stroke-ok', texto: 'Todo en orden' },
  alerta: { caja: 'fill-alerta/20 stroke-alerta', texto: null },
  detenida: { caja: 'fill-naranja/20 stroke-naranja', texto: 'Máquina detenida' },
}

function ZonaEnMapa({ zona, alertas, robotAca, robotConectado, seleccionada, onSeleccionar }) {
  const estado = estadoZona(zona, alertas)
  const x = zona.grilla_x * CELDA + MARGEN
  const y = zona.grilla_y * CELDA + MARGEN
  const ancho = zona.ancho * CELDA - MARGEN * 2
  const alto = zona.alto * CELDA - MARGEN * 2
  const interactiva = Boolean(onSeleccionar)
  const resumen = `${zona.nombre}: ${estado === 'alerta' ? `${alertas} alerta(s) activa(s)` : COLORES[estado].texto}`

  return (
    <g role={interactiva ? 'button' : 'img'} aria-label={resumen} tabIndex={interactiva ? 0 : undefined}
       className={interactiva ? 'cursor-pointer outline-none [&:focus-visible>rect]:stroke-[5]' : ''}
       onClick={interactiva ? () => onSeleccionar(zona) : undefined}
       onKeyDown={interactiva ? (e) => (e.key === 'Enter' || e.key === ' ') && onSeleccionar(zona) : undefined}>
      <rect x={x} y={y} width={ancho} height={alto} rx="12"
            className={`${COLORES[estado].caja} ${seleccionada ? 'stroke-[6]' : 'stroke-[2.5]'}`} />
      <text x={x + 14} y={y + 38} className="fill-zinc-900 text-[29px] font-bold dark:fill-zinc-100">{zona.nombre}</text>
      {zona.maquina && ancho >= 190 && (
        <text x={x + 14} y={y + 66} className="fill-zinc-600 text-[21px] dark:fill-zinc-300">{zona.maquina}</text>
      )}
      <text x={x + 14} y={y + alto - 16}
            className={`text-[22px] font-semibold ${estado === 'alerta' ? 'fill-alerta' : estado === 'detenida' ? 'fill-naranja' : 'fill-ok'}`}>
        {estado === 'alerta' ? `${alertas} alerta${alertas > 1 ? 's' : ''}` : COLORES[estado].texto}
      </text>
      {robotAca && (
        <g transform={`translate(${x + ancho - 46} ${y + alto - 46})`}>
          <title>{robotConectado ? 'Robot (conectado)' : 'Robot (sin conexión)'}</title>
          <circle cx="18" cy="18" r="18" className={`${robotConectado ? 'fill-marca' : 'fill-zinc-400'} stroke-tinta stroke-2 ${robotConectado ? 'animate-pulse' : ''}`} />
          <rect x="7" y="11" width="22" height="14" rx="7" className="fill-tinta" />
          <circle cx="14" cy="18" r="2.6" className="fill-marca" />
          <circle cx="22" cy="18" r="2" className="fill-naranja" />
        </g>
      )}
    </g>
  )
}

export default function MapaFabrica({ zonas, alertasPorZona = {}, robot, seleccionada, onSeleccionar }) {
  const { columnas, filas } = medidasGrilla(zonas)
  const ancho = columnas * CELDA
  const alto = filas * CELDA

  return (
    <svg viewBox={`0 0 ${ancho} ${alto}`} className="h-auto w-full select-none" role="group" aria-label="Plano de la fábrica">
      <defs>
        <pattern id="celdas" width={CELDA} height={CELDA} patternUnits="userSpaceOnUse">
          <path d={`M ${CELDA} 0 L 0 0 0 ${CELDA}`} fill="none" className="stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="1" strokeDasharray="4 6" />
        </pattern>
      </defs>
      <rect width={ancho} height={alto} rx="14" className="fill-zinc-50 stroke-zinc-300 dark:fill-zinc-900/60 dark:stroke-zinc-700" />
      <rect width={ancho} height={alto} fill="url(#celdas)" />
      {zonas.map((zona) => (
        <ZonaEnMapa key={zona.id} zona={zona} alertas={alertasPorZona[zona.id] || 0}
                    robotAca={robot?.zona_actual_id === zona.id} robotConectado={robot?.conectado}
                    seleccionada={seleccionada === zona.id} onSeleccionar={onSeleccionar} />
      ))}
    </svg>
  )
}

// Referencia de colores para poner debajo del mapa
export function LeyendaMapa() {
  const item = (color, texto) => (
    <li className="flex items-center gap-1.5"><span className={`size-3 rounded-sm ${color}`} />{texto}</li>
  )
  return (
    <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500 dark:text-zinc-400">
      {item('bg-ok', 'En orden')}{item('bg-alerta', 'Alertas activas')}{item('bg-naranja', 'Máquina detenida')}{item('bg-marca', 'Robot')}
    </ul>
  )
}
