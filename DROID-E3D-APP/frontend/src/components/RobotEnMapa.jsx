// Ficha del robot dentro del mapa de la fábrica (va dentro del <svg> de MapaFabrica).
// Cuando cambia de zona se desliza hasta la nueva posición (transición de CSS).
// Si está conectado tiene una onda que late; si no, se ve gris.
export default function RobotEnMapa({ x, y, conectado }) {
  return (
    <g className="robot-mapa pointer-events-none" style={{ transform: `translate(${x}px, ${y}px)` }}>
      <title>{conectado ? 'Robot (conectado)' : 'Robot (sin conexión)'}</title>
      {conectado && (
        <circle r="26" className="fill-marca/40">
          <animate attributeName="r" values="24;40;24" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      <circle r="26" className={`${conectado ? 'fill-marca' : 'fill-zinc-400'} stroke-tinta`} strokeWidth="3" />
      {/* Cara del robot: visor oscuro con dos luces */}
      <rect x="-15" y="-9" width="30" height="18" rx="9" className="fill-tinta" />
      <circle cx="-6" cy="0" r="3.4" className={conectado ? 'fill-marca' : 'fill-zinc-400'} />
      <circle cx="6" cy="0" r="2.6" className="fill-naranja" />
    </g>
  )
}
