// Avisos flotantes ("toasts"): mensajes cortos abajo a la derecha que se van solos a los 4,5 s.
// Uso en cualquier componente:  const avisar = useAvisos();  avisar('Empleado creado')
//                               avisar('No se pudo guardar', 'error')
import { createContext, useCallback, useContext, useState } from 'react'
import Icono from '../components/Icono.jsx'

const AvisosContext = createContext(() => {})

const ESTILO = {
  ok: { icono: 'ok', color: 'text-ok' },
  error: { icono: 'alerta', color: 'text-alerta' },
  info: { icono: 'robot', color: 'text-zinc-500' },
}

export function AvisosProvider({ children }) {
  const [avisos, setAvisos] = useState([])

  const quitar = useCallback((id) => setAvisos((lista) => lista.filter((a) => a.id !== id)), [])
  const avisar = useCallback((texto, tipo = 'ok') => {
    const id = `${Date.now()}-${Math.random()}`
    setAvisos((lista) => [...lista.slice(-2), { id, texto, tipo }]) // como máximo 3 a la vez
    setTimeout(() => quitar(id), 4500)
  }, [quitar])

  return (
    <AvisosContext.Provider value={avisar}>
      {children}
      {/* La zona existe siempre, así los lectores de pantalla anuncian cada aviso nuevo */}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-4 bottom-24 z-[60] flex flex-col items-end gap-2 md:inset-x-auto md:right-6 md:bottom-6 md:w-96">
        {avisos.map((a) => (
          <div key={a.id} role={a.tipo === 'error' ? 'alert' : 'status'}
               className="animar-aviso pointer-events-auto flex w-full items-start gap-3 rounded-xl border border-zinc-200/80 bg-white p-3.5 text-sm shadow-lg dark:border-zinc-700 dark:bg-zinc-900">
            <span className={ESTILO[a.tipo]?.color}><Icono nombre={ESTILO[a.tipo]?.icono} /></span>
            <p className="flex-1 font-medium">{a.texto}</p>
            <button type="button" onClick={() => quitar(a.id)} aria-label="Cerrar aviso" className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200">
              <Icono nombre="cerrar" className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </AvisosContext.Provider>
  )
}

export function useAvisos() {
  return useContext(AvisosContext)
}
