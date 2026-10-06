import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/client.js'
import Icono from '../components/Icono.jsx'
import Logo from '../components/Logo.jsx'
import { inicioSegunRol, useAuth } from '../context/AuthContext.jsx'
import { useTema } from '../context/TemaContext.jsx'

const claseCampo = 'w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 outline-none focus:border-marca focus:ring-2 focus:ring-marca/40 dark:border-zinc-700 dark:bg-zinc-950'

export default function Login() {
  const { iniciarSesion } = useAuth()
  const { oscuro, cambiarTema } = useTema()
  const navegar = useNavigate()
  const { state } = useLocation() // state.desde = la página que quería ver antes de loguearse

  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const enviar = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const datos = await loginUser(usuario.trim(), contrasena)
      iniciarSesion(datos)
      navegar(state?.desde || inicioSegunRol(datos), { replace: true })
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="relative grid min-h-dvh place-items-center p-4">
      <button type="button" onClick={cambiarTema} aria-label="Cambiar tema"
              className="absolute top-4 right-4 grid size-10 place-items-center rounded-lg text-zinc-500 hover:bg-zinc-200 dark:hover:bg-zinc-800">
        <Icono nombre={oscuro ? 'sol' : 'luna'} />
      </button>

      <form onSubmit={enviar}
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
        <div className="h-1.5 bg-[repeating-linear-gradient(45deg,#f5b800_0_12px,#1f2328_12px_24px)]" />
        <div className="space-y-4 p-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <Logo conTexto={false} className="size-14" />
            <h1 className="text-2xl font-extrabold tracking-tight">DROID-E3D</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Control de elementos de protección personal</p>
          </div>

          <label className="block text-sm font-medium">
            Usuario
            <input className={`${claseCampo} mt-1`} value={usuario} autoComplete="username" autoFocus required
                   onChange={(e) => setUsuario(e.target.value)} />
          </label>
          <label className="block text-sm font-medium">
            Contraseña
            <input className={`${claseCampo} mt-1`} type="password" value={contrasena} autoComplete="current-password" required
                   onChange={(e) => setContrasena(e.target.value)} />
          </label>

          {error && (
            <p role="alert" className="rounded-lg bg-alerta/10 px-3 py-2 text-sm text-alerta">{error}</p>
          )}

          <button type="submit" disabled={cargando}
                  className="w-full rounded-lg bg-marca py-2.5 font-semibold text-tinta hover:bg-marca-oscuro disabled:opacity-60">
            {cargando ? 'Ingresando…' : 'Ingresar'}
          </button>
          <p className="text-center text-xs text-zinc-500 dark:text-zinc-400">by SMAT · una división de TOUCH</p>
        </div>
      </form>
    </div>
  )
}
