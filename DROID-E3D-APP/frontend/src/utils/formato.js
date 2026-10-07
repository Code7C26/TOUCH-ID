// Funciones para mostrar datos lindos en pantalla: fechas, nombres de EPP, porcentajes y colores.

export const NOMBRES_EPP = { casco: 'Casco', guantes: 'Guantes', lentes: 'Lentes', chaleco: 'Chaleco' }

const NOMBRES_TIPO = {
  sin_casco: 'Sin casco',
  sin_guantes: 'Sin guantes',
  sin_lentes: 'Sin lentes',
  sin_chaleco: 'Sin chaleco',
}

// 'sin_casco' -> 'Sin casco'
export function nombreTipo(tipo) {
  return NOMBRES_TIPO[tipo] || tipo
}

// '2026-10-05T14:32:00' -> '05/10/2026 14:32'
export function formatearFecha(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

// '2026-10-05T14:32:00' -> 'hace 5 min' / 'hace 2 h' / 'hace 3 días'
export function haceCuanto(iso) {
  if (!iso) return ''
  const minutos = Math.round((Date.now() - new Date(iso).getTime()) / 60000)
  if (minutos < 1) return 'recién'
  if (minutos < 60) return `hace ${minutos} min`
  const horas = Math.round(minutos / 60)
  if (horas < 24) return `hace ${horas} h`
  const dias = Math.round(horas / 24)
  return `hace ${dias} ${dias === 1 ? 'día' : 'días'}`
}

// 0.934 -> '93%'
export function porcentaje(valor) {
  return `${Math.round((valor || 0) * 100)}%`
}

// Date -> 'AAAA-MM-DD' en hora local (es el formato que usa el backend para los filtros de fecha)
export function fechaISO(fecha) {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${fecha.getFullYear()}-${mes}-${dia}`
}

// La fecha de hace N días, como 'AAAA-MM-DD'
export function fechaHaceDias(dias) {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() - dias)
  return fechaISO(fecha)
}
