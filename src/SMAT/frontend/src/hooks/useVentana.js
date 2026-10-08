// Comportamiento común de ventanas y paneles laterales (accesibles con el teclado):
//  - al abrir: enfoca el primer campo y bloquea el scroll de la página de atrás
//  - Esc cierra; Tab y Shift+Tab quedan "atrapados" adentro (no se escapan a la página de atrás)
//  - al cerrar: devuelve el foco al botón que la abrió
// Uso:  const ref = useVentana(abierto, onCerrar)   y   <div ref={ref} role="dialog" ...>
import { useEffect, useRef } from 'react'

const ENFOCABLES = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

export default function useVentana(abierto, onCerrar) {
  const ref = useRef(null)
  const cerrar = useRef(onCerrar)
  cerrar.current = onCerrar // siempre la última versión, sin reinstalar el efecto en cada dibujo

  useEffect(() => {
    if (!abierto) return undefined
    const anterior = document.activeElement
    const caja = ref.current
    const primero = caja?.querySelector('input, select, textarea') || caja?.querySelector(ENFOCABLES)
    ;(primero || caja)?.focus()

    const alTeclear = (e) => {
      if (e.key === 'Escape') { cerrar.current(); return }
      if (e.key !== 'Tab' || !caja) return
      const items = [...caja.querySelectorAll(ENFOCABLES)].filter((el) => el.offsetParent !== null)
      if (items.length === 0) return
      const [inicio, fin] = [items[0], items[items.length - 1]]
      if (e.shiftKey && document.activeElement === inicio) { e.preventDefault(); fin.focus() }
      else if (!e.shiftKey && document.activeElement === fin) { e.preventDefault(); inicio.focus() }
    }
    document.addEventListener('keydown', alTeclear)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', alTeclear)
      document.body.style.overflow = ''
      anterior?.focus?.()
    }
  }, [abierto])

  return ref
}
