import { useState } from 'react'
import { loginUser } from '../api/client.js'

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setCargando(true)
    try {
      const datos = await loginUser(usuario, contrasena)
      onLogin(datos)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="login-container">
      <form className="card login-card" onSubmit={handleSubmit}>
        <h1>DROID-E3D</h1>
        <p className="subtitle">Control de elementos de protección</p>
        <input placeholder="Usuario" value={usuario} onChange={(e) => setUsuario(e.target.value)} />
        <input type="password" placeholder="Contraseña" value={contrasena}
               onChange={(e) => setContrasena(e.target.value)} />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={cargando}>{cargando ? 'Ingresando...' : 'Ingresar'}</button>
      </form>
    </div>
  )
}
