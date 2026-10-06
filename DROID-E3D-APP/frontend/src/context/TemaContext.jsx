// Tema claro / oscuro. Se guarda en el navegador y se aplica con la clase "dark" en <html>.
// Uso:  const { oscuro, cambiarTema } = useTema()
import { createContext, useContext, useEffect, useState } from 'react'

const TemaContext = createContext(null)

// Si el usuario nunca eligió, se usa el tema del sistema operativo
function temaInicial() {
  try {
    const guardado = localStorage.getItem('tema')
    if (guardado) return guardado === 'oscuro'
  } catch {
    // sin acceso a localStorage: seguimos con el del sistema
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function TemaProvider({ children }) {
  const [oscuro, setOscuro] = useState(temaInicial)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', oscuro)
    try {
      localStorage.setItem('tema', oscuro ? 'oscuro' : 'claro')
    } catch {
      // no pasa nada si no se puede guardar
    }
  }, [oscuro])

  const cambiarTema = () => setOscuro((actual) => !actual)

  return <TemaContext.Provider value={{ oscuro, cambiarTema }}>{children}</TemaContext.Provider>
}

export function useTema() {
  return useContext(TemaContext)
}
