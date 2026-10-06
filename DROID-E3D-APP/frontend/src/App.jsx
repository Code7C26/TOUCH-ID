// Mapa de rutas de la web (ver docs/PLAN.md, "Mapa del sitio").
//  /login      -> pública
//  /app/...    -> con sesión; algunas solo para empleado y otras solo para encargado
//  /           -> por ahora va a /app; en la Fase L será la página pública de SMAT
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import RutaProtegida from './components/RutaProtegida.jsx'
import { inicioSegunRol, useAuth } from './context/AuthContext.jsx'
import Login from './pages/Login.jsx'
import NoEncontrada from './pages/NoEncontrada.jsx'
import Inicio from './pages/empleado/Inicio.jsx'
import MisAlertas from './pages/empleado/MisAlertas.jsx'
import Perfil from './pages/empleado/Perfil.jsx'
import Auditoria from './pages/encargado/Auditoria.jsx'
import Empleados from './pages/encargado/Empleados.jsx'
import Incidencias from './pages/encargado/Incidencias.jsx'
import Panel from './pages/encargado/Panel.jsx'
import Reportes from './pages/encargado/Reportes.jsx'
import Robot from './pages/encargado/Robot.jsx'
import Zonas from './pages/encargado/Zonas.jsx'

// /app muestra el Inicio del empleado; al encargado lo lleva a su Panel
function InicioApp() {
  const { usuario } = useAuth()
  return usuario.rol === 'encargado' ? <Navigate to="/app/panel" replace /> : <Inicio />
}

export default function App() {
  const { usuario } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/app" replace />} />
      <Route path="/login" element={usuario ? <Navigate to={inicioSegunRol(usuario)} replace /> : <Login />} />

      <Route path="/app" element={<RutaProtegida><Layout /></RutaProtegida>}>
        <Route index element={<InicioApp />} />

        <Route element={<RutaProtegida roles={['empleado']} />}>
          <Route path="mis-alertas" element={<MisAlertas />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>

        <Route element={<RutaProtegida roles={['encargado']} />}>
          <Route path="panel" element={<Panel />} />
          <Route path="incidencias" element={<Incidencias />} />
          <Route path="empleados" element={<Empleados />} />
          <Route path="zonas" element={<Zonas />} />
          <Route path="robot" element={<Robot />} />
          <Route path="reportes" element={<Reportes />} />
          <Route path="auditoria" element={<Auditoria />} />
        </Route>

        <Route path="*" element={<NoEncontrada />} />
      </Route>

      <Route path="*" element={<NoEncontrada />} />
    </Routes>
  )
}
