// Cálculos del mapa de la fábrica. Cada zona ocupa un rectángulo de celdas:
// grilla_x y grilla_y (esquina de arriba a la izquierda), ancho y alto (en celdas).

// Tamaño de la grilla: lo que necesitan las zonas, con un mínimo para que el mapa no quede diminuto
export function medidasGrilla(zonas, minColumnas = 6, minFilas = 4) {
  return {
    columnas: Math.max(minColumnas, ...zonas.map((z) => z.grilla_x + z.ancho)),
    filas: Math.max(minFilas, ...zonas.map((z) => z.grilla_y + z.alto)),
  }
}

// ¿Dos zonas se superponen?
export function seSuperponen(a, b) {
  return a.grilla_x < b.grilla_x + b.ancho && b.grilla_x < a.grilla_x + a.ancho
      && a.grilla_y < b.grilla_y + b.alto && b.grilla_y < a.grilla_y + a.alto
}

// Zonas con las que choca la que se está editando (se ignora a sí misma por id)
export function zonasQueChocan(zonas, borrador) {
  return zonas.filter((z) => z.id !== borrador.id && seSuperponen(z, borrador))
}

// Estado visual de una zona: alerta (hay alertas activas), detenida (máquina parada) u ok
export function estadoZona(zona, alertasActivas = 0) {
  if (alertasActivas > 0) return 'alerta'
  if (zona.maquina && !zona.maquina_activa) return 'detenida'
  return 'ok'
}

// Cuenta las alertas activas de cada zona: { 2: 3, 4: 1 }
export function contarPorZona(incidencias) {
  return incidencias.reduce((cuenta, inc) => {
    cuenta[inc.zona_id] = (cuenta[inc.zona_id] || 0) + 1
    return cuenta
  }, {})
}
