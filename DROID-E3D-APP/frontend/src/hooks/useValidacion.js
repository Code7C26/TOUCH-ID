// Validación en vivo de un formulario.
//  - errores: objeto { campo: 'mensaje' o '' } que el formulario calcula en cada dibujo
//  - Un error aparece cuando se sale del campo (onBlur) y desde ahí se actualiza mientras se escribe.
//  - Al intentar enviar se muestran todos los errores de golpe.
// Uso:
//   const { error, tocar, puedeEnviar } = useValidacion(errores)
//   <input onBlur={tocar('nombre')} />  ...  <Campo error={error('nombre')}>
//   al enviar:  if (!puedeEnviar()) return
import { useState } from 'react'

export default function useValidacion(errores) {
  const [tocados, setTocados] = useState({})
  const [intento, setIntento] = useState(false)
  const hayErrores = Object.values(errores).some(Boolean)

  return {
    error: (campo) => (tocados[campo] || intento ? errores[campo] || '' : ''),
    tocar: (campo) => () => setTocados((t) => (t[campo] ? t : { ...t, [campo]: true })),
    puedeEnviar: () => { setIntento(true); return !hayErrores },
    hayErrores,
  }
}
