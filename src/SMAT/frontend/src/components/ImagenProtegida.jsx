// Muestra una foto del backend que necesita sesión (evidencias y rostros).
// Ej: <ImagenProtegida ruta="/uploads/evidencias/12_ab.jpg" alt="Evidencia" className="h-40 w-full" />
// Mientras carga muestra un recuadro gris; si falla, un aviso corto.
import { useEffect, useState } from 'react'
import { getImagen } from '../api/client.js'

export default function ImagenProtegida({ ruta, alt, className = '' }) {
  const [src, setSrc] = useState(null)
  const [fallo, setFallo] = useState(false)

  useEffect(() => {
    let vigente = true   // si el componente se va antes de que llegue la foto, no la usamos
    setSrc(null); setFallo(false)
    getImagen(ruta).then((url) => vigente && setSrc(url)).catch(() => vigente && setFallo(true))
    return () => { vigente = false }
  }, [ruta])

  if (fallo) {
    return <div className={`grid place-items-center bg-zinc-100 text-xs text-zinc-500 dark:bg-zinc-800 ${className}`}>Foto no disponible</div>
  }
  if (!src) return <div className={`animate-pulse bg-zinc-200 dark:bg-zinc-800 ${className}`} aria-label="Cargando foto" />
  return <img src={src} alt={alt} className={`object-cover ${className}`} />
}
