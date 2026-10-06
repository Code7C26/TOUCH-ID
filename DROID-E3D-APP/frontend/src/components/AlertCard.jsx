const NOMBRES = {
  sin_casco: 'Sin casco',
  sin_guantes: 'Sin guantes',
  sin_lentes: 'Sin lentes',
  sin_chaleco: 'Sin chaleco',
}

export default function AlertCard({ incidencia, onResolver }) {
  const fecha = new Date(incidencia.timestamp).toLocaleString('es-AR')
  return (
    <div className={`alert-card ${incidencia.estado}`}>
      <div>
        <strong>{NOMBRES[incidencia.tipo] || incidencia.tipo}</strong>
        <p>{incidencia.zona} · {incidencia.empleado_nombre}</p>
        <small>{fecha} · Confianza {Math.round(incidencia.confianza * 100)}%</small>
      </div>
      {onResolver && incidencia.estado === 'activa' && (
        <button className="btn-small" onClick={() => onResolver(incidencia.id)}>Resolver</button>
      )}
    </div>
  )
}
