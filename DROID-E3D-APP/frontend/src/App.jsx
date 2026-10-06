import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login.jsx'
import HomeEmployee from './components/HomeEmployee.jsx'
import HomeManager from './components/HomeManager.jsx'

export default function App() {
  const [user, setUser] = useState(() => {
    const guardado = localStorage.getItem('user')
    return guardado ? JSON.parse(guardado) : null
  })

  const handleLogin = (datos) => {
    localStorage.setItem('user', JSON.stringify(datos))
    setUser(datos)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login onLogin={handleLogin} />} />
      <Route
        path="/"
        element={
          !user ? <Navigate to="/login" />
          : user.rol === 'encargado' ? <HomeManager user={user} onLogout={handleLogout} />
          : <HomeEmployee user={user} onLogout={handleLogout} />
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}
