// Notificaciones push en ESTE dispositivo (celular o PC): avisan cada alerta aunque la web esté cerrada.
// Uso:  const { estado, ocupado, error, activar, desactivar, probar } = useNotificaciones()
//
// estado:
//  'cargando'       revisando el navegador
//  'no-soportado'   el navegador no las permite acá (por ejemplo, web por http con la IP de la PC)
//  'solo-compilada' estamos en "npm run dev": el service worker solo existe en la versión compilada
//  'bloqueadas'     la persona dijo "Bloquear" al permiso de notificaciones
//  'apagadas'       se pueden activar
//  'activadas'      este dispositivo ya recibe las notificaciones
import { useCallback, useEffect, useState } from 'react'
import { desuscribirPush, getClavePush, probarPush, suscribirPush } from '../api/client.js'

const soportado = 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window

// La clave pública llega como texto (base64 "para URLs"); el navegador la quiere como bytes
function aBytes(base64url) {
  const base64 = (base64url + '='.repeat((4 - (base64url.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/')
  return Uint8Array.from(atob(base64), (letra) => letra.charCodeAt(0))
}

// La suscripción que tiene guardada el navegador (o null)
async function suscripcionActual() {
  const registro = await navigator.serviceWorker.ready
  return registro.pushManager.getSubscription()
}

// Al cerrar sesión: este dispositivo deja de recibir las notificaciones de esa persona.
// Basta con darla de baja en el navegador: la próxima vez que el servidor intente mandarle algo,
// el servicio de push le contesta "ya no existe" y el servidor la borra solo.
export async function olvidarEsteDispositivo() {
  if (!soportado || import.meta.env.DEV) return
  const registro = await navigator.serviceWorker.getRegistration()
  const suscripcion = await registro?.pushManager.getSubscription()
  await suscripcion?.unsubscribe()
}

export default function useNotificaciones() {
  const [estado, setEstado] = useState('cargando')
  const [ocupado, setOcupado] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!soportado) {
      setEstado('no-soportado')
    } else if (import.meta.env.DEV) {
      setEstado('solo-compilada')
    } else if (Notification.permission === 'denied') {
      setEstado('bloqueadas')
    } else {
      let vigente = true
      suscripcionActual()
        .then((suscripcion) => {
          if (!vigente) return
          setEstado(suscripcion ? 'activadas' : 'apagadas')
          // Si ya estaba suscripto, se avisa otra vez al servidor por si ahora entró otra persona
          if (suscripcion) suscribirPush(suscripcion.toJSON()).catch(() => {})
        })
        .catch(() => vigente && setEstado('apagadas'))
      return () => { vigente = false }
    }
    return undefined
  }, [])

  // Envuelve cada acción: muestra "ocupado" y guarda el mensaje si algo falla
  const hacer = useCallback(async (accion) => {
    setOcupado(true)
    setError('')
    try {
      return await accion()
    } catch (e) {
      setError(e.message || 'No se pudo completar la acción')
      return null
    } finally {
      setOcupado(false)
    }
  }, [])

  const activar = () => hacer(async () => {
    const permiso = await Notification.requestPermission()   // el navegador pregunta "¿Permitir notificaciones?"
    if (permiso !== 'granted') {
      setEstado(permiso === 'denied' ? 'bloqueadas' : 'apagadas')
      return
    }
    const { clave_publica: clave } = await getClavePush()
    const registro = await navigator.serviceWorker.ready
    let suscripcion
    try {
      suscripcion = await registro.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: aBytes(clave) })
    } catch {
      throw new Error('El navegador no pudo conectarse con su servicio de notificaciones. Probá de nuevo en unos minutos o con otro navegador.')
    }
    await suscribirPush(suscripcion.toJSON())
    setEstado('activadas')
  })

  const desactivar = () => hacer(async () => {
    const suscripcion = await suscripcionActual()
    if (suscripcion) {
      await desuscribirPush(suscripcion.endpoint)
      await suscripcion.unsubscribe()
    }
    setEstado('apagadas')
  })

  const probar = () => hacer(() => probarPush())

  return { estado, ocupado, error, activar, desactivar, probar }
}
