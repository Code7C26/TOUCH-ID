// Pide datos al backend y los vuelve a pedir cada cierto tiempo (así las alertas aparecen solas).
// Uso:  const { datos, error, cargando, recargar } = usePolling(() => getStats(), 5000)
//  - intervaloMs = 0  -> pide una sola vez (sin repetir)
//  - deps            -> si cambian (ej. un filtro), vuelve a pedir enseguida
// Mientras la pestaña está oculta no consulta, para no gastar batería ni servidor.
import { useCallback, useEffect, useRef, useState } from 'react'

export default function usePolling(cargar, intervaloMs = 5000, deps = []) {
  const [datos, setDatos] = useState(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  // Guardamos siempre la última versión de "cargar" sin reiniciar el intervalo
  const refCargar = useRef(cargar)
  refCargar.current = cargar

  const recargar = useCallback(async () => {
    try {
      setDatos(await refCargar.current())
      setError('')
    } catch (e) {
      setError(e.message)
    } finally {
      setCargando(false)
    }
  }, [])

  useEffect(() => {
    setCargando(true)
    recargar()
    if (!intervaloMs) return undefined
    const id = setInterval(() => {
      if (document.visibilityState === 'visible') recargar()
    }, intervaloMs)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recargar, intervaloMs, ...deps])

  return { datos, error, cargando, recargar }
}
