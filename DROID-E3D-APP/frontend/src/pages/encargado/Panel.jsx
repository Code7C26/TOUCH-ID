// Panel del encargado: números del día, zonas con más alertas y últimas alertas.
// (En la Fase 4 se suma el mapa de la fábrica y el estado del robot.)
import { getIncidents, getStats, resolveIncident } from '../../api/client.js'
import AlertCard from '../../components/AlertCard.jsx'
import StatCard from '../../components/StatCard.jsx'
import Tabla from '../../components/Tabla.jsx'
import Titulo from '../../components/Titulo.jsx'
import usePolling from '../../hooks/usePolling.js'

export default function Panel() {
  const stats = usePolling(() => getStats(), 5000)
  const alertas = usePolling(() => getIncidents(), 5000)
  const s = stats.datos

  const resolver = async (id) => {
    try {
      await resolveIncident(id)
      alertas.recargar()
      stats.recargar()
    } catch (e) {
      window.alert(e.message)
    }
  }

  return (
    <>
      <Titulo titulo="Panel" subtitulo="Se actualiza solo cada 5 segundos" />
      {(stats.error || alertas.error) && (
        <p role="alert" className="mb-4 rounded-lg bg-alerta/10 px-3 py-2 text-sm text-alerta">{stats.error || alertas.error}</p>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard titulo="Alertas activas" valor={s?.incidencias_activas} icono="alerta" tono={s?.incidencias_activas ? 'alerta' : 'ok'} />
        <StatCard titulo="Hoy" valor={s?.incidencias_hoy} icono="reportes" tono="marca" />
        <StatCard titulo="Últimos 7 días" valor={s?.incidencias_semana} icono="panel" />
        <StatCard titulo="Empleados activos" valor={s?.empleados_activos} icono="empleados" tono="ok" />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_2fr]">
        <section>
          <h2 className="mb-3 text-lg font-semibold">Zonas con más alertas</h2>
          <Tabla claveFila="zona" filas={s?.top_zonas || []}
                 columnas={[{ clave: 'zona', titulo: 'Zona' }, { clave: 'incidencias', titulo: 'Alertas', clase: 'text-right tabular-nums' }]} />
        </section>
        <section>
          <h2 className="mb-3 text-lg font-semibold">Últimas alertas</h2>
          {alertas.cargando && <p className="text-sm text-zinc-500">Cargando…</p>}
          <div className="space-y-2">
            {(alertas.datos?.incidencias || []).slice(0, 8).map((inc) => (
              <AlertCard key={inc.id} incidencia={inc} onResolver={resolver} />
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
