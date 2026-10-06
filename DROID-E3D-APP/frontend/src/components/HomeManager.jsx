import { useEffect, useState } from 'react'
import { getIncidents, getStats, resolveIncident } from '../api/client.js'
import AlertCard from './AlertCard.jsx'

export default function HomeManager({ user, onLogout }) {
  const [stats, setStats] = useState(null)
  const [incidencias, setIncidencias] = useState([])
  const [error, setError] = useState('')

  const cargar = () => {
    getStats().then(setStats).catch((e) => setError(e.message))
    getIncidents().then((d) => setIncidencias(d.incidencias)).catch((e) => setError(e.message))
  }

  useEffect(() => {
    cargar()
    const intervalo = setInterval(cargar, 5000)
    return () => clearInterval(intervalo)
  }, [])

  const handleResolver = async (id) => {
    await resolveIncident(id)
    cargar()
  }

  return (
    <div className="page">
      <header>
        <div>
          <h2>Panel del encargado</h2>
          <p className="subtitle">{user.nombre}</p>
        </div>
        <button className="btn-secondary" onClick={onLogout}>Salir</button>
      </header>

      {error && <p className="error">{error}</p>}

      {stats && (
        <>
          <div className="stats-grid">
            <div className="stat-card"><span>{stats.incidencias_hoy}</span><p>Incidencias hoy</p></div>
            <div className="stat-card"><span>{stats.incidencias_semana}</span><p>Esta semana</p></div>
            <div className="stat-card"><span>{stats.empleados_activos}</span><p>Empleados</p></div>
          </div>

          <h3>Zonas con más incidencias</h3>
          <table>
            <thead><tr><th>Zona</th><th>Incidencias</th></tr></thead>
            <tbody>
              {stats.top_zonas.map((z) => (
                <tr key={z.zona}><td>{z.zona}</td><td>{z.incidencias}</td></tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h3>Todas las alertas</h3>
      {incidencias.map((inc) => (
        <AlertCard key={inc.id} incidencia={inc} onResolver={handleResolver} />
      ))}
    </div>
  )
}
