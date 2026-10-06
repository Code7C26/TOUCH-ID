// Video en vivo de la cámara del robot. La PC con la IA lo sirve como MJPEG (una imagen que se
// va renovando), y el navegador lo muestra con una simple etiqueta <img>.
//  - url: dirección del stream (ej. http://192.168.0.20:8080/video). Vacía = sin video configurado.
import { useEffect, useState } from 'react'
import { botonSecundario } from '../utils/estilos.js'

export default function VideoEnVivo({ url }) {
  const [falla, setFalla] = useState(false)
  const [intento, setIntento] = useState(0)   // al cambiar, el navegador vuelve a pedir el video

  useEffect(() => { setFalla(false) }, [url])

  // Una página https no puede mostrar video http (el navegador lo bloquea): se avisa en vez de quedar en negro
  const bloqueado = Boolean(url) && window.location.protocol === 'https:' && url.startsWith('http://')

  let aviso = null
  if (!url) aviso = { titulo: 'Sin video configurado', texto: 'Indicá abajo la dirección del video que sirve la PC con la IA.' }
  else if (bloqueado) aviso = { titulo: 'El navegador bloquea este video', texto: 'La web usa https y el video usa http. Usá la web en la red local o un video https.' }
  else if (falla) aviso = { titulo: 'Sin señal de video', texto: 'No se pudo conectar con la cámara. Revisá que la PC con la IA esté encendida y en la misma red.' }

  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-zinc-900">
      {url && !bloqueado && (
        <img key={`${url}-${intento}`} src={url} alt="Video en vivo de la cámara del robot"
             className={`size-full object-contain ${falla ? 'invisible' : ''}`}
             onError={() => setFalla(true)} onLoad={() => setFalla(false)} />
      )}

      {aviso ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center text-zinc-300">
          <p className="font-semibold text-white">{aviso.titulo}</p>
          <p className="max-w-sm text-sm">{aviso.texto}</p>
          {falla && <button type="button" className={`${botonSecundario} mt-1 border-zinc-600 text-white hover:bg-zinc-800`} onClick={() => setIntento(intento + 1)}>Reintentar</button>}
        </div>
      ) : (
        <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 rounded-full bg-black/60 px-2.5 py-1 text-xs font-semibold text-white">
          <span className="size-2 animate-pulse rounded-full bg-alerta" /> EN VIVO
        </span>
      )}
    </div>
  )
}
