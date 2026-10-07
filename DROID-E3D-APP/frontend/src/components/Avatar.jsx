// Círculo con las iniciales de una persona. El color sale del nombre, así cada persona tiene siempre el mismo.
// Ej: <Avatar nombre="Carlos Díaz" />  ->  "CD"
const COLORES = [
  'bg-amber-100 text-amber-800', 'bg-sky-100 text-sky-800', 'bg-emerald-100 text-emerald-800',
  'bg-violet-100 text-violet-800', 'bg-rose-100 text-rose-800', 'bg-teal-100 text-teal-800', 'bg-orange-100 text-orange-800',
]
const TAMANOS = { sm: 'size-7 text-[11px]', md: 'size-9 text-xs', lg: 'size-12 text-base' }

export function iniciales(nombre = '') {
  const partes = nombre.trim().split(/\s+/).filter(Boolean)
  return ((partes[0]?.[0] || '?') + (partes[1]?.[0] || '')).toUpperCase()
}

export default function Avatar({ nombre, tamano = 'md' }) {
  // Suma de los códigos de las letras -> siempre el mismo color para el mismo nombre
  const suma = [...(nombre || '')].reduce((total, letra) => total + letra.charCodeAt(0), 0)
  const desconocido = !nombre || nombre === 'Desconocido'
  return (
    <span aria-hidden="true"
          className={`inline-grid shrink-0 place-items-center rounded-full font-semibold ${TAMANOS[tamano]} ${
            desconocido ? 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800' : COLORES[suma % COLORES.length]}`}>
      {desconocido ? '?' : iniciales(nombre)}
    </span>
  )
}
