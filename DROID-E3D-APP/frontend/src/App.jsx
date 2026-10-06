import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Login from './components/Login.jsx'
import HomeEmployee from './components/HomeEmployee.jsx'
import HomeManager from './components/HomeManager.jsx'

// Rutas de la app. La sesión ya no vive acá: la maneja AuthContext.
export default function App() {
  const { usuario, iniciarSesion, cerrarSesion } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={usuario ? <Navigate to="/" /> : <Login onLogin={iniciarSesion} />} />
      <Route
        path="/"
        element={
          !usuario ? <Navigate to="/login" />
          : usuario.rol === 'encargado' ? <HomeManager user={usuario} onLogout={cerrarSesion} />
          : <HomeEmployee user={usuario} onLogout={cerrarSesion} />
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
