// Devuelve el valor recién cuando se deja de cambiar por un rato (ej. al escribir en un buscador).
// Así no se le pide al servidor una búsqueda por cada letra.
// Uso:  const textoBuscado = useDemora(texto, 350)
import { useEffect, useState } from 'react'

export default function useDemora(valor, milisegundos = 350) {
  const [demorado, setDemorado] = useState(valor)
  useEffect(() => {
    const id = setTimeout(() => setDemorado(valor), milisegundos)
    return () => clearTimeout(id)
  }, [valor, milisegundos])
  return demorado
}
