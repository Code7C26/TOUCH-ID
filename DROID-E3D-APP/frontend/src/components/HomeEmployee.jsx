import { useEffect, useState } from 'react'
import { getIncidents } from '../api/client.js'
import AlertCard from './AlertCard.jsx'

export default function HomeEmployee({ user, onLogout }) {
  const [incidencias, setIncidencias] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    const cargar = () =>
      getIncidents(user.zona).then((d) => setIncidencias(d.incidencias)).catch((e) => setError(e.message))
    cargar()
    const intervalo = setInterval(cargar, 5000) // refresca cada 5 segundos
    return () => clearInterval(intervalo)
  }, [user.zona])

  const activas = incidencias.filter((i) => i.estado === 'activa')

  return (
    <div className="page">
      <header>
        <div>
          <h2>Hola, {user.nombre}</h2>
          <p className="subtitle">Tu zona: {user.zona || 'Sin asignar'}</p>
        </div>
        <button className="btn-secondary" onClick={onLogout}>Salir</button>
      </header>

      {activas.length > 0 ? (
        <div className="alert-banner">⚠️ Hay {activas.length} alerta(s) activa(s) en tu zona. Revisá tu equipo de protección.</div>
      ) : (
        <div className="ok-banner">✅ Todo en orden en tu zona</div>
      )}

      {error && <p className="error">{error}</p>}
      <h3>Últimas alertas</h3>
      {incidencias.slice(0, 5).map((inc) => <AlertCard key={inc.id} incidencia={inc} />)}
    </div>
  )
}
