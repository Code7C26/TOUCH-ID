// Protege rutas en la web:
//  - sin sesión  -> manda a /login (y recuerda a dónde querías ir)
//  - rol que no corresponde -> manda al inicio de su rol
// Ojo: esto es solo comodidad visual. La seguridad real está en el backend (rol_requerido).
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { inicioSegunRol, useAuth } from '../context/AuthContext.jsx'

export default function RutaProtegida({ roles, children }) {
  const { usuario } = useAuth()
  const ubicacion = useLocation()

  if (!usuario) {
    return <Navigate to="/login" replace state={{ desde: ubicacion.pathname }} />
  }
  if (roles && !roles.includes(usuario.rol)) {
    return <Navigate to={inicioSegunRol(usuario)} replace />
  }
  // Se puede usar envolviendo un componente o como "ruta padre" de otras rutas
  return children ?? <Outlet />
}
