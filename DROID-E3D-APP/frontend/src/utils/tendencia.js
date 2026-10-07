// Compara un número con el del período anterior (ej. alertas de hoy contra las de ayer).
// En las alertas MÁS es PEOR, por eso "sube" se pinta en rojo y "baja" en verde.
// Devuelve { direccion: 'sube' | 'baja' | 'igual', texto }
export function calcularTendencia(actual, anterior, comparadoCon) {
  if (actual == null || anterior == null) return null
  if (actual === anterior) return { direccion: 'igual', texto: `igual que ${comparadoCon}` }
  if (anterior === 0) return { direccion: 'sube', texto: `${actual} más que ${comparadoCon}` }
  const cambio = Math.round(((actual - anterior) * 100) / anterior)
  return { direccion: cambio > 0 ? 'sube' : 'baja', texto: `${Math.abs(cambio)}% vs ${comparadoCon}` }
}
