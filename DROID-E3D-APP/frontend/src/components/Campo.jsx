// Un campo de formulario completo: etiqueta, el control (input/select), y debajo la ayuda o el error.
// Conecta todo para los lectores de pantalla (aria-invalid y aria-describedby).
// Ej: <Campo etiqueta="Usuario" obligatorio error={error('usuario')} ayuda="Con este nombre entra a la web.">
//       <input className={campo} value={...} onChange={...} onBlur={tocar('usuario')} />
//     </Campo>
import { cloneElement, useId } from 'react'
import { campoConError } from '../utils/estilos.js'

export default function Campo({ etiqueta, ayuda, error, obligatorio = false, className = '', children }) {
  const id = useId()
  const idTexto = `${id}-texto`
  const control = cloneElement(children, {
    id,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error || ayuda ? idTexto : undefined,
    className: `${children.props.className || ''} ${error ? campoConError : ''}`,
  })

  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-medium text-zinc-800 dark:text-zinc-200">
        {etiqueta}{obligatorio && <span className="text-alerta" aria-hidden="true"> *</span>}
      </label>
      <div className="mt-1.5">{control}</div>
      {(error || ayuda) && (
        <p id={idTexto} className={`mt-1.5 text-xs ${error ? 'font-medium text-alerta' : 'text-zinc-500 dark:text-zinc-400'}`}>{error || ayuda}</p>
      )}
    </div>
  )
}
