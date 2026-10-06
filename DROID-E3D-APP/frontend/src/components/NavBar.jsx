// Barra superior: logo, nombre del usuario, cambio de tema y salir.
import { Link } from 'react-router-dom'
import { inicioSegunRol, useAuth } from '../context/AuthContext.jsx'
import { useTema } from '../context/TemaContext.jsx'
import Icono from './Icono.jsx'
import Logo from './Logo.jsx'

export default function NavBar() {
  const { usuario, cerrarSesion } = useAuth()
  const { oscuro, cambiarTema } = useTema()
  const botonIcono = 'grid size-10 place-items-center rounded-lg text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800'

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
      {/* franja amarilla y negra: estilo "cinta de seguridad" */}
      <div className="h-1 bg-[repeating-linear-gradient(45deg,#f5b800_0_12px,#1f2328_12px_24px)]" />
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to={inicioSegunRol(usuario)} aria-label="Ir al inicio"><Logo /></Link>

        <div className="flex items-center gap-1">
          <div className="mr-2 hidden text-right sm:block">
            <p className="text-sm font-semibold">{usuario?.nombre}</p>
            <p className="text-xs capitalize text-zinc-500 dark:text-zinc-400">
              {usuario?.rol}{usuario?.zona ? ` · ${usuario.zona}` : ''}
            </p>
          </div>
          <button type="button" onClick={cambiarTema} className={botonIcono}
                  aria-label={oscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}>
            <Icono nombre={oscuro ? 'sol' : 'luna'} />
          </button>
          <button type="button" onClick={cerrarSesion} className={botonIcono} aria-label="Cerrar sesión">
            <Icono nombre="salir" />
          </button>
        </div>
      </div>
    </header>
  )
}
