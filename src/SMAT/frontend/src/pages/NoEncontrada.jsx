import { Link } from 'react-router-dom'
import Logo from '../components/Logo.jsx'
import { inicioSegunRol, useAuth } from '../context/AuthContext.jsx'

export default function NoEncontrada() {
  const { usuario } = useAuth()
  return (
    <div className="grid min-h-[60dvh] place-items-center text-center">
      <div className="space-y-3">
        <Logo conTexto={false} className="mx-auto size-16" />
        <h1 className="text-2xl font-bold">Página no encontrada</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">La dirección no existe o no tenés acceso.</p>
        <Link to={usuario ? inicioSegunRol(usuario) : '/login'}
              className="inline-block rounded-lg bg-marca px-4 py-2 font-semibold text-tinta hover:bg-marca-oscuro">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
