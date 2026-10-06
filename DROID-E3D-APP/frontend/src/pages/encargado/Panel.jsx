// Panel del encargado: números del día, mapa de la fábrica, estado del robot y últimas alertas.
// Todo se actualiza solo cada pocos segundos.
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getIncidents, getRobot, getStats, getZones, resolveIncident } from '../../api/client.js'
import AlertCard from '../../components/AlertCard.jsx'
import MapaFabrica, { LeyendaMapa } from '../../components/MapaFabrica.jsx'
import StatCard from '../../components/StatCard.jsx'
import Tabla from '../../components/Tabla.jsx'
import TarjetaRobot from '../../components/TarjetaRobot.jsx'
import Titulo from '../../components/Titulo.jsx'
import usePolling from '../../hooks/usePolling.js'
import { mensajeError, tarjeta } from '../../utils/estilos.js'
import { contarPorZona } from '../../utils/mapa.js'

export default function Panel() {
  const navegar = useNavigate()
  const [errorAccion, setErrorAccion] = useState('')
  const stats = usePolling(() => getStats(), 5000)
  const zonas = usePolling(() => getZones(), 15000)
  const robot = usePolling(() => getRobot(), 4000)
  const activas = usePolling(() => getIncidents({ estado: 'activa', limit: 200 }), 5000)
  const recientes = usePolling(() => getIncidents({ limit: 6 }), 5000)

  const s = stats.datos
  const alertasPorZona = contarPorZona(activas.datos?.incidencias || [])
  const error = [stats, zonas, robot, activas, recientes].map((p) => p.error).find(Boolean) || errorAccion

  const resolver = async (id) => {
    setErrorAccion('')
    try {
      await resolveIncident(id)
      stats.recargar(); activas.recargar(); recientes.recargar()
    } catch (e) {
      setErrorAccion(e.message)
    }
  }

  return (
    <>
      <Titulo titulo="Panel" subtitulo="Se actualiza solo cada pocos segundos" />
      {error && <p role="alert" className={`mb-4 ${mensajeError}`}>{error}</p>}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard titulo="Alertas activas" valor={s?.incidencias_activas} icono="alerta" tono={s?.incidencias_activas ? 'alerta' : 'ok'} />
        <StatCard titulo="Hoy" valor={s?.incidencias_hoy} icono="reportes" tono="marca" />
        <StatCard titulo="Últimos 7 días" valor={s?.incidencias_semana} icono="panel" />
        <StatCard titulo="Empleados activos" valor={s?.empleados_activos} icono="empleados" tono="ok" />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[3fr_2fr]">
        <section className={tarjeta}>
          <h2 className="mb-3 text-lg font-semibold">Mapa de la fábrica</h2>
          {zonas.cargando && <p className="text-sm text-zinc-500">Cargando…</p>}
          {zonas.datos && (
            <MapaFabrica zonas={zonas.datos.zonas} alertasPorZona={alertasPorZona} robot={robot.datos}
                         onSeleccionar={(z) => navegar(`/app/incidencias?zona_id=${z.id}`)} />
          )}
          <LeyendaMapa />
          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">Tocá una zona para ver sus alertas.</p>
        </section>

        <div className="space-y-6">
          <TarjetaRobot robot={robot.datos} />
          <section>
            <h2 className="mb-3 text-lg font-semibold">Zonas con más alertas</h2>
            <Tabla claveFila="zona" filas={s?.top_zonas || []}
                   columnas={[{ clave: 'zona', titulo: 'Zona' }, { clave: 'incidencias', titulo: 'Alertas', clase: 'text-right tabular-nums' }]} />
          </section>
        </div>
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-semibold">Últimas alertas</h2>
        {recientes.cargando && <p className="text-sm text-zinc-500">Cargando…</p>}
        <div className="grid gap-2 lg:grid-cols-2">
          {(recientes.datos?.incidencias || []).map((inc) => <AlertCard key={inc.id} incidencia={inc} onResolver={resolver} />)}
        </div>
      </section>
    </>
  )
}
